## What changes
<!-- one or two lines -->

## Release gate (fully automated, nothing to tick)
Merging into `main` goes live to students. The CI workflow runs the secret scan, course-content checks, browser tests, backend tests against a throwaway Supabase, and the **release gate**. The gate closes this PR automatically if it is not from `staging` or if any test failed. Read the pass/fail table on the run's **Summary** page.

## Backend changes (functions / migrations)
<!-- none | list them (they must already be deployed/applied) -->
