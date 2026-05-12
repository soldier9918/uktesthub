<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>UKTestHub Sitemap</title>
        <style>
          body { font-family: -apple-system, system-ui, sans-serif; margin: 24px; color: #111; }
          h1 { font-size: 20px; margin: 0 0 8px; }
          p { color: #555; margin: 0 0 16px; }
          table { border-collapse: collapse; width: 100%; font-size: 13px; }
          th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #eee; }
          th { background: #f6f6f6; }
          a { color: #0a58ca; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>UKTestHub Sitemap</h1>
        <p>
          <xsl:value-of select="count(s:urlset/s:url)"/> URLs. This is a styled view of <code>/sitemap.xml</code>; crawlers see the raw XML.
        </p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last modified</th>
            <th>Change frequency</th>
            <th>Priority</th>
          </tr>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td>
                <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
              </td>
              <td><xsl:value-of select="s:lastmod"/></td>
              <td><xsl:value-of select="s:changefreq"/></td>
              <td><xsl:value-of select="s:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
