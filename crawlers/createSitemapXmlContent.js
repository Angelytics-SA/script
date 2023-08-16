require('./core/utils');

/**
 * Generate the XML sitemap content. See https://www.sitemaps.org/protocol.html.
 * @param  {String}  urls The input urls
 * @return {String}       The constent of the xml file, as a string.
 */
const createSitemapXmlContent = (...urls) => {
  // Get date.
  let date = new Date();
  date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  // Filter urls.
  urls = new Set(urls.flat(Infinity).map(u => URL.getPageOrigin(u)));
  let output = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  urls.forEach(u => {
    u && (output += `\n  <url>
    <loc>${u}</loc>
    <lastmod>${date}</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="${u}"/>
  </url>`);
  });
  return output + '\n</urlset>';
}

// Export.
module.exports = createSitemapXmlContent.createSitemapXmlContent = createSitemapXmlContent;