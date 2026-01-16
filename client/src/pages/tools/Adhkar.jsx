import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/tools.css';

function Adhkar() {
  const [activeTab, setActiveTab] = useState('morning');
  const [playingIndex, setPlayingIndex] = useState(null);

  const morningAdhkar = [
    {
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadeer",
      translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
      count: 1,
      source: 'Muslim'
    },
    {
      arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
      transliteration: "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namootu wa-ilaykan-nushoor",
      translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
      count: 1,
      source: 'Tirmidhi'
    },
    {
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayy, wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa ant",
      translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide by Your covenant and promise as best I can, I take refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
      count: 1,
      source: 'Bukhari - Sayyid al-Istighfar'
    },
    {
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      transliteration: "Subhanallahi wa bihamdih",
      translation: 'How perfect Allah is and I praise Him.',
      count: 100,
      source: 'Muslim'
    },
    {
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadeer",
      translation: 'None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
      count: 10,
      source: 'Bukhari & Muslim'
    },
    {
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wala fis-sama' wahuwa as-Sami'ul-'Aleem",
      translation: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.',
      count: 3,
      source: 'Abu Dawud & Tirmidhi'
    }
  ];

  const eveningAdhkar = [
    {
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadeer",
      translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
      count: 1,
      source: 'Muslim'
    },
    {
      arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
      transliteration: "Allahumma bika amsayna, wabika asbahna, wabika nahya, wabika namootu wa-ilaykal-maseer",
      translation: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.',
      count: 1,
      source: 'Tirmidhi'
    },
    {
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
      translation: 'I take refuge in the perfect words of Allah from the evil of what He has created.',
      count: 3,
      source: 'Muslim'
    },
    {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
      transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyah fid-dunya wal-akhirah",
      translation: 'O Allah, I ask You for pardon and well-being in this world and the next.',
      count: 1,
      source: 'Abu Dawud & Ibn Majah'
    },
    {
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      transliteration: "Subhanallahi wa bihamdih",
      translation: 'How perfect Allah is and I praise Him.',
      count: 100,
      source: 'Muslim'
    },
    {
      arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      transliteration: "Astaghfirullaha wa atubu ilayh",
      translation: 'I seek forgiveness from Allah and repent to Him.',
      count: 100,
      source: 'Bukhari & Muslim'
    }
  ];

  const adhkarList = activeTab === 'morning' ? morningAdhkar : eveningAdhkar;

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
        <h1>Morning & Evening Adhkar</h1>
        <p>Authentic supplications for daily protection and blessings</p>
      </div>

      <div className="tool-content">
        <div className="adhkar-container">
          <div className="adhkar-tabs">
            <button 
              className={`adhkar-tab ${activeTab === 'morning' ? 'active' : ''}`}
              onClick={() => setActiveTab('morning')}
            >
              Morning Adhkar
            </button>
            <button 
              className={`adhkar-tab ${activeTab === 'evening' ? 'active' : ''}`}
              onClick={() => setActiveTab('evening')}
            >
              Evening Adhkar
            </button>
          </div>

          <div className="adhkar-list">
            {adhkarList.map((dhikr, index) => (
              <div key={index} className="adhkar-card">
                <div className="adhkar-arabic">{dhikr.arabic}</div>
                <div className="adhkar-transliteration">{dhikr.transliteration}</div>
                <div className="adhkar-translation">{dhikr.translation}</div>
                <div className="adhkar-meta">
                  <div className="adhkar-count">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Recite {dhikr.count}x | {dhikr.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adhkar;
