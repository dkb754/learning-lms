## What changes
<!-- one or two lines -->

## Gate before merging into `main` (this goes live to students on merge)
- [ ] CI is green: **secret-scan** and **e2e**  (links is informational — read its log)
- [ ] Merged to `staging` first and tested on the staging URL **as TEST STUDENT and as the instructor** (staging uses the live database — never use real students' codes there)
- [ ] Worked the manual checklist in `docs/LMS_PreDeploy_Checklist_updated.docx` for anything this PR touches (login, upload, sync, links, mobile)
- [ ] Upload tested end to end on staging: file appears in Supabase → Storage → submissions and in the Student Tracker
- [ ] No access codes, admin code or keys added to any file
- [ ] If an Edge Function or migration changed: it is deployed/applied **and** noted below

## Backend changes (functions / migrations)
<!-- none | list them -->
