## Plan

Add `workflow_dispatch:` to the `on:` triggers in `.github/workflows/main.yml` so the "Build Check" workflow can be triggered manually from the GitHub Actions UI.

## Change
- File: `.github/workflows/main.yml`
- Add `workflow_dispatch:` as an additional trigger under `on:`

## Result
After this change, the user can go to their GitHub repo → Actions → Build Check → Run workflow to trigger a manual build.