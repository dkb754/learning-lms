#!/usr/bin/env python3
"""Check every external link in index.html is live. Run from a machine with normal internet access:

    python3 tools/check-links.py

YouTube links are checked through the public oEmbed endpoint (a removed/private video returns 404/401).
Exit code 1 if any link fails. Some sites block scripted requests (403/429): those are reported as
WARN and need a manual click rather than being treated as dead.
"""
import re, sys, json, socket, urllib.request, urllib.error, urllib.parse, pathlib, concurrent.futures as cf

html = (pathlib.Path(__file__).resolve().parent.parent / "index.html").read_text()
urls = sorted(set(re.findall(r'href="(https?://[^"]+)"', html)) - {"https://fonts.googleapis.com"})
urls = [u.replace("&amp;", "&") for u in urls if "fonts.googleapis" not in u]
UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
# Sites known to answer scripts with 403/404 even for pages that exist (e.g. fda.gov/food returns 404 to bots).
# A failure here is reported as WARN: open the link in a browser to confirm.
BOT_BLOCKS_SCRIPTS = ("fda.gov",)

def get(url, method="GET"):
    req = urllib.request.Request(url, headers=UA, method=method)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.status, r.geturl()

def check(url):
    """One attempt. Returns (status, message). A timeout is retried once and then reported as WARN: slow servers
    are not dead servers (restaurantowner.com answers in 200 ms one run and times out the next)."""
    for attempt in (1, 2):
        try:
            if "youtube.com/watch" in url:
                q = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url, safe="")
                with urllib.request.urlopen(urllib.request.Request(q, headers=UA), timeout=25) as r:
                    title = json.load(r).get("title", "")
                return "OK", f"video: {title[:70]}"
            status, final = get(url)
            return "OK", f"{status}" + (f" -> {final}" if final.rstrip('/') != url.rstrip('/') else "")
        except urllib.error.HTTPError as e:
            host = urllib.parse.urlparse(url).hostname or ""
            if e.code in (401, 403, 429, 999) and "youtube.com" not in url:
                return "WARN", f"HTTP {e.code} (site blocks scripts — open it in a browser)"
            if e.code == 404 and host.endswith(BOT_BLOCKS_SCRIPTS):
                return "WARN", "HTTP 404 (this site answers scripts with 404 even for live pages — open it in a browser)"
            return "FAIL", f"HTTP {e.code}"
        except (TimeoutError, socket.timeout) as e:
            if attempt == 2:
                return "WARN", "timed out twice — inconclusive, open it in a browser"
        except urllib.error.URLError as e:
            if isinstance(getattr(e, "reason", None), (TimeoutError, socket.timeout)):
                if attempt == 2:
                    return "WARN", "timed out twice — inconclusive, open it in a browser"
            else:
                return "FAIL", "URLError: " + str(e.reason)[:80]
        except Exception as e:
            return "FAIL", type(e).__name__ + ": " + str(e)[:80]

bad = 0
with cf.ThreadPoolExecutor(8) as ex:
    for url, (st, msg) in zip(urls, ex.map(check, urls)):
        print(f"{st:5} {url}\n      {msg}")
        bad += st == "FAIL"
print(f"\n{len(urls)} links, {bad} failed")
sys.exit(1 if bad else 0)
