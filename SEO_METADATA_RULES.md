# SEO Metadata Rules (pages and blog posts)

To stop any page from being truncated or ignored by search engines, every page
title and meta description must stay within fixed limits. These are hard rules,
not guidelines: `npm run build` and `npm run test` both fail when a page breaks
them.

## Limits

| Field | Min | Max | Why |
| --- | --- | --- | --- |
| `<title>` | 15 | 60 | Search results truncate at roughly 60 characters |
| `<meta name="description">` | 70 | 160 | Snippets truncate at roughly 160 characters |

Every prerendered page must also carry a self-referencing `canonical` and exactly
one page-level `<h1>`.

## Where the rules are enforced

- `scripts/seoLimits.mjs` holds the limits and the `seoMetadataProblems()` check.
- `scripts/verify-prerender.mjs` runs that check against the **built HTML** for
  every prerendered route during `npm run build`, so titles defined inside
  components are covered too.
- `tests/seoMetadata.test.ts` runs the same check against `utils/blogData.ts` and
  `utils/roleTemplates.ts` during `npm run test` for fast feedback.

## Adding or editing a page or blog post

1. Keep the fully rendered `<title>` at **60 characters or fewer**. Lead with the
   primary keyword. Drop the `| Cvarchitect` suffix when it does not fit; the
   brand still appears via `og:site_name`.
2. Keep the meta description between **70 and 160 characters**. Lead with the
   value to the reader, not the brand.
3. Do not build a title by concatenating a keyword with a long suffix. Write it
   to fit, and check the count.
4. Run `npm run test` and then `npm run build`. Both gates must pass.
