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

const SITE_NAME = "Spooort.ru";
const SITE_URL = "https://spooort.ru";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const truncateText = (text: string, maxLength: number): string => {
  const clean = stripHtml(text);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 3) + "...";
};

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
  const fullTitle = title.length > 55
    ? `${truncateText(title, 55)} | ${SITE_NAME}`
    : `${title} | ${SITE_NAME}`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const imageUrl = image || DEFAULT_IMAGE;
  const safeDescription = truncateText(description, 160);

  const jsonLd =
    type === "article" && publishedTime
      ? {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: truncateText(title, 110),
          description: safeDescription,
          image: imageUrl,
          datePublished: publishedTime,
          author: {
            "@type": "Person",
            name: author || `Редакция ${SITE_NAME}`,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.ico`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": fullUrl,
          },
          keywords: tags.join(", "),
        }
      : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={truncateText(title, 60)} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
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
      <meta name="twitter:site" content={`@${SITE_NAME}`} />
      <meta name="twitter:title" content={truncateText(title, 60)} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Schema */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
