#!/usr/bin/env python3
"""Generate the app icons as PNGs, with no image library involved.

The mark is the app's own metaphor: a 3x3 brick array on the Build Mode blue.
Drawn at 4x and box-downsampled for clean edges. Content sits inside the middle
60% so the same file survives Android's maskable-icon crop.
"""
import zlib, struct, pathlib

OUT = pathlib.Path(__file__).parent / "dist"
SS = 4  # supersample factor

BLUE_TOP    = (0x6D, 0x99, 0xFF)
BLUE_BOTTOM = (0x24, 0x53, 0xD8)
BRICK       = (0xFF, 0xFF, 0xFF)


def write_png(path, w, h, rows):
    raw = b"".join(b"\x00" + bytes(c for px in row for c in px) for row in rows)
    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    path.write_bytes(png)


def in_round_rect(x, y, x0, y0, x1, y1, r):
    if not (x0 <= x <= x1 and y0 <= y <= y1):
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def render(size, opaque_bg=None):
    """Draw at size*SS then average each SSxSS block back down."""
    big = size * SS
    px = [[(0, 0, 0, 0)] * big for _ in range(big)]

    plate_r = big * 0.22
    # brick grid: 3x3 inside the middle 60% of the canvas
    grid = big * 0.60
    g0 = (big - grid) / 2
    cell = grid / 3
    pad = cell * 0.14
    brick_r = cell * 0.19

    for y in range(big):
        t = y / (big - 1)
        bg = tuple(round(BLUE_TOP[i] + (BLUE_BOTTOM[i] - BLUE_TOP[i]) * t) for i in range(3))
        row = px[y]
        for x in range(big):
            if not in_round_rect(x, y, 0, 0, big - 1, big - 1, plate_r):
                continue
            col, alpha = bg, 255
            gx, gy = int((x - g0) // cell), int((y - g0) // cell)
            if 0 <= gx < 3 and 0 <= gy < 3:
                bx0 = g0 + gx * cell + pad
                by0 = g0 + gy * cell + pad
                if in_round_rect(x, y, bx0, by0, bx0 + cell - 2 * pad, by0 + cell - 2 * pad, brick_r):
                    # rows fade downward — an array still being stacked
                    mix = (1.0, 0.88, 0.72)[gy]
                    col = tuple(round(bg[i] + (BRICK[i] - bg[i]) * mix) for i in range(3))
            row[x] = col + (alpha,)

    out = []
    for y in range(size):
        line = []
        for x in range(size):
            r = g = b = a = 0
            for dy in range(SS):
                for dx in range(SS):
                    p = px[y * SS + dy][x * SS + dx]
                    r += p[0] * p[3]; g += p[1] * p[3]; b += p[2] * p[3]; a += p[3]
            n = SS * SS
            if a == 0:
                line.append(opaque_bg + (255,) if opaque_bg else (0, 0, 0, 0))
            else:
                pxl = (r // a, g // a, b // a, a // n)
                if opaque_bg:  # flatten onto a solid ground for iOS
                    al = pxl[3] / 255
                    pxl = tuple(round(pxl[i] * al + opaque_bg[i] * (1 - al)) for i in range(3)) + (255,)
                line.append(pxl)
        out.append(line)
    return out


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for name, size, bg in [
        ("icon-512.png", 512, None),
        ("icon-192.png", 192, None),
        ("apple-touch-icon.png", 180, (0x2C, 0x63, 0xF0)),
        ("favicon-32.png", 32, None),
    ]:
        write_png(OUT / name, size, size, render(size, bg))
        print(f"  {name:24} {(OUT / name).stat().st_size:>7,} bytes")
