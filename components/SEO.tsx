import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

type SEOProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: unknown | unknown[];
};

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string') {
    return envUrl;
  }

  return 'https://cvarchitect.app';
};

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage,
  noindex,
  jsonLd,
}: SEOProps) {
  const location = useLocation();
  const baseUrl = getBaseUrl().replace(/\/+$/, '');

  const path = canonicalPath ?? location.pathname ?? '/';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const image = (ogImage ?? `${baseUrl}/images/og-preview.png`).replace(/(?<!:)\/\/+/g, '/');
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  const jsonLdArray: unknown[] = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  /**
   * react-helmet-async dedupes <script> tags by their primary attribute, which
   * for inline scripts is `type`. Two ld+json scripts therefore collapse into
   * one and the extra schemas silently vanish. Emit a single @graph instead.
   */
  const jsonLdPayload =
    jsonLdArray.length > 1
      ? {
          '@context': 'https://schema.org',
          '@graph': jsonLdArray.map((schema) => {
            const copy = { ...(schema as Record<string, unknown>) };
            delete copy['@context'];
            return copy;
          }),
        }
      : jsonLdArray[0];

  return (
    // defer={false} applies head changes synchronously. With the default defer
    // behaviour, react-helmet-async waits for requestAnimationFrame, which does
    // not fire in the headless prerender (or a background tab), so page-level
    // JSON-LD silently vanished from the static HTML crawlers read.
    <Helmet defer={false}>
      <title>{title}</title>
      {description && <meta name="description" content={description} data-rh="true" />}
      {keywords && <meta name="keywords" content={keywords} data-rh="true" />}

      <link rel="canonical" href={url} data-rh="true" />
      <meta name="robots" content={robots} data-rh="true" />

      {/* Open Graph */}
      <meta property="og:type" content="website" data-rh="true" />
      <meta property="og:site_name" content="Cvarchitect" data-rh="true" />
      <meta property="og:title" content={title} data-rh="true" />
      {description && <meta property="og:description" content={description} data-rh="true" />}
      <meta property="og:url" content={url} data-rh="true" />
      <meta property="og:image" content={image} data-rh="true" />
      <meta property="og:image:width" content="1200" data-rh="true" />
      <meta property="og:image:height" content="630" data-rh="true" />
      <meta property="og:locale" content="en_US" data-rh="true" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" data-rh="true" />
      <meta name="twitter:title" content={title} data-rh="true" />
      {description && <meta name="twitter:description" content={description} data-rh="true" />}
      <meta name="twitter:image" content={image} data-rh="true" />

      {jsonLdPayload ? (
        <script type="application/ld+json">{JSON.stringify(jsonLdPayload)}</script>
      ) : null}
    </Helmet>
  );
}

