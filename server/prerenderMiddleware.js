import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_USER_AGENTS = [
  'googlebot',
  'google-inspectiontool',
  'google-structured-data-testing-tool',
  'google-xrawler',
  'googleother',
  'storebot-google',
  'apis-google',
  'mediapartners-google',
  'adsbot-google',
  'bingbot',
  'bingpreview',
  'msnbot',
  'yandexbot',
  'yandexmobilebot',
  'duckduckbot',
  'slurp',
  'baiduspider',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'pinterestbot',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
  'qwantify',
  'bitrix link preview',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot',
  'seznambot',
  'petalbot',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'sogou',
  'ia_archiver',
  'archive.org_bot'
];

const CACHE_DIR = path.join(__dirname, '../.prerender-cache');
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  if (ua.includes('qurandeenprerender')) return false;
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function getCacheKey(url) {
  return Buffer.from(url).toString('base64').replace(/[/+=]/g, '_');
}

function getCachedPage(url) {
  const cacheKey = getCacheKey(url);
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.html`);
  const metaPath = path.join(CACHE_DIR, `${cacheKey}.meta.json`);
  
  if (fs.existsSync(cachePath) && fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      if (Date.now() - meta.timestamp < CACHE_TTL) {
        return fs.readFileSync(cachePath, 'utf-8');
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }
  }
  return null;
}

function setCachedPage(url, html) {
  const cacheKey = getCacheKey(url);
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.html`);
  const metaPath = path.join(CACHE_DIR, `${cacheKey}.meta.json`);
  
  try {
    fs.writeFileSync(cachePath, html);
    fs.writeFileSync(metaPath, JSON.stringify({ timestamp: Date.now(), url }));
  } catch (e) {
    console.error('Cache write error:', e);
  }
}

let browserInstance = null;

async function getBrowser() {
  if (browserInstance) {
    try {
      const pages = await browserInstance.pages();
      if (pages.length >= 0) {
        return browserInstance;
      }
    } catch (e) {
      browserInstance = null;
    }
  }
  
  const chromiumPath = process.env.CHROME_PATH || 
    '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium';
  
  browserInstance = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--single-process',
      '--no-zygote',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-first-run'
    ]
  });
  
  return browserInstance;
}

async function renderPage(url, timeout = 20000) {
  let page = null;
  
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (compatible; QuranDeenPrerender/1.0)');
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: timeout
    });
    
    await page.waitForFunction(() => {
      const content = document.body ? document.body.innerText : '';
      return content.length > 200 || 
        document.querySelector('.verse-text, .hadith-text, .surah-content, .home-container, .azkaar-container');
    }, { timeout: 10000 }).catch(() => {});
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let html = await page.evaluate(() => {
      const head = document.head;
      const rhTags = head.querySelectorAll('[data-rh="true"]');
      if (rhTags.length > 0) {
        const rhTypes = new Set();
        rhTags.forEach(tag => {
          if (tag.tagName === 'META') {
            const key = tag.getAttribute('name') || tag.getAttribute('property') || tag.getAttribute('http-equiv');
            if (key) rhTypes.add(`${tag.tagName}-${key}`);
          } else if (tag.tagName === 'LINK') {
            const rel = tag.getAttribute('rel');
            if (rel) rhTypes.add(`${tag.tagName}-${rel}`);
          } else if (tag.tagName === 'TITLE') {
            rhTypes.add('TITLE');
          }
        });
        
        const allTags = head.querySelectorAll('meta, link, title');
        allTags.forEach(tag => {
          if (tag.hasAttribute('data-rh')) return;
          let key;
          if (tag.tagName === 'META') {
            key = `${tag.tagName}-${tag.getAttribute('name') || tag.getAttribute('property') || tag.getAttribute('http-equiv')}`;
          } else if (tag.tagName === 'LINK') {
            key = `${tag.tagName}-${tag.getAttribute('rel')}`;
          } else if (tag.tagName === 'TITLE') {
            key = 'TITLE';
          }
          if (key && rhTypes.has(key)) {
            tag.remove();
          }
        });
      }
      return document.documentElement.outerHTML;
    });
    
    html = '<!DOCTYPE html>\n' + html;
    
    html = html.replace(/<script\b(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    const baseUrl = new URL(url);
    if (!html.includes('<base href=')) {
      html = html.replace(/(<head[^>]*>)/i, `$1\n<base href="${baseUrl.origin}/">`);
    }
    
    return html;
    
  } catch (error) {
    console.error('[Prerender] Render error:', error.message);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {}
    }
  }
}

export function prerenderMiddleware(baseUrl) {
  const renderBaseUrl = `http://localhost:${process.env.PORT || 5000}`;
  console.log(`[Prerender] Middleware initialized - serving: ${baseUrl}, rendering via: ${renderBaseUrl}`);
  
  return async (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    
    if (!isBot(userAgent)) {
      return next();
    }
    
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/socket.io') ||
        req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map|json|xml|txt|mp3|mp4|webp|avif)$/)) {
      return next();
    }
    
    const canonicalUrl = `${baseUrl}${req.originalUrl}`;
    const renderUrl = `${renderBaseUrl}${req.originalUrl}`;
    console.log(`[Prerender] Bot detected: ${userAgent.substring(0, 60)}`);
    console.log(`[Prerender] URL: ${req.originalUrl}`);
    
    const cachedHtml = getCachedPage(canonicalUrl);
    if (cachedHtml) {
      console.log(`[Prerender] Cache HIT: ${req.path}`);
      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'X-Prerender-Status': 'cached',
        'X-Robots-Tag': 'index, follow',
        'Cache-Control': 'public, max-age=86400'
      });
      return res.send(cachedHtml);
    }
    
    try {
      console.log(`[Prerender] Cache MISS - rendering: ${renderUrl}`);
      const html = await renderPage(renderUrl);
      
      if (html && html.length > 500) {
        let finalHtml = html.replace(
          /href="http:\/\/localhost:\d+/g, 
          `href="${baseUrl}`
        ).replace(
          /content="http:\/\/localhost:\d+/g,
          `content="${baseUrl}`
        );
        
        setCachedPage(canonicalUrl, finalHtml);
        console.log(`[Prerender] Rendered & cached: ${req.path} (${finalHtml.length} bytes)`);
        res.set({
          'Content-Type': 'text/html; charset=utf-8',
          'X-Prerender-Status': 'rendered',
          'X-Robots-Tag': 'index, follow',
          'Cache-Control': 'public, max-age=86400'
        });
        return res.send(finalHtml);
      } else {
        console.log(`[Prerender] Render failed or too small for: ${req.path}`);
        return next();
      }
    } catch (error) {
      console.error('[Prerender] Error:', error.message);
      return next();
    }
  };
}

export async function warmupCache(baseUrl, paths) {
  const renderBaseUrl = `http://localhost:${process.env.PORT || 5000}`;
  console.log(`[Prerender] Starting cache warmup for ${paths.length} pages...`);
  
  let warmed = 0;
  let failed = 0;
  
  for (const pagePath of paths) {
    const canonicalUrl = `${baseUrl}${pagePath}`;
    
    const cached = getCachedPage(canonicalUrl);
    if (cached) {
      warmed++;
      continue;
    }
    
    const renderUrl = `${renderBaseUrl}${pagePath}`;
    
    try {
      const html = await renderPage(renderUrl);
      if (html && html.length > 500) {
        let finalHtml = html.replace(
          /href="http:\/\/localhost:\d+/g, 
          `href="${baseUrl}`
        ).replace(
          /content="http:\/\/localhost:\d+/g,
          `content="${baseUrl}`
        );
        setCachedPage(canonicalUrl, finalHtml);
        warmed++;
        console.log(`[Prerender] Warmed: ${pagePath} (${finalHtml.length} bytes)`);
      } else {
        failed++;
        console.log(`[Prerender] Warmup failed: ${pagePath}`);
      }
    } catch (e) {
      failed++;
      console.error(`[Prerender] Warmup error ${pagePath}: ${e.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`[Prerender] Cache warmup complete: ${warmed} warmed, ${failed} failed`);
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
