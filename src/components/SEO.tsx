import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

const SITE_URL = "https://spooort.ru";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export const SEO = ({
  title,
  description,
  image,
  url,
  type = "article",
  publishedTime,
  author,
  tags = [],
}: SEOProps) => {
  const fullTitle = `${title} | SportNews`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const imageUrl = image || DEFAULT_IMAGE;

  // JSON-LD Schema for NewsArticle
  const jsonLd = type === "article" && publishedTime ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": publishedTime,
    "author": {
      "@type": "Person",
      "name": author || "Редакция SportNews"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SportNews",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": tags.join(", ")
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SportNews" />
      <meta property="og:locale" content="ru_RU" />
      
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SportNews" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Schema */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
