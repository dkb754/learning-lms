# Auto-deploy: GitHub → Netlify (no more drag-and-drop)

```
feature branch ──PR──▶ staging ──PR──▶ main
                         │              │
                 Netlify branch deploy   Netlify PRODUCTION deploy (culinarycoachlearn.netlify.app)
                 staging--<site>.netlify.app
```
Every push to `main` deploys automatically. Because Netlify deploys whatever lands on `main`, the gate is **who can put code on `main`**:
only a pull request from `staging` that passed CI and the checklist.

## One-time setup (≈10 minutes — these need your GitHub/Netlify logins)
1. **GitHub** → New repository → `culinary-coach-lms`, *Private*, empty (no README). Then give Claude Code access and it will push `main` + `staging`,
   or push yourself:
   ```sh
   git remote add origin git@github.com:<you>/culinary-coach-lms.git
   git push -u origin main staging
   ```
2. **Netlify** → Add new site → Import an existing project → GitHub → pick the repo. Build command: *(leave empty)*, Publish directory: `.`
   (`netlify.toml` already says so). Production branch: `main`.
   To keep the existing URL, instead open the current site → *Site configuration → Build & deploy → Continuous deployment → Link repository*.
3. Netlify → *Site configuration → Build & deploy → Branches and deploy contexts* → **Branch deploys: Let me add individual branches** → add `staging`.
4. **GitHub → Settings → Branches → Add rule** for `main`:
   - ✅ Require a pull request before merging (1 approval is fine; it can be you)
   - ✅ Require status checks to pass: **secret-scan**, **e2e**
   - ✅ Do not allow bypassing the above settings
5. Backend is already live in Supabase (functions `validate-login`, `lms-api-v2`; migrations `0001`–`0005`). Nothing to configure in Netlify — the page holds no secrets.

## Day to day
1. Branch from `staging`, make the change, open a PR **into `staging`**. CI runs.
2. After merge, open the staging URL. **It uses the live database**, so test as `TEST STUDENT` / the instructor only (a red ribbon says so).
3. Work the checklist (`docs/LMS_PreDeploy_Checklist_updated.docx`) for what you touched.
4. Open a PR `staging → main` (the PR template repeats the gate). Merge ⇒ production deploys in ~30 s.
5. Rollback: Netlify → Deploys → pick the last good deploy → *Publish deploy*. (Or `git revert` the merge on `main`.)

## Backend changes are separate from page deploys
- Edge Functions: `supabase functions deploy validate-login lms-api-v2 --no-verify-jwt` (or the Supabase dashboard).
- Migrations: apply `supabase/migrations/*.sql` in order. Do the **page** deploy and the **backend** change in the order that never leaves them out of step
  (additive backend change first → page → destructive backend change last).
