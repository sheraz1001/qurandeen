import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/tools.css';

function HadithOfDay() {
  const [hadith, setHadith] = useState(null);
  const [copied, setCopied] = useState(false);

  const hadiths = [
    {
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      translation: 'Actions are judged by intentions, and everyone will be rewarded according to what they intended.',
      source: 'Sahih Bukhari',
      number: '1',
      narrator: 'Umar ibn al-Khattab (RA)',
      explanation: 'This foundational hadith teaches that the sincerity of our intentions determines the value of our deeds. A good deed done with an impure intention loses its reward, while a sincere intention elevates even simple acts.'
    },
    {
      arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
      translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
      source: 'Sahih Bukhari',
      number: '13',
      narrator: 'Anas ibn Malik (RA)',
      explanation: 'This hadith emphasizes the importance of brotherhood and selflessness in Islam. True faith requires us to transcend selfish desires and genuinely wish good for others.'
    },
    {
      arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
      translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
      source: 'Sahih Bukhari',
      number: '6018',
      narrator: 'Abu Hurairah (RA)',
      explanation: 'This hadith teaches the importance of mindful speech. Believers are encouraged to either contribute positively to conversations or to practice silence, avoiding harmful or useless talk.'
    },
    {
      arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
      translation: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
      source: 'Sahih Bukhari',
      number: '10',
      narrator: 'Abdullah ibn Amr (RA)',
      explanation: 'This hadith defines true Muslim character - someone who does not harm others through words or actions. It emphasizes the practical manifestation of faith through peaceful conduct.'
    },
    {
      arabic: 'الدِّينُ النَّصِيحَةُ',
      translation: 'The religion is sincere advice (Nasihah).',
      source: 'Sahih Muslim',
      number: '55',
      narrator: 'Tamim al-Dari (RA)',
      explanation: 'This hadith summarizes religion as sincere counsel - to Allah, His Book, His Messenger, Muslim leaders, and common Muslims. It emphasizes the communal responsibility of guidance and well-wishing.'
    },
    {
      arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
      translation: 'Fear Allah wherever you are, follow a bad deed with a good deed to erase it, and treat people with good character.',
      source: 'Tirmidhi',
      number: '1987',
      narrator: 'Abu Dharr al-Ghifari (RA)',
      explanation: 'This comprehensive hadith provides three essential guidelines: God-consciousness everywhere, seeking forgiveness through good deeds, and maintaining excellent character with all people.'
    },
    {
      arabic: 'مَنْ لاَ يَرْحَمُ النَّاسَ لاَ يَرْحَمُهُ اللَّهُ',
      translation: 'He who does not show mercy to people, Allah will not show mercy to him.',
      source: 'Sahih Bukhari',
      number: '7376',
      narrator: 'Jarir ibn Abdullah (RA)',
      explanation: 'This hadith highlights the importance of mercy in Islam. Showing compassion to others is directly linked to receiving Allah\'s mercy. It encourages believers to be merciful in all their dealings.'
    },
    {
      arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
      translation: 'Cleanliness is half of faith.',
      source: 'Sahih Muslim',
      number: '223',
      narrator: 'Abu Malik al-Ashari (RA)',
      explanation: 'This hadith emphasizes the importance of physical and spiritual purity in Islam. Maintaining cleanliness is not just about hygiene but is an essential component of religious practice.'
    },
    {
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      translation: 'The best of you are those who learn the Quran and teach it.',
      source: 'Sahih Bukhari',
      number: '5027',
      narrator: 'Uthman ibn Affan (RA)',
      explanation: 'This hadith elevates those who dedicate themselves to Quranic learning and teaching. It encourages Muslims to not only learn the Quran but to share that knowledge with others.'
    },
    {
      arabic: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ',
      translation: 'Verily, Allah is gentle and He loves gentleness in all matters.',
      source: 'Sahih Bukhari',
      number: '6927',
      narrator: 'Aisha (RA)',
      explanation: 'This hadith teaches that gentleness is a divine attribute and something beloved to Allah. It encourages Muslims to approach all situations with kindness and soft-heartedness.'
    },
    {
      arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
      translation: 'A good word is charity.',
      source: 'Sahih Bukhari',
      number: '2989',
      narrator: 'Abu Hurairah (RA)',
      explanation: 'This hadith teaches that even kind words are a form of charity. It democratizes good deeds, showing that everyone can give charity regardless of their material wealth.'
    },
    {
      arabic: 'لاَ ضَرَرَ وَلاَ ضِرَارَ',
      translation: 'There should be no harm nor reciprocal harm.',
      source: 'Ibn Majah',
      number: '2340',
      narrator: 'Abu Said al-Khudri (RA)',
      explanation: 'This foundational hadith establishes a key principle in Islamic jurisprudence: neither causing harm to others nor retaliating with harm. It promotes peace and mutual welfare.'
    },
    {
      arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
      translation: 'Supplication (Dua) is worship.',
      source: 'Tirmidhi',
      number: '3372',
      narrator: 'Nu\'man ibn Bashir (RA)',
      explanation: 'This hadith teaches that making dua to Allah is the essence of worship. It emphasizes the importance of maintaining a direct connection with Allah through prayer and supplication.'
    },
    {
      arabic: 'مَنْ صَلَّى الْفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
      translation: 'Whoever prays the Fajr prayer is under the protection of Allah.',
      source: 'Sahih Muslim',
      number: '657',
      narrator: 'Jundub ibn Abdullah (RA)',
      explanation: 'This hadith highlights the special status of the Fajr prayer and the divine protection granted to those who observe it. It encourages Muslims to prioritize this often-challenging prayer.'
    },
    {
      arabic: 'إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ',
      translation: 'Indeed, Allah is beautiful and He loves beauty.',
      source: 'Sahih Muslim',
      number: '91',
      narrator: 'Abdullah ibn Masud (RA)',
      explanation: 'This hadith reveals that beauty is a divine attribute and something beloved to Allah. It encourages Muslims to appreciate and create beauty in their lives, environments, and conduct.'
    }
  ];

  useEffect(() => {
    const today = new Date().toDateString();
    const cached = localStorage.getItem('hadithOfDay');
    const cachedDate = localStorage.getItem('hadithOfDayDate');

    if (cached && cachedDate === today) {
      setHadith(JSON.parse(cached));
    } else {
      const dayIndex = new Date().getDate() % hadiths.length;
      const selectedHadith = hadiths[dayIndex];
      setHadith(selectedHadith);
      localStorage.setItem('hadithOfDay', JSON.stringify(selectedHadith));
      localStorage.setItem('hadithOfDayDate', today);
    }
  }, []);

  const getShareText = () => {
    if (!hadith) return '';
    return `Hadith of the Day\n\n${hadith.arabic}\n\n"${hadith.translation}"\n\n📚 ${hadith.source} #${hadith.number}\n👤 Narrated by: ${hadith.narrator}\n\n🌐 QuranDeen.com`;
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getNewHadith = () => {
    const randomIndex = Math.floor(Math.random() * hadiths.length);
    setHadith(hadiths[randomIndex]);
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (!hadith) {
    return (
      <div className="tools-page">
        <div className="tool-content" style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Loading hadith...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tools-page">
      <div className="tool-page-header">
        <Link to="/tools" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Tools
        </Link>
        <h1>Hadith of the Day</h1>
        <p>Daily wisdom from the authentic sayings of Prophet Muhammad (PBUH)</p>
      </div>

      <div className="tool-content">
        <div className="hadith-container">
          <div className="hadith-header">
            <div className="hadith-source">{hadith.source}</div>
            <div className="hadith-title">Hadith of the Day</div>
          </div>

          <div className="hadith-content">
            <div className="hadith-arabic">{hadith.arabic}</div>
            <div className="hadith-translation">"{hadith.translation}"</div>

            <div className="hadith-reference">
              <span>Hadith #{hadith.number}</span>
              <span>Narrator: {hadith.narrator}</span>
            </div>

            <div className="hadith-explanation">
              <h3>Explanation</h3>
              <p>{hadith.explanation}</p>
            </div>

            <div className="hadith-actions">
              <button className="share-btn twitter" onClick={shareOnTwitter}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </button>
              <button className="share-btn whatsapp" onClick={shareOnWhatsApp}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
              <button className="share-btn copy" onClick={copyToClipboard}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="share-btn download" onClick={getNewHadith}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                New Hadith
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HadithOfDay;
