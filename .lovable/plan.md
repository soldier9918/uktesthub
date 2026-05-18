## Goal

Serve `ads.txt` at `https://www.uktesthub.com/ads.txt` so Google AdSense can verify the site's authorized sellers.

## Change

Create **`public/ads.txt`** with the standard AdSense line:

```
google.com, pub-7445296424475191, DIRECT, f08c47fec0942fa0
```

Files in `public/` are served as-is at the site root by Vite, so this will be reachable at `/ads.txt` on every domain the project serves (including `www.uktesthub.com`).

## Notes

- `pub-7445296424475191` matches the AdSense client already configured in `src/routes/__root.tsx` and `src/components/AdSlot.tsx`.
- `f08c47fec0942fa0` is Google's standard AdSense TAG ID — the same value Google instructs every publisher to use.
- No code or route changes are needed; no rebuild of dynamic routes. After publish, AdSense's crawler will find the file within ~24h.