## Replace Care & Social Work hero image

The image with the floating hand is `src/assets/cat-hero-care-social-work.jpg`. It is shared by all 5 topics in the "Care & Social Work" category (Care Certificate, Adult Social Care, Safeguarding Adults, Medication Awareness, Social Work England Readiness).

### Steps
1. Generate a new hero image (1920×1080, warm/professional care setting — e.g. a social worker speaking with a client at a table, or a carer offering tea, with no awkward floating/disembodied hands) using the premium image model for clean anatomy.
2. Save it to `src/assets/cat-hero-care-social-work.jpg`, overwriting the current file. No code changes needed — the import in `src/data/categories.ts` line 22 already points there.
3. Verify by viewing the generated file and the preview at `/topic/social-work-england`.

### Note
This change updates the hero for **all 5 Care & Social Work topics**, not just Social Work England. If you want a unique image per topic instead, that's a bigger change (would need a per-topic image map). Let me know if you'd prefer that.
