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

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} data-rh="true" />}
      {keywords && <meta name="keywords" content={keywords} data-rh="true" />}

      <link rel="canonical" href={url} data-rh="true" />
      <meta name="robots" content={robots} data-rh="true" />

      {/* Open Graph */}
      <meta property="og:type" content="website" data-rh="true" />
      <meta property="og:site_name" content="CV Architect" data-rh="true" />
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

      {jsonLdArray.map((schema, index) => (
        <script
          // eslint-disable-next-line react/no-danger
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}

