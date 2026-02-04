import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_USER_AGENTS = [
  'googlebot',
  'google-inspectiontool',
  'bingbot',
  'yandexbot',
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
  'pinterestbot',
  'bitrix link preview',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot'
];

const CACHE_DIR = path.join(__dirname, '../.prerender-cache');
const CACHE_TTL = 24 * 60 * 60 * 1000;

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
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
      '--no-zygote'
    ]
  });
  
  return browserInstance;
}

async function renderPage(url, timeout = 30000) {
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
      waitUntil: 'networkidle0',
      timeout: timeout
    });
    
    await page.waitForFunction(() => {
      const content = document.body.innerText;
      return content.length > 500 || document.querySelector('.verse-text, .hadith-text, .surah-content');
    }, { timeout: 15000 }).catch(() => {});
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let html = await page.content();
    
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    const baseUrl = new URL(url);
    html = html.replace(/(<head[^>]*>)/i, `$1<base href="${baseUrl.origin}/">`);
    
    return html;
    
  } catch (error) {
    console.error('Prerender error:', error.message);
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
  console.log('[Prerender] Middleware initialized with baseUrl:', baseUrl);
  
  return async (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    
    const isBotRequest = isBot(userAgent);
    
    if (!isBotRequest) {
      return next();
    }
    
    if (req.path.startsWith('/api/') || 
        req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$/)) {
      return next();
    }
    
    const fullUrl = `${baseUrl}${req.originalUrl}`;
    console.log(`[Prerender] Bot detected: ${userAgent.substring(0, 50)}...`);
    console.log(`[Prerender] Rendering: ${fullUrl}`);
    
    const cachedHtml = getCachedPage(fullUrl);
    if (cachedHtml) {
      console.log(`[Prerender] Serving cached page for: ${req.path}`);
      res.set('X-Prerender-Status', 'cached');
      return res.send(cachedHtml);
    }
    
    try {
      const html = await renderPage(fullUrl);
      
      if (html) {
        setCachedPage(fullUrl, html);
        res.set('X-Prerender-Status', 'rendered');
        return res.send(html);
      } else {
        return next();
      }
    } catch (error) {
      console.error('[Prerender] Error:', error.message);
      return next();
    }
  };
}

export async function warmupCache(baseUrl, paths) {
  console.log('[Prerender] Starting cache warmup...');
  
  for (const path of paths) {
    const url = `${baseUrl}${path}`;
    console.log(`[Prerender] Warming up: ${url}`);
    
    try {
      const html = await renderPage(url);
      if (html) {
        setCachedPage(url, html);
        console.log(`[Prerender] Cached: ${path}`);
      }
    } catch (e) {
      console.error(`[Prerender] Failed to warm up ${path}:`, e.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('[Prerender] Cache warmup complete');
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
