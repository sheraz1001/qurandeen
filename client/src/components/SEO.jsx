import { Helmet } from 'react-helmet-async';

function SEO({ 
  title, 
  description, 
  canonical, 
  ogType = 'website',
  ogImage = 'https://qurandeen.com/og-image.png',
  keywords,
  noindex = false,
  schema
}) {
  const siteName = 'QuranDeen';
  const fullTitle = title.includes('QuranDeen') ? title : `${title} | ${siteName}`;
  const canonicalUrl = canonical || 'https://qurandeen.com';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {keywords && <meta name="keywords" content={keywords} />}
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;
