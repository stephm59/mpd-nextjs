interface ServiceCityPageData {
  id: string
  services: { name: string; slug: string }
  cities: { name: string; slug: string }
  meta_title?: string | null
  meta_description?: string | null
  cta_subtitle: string
}

interface ServiceCityOffer {
  title: string
  description: string
}

interface ServiceCityFaq {
  question: string
  answer: string
}

interface ServiceCityTestimonial {
  rating: number
  content: string
  author_name: string
  location?: string | null
}

const LILLE_METRO_CITIES = [
  'villeneuve-d-ascq', 'roubaix', 'tourcoing', 'wattrelos', 'hem', 'croix',
  'wasquehal', 'mouvaux', 'lys-lez-lannoy', 'bondues', 'marcq-en-baroeul',
  'saint-andre-lez-lille', 'la-madeleine', 'lambersart', 'lomme', 'loos',
  'haubourdin', 'wattignies', 'faches-thumesnil', 'lesquin', 'lezennes',
]

const LOGO_URL = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/logo-mon-ptit-depanneur-contour-blanc.webp'

export const generateServiceCityJsonLd = (
  page: ServiceCityPageData,
  offers: ServiceCityOffer[] = [],
  faqs: ServiceCityFaq[] = [],
  testimonials: ServiceCityTestimonial[] = [],
  baseUrl = 'https://www.monptitdepanneur.fr'
) => {
  const pageUrl = `${baseUrl}/${page.services.slug}-${page.cities.slug}/`
  const { name: serviceName, slug: serviceSlug } = page.services
  const { name: cityName, slug: citySlug } = page.cities

  const servicesList = offers.map((offer, i) => ({
    '@type': 'Service',
    '@id': `${pageUrl}#service-${i}`,
    name: offer.title,
    description: offer.description,
    provider: { '@type': 'Organization', name: "Mon P'tit Dépanneur" },
    areaServed: { '@type': 'City', name: cityName },
  }))

  const offersList = offers.map(offer => ({
    '@type': 'Offer',
    name: offer.title,
    description: offer.description,
    provider: { '@type': 'Organization', name: "Mon P'tit Dépanneur" },
  }))

  const aggregateRating =
    testimonials.length > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1),
          reviewCount: testimonials.length,
          bestRating: 5,
          worstRating: 1,
        }
      : null

  const reviews = testimonials.slice(0, 5).map((t, i) => ({
    '@type': 'Review',
    '@id': `${pageUrl}#review-${i}`,
    reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5, worstRating: 1 },
    reviewBody: t.content,
    author: { '@type': 'Person', name: t.author_name, ...(t.location && { address: t.location }) },
  }))

  const isLilleMetro = LILLE_METRO_CITIES.includes(citySlug)
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${baseUrl}/` },
  ]
  if (isLilleMetro) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: `${serviceName} Lille`, item: `${baseUrl}/${serviceSlug}-lille/` })
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: `${serviceName} ${cityName}`, item: pageUrl })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: `${serviceName} ${cityName}`, item: pageUrl })
  }

  const faqPage =
    faqs.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null

  const graph: object[] = [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.meta_title || `${serviceName} à ${cityName} | Mon p'tit Dépanneur`,
      isPartOf: { '@id': `${baseUrl}/#website` },
      about: { '@id': `${baseUrl}/#etablissement` },
      primaryImageOfPage: { '@type': 'ImageObject', url: LOGO_URL },
      inLanguage: 'fr',
      description: page.meta_description || `${serviceName} à ${cityName} : ${page.cta_subtitle}`,
    },
    { '@type': 'BreadcrumbList', '@id': `${pageUrl}#breadcrumb`, itemListElement: breadcrumbItems },
    {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#etablissement`,
      name: "Mon p'tit Dépanneur",
      alternateName: 'Mon petit dépanneur',
      description: `Dépannage ${serviceName.toLowerCase()} ${cityName}`,
      url: baseUrl,
      telephone: '03 28 53 48 68',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '21 Rue Edouard Delesalle',
        addressLocality: 'Lille',
        postalCode: '59000',
        addressCountry: 'FR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 50.6365, longitude: 3.0586 },
      areaServed: [{ '@type': 'City', name: cityName }],
      serviceType: serviceName,
      ...(aggregateRating && { aggregateRating }),
      ...(reviews.length > 0 && { review: reviews }),
      ...(offersList.length > 0 && {
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Services ${serviceName} à ${cityName}`,
          itemListElement: offersList,
        },
      }),
      ...(servicesList.length > 0 && { hasService: servicesList }),
      openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-17:00'],
      sameAs: [],
    },
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: "Mon p'tit Dépanneur",
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: "Mon p'tit Dépanneur",
      description: 'Dépannage et intervention rapide',
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: 'fr',
    },
  ]

  if (faqPage) graph.push(faqPage)

  return { '@context': 'https://schema.org', '@graph': graph }
}

export const generateHomeJsonLd = (baseUrl = 'https://www.monptitdepanneur.fr') => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: "Mon p'tit Dépanneur",
      description: 'Dépannage et intervention rapide sur Lille et sa métropole',
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: 'fr',
    },
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: "Mon p'tit Dépanneur",
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#etablissement`,
      name: "Mon p'tit Dépanneur",
      alternateName: 'Mon petit dépanneur',
      description: "Entreprise de dépannage et d'intervention rapide : chauffage, plomberie, pompe à chaleur sur Lille et sa métropole",
      url: baseUrl,
      telephone: '03 28 53 48 68',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '21 Rue Edouard Delesalle',
        addressLocality: 'Lille',
        postalCode: '59000',
        addressCountry: 'FR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 50.6365, longitude: 3.0586 },
      areaServed: [
        { '@type': 'City', name: 'Lille' },
        { '@type': 'City', name: "Villeneuve-d'Ascq" },
        { '@type': 'City', name: 'Roubaix' },
        { '@type': 'City', name: 'Tourcoing' },
      ],
      serviceType: ['Chauffage', 'Plomberie', 'Pompe à chaleur'],
      openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-17:00'],
      sameAs: [],
    },
  ],
})

interface BlogPostData {
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  cover_image_url?: string | null
  published_at?: string | null
  updated_at?: string
  meta_title?: string | null
  meta_description?: string | null
}

export const generateBlogPostJsonLd = (post: BlogPostData, baseUrl = 'https://www.monptitdepanneur.fr') => {
  const postUrl = `${baseUrl}/carnet/${post.slug}`
  const imageUrl = post.cover_image_url || LOGO_URL

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${postUrl}#article`,
    headline: post.title,
    name: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    image: { '@type': 'ImageObject', url: imageUrl },
    datePublished: post.published_at || new Date().toISOString(),
    dateModified: post.updated_at || post.published_at || new Date().toISOString(),
    author: { '@type': 'Organization', '@id': `${baseUrl}/#organization`, name: "Mon p'tit Dépanneur" },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: "Mon p'tit Dépanneur",
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage: 'fr',
  }
}
