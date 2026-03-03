import { spawn } from 'child_process';
import http from 'http';
import { warmupCache, closeBrowser } from './prerenderMiddleware.js';

const PORT = 5000;
const BASE_URL = 'https://qurandeen.com';

const surahSlugs = [
  '1-al-fatihah', '2-al-baqarah', '3-aali-imran', '4-an-nisa', '5-al-maidah', '6-al-anam', '7-al-araf', '8-al-anfal', '9-at-tawbah', '10-yunus',
  '11-hud', '12-yusuf', '13-ar-rad', '14-ibrahim', '15-al-hijr', '16-an-nahl', '17-al-isra', '18-al-kahf', '19-maryam', '20-ta-ha',
  '21-al-anbiya', '22-al-hajj', '23-al-muminun', '24-an-nur', '25-al-furqan', '26-ash-shuara', '27-an-naml', '28-al-qasas', '29-al-ankabut', '30-ar-rum',
  '31-luqman', '32-as-sajdah', '33-al-ahzab', '34-saba', '35-fatir', '36-ya-sin', '37-as-saffat', '38-sad', '39-az-zumar', '40-ghafir',
  '41-fussilat', '42-ash-shura', '43-az-zukhruf', '44-ad-dukhan', '45-al-jathiyah', '46-al-ahqaf', '47-muhammad', '48-al-fath', '49-al-hujurat', '50-qaf',
  '51-adh-dhariyat', '52-at-tur', '53-an-najm', '54-al-qamar', '55-ar-rahman', '56-al-waqiah', '57-al-hadid', '58-al-mujadila', '59-al-hashr', '60-al-mumtahanah',
  '61-as-saff', '62-al-jumuah', '63-al-munafiqun', '64-at-taghabun', '65-at-talaq', '66-at-tahrim', '67-al-mulk', '68-al-qalam', '69-al-haqqah', '70-al-maarij',
  '71-nuh', '72-al-jinn', '73-al-muzzammil', '74-al-muddaththir', '75-al-qiyamah', '76-al-insan', '77-al-mursalat', '78-an-naba', '79-an-naziat', '80-abasa',
  '81-at-takwir', '82-al-infitar', '83-al-mutaffifin', '84-al-inshiqaq', '85-al-buruj', '86-at-tariq', '87-al-ala', '88-al-ghashiyah', '89-al-fajr', '90-al-balad',
  '91-ash-shams', '92-al-layl', '93-ad-duhaa', '94-ash-sharh', '95-at-tin', '96-al-alaq', '97-al-qadr', '98-al-bayyinah', '99-az-zalzalah', '100-al-adiyat',
  '101-al-qariah', '102-at-takathur', '103-al-asr', '104-al-humazah', '105-al-fil', '106-quraysh', '107-al-maun', '108-al-kawthar', '109-al-kafirun', '110-an-nasr',
  '111-al-masad', '112-al-ikhlas', '113-al-falaq', '114-an-nas'
];

function waitForServer(maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      const req = http.get(`http://localhost:${PORT}/`, (res) => {
        if (res.statusCode === 200) {
          res.resume();
          resolve();
        } else {
          if (attempts < maxAttempts) setTimeout(check, 2000);
          else reject(new Error('Server did not start'));
        }
      });
      req.on('error', () => {
        if (attempts < maxAttempts) setTimeout(check, 2000);
        else reject(new Error('Server did not start'));
      });
      req.setTimeout(5000, () => {
        req.destroy();
        if (attempts < maxAttempts) setTimeout(check, 2000);
        else reject(new Error('Server did not start'));
      });
    };
    check();
  });
}

async function main() {
  console.log('[Build Prerender] Starting server for pre-rendering...');

  const server = spawn('node', ['server/index.js'], {
    env: { ...process.env, NODE_ENV: 'production', SKIP_WARMUP: 'true' },
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd().includes('server') ? process.cwd().replace('/server', '') : process.cwd()
  });

  server.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.log(`[Server] ${msg}`);
  });
  server.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg && !msg.includes('ExperimentalWarning')) console.error(`[Server ERR] ${msg}`);
  });

  try {
    console.log('[Build Prerender] Waiting for server to start...');
    await waitForServer();
    console.log('[Build Prerender] Server is ready!');

    const criticalPaths = [
      '/',
      '/hadith',
      '/azkaar',
      '/islamic-resources',
      '/quran-juz-browser',
      '/quran-mp3-audio',
      '/islamic-events',
      '/hijri-calendar',
      '/islamic-resources/prayer-times',
      '/islamic-resources/names-of-allah',
      '/islamic-resources/qibla-direction',
    ];

    surahSlugs.forEach(slug => {
      criticalPaths.push(`/surah/${slug}`);
    });

    criticalPaths.push(
      '/hadith/sahih-bukhari',
      '/hadith/sahih-muslim',
      '/hadith/abu-dawud',
      '/hadith/ibn-majah',
      '/hadith/al-tirmidhi'
    );

    criticalPaths.push(
      '/surah/1-al-fatihah/ayah/1',
      '/surah/1-al-fatihah/ayah/7',
      '/surah/2-al-baqarah/ayah/255',
      '/surah/2-al-baqarah/ayah/286',
      '/surah/36-ya-sin/ayah/1',
      '/surah/55-ar-rahman/ayah/1',
      '/surah/67-al-mulk/ayah/1',
      '/surah/112-al-ikhlas/ayah/1',
      '/surah/113-al-falaq/ayah/1',
      '/surah/114-an-nas/ayah/1'
    );

    console.log(`[Build Prerender] Pre-rendering ${criticalPaths.length} pages...`);
    await warmupCache(BASE_URL, criticalPaths);
    console.log('[Build Prerender] Pre-rendering complete!');

  } catch (e) {
    console.error('[Build Prerender] Error:', e.message);
  } finally {
    await closeBrowser();
    server.kill('SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!server.killed) server.kill('SIGKILL');
    console.log('[Build Prerender] Done.');
    process.exit(0);
  }
}

main();
