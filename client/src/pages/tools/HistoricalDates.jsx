import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../../styles/hijri-calendar.css';
import '../../styles/historical-dates.css';

const HISTORICAL_EVENTS = [
  {
    id: 1,
    year: 1,
    hijriDate: '1 Muharram 1 AH',
    gregorianDate: 'July 16, 622 CE',
    title: 'The Hijra - Migration to Medina',
    titleArabic: 'الهجرة النبوية',
    category: 'migration',
    importance: 'legendary',
    icon: '🕌',
    shortDesc: 'The Prophet Muhammad (PBUH) and his companions migrated from Mecca to Medina, marking the beginning of the Islamic calendar.',
    fullStory: `The Hijra (هجرة) represents one of the most pivotal moments in Islamic history. After 13 years of persecution in Mecca, Prophet Muhammad (Peace Be Upon Him) received divine permission to migrate to Yathrib, later known as Madinah (Medina).

The journey was fraught with danger. The Quraysh had placed a bounty on the Prophet's head and sent armed men to kill him. On the night of the migration, the Prophet asked Ali ibn Abi Talib to sleep in his bed as a decoy, demonstrating the immense trust and sacrifice within the early Muslim community.

The Prophet and Abu Bakr (RA) took refuge in the Cave of Thawr for three days while Quraysh search parties passed nearby. A spider miraculously wove its web across the cave entrance, and a dove built its nest there, leading the pursuers to believe no one had entered.

The journey to Medina took about 8 days. Upon arrival, the Prophet was greeted with the famous nasheed "Tala'al Badru Alayna" (The Full Moon Rose Over Us). He established the first mosque (Quba Mosque) and later the Prophet's Mosque (Masjid an-Nabawi).

The Hijra marked the establishment of the first Islamic state, the beginning of the Muslim Ummah as a political entity, and the start of the Islamic calendar. Umar ibn al-Khattab (RA) later chose this event to mark Year 1 of the Hijri calendar, recognizing its transformative significance.`,
    keyFacts: [
      'Distance traveled: approximately 450 km (280 miles)',
      'Duration: 8-10 days',
      'Companions: Abu Bakr as-Siddiq (RA)',
      'Guide: Abdullah ibn Urayqit (a non-Muslim hired guide)',
      'First stop: Cave of Thawr for 3 days'
    ],
    relatedVerses: ['Quran 9:40 - "If you do not aid him, Allah has already aided him..."']
  },
  {
    id: 2,
    year: 2,
    hijriDate: '17 Ramadan 2 AH',
    gregorianDate: 'March 13, 624 CE',
    title: 'Battle of Badr',
    titleArabic: 'غزوة بدر',
    category: 'battle',
    importance: 'legendary',
    icon: '⚔️',
    shortDesc: 'The first major battle between Muslims and the Quraysh, resulting in a decisive victory for the 313 Muslim fighters.',
    fullStory: `The Battle of Badr (غزوة بدر) was the first major military confrontation between the early Muslims and the Quraysh of Mecca. It took place on the 17th of Ramadan, 2 AH, near the wells of Badr.

The Muslim force consisted of only 313 men, poorly equipped with just 2 horses and 70 camels. They faced an army of approximately 1,000 well-armed Quraysh warriors with 100 horses and 700 camels.

Before the battle, Prophet Muhammad (PBUH) spent the night in prayer, asking Allah for victory. He was promised divine assistance: "I will reinforce you with a thousand angels, following one another" (Quran 8:9).

The battle began with single combat between champions. Hamza ibn Abdul-Muttalib, Ali ibn Abi Talib, and Ubaydah ibn al-Harith faced three Quraysh champions. The Muslims were victorious in each duel.

The main battle resulted in a stunning victory. 70 Quraysh leaders were killed, including Abu Jahl (the "Pharaoh of this Ummah"), and 70 were captured. The Muslims lost only 14 martyrs.

Badr is called "Yawm al-Furqan" (يوم الفرقان - The Day of Criterion) in the Quran because it distinguished truth from falsehood. The victory established Muslims as a formidable force in Arabia and proved that faith and unity could overcome material disadvantage.`,
    keyFacts: [
      'Muslim force: 313 fighters',
      'Quraysh force: ~1,000 fighters',
      'Muslim casualties: 14 martyrs',
      'Quraysh casualties: 70 killed, 70 captured',
      'Location: Wells of Badr, southwest of Medina'
    ],
    relatedVerses: ['Quran 3:123 - "And already had Allah given you victory at Badr while you were few in number..."']
  },
  {
    id: 3,
    year: 3,
    hijriDate: '7 Shawwal 3 AH',
    gregorianDate: 'March 23, 625 CE',
    title: 'Battle of Uhud',
    titleArabic: 'غزوة أحد',
    category: 'battle',
    importance: 'major',
    icon: '⚔️',
    shortDesc: 'A significant battle where the Muslims faced setbacks due to archers leaving their positions, and Hamza (RA) was martyred.',
    fullStory: `The Battle of Uhud took place one year after Badr, as the Quraysh sought revenge for their earlier defeat. They amassed an army of 3,000 warriors led by Abu Sufyan.

Prophet Muhammad (PBUH) positioned 50 archers on Mount Uhud with strict orders not to leave their posts under any circumstances. Initially, the Muslims gained the upper hand, and the Quraysh began to flee.

Seeing apparent victory, most archers disobeyed orders and descended to collect war spoils. Khalid ibn al-Walid (then fighting for Quraysh) noticed this and led a cavalry charge from behind, turning the tide of battle.

The Prophet (PBUH) himself was wounded, losing a tooth and suffering facial injuries. His uncle Hamza ibn Abdul-Muttalib (RA), known as "The Lion of Allah," was martyred and his body mutilated by Hind bint Utbah.

70 Muslims were martyred that day. However, the Quraysh failed to achieve a decisive victory and retreated without conquering Medina.

The battle taught profound lessons about obedience, the consequences of disobedience, and that victory comes only from Allah. The Quran addresses these events extensively in Surah Al-Imran (Chapter 3).`,
    keyFacts: [
      'Muslim force: ~700 fighters',
      'Quraysh force: 3,000 fighters',
      'Muslim martyrs: 70, including Hamza (RA)',
      'The Prophet was wounded',
      'Key lesson: Obedience to leadership'
    ],
    relatedVerses: ['Quran 3:152 - "And Allah had certainly fulfilled His promise to you when you were killing them..."']
  },
  {
    id: 4,
    year: 5,
    hijriDate: 'Shawwal-Dhul Qadah 5 AH',
    gregorianDate: 'February-March 627 CE',
    title: 'Battle of the Trench (Khandaq)',
    titleArabic: 'غزوة الخندق',
    category: 'battle',
    importance: 'major',
    icon: '⚔️',
    shortDesc: 'A coalition of 10,000 enemies besieged Medina, but Muslims defended using a trench strategy suggested by Salman al-Farsi.',
    fullStory: `The Battle of the Trench (غزوة الخندق), also known as the Battle of the Confederates (الأحزاب), was a defensive siege that lasted approximately one month.

A confederation of Quraysh, various Arab tribes, and the Jewish Banu Nadir (who had been expelled from Medina) amassed an unprecedented army of 10,000 warriors to annihilate the Muslim community once and for all.

Upon learning of the approaching army, the Prophet (PBUH) consulted his companions. Salman al-Farsi (RA), a Persian companion, suggested digging a trench around Medina's vulnerable northern approach – a tactic unknown to Arabs but common in Persian warfare.

The Muslims worked tirelessly to dig a trench about 5.5 km long, 4.6 m wide, and 3 m deep. Even the Prophet participated in the digging, and miraculous events were reported, including rocks shattering after the Prophet's supplication.

The siege lasted about 27 days. The confederates could not cross the trench, and attempts to find other entry points failed. Internal conflict arose among the confederates, especially when Nu'aym ibn Mas'ud secretly accepted Islam and sowed discord between them.

Finally, Allah sent a violent windstorm that uprooted the enemy's tents and extinguished their fires. Demoralized, the confederates retreated, never to attack Medina again. The Prophet declared: "Now we will go to them, and they will not come to us."`,
    keyFacts: [
      'Confederate army: 10,000 fighters',
      'Muslim defenders: 3,000 fighters',
      'Trench length: ~5.5 km',
      'Siege duration: ~27 days',
      'Divine intervention: Windstorm dispersed enemies'
    ],
    relatedVerses: ['Quran 33:9 - "O you who believe, remember the favor of Allah upon you when armies came to you..."']
  },
  {
    id: 5,
    year: 6,
    hijriDate: 'Dhul Qadah 6 AH',
    gregorianDate: 'March 628 CE',
    title: 'Treaty of Hudaybiyyah',
    titleArabic: 'صلح الحديبية',
    category: 'diplomacy',
    importance: 'legendary',
    icon: '📜',
    shortDesc: 'A peace treaty with Quraysh that appeared unfavorable but was called a "clear victory" by Allah.',
    fullStory: `The Treaty of Hudaybiyyah represents one of the greatest diplomatic achievements in Islamic history, though it initially seemed like a setback to many companions.

In 6 AH, Prophet Muhammad (PBUH) set out with about 1,400 companions to perform Umrah. They were unarmed, wearing ihram, demonstrating peaceful intentions. The Quraysh blocked their entry at a place called Hudaybiyyah.

After negotiations, a treaty was signed with terms that appeared unfavorable to Muslims:
1. Muslims would return without performing Umrah that year
2. They could return the following year for only 3 days
3. Any Meccan who converted and came to Medina would be returned
4. Any Muslim who went to Mecca would not be returned
5. A 10-year peace between both parties

Companions like Umar (RA) were deeply troubled by these terms. However, the Prophet assured them of Allah's wisdom.

The treaty was described in the Quran as "Fath Mubeen" (فتح مبين - Clear Victory) in Surah Al-Fath. The wisdom became apparent: the peace allowed Islam to spread rapidly. In the two years following the treaty, more people entered Islam than in all previous years combined. The treaty also exposed Quraysh's political weakness and moral bankruptcy when they eventually violated it.`,
    keyFacts: [
      'Duration of peace: 10 years (treaty broken by Quraysh in 2 years)',
      'Muslims present: ~1,400',
      'Quran called it "Fath Mubeen" (Clear Victory)',
      'Led to rapid spread of Islam',
      'Paved way for conquest of Mecca'
    ],
    relatedVerses: ['Quran 48:1 - "Indeed, We have given you a clear victory..."']
  },
  {
    id: 6,
    year: 7,
    hijriDate: 'Muharram 7 AH',
    gregorianDate: 'May 628 CE',
    title: 'Battle of Khaybar',
    titleArabic: 'غزوة خيبر',
    category: 'battle',
    importance: 'major',
    icon: '⚔️',
    shortDesc: 'Conquest of the Jewish fortress of Khaybar, where Ali (RA) famously carried the fortress gate as a shield.',
    fullStory: `The Battle of Khaybar was a military campaign against the Jewish fortress city of Khaybar, located about 150 km north of Medina.

After the Treaty of Hudaybiyyah secured peace with Quraysh, the Prophet (PBUH) turned attention to Khaybar, whose inhabitants had been conspiring against Muslims and had helped organize the Confederate army during the Battle of the Trench.

Khaybar consisted of several well-fortified strongholds. The siege lasted about a month, with Muslims gradually conquering the forts one by one.

One of the most famous incidents occurred at the fortress of Qamus. After unsuccessful attempts by several companions, the Prophet announced: "Tomorrow I will give the flag to a man who loves Allah and His Messenger, and Allah and His Messenger love him. Allah will grant victory through him."

Everyone hoped to be that man. The next morning, the Prophet called for Ali ibn Abi Talib (RA), who was suffering from an eye ailment. The Prophet applied his saliva to Ali's eyes, curing them instantly. Ali then led the assault.

In the battle, Ali reportedly tore off the fortress gate and used it as a shield. When asked later, he said he felt no weight from it. The Muslims were victorious, and Khaybar was conquered.

The conquest established a precedent for dealing with conquered peoples, allowing them to remain on their land in exchange for a portion of their produce.`,
    keyFacts: [
      'Location: 150 km north of Medina',
      'Duration: ~1 month siege',
      'Hero: Ali ibn Abi Talib (RA)',
      'Outcome: All fortresses conquered',
      'Agreement: Jews could stay farming land for 50% of produce'
    ],
    relatedVerses: ['Quran 48:15 - "Those who remained behind will say when you set out toward the war booty to take it..."']
  },
  {
    id: 7,
    year: 8,
    hijriDate: '20 Ramadan 8 AH',
    gregorianDate: 'January 11, 630 CE',
    title: 'Conquest of Mecca (Fath Makkah)',
    titleArabic: 'فتح مكة',
    category: 'conquest',
    importance: 'legendary',
    icon: '🕋',
    shortDesc: 'The peaceful conquest of Mecca, where the Prophet forgave all his former enemies and cleansed the Kaaba of idols.',
    fullStory: `The Conquest of Mecca (فتح مكة) stands as one of the most remarkable events in history – a bloodless conquest followed by universal forgiveness.

After the Quraysh violated the Treaty of Hudaybiyyah by attacking Muslim allies (Banu Khuza'a), the Prophet (PBUH) assembled an army of 10,000 Muslims and marched toward Mecca.

Abu Sufyan, the Quraysh leader, came to negotiate and was stunned by the size of the Muslim army. He accepted Islam and was promised that anyone who entered his house or stayed in their homes would be safe.

The Prophet entered Mecca on 20 Ramadan 8 AH with his head bowed in humility, reciting Surah Al-Fath. He entered the Sacred Mosque and performed tawaf (circumambulation) around the Kaaba.

The Kaaba contained 360 idols. The Prophet pointed at each with his staff, reciting "Truth has come and falsehood has vanished" (Quran 17:81), and each idol fell. The Kaaba was then cleansed and rededicated to the worship of Allah alone.

Standing at the door of the Kaaba, the Prophet addressed the Quraysh who had persecuted Muslims for 21 years. He asked: "What do you expect from me today?" They replied: "Mercy, O noble one, son of the noble one." He declared: "Go, for you are free." This general amnesty was unprecedented in Arabian history.

Only a handful of people were condemned (for specific crimes), and even most of them were later pardoned.`,
    keyFacts: [
      'Muslim army: 10,000 fighters',
      'Casualties: Minimal (nearly bloodless)',
      '360 idols destroyed in Kaaba',
      'General amnesty declared',
      'Bilal gave first adhan from atop Kaaba'
    ],
    relatedVerses: ['Quran 110:1-3 - "When the victory of Allah has come and the conquest..."']
  },
  {
    id: 8,
    year: 9,
    hijriDate: 'Rajab 9 AH',
    gregorianDate: 'October 630 CE',
    title: 'Expedition of Tabuk',
    titleArabic: 'غزوة تبوك',
    category: 'battle',
    importance: 'major',
    icon: '🏜️',
    shortDesc: 'The largest military expedition led by the Prophet, testing Muslims through extreme hardship and heat.',
    fullStory: `The Expedition of Tabuk (غزوة تبوك) was the last military expedition led by Prophet Muhammad (PBUH). It was also the largest and most challenging.

Reports reached Medina that the Byzantine Empire was amassing troops at Tabuk (in present-day Saudi Arabia near Jordan) to attack the Muslim state. The Prophet called for a general mobilization.

The timing was particularly difficult: it was harvest season, the distance was immense (~700 km), and the weather was scorching hot. This was truly a test of faith.

Despite the hardships, 30,000 Muslims responded to the call. They marched through the desert in extreme heat with limited provisions. The journey was so difficult that the army was called "Jaysh al-Usrah" (Army of Hardship).

Upon reaching Tabuk, they found no Byzantine army. The Romans had retreated upon hearing of the Muslim advance. The Prophet stayed for about 20 days, sent expeditions to nearby areas, and secured treaties with local Christian and Jewish communities.

The Quran addresses this expedition extensively, especially criticizing the hypocrites who made excuses to avoid joining. Three sincere companions (Ka'b ibn Malik, Murarah ibn Rabi'ah, and Hilal ibn Umayyah) who stayed behind without valid excuse were boycotted for 50 days before Allah accepted their repentance.

The expedition demonstrated Muslim strength and extended Islamic influence to the northern borders of Arabia.`,
    keyFacts: [
      'Muslim army: 30,000 fighters (largest)',
      'Distance: ~700 km from Medina',
      'Season: Extreme summer heat during harvest',
      'Outcome: No battle (Byzantines retreated)',
      'Called "Jaysh al-Usrah" (Army of Hardship)'
    ],
    relatedVerses: ['Quran 9:117 - "Allah has already forgiven the Prophet and the Muhajireen and Ansar..."']
  },
  {
    id: 9,
    year: 10,
    hijriDate: '9 Dhul Hijjah 10 AH',
    gregorianDate: 'March 6, 632 CE',
    title: 'The Farewell Pilgrimage',
    titleArabic: 'حجة الوداع',
    category: 'pilgrimage',
    importance: 'legendary',
    icon: '🕋',
    shortDesc: 'The only Hajj performed by Prophet Muhammad (PBUH), where he delivered his famous Farewell Sermon.',
    fullStory: `The Farewell Pilgrimage (حجة الوداع) was the only Hajj performed by Prophet Muhammad (PBUH) after the conquest of Mecca. It established the rituals of Hajj as performed by Muslims to this day.

Over 100,000 Muslims accompanied the Prophet on this journey. Sensing this might be his last Hajj, the Prophet meticulously demonstrated every ritual, saying: "Learn your rituals from me, for I do not know if I will perform Hajj after this year."

On the 9th of Dhul Hijjah, standing on the plain of Arafat, the Prophet delivered his Farewell Sermon (خطبة الوداع) – one of the most significant speeches in human history.

Key teachings from the sermon:
• All mankind is from Adam and Eve; no Arab has superiority over a non-Arab except through piety
• The sanctity of life, property, and honor
• Abolition of pre-Islamic blood feuds and usury
• Rights of women: "Treat women kindly, for they are your partners and helpers"
• Brotherhood of Muslims: "All Muslims are brothers"
• Adherence to Quran and Sunnah: "I leave behind two things; you will never go astray if you hold onto them: the Book of Allah and my Sunnah"

After delivering the sermon, the verse was revealed: "This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion" (Quran 5:3).

The Prophet passed away approximately 81 days later.`,
    keyFacts: [
      'Pilgrims: Over 100,000 Muslims',
      'Date: 9 Dhul Hijjah 10 AH',
      'Location: Plain of Arafat',
      'Final revelation: Quran 5:3 (perfection of religion)',
      'Prophet passed away ~81 days later'
    ],
    relatedVerses: ['Quran 5:3 - "This day I have perfected for you your religion..."']
  },
  {
    id: 10,
    year: 11,
    hijriDate: '12 Rabi al-Awwal 11 AH',
    gregorianDate: 'June 8, 632 CE',
    title: 'Death of Prophet Muhammad (PBUH)',
    titleArabic: 'وفاة النبي ﷺ',
    category: 'passing',
    importance: 'legendary',
    icon: '💔',
    shortDesc: 'The Prophet (PBUH) passed away in Medina, marking the end of prophethood and the beginning of the Caliphate era.',
    fullStory: `The passing of Prophet Muhammad (Peace Be Upon Him) on 12 Rabi al-Awwal 11 AH was the greatest loss in Islamic history, marking the end of revelation and prophethood.

The Prophet's final illness began shortly after his return from the Farewell Pilgrimage. He suffered from severe headaches and fever for about 13 days.

During this time, he continued to lead prayers when able. When too weak, he appointed Abu Bakr (RA) to lead prayers – a significant indication of succession. He visited the graves of Uhud martyrs and prayed for them.

On his final day, the Prophet seemed to improve briefly. He entered the mosque for Fajr prayer, and the congregation was overjoyed. But he returned to Aisha's (RA) room.

As his final moments approached, he repeatedly said: "With the highest companion" (مع الرفيق الأعلى), referring to Allah. His last words were: "O Allah, with the highest companion."

He passed away with his head resting on Aisha's chest, during the forenoon hours of Monday, 12 Rabi al-Awwal.

Umar ibn al-Khattab (RA), in shock, refused to believe the news. Abu Bakr (RA) then addressed the community: "Whoever worshipped Muhammad, then Muhammad has died. But whoever worships Allah, then Allah is Ever-Living and shall never die." He recited: "Muhammad is not but a messenger. Messengers have passed before him" (Quran 3:144).

The Prophet was buried in Aisha's room, where he passed away. This location remains within the Prophet's Mosque in Medina today.`,
    keyFacts: [
      'Age at passing: 63 years',
      'Duration of illness: ~13 days',
      'Location: Aisha\'s (RA) room in Medina',
      'Last words: "O Allah, with the highest companion"',
      'Burial place: Same room (now part of Masjid an-Nabawi)'
    ],
    relatedVerses: ['Quran 3:144 - "Muhammad is not but a messenger. Messengers have passed before him..."']
  },
  {
    id: 11,
    year: 11,
    hijriDate: '12 Rabi al-Awwal 11 AH',
    gregorianDate: 'June 8, 632 CE',
    title: 'Election of Abu Bakr as First Caliph',
    titleArabic: 'خلافة أبي بكر الصديق',
    category: 'caliphate',
    importance: 'major',
    icon: '👑',
    shortDesc: 'Abu Bakr as-Siddiq (RA) was elected as the first Caliph of Islam at Saqifah Bani Sa\'idah.',
    fullStory: `On the same day of the Prophet's passing, the Muslim community faced an immediate crisis of leadership. At Saqifah Bani Sa'idah (a covered meeting place in Medina), the Ansar gathered to discuss succession.

Some Ansar proposed that they should have a leader from themselves, given their support for Islam. Upon hearing this, Abu Bakr, Umar, and Abu Ubaydah rushed to the gathering.

Abu Bakr (RA) addressed the assembly, reminding them that the Arabs would only accept leadership from Quraysh. He proposed either Umar or Abu Ubaydah for the position.

Both declined, with Umar immediately taking Abu Bakr's hand and pledging allegiance (bay'ah) to him, saying: "You are the best of us and the most beloved to the Messenger of Allah."

The choice was fitting: Abu Bakr was the Prophet's closest companion, his father-in-law, and the one chosen to lead prayers during the Prophet's illness. He was the first adult male to accept Islam and had spent his entire fortune in the path of Allah.

Abu Bakr's caliphate (11-13 AH) would face immediate challenges: the Ridda Wars (against tribes who rejected Islam after the Prophet's death), compilation of the Quran, and expansion of the Islamic state.

His humility was legendary. In his inaugural address, he said: "I have been given authority over you but I am not the best of you. If I do well, help me; and if I do wrong, set me right."`,
    keyFacts: [
      'Title: As-Siddiq (The Truthful)',
      'Duration of Caliphate: ~2 years (11-13 AH)',
      'First adult male convert to Islam',
      'Companion of the Prophet in Hijra',
      'Unified Arabian Peninsula during Ridda Wars'
    ],
    relatedVerses: ['Quran 9:40 - "...when they were in the cave and he said to his companion, \'Do not grieve; indeed Allah is with us.\'"']
  },
  {
    id: 12,
    year: 13,
    hijriDate: '22 Jumada al-Thani 13 AH',
    gregorianDate: 'August 23, 634 CE',
    title: 'Death of Abu Bakr (RA) & Umar\'s Caliphate',
    titleArabic: 'وفاة أبي بكر وخلافة عمر',
    category: 'caliphate',
    importance: 'major',
    icon: '👑',
    shortDesc: 'Abu Bakr (RA) passed away and Umar ibn al-Khattab (RA) became the second Caliph.',
    fullStory: `Abu Bakr (RA) led the Muslim Ummah for approximately two years and three months. During this brief but crucial period, he unified Arabia, launched the conquests of Persia and Byzantine territories, and compiled the Quran into a single manuscript.

In his final illness, Abu Bakr consulted senior companions about his successor. The consensus pointed to Umar ibn al-Khattab (RA), despite Umar's reputation for strictness. Abu Bakr said: "Umar's harshness was to balance my leniency. When authority rests upon him, he will soften."

Abu Bakr passed away on 22 Jumada al-Thani 13 AH at age 63 (the same age as the Prophet at his passing). He was buried next to the Prophet (PBUH) in Aisha's room.

Umar's caliphate (13-23 AH) would become known as the golden age of Islamic expansion. Under his leadership:

• The Sassanid Persian Empire was conquered
• Byzantine provinces of Syria, Palestine, and Egypt were liberated
• Jerusalem was peacefully surrendered
• The Hijri calendar was established
• Bayt al-Mal (public treasury) was institutionalized
• The judicial system was organized
• Cities like Kufa and Basra were founded

Umar was known for his justice, simplicity, and accessibility to all citizens. He would patrol the streets at night to ensure no one was in need.`,
    keyFacts: [
      'Abu Bakr\'s age at death: 63 years',
      'Umar\'s caliphate duration: ~10.5 years (13-23 AH)',
      'Major conquests: Persia, Syria, Palestine, Egypt',
      'Established: Hijri calendar, Bayt al-Mal',
      'Title: Al-Faruq (One who distinguishes truth from falsehood)'
    ],
    relatedVerses: ['Quran 48:29 - "Muhammad is the Messenger of Allah; and those with him are forceful against disbelievers..."']
  },
  {
    id: 13,
    year: 15,
    hijriDate: '15 AH',
    gregorianDate: '636 CE',
    title: 'Conquest of Jerusalem',
    titleArabic: 'فتح بيت المقدس',
    category: 'conquest',
    importance: 'legendary',
    icon: '🏛️',
    shortDesc: 'Umar ibn al-Khattab (RA) personally received the keys to Jerusalem, entering the holy city with remarkable humility.',
    fullStory: `The conquest of Jerusalem (بيت المقدس) in 15 AH is one of the most significant events in Islamic history, notable for both its strategic importance and the manner in which it was achieved.

After the decisive Battle of Yarmouk, Muslim forces under Abu Ubaydah ibn al-Jarrah laid siege to Jerusalem. The city's Patriarch, Sophronius, refused to surrender to anyone except the Caliph himself.

When Umar arrived, he was riding a camel with his servant. They had been taking turns riding throughout the journey. It happened to be the servant's turn to ride as they approached the city. Abu Ubaydah suggested Umar ride to make a better impression. Umar refused, saying: "We are a people whom Allah has honored through Islam. We don't seek honor through anything else."

The Patriarch was stunned when the simply-dressed man on foot turned out to be the Caliph of the Muslims. This humility deeply impressed him.

Umar entered Jerusalem peacefully. He refused to pray inside the Church of the Holy Sepulchre when prayer time came, explaining: "If I pray here, Muslims after me might claim it as a mosque." He prayed outside instead.

The Covenant of Umar (العهدة العمرية) guaranteed Christians freedom of worship, protection of their churches, and security of their lives and property. It remains one of the earliest examples of religious tolerance in medieval history.

Umar also cleansed and prayed at the Temple Mount, which had been used as a garbage dump. The Al-Aqsa Mosque would later be built there.`,
    keyFacts: [
      'Peaceful surrender: No fighting in Jerusalem',
      'Umar entered on foot (servant rode the camel)',
      'Covenant guaranteed Christian rights',
      'Refused to pray in Church (to protect it)',
      'Cleansed Temple Mount area'
    ],
    relatedVerses: ['Quran 17:1 - "Exalted is He who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa..."']
  },
  {
    id: 14,
    year: 20,
    hijriDate: '20 AH',
    gregorianDate: '641 CE',
    title: 'Conquest of Egypt',
    titleArabic: 'فتح مصر',
    category: 'conquest',
    importance: 'major',
    icon: '🏛️',
    shortDesc: 'Amr ibn al-As (RA) conquered Egypt, ending Byzantine rule and opening Africa to Islam.',
    fullStory: `The conquest of Egypt was led by the brilliant military commander Amr ibn al-As (RA), who had initially requested permission from Umar to pursue this campaign.

Amr set out with only 4,000 men (later reinforced to 12,000) toward Egypt in late 639 CE. The campaign took about two years to complete.

The Byzantine Empire was hated by the Coptic Christians of Egypt due to religious persecution. The Byzantines enforced Greek Orthodox theology, while the Copts held to Monophysite beliefs. This made the Muslim arrival a relief for many Egyptians.

Key events of the conquest:
• Battle of Heliopolis (640 CE): Decisive defeat of Byzantine forces
• Siege of Babylon Fortress: Strategic fortress fell after siege
• Siege of Alexandria (641 CE): The great city surrendered peacefully

Amr established a new capital called Fustat (near modern Cairo) rather than occupying Alexandria. He built the first mosque in Africa, known as the Mosque of Amr ibn al-As, which still stands today.

The conquest opened trade routes to Africa, secured the Mediterranean, and provided vital grain supplies for the growing Islamic state. Egypt's wealth and strategic position made it one of the most important Muslim provinces.

Amr's governance was just and tolerant. The Coptic Patriarch Benjamin, who had been in hiding from Byzantine persecution, returned and was allowed to rebuild churches and practice freely.`,
    keyFacts: [
      'Initial force: 4,000 fighters',
      'Duration: ~2 years',
      'Founded: City of Fustat (predecessor to Cairo)',
      'Built: First mosque in Africa (Mosque of Amr)',
      'Coptic Christians welcomed Muslim rule'
    ],
    relatedVerses: ['Quran 12:99 - "And when they entered upon Joseph, he took his parents to himself (in Egypt)..."']
  },
  {
    id: 15,
    year: 23,
    hijriDate: '26 Dhul Hijjah 23 AH',
    gregorianDate: 'November 3, 644 CE',
    title: 'Martyrdom of Umar (RA)',
    titleArabic: 'استشهاد عمر بن الخطاب',
    category: 'passing',
    importance: 'major',
    icon: '💔',
    shortDesc: 'Umar ibn al-Khattab (RA) was assassinated by Abu Lu\'lu\'a while leading Fajr prayer.',
    fullStory: `The assassination of Umar ibn al-Khattab (RA) marked the first political assassination in Islamic history. It occurred during Fajr prayer on 26 Dhul Hijjah 23 AH.

The assassin was Abu Lu'lu'a Firuz, a Persian slave owned by Mughirah ibn Shu'bah. He had a personal grievance against Umar regarding taxes imposed on his earnings. When Umar refused to reduce the tax (finding it reasonable), Abu Lu'lu'a harbored resentment.

During Fajr prayer, as Umar was leading the congregation, Abu Lu'lu'a attacked him with a double-edged poisoned dagger, stabbing him six times. He also wounded several worshippers before taking his own life.

As Umar lay dying, he appointed a council (Shura) of six senior companions to choose his successor: Uthman ibn Affan, Ali ibn Abi Talib, Talha ibn Ubaydullah, Zubayr ibn al-Awwam, Sa'd ibn Abi Waqqas, and Abd al-Rahman ibn Awf.

Before his death, Umar made several requests:
• He sought Aisha's permission to be buried next to the Prophet and Abu Bakr
• He ordered his son Abdullah to settle his debts from family property
• He expressed concern that he might not have served the Ummah adequately

Umar died three days after the attack. His caliphate of approximately 10.5 years saw the Islamic state expand from Arabia to include Persia, Syria, Palestine, and Egypt. He was 63 years old – the same age as the Prophet and Abu Bakr at their passing.`,
    keyFacts: [
      'Age at martyrdom: 63 years',
      'Assassin: Abu Lu\'lu\'a Firuz (Persian slave)',
      'Location: Masjid an-Nabawi, during Fajr',
      'Burial: Next to Prophet (PBUH) and Abu Bakr (RA)',
      'Appointed 6-member Shura for succession'
    ],
    relatedVerses: ['Quran 3:185 - "Every soul will taste death..."']
  },
  {
    id: 16,
    year: 35,
    hijriDate: '18 Dhul Hijjah 35 AH',
    gregorianDate: 'June 17, 656 CE',
    title: 'Martyrdom of Uthman (RA)',
    titleArabic: 'استشهاد عثمان بن عفان',
    category: 'passing',
    importance: 'major',
    icon: '💔',
    shortDesc: 'The third Caliph Uthman (RA) was martyred by rebels while reading the Quran.',
    fullStory: `The martyrdom of Uthman ibn Affan (RA) was a tragedy that marked the beginning of fitna (civil strife) in the Muslim community.

Uthman's caliphate (23-35 AH) was remarkably successful in its early years. He completed the compilation of the Quran into a single standardized codex, expanded the Prophet's Mosque, built the first Islamic navy, and continued the expansion into North Africa and Central Asia.

However, later years saw growing discontent. Rebels from Egypt, Kufa, and Basra accused Uthman of nepotism (appointing relatives to positions) and deviating from earlier policies. These accusations were largely exaggerated or false.

In 35 AH, rebels besieged Uthman's house for about 40 days. Despite having the ability to call for military support, Uthman refused, saying he would not shed Muslim blood to protect himself.

Many companions offered to defend him, but Uthman ordered them to stand down. Ali ibn Abi Talib (RA) sent his sons Hasan and Husayn to guard Uthman's door.

On 18 Dhul Hijjah, while Uthman was fasting and reading the Quran, rebels broke into his house. He was reading: "Allah will suffice you against them, and He is the Hearing, the Knowing" (Quran 2:137). He was struck down while the Quran was in his hands, and his blood fell upon the verse.

His wife Na'ilah tried to protect him and lost fingers in the attack. Uthman was 82 years old, and his blood on the Quran became a symbol of the tragedy.`,
    keyFacts: [
      'Age at martyrdom: 82 years',
      'Duration of caliphate: 12 years (23-35 AH)',
      'Compiled standardized Quran (Uthmanic codex)',
      'Martyred while reading Quran',
      'Title: Dhun-Nurayn (Possessor of Two Lights)'
    ],
    relatedVerses: ['Quran 2:137 - "Allah will suffice you against them, and He is the Hearing, the Knowing..."']
  },
  {
    id: 17,
    year: 40,
    hijriDate: '21 Ramadan 40 AH',
    gregorianDate: 'January 28, 661 CE',
    title: 'Martyrdom of Ali (RA)',
    titleArabic: 'استشهاد علي بن أبي طالب',
    category: 'passing',
    importance: 'legendary',
    icon: '💔',
    shortDesc: 'The fourth Caliph Ali (RA) was assassinated by a Kharijite while going to Fajr prayer.',
    fullStory: `The martyrdom of Ali ibn Abi Talib (RA) marked the end of the Rashidun (Rightly Guided) Caliphate era.

Ali's caliphate (35-40 AH) was marked by internal conflicts. He faced the Battle of the Camel (fought against Talha, Zubayr, and Aisha, who sought justice for Uthman's murder), the Battle of Siffin (against Muawiyah), and the Battle of Nahrawan (against the Kharijites).

The Kharijites were extremists who had initially supported Ali but turned against him after the arbitration at Siffin. They declared all parties – Ali, Muawiyah, and their supporters – as disbelievers deserving death.

Three Kharijites plotted to simultaneously assassinate Ali, Muawiyah, and Amr ibn al-As on the same day (21 Ramadan 40 AH). Only the attack on Ali succeeded.

As Ali left his home for Fajr prayer at the mosque in Kufa, Ibn Muljam struck him with a poisoned sword on the head, crying: "Judgment belongs to Allah alone!"

Ali lived for two more days. His final advice included:
• Care for orphans and the poor
• Be consistent in prayer
• Fear Allah in all matters
• Do not seek to kill Ibn Muljam in any way other than a single strike (as Ali was struck once)

Ali (RA) died on 21 Ramadan 40 AH at approximately 63 years old. He was buried in Najaf (present-day Iraq). His shrine is one of the holiest sites in Islam, particularly for Shia Muslims.

Ali is revered as one of the greatest figures in Islamic history: cousin and son-in-law of the Prophet, father of Hasan and Husayn, the "Gate to the City of Knowledge," and the Lion of Allah.`,
    keyFacts: [
      'Age at martyrdom: ~63 years',
      'Duration of caliphate: ~5 years (35-40 AH)',
      'Assassin: Ibn Muljam (Kharijite)',
      'Last of the Rashidun Caliphs',
      'Titles: Asadullah (Lion of Allah), Baab al-Ilm (Gate of Knowledge)'
    ],
    relatedVerses: ['Quran 5:55 - "Your ally is none but Allah and His Messenger and those who believe..."']
  },
  {
    id: 18,
    year: 61,
    hijriDate: '10 Muharram 61 AH',
    gregorianDate: 'October 10, 680 CE',
    title: 'Tragedy of Karbala - Martyrdom of Husayn (RA)',
    titleArabic: 'استشهاد الحسين بن علي',
    category: 'passing',
    importance: 'legendary',
    icon: '💔',
    shortDesc: 'Husayn ibn Ali (RA), grandson of the Prophet, was martyred at Karbala along with his family and companions.',
    fullStory: `The tragedy of Karbala is one of the most sorrowful events in Islamic history. On the 10th of Muharram (Ashura) 61 AH, Husayn ibn Ali (RA), the beloved grandson of Prophet Muhammad (PBUH), was martyred along with 72 of his family members and companions.

After the death of Muawiyah, his son Yazid claimed the caliphate. Husayn refused to pledge allegiance to Yazid, whom he considered unfit for leadership due to his un-Islamic conduct.

The people of Kufa invited Husayn to lead them against Yazid, sending thousands of letters of support. Husayn sent his cousin Muslim ibn Aqil ahead to assess the situation. Initially, 18,000 Kufans pledged allegiance. However, when Yazid's governor Ibn Ziyad arrived with threats, the Kufans abandoned Muslim, who was captured and executed.

Before news reached Husayn, he had already set out with his family and a small group of companions. Even after learning of Muslim's fate, he continued, saying he could not turn back from those who had invited him.

At Karbala, near the Euphrates, Husayn's camp was surrounded by an army of 4,000 (later 30,000) under Umar ibn Sa'd. They were cut off from water for days.

On 10 Muharram, after negotiations failed, battle commenced. Husayn's companions fought valiantly and were killed one by one. His son Ali al-Akbar, his nephew Qasim, his brothers, and all male companions were martyred.

Finally, Husayn himself entered battle. He was struck multiple times and eventually beheaded. His head was taken to Yazid in Damascus.

The women and children, including Husayn's son Ali Zayn al-Abidin (who was too ill to fight), were taken as prisoners. The tragedy profoundly impacted Islamic history and consciousness.`,
    keyFacts: [
      'Date: 10 Muharram 61 AH (Ashura)',
      'Martyrs: 72 including Husayn (RA)',
      'Location: Karbala, present-day Iraq',
      'Commander opposing: Umar ibn Sa\'d',
      'Survivors: Ali Zayn al-Abidin, women and children'
    ],
    relatedVerses: ['Quran 3:169 - "And never think of those who have been killed in the cause of Allah as dead. Rather, they are alive with their Lord..."']
  },
  {
    id: 19,
    year: 132,
    hijriDate: '132 AH',
    gregorianDate: '750 CE',
    title: 'Fall of Umayyads - Rise of Abbasid Caliphate',
    titleArabic: 'سقوط الدولة الأموية وقيام الخلافة العباسية',
    category: 'caliphate',
    importance: 'major',
    icon: '👑',
    shortDesc: 'The Umayyad Caliphate fell to the Abbasid Revolution, shifting power from Damascus to Baghdad.',
    fullStory: `The Abbasid Revolution marked a dramatic transformation of the Islamic world. The Umayyad Dynasty, which had ruled from Damascus since 661 CE, was overthrown and replaced by the Abbasids, descendants of the Prophet's uncle Abbas ibn Abdul-Muttalib.

The revolution was fueled by multiple grievances:
• Perceived discrimination against non-Arab Muslims (mawali)
• Resentment of Umayyad centralization of power
• Opposition from descendants of Ali (Alids)
• General dissatisfaction with Umayyad governance

The revolt began in Khorasan (eastern Iran) under Abu Muslim al-Khorasani, who raised black banners – the color of the Abbasids, contrasting with Umayyad white. The movement grew rapidly.

In 750 CE (132 AH), the Abbasids defeated the Umayyad army at the Battle of the Great Zab River. The last Umayyad Caliph, Marwan II, fled to Egypt where he was killed.

Abu al-Abbas as-Saffah became the first Abbasid Caliph. The Abbasids then systematically eliminated the Umayyad family in a series of massacres. Only Abd al-Rahman I escaped, fleeing to Spain where he established an independent Umayyad Emirate in Cordoba.

The Abbasids moved the capital from Damascus to the newly built city of Baghdad (762 CE), shifting the center of the Islamic world eastward.

The Abbasid era (750-1258 CE) would become known as the Islamic Golden Age, with flourishing of science, philosophy, medicine, mathematics, and the arts. The House of Wisdom in Baghdad became the world's leading center of learning.`,
    keyFacts: [
      'End of Umayyad Caliphate: 750 CE (132 AH)',
      'First Abbasid Caliph: Abu al-Abbas as-Saffah',
      'New capital: Baghdad (founded 762 CE)',
      'Surviving Umayyad: Abd al-Rahman I (founded Cordoba)',
      'Abbasid era: Known as Islamic Golden Age'
    ],
    relatedVerses: ['Quran 3:26 - "Say: O Allah, Owner of Sovereignty, You give sovereignty to whom You will..."']
  },
  {
    id: 20,
    year: 92,
    hijriDate: '92 AH',
    gregorianDate: '711 CE',
    title: 'Muslim Conquest of Spain (Al-Andalus)',
    titleArabic: 'فتح الأندلس',
    category: 'conquest',
    importance: 'major',
    icon: '🏰',
    shortDesc: 'Tariq ibn Ziyad crossed the Strait of Gibraltar and conquered Visigothic Spain.',
    fullStory: `The Islamic conquest of Spain began in 711 CE when the young Berber general Tariq ibn Ziyad crossed from Morocco with an army of about 7,000 men.

The crossing point became known as Jabal Tariq (جبل طارق - "Mountain of Tariq"), which eventually became "Gibraltar."

The Visigothic Kingdom of Spain was weakened by internal conflicts. King Roderick was unpopular, and some nobles had invited the Muslims to intervene. However, what started as an intervention became a full conquest.

At the Battle of Guadalete (July 711), Tariq's forces decisively defeated Roderick's much larger army. Roderick was killed or disappeared. Within months, Tariq had captured Toledo, the Visigothic capital.

Musa ibn Nusayr, the governor of North Africa, followed with a larger army of 18,000. By 720 CE, most of the Iberian Peninsula was under Muslim control.

The conquest of Spain (Al-Andalus) launched one of history's most brilliant civilizations. For nearly 800 years (711-1492), Islamic Spain was a beacon of learning, culture, and relative tolerance.

Achievements of Al-Andalus:
• Cities like Cordoba, Granada, and Seville became centers of learning
• The Great Mosque of Cordoba remains an architectural masterpiece
• Translation of Greek texts preserved and advanced classical knowledge
• Advances in agriculture, irrigation, and urban planning
• Coexistence of Muslims, Christians, and Jews (Convivencia)

Al-Andalus served as a bridge transferring knowledge from the Islamic world to medieval Europe.`,
    keyFacts: [
      'Crossing: 711 CE (92 AH)',
      'Commander: Tariq ibn Ziyad',
      'Force: ~7,000 initial, reinforced to ~25,000',
      'Duration: Most of Spain conquered by 720 CE',
      'Legacy: 800 years of Islamic civilization in Iberia'
    ],
    relatedVerses: ['Quran 21:105 - "And We have already written in the Psalms, after the Torah, that the land will be inherited by My righteous servants."']
  },
  {
    id: 21,
    year: 656,
    hijriDate: '656 AH',
    gregorianDate: '1258 CE',
    title: 'Mongol Sack of Baghdad - Fall of Abbasid Caliphate',
    titleArabic: 'سقوط بغداد',
    category: 'tragedy',
    importance: 'legendary',
    icon: '🏚️',
    shortDesc: 'The Mongols under Hulagu Khan destroyed Baghdad, ending the Abbasid Caliphate and devastating Islamic civilization.',
    fullStory: `The Mongol sack of Baghdad in 1258 CE (656 AH) was one of the most catastrophic events in Islamic history. It marked the end of the Abbasid Caliphate and caused immense destruction to the center of Islamic civilization.

Hulagu Khan, grandson of Genghis Khan, led an army estimated at 150,000-300,000 toward Baghdad. The Abbasid Caliph al-Musta'sim had weakened his army and ignored warnings of the Mongol threat.

The siege lasted about two weeks. On February 10, 1258, the Mongols breached the walls. What followed was unprecedented devastation:

• The population was massacred. Estimates range from 200,000 to over 1 million killed.
• The House of Wisdom, repository of centuries of human knowledge, was destroyed.
• Books were thrown into the Tigris River, which reportedly ran black with ink and red with blood.
• Mosques, hospitals, palaces, and libraries were burned.
• The Caliph al-Musta'sim was executed (reportedly rolled in a carpet and trampled to death).

The destruction was so complete that Baghdad would not recover for centuries. Irrigation systems were wrecked, agriculture collapsed, and the population never returned to pre-1258 levels.

The psychological impact was immense. For centuries, Baghdad had been the center of the Muslim world. Its fall seemed to many like the end of Islam itself.

However, the Mongol advance was eventually halted. In 1260, at the Battle of Ain Jalut in Palestine, the Mamluk Sultanate of Egypt defeated the Mongols – a turning point in world history. Many Mongols later converted to Islam.`,
    keyFacts: [
      'Date of fall: February 10, 1258 CE (656 AH)',
      'Mongol commander: Hulagu Khan',
      'Casualties: 200,000 to 1+ million',
      'Last Abbasid Caliph: al-Musta\'sim (executed)',
      'Destruction: House of Wisdom, libraries, hospitals'
    ],
    relatedVerses: ['Quran 2:155 - "And We will surely test you with something of fear and hunger and loss of wealth and lives..."']
  },
  {
    id: 22,
    year: 857,
    hijriDate: '857 AH',
    gregorianDate: '1453 CE',
    title: 'Ottoman Conquest of Constantinople',
    titleArabic: 'فتح القسطنطينية',
    category: 'conquest',
    importance: 'legendary',
    icon: '🏰',
    shortDesc: 'Sultan Mehmed II conquered Constantinople, fulfilling a prophecy of the Prophet (PBUH) and ending the Byzantine Empire.',
    fullStory: `The Ottoman conquest of Constantinople on May 29, 1453 CE (857 AH) fulfilled a prophecy of Prophet Muhammad (PBUH), who had said: "You will conquer Constantinople. What a wonderful leader will that leader be, and what a wonderful army will that army be!"

Sultan Mehmed II, just 21 years old, was determined to be that leader. He spent two years preparing for the siege, including:
• Building the fortress of Rumeli Hisarı to control the Bosphorus
• Commissioning massive cannons, including the famous "Basilica" cannon
• Assembling an army of approximately 80,000-100,000 soldiers
• Building a fleet of over 100 ships

Constantinople's legendary walls had resisted sieges for 1,000 years. The city was defended by only about 7,000 troops under Emperor Constantine XI.

The siege began on April 6, 1453. Ottoman cannons pounded the walls daily. When a chain across the Golden Horn prevented naval access, Mehmed ordered 70 ships to be dragged overland on greased logs – a remarkable engineering feat.

After 53 days of siege, on May 29, Ottoman forces breached the walls. Emperor Constantine XI died in battle. Mehmed entered the city and proceeded to the Hagia Sophia cathedral.

Contrary to normal practices of the era, Mehmed showed remarkable tolerance:
• Churches were allowed to function
• Christians could practice their faith
• The Greek Orthodox Patriarch was given authority over Christians
• Jews were welcomed (many Spanish Jews later settled in Ottoman lands)

Constantinople became Istanbul, the new Ottoman capital. Hagia Sophia was converted to a mosque. The city would remain the center of the Islamic Caliphate until 1924.`,
    keyFacts: [
      'Date: May 29, 1453 CE (857 AH)',
      'Sultan: Mehmed II (The Conqueror)',
      'Ottoman army: ~80,000-100,000',
      'Siege duration: 53 days',
      'Ended: Byzantine Empire (1,000+ years)'
    ],
    relatedVerses: ['Hadith: "You will conquer Constantinople. What a wonderful leader will that leader be..."']
  },
  {
    id: 23,
    year: 897,
    hijriDate: '897 AH',
    gregorianDate: '1492 CE',
    title: 'Fall of Granada - End of Al-Andalus',
    titleArabic: 'سقوط غرناطة',
    category: 'tragedy',
    importance: 'major',
    icon: '🏚️',
    shortDesc: 'The last Muslim kingdom in Spain fell to Ferdinand and Isabella, ending 800 years of Islamic presence in Iberia.',
    fullStory: `The fall of Granada on January 2, 1492 CE (897 AH) marked the end of nearly 800 years of Islamic civilization in the Iberian Peninsula – one of history's most brilliant and tolerant societies.

Granada's Nasrid Kingdom was the last Muslim state in Spain. By 1482, Ferdinand of Aragon and Isabella of Castile launched their final campaign to conquer it.

Sultan Abu Abdullah Muhammad XII (known as Boabdil to Europeans) faced insurmountable odds. Internal conflicts, lack of support from other Muslim powers, and the combined might of unified Christian Spain made resistance futile.

After a ten-year war and a siege of Granada, Boabdil negotiated a surrender. The Treaty of Granada (November 1491) promised Muslims:
• Freedom to practice Islam
• Protection of property and mosques
• Preservation of customs and language
• Right to emigrate freely

On January 2, 1492, Boabdil surrendered the keys of the Alhambra Palace to Ferdinand and Isabella. Legend says that as he looked back at Granada from a mountain pass, he wept. His mother reportedly said: "Weep like a woman for what you could not defend like a man." The pass is still called "El Suspiro del Moro" (The Moor's Sigh).

The promised tolerance quickly evaporated:
• 1502: Muslims forced to convert or leave
• Forced conversions, persecution, and the Inquisition followed
• 1609-1614: Final expulsion of Moriscos (converted Muslims)

The loss of Al-Andalus remains a profound historical memory in the Muslim world. The Alhambra Palace, the Great Mosque of Cordoba, and other monuments stand as testament to the civilization that once flourished there.`,
    keyFacts: [
      'Date: January 2, 1492 CE (897 AH)',
      'Last Sultan: Boabdil (Abu Abdullah Muhammad XII)',
      'Victors: Ferdinand II and Isabella I',
      'Duration of Islamic Spain: 781 years (711-1492)',
      'Same year: Columbus sailed to Americas'
    ],
    relatedVerses: ['Quran 3:140 - "If a wound should touch you, there has already touched the other people a wound similar to it..."']
  }
];

const ERAS = [
  { id: 'prophetic', name: 'Prophetic Era', range: '1-11 AH', color: '#10b981' },
  { id: 'rashidun', name: 'Rashidun Caliphate', range: '11-40 AH', color: '#0284c7' },
  { id: 'umayyad', name: 'Early Islamic Era', range: '41-132 AH', color: '#7c3aed' },
  { id: 'abbasid', name: 'Classical Period', range: '132-656 AH', color: '#f59e0b' },
  { id: 'late', name: 'Late Medieval Era', range: '656-1000 AH', color: '#ef4444' }
];

const CATEGORIES = [
  { id: 'all', name: 'All Events', icon: '📜' },
  { id: 'migration', name: 'Migration', icon: '🕌' },
  { id: 'battle', name: 'Battles', icon: '⚔️' },
  { id: 'conquest', name: 'Conquests', icon: '🏰' },
  { id: 'diplomacy', name: 'Diplomacy', icon: '📜' },
  { id: 'pilgrimage', name: 'Pilgrimage', icon: '🕋' },
  { id: 'caliphate', name: 'Caliphate', icon: '👑' },
  { id: 'passing', name: 'Martyrdom/Passing', icon: '💔' },
  { id: 'tragedy', name: 'Tragedies', icon: '🏚️' }
];

function HistoricalDates() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEra, setActiveEra] = useState(null);

  const filteredEvents = useMemo(() => {
    return HISTORICAL_EVENTS.filter(event => {
      const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.titleArabic.includes(searchQuery) ||
        event.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEra = !activeEra || (
        (activeEra === 'prophetic' && event.year >= 1 && event.year <= 11) ||
        (activeEra === 'rashidun' && event.year > 11 && event.year <= 40) ||
        (activeEra === 'umayyad' && event.year > 40 && event.year <= 132) ||
        (activeEra === 'abbasid' && event.year > 132 && event.year <= 656) ||
        (activeEra === 'late' && event.year > 656)
      );
      return matchesCategory && matchesSearch && matchesEra;
    });
  }, [activeCategory, searchQuery, activeEra]);

  const getImportanceClass = (importance) => {
    switch(importance) {
      case 'legendary': return 'importance-legendary';
      case 'major': return 'importance-major';
      default: return 'importance-normal';
    }
  };

  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="historical-dates-page">
      <Helmet>
        <title>Historical Islamic Dates - Explore Hijri Years & Events | QuranDeen</title>
        <meta name="description" content="Explore major Islamic historical events from the Hijra to the Ottoman era. Discover detailed stories of the Prophet's life, battles, conquests, and the Rashidun Caliphate." />
      </Helmet>

      <div className="hijri-hero historical-hero">
        <div className="hijri-hero-content">
          <h1>Historical Islamic Dates</h1>
          <p>Explore the rich tapestry of Islamic history through major events that shaped our civilization</p>
          
          <div className="today-display historical-stats">
            <div className="stat-item">
              <span className="stat-number">{HISTORICAL_EVENTS.length}</span>
              <span className="stat-label">Historical Events</span>
            </div>
            <div className="today-divider">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-item">
              <span className="stat-number">1400+</span>
              <span className="stat-label">Years of History</span>
            </div>
            <div className="today-divider">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Major Eras</span>
            </div>
          </div>
        </div>
      </div>

      <div className="historical-container">
        <div className="filters-section">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search events, years, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="era-filters">
            <span className="filter-label">Filter by Era:</span>
            <div className="era-buttons">
              <button
                className={`era-btn ${!activeEra ? 'active' : ''}`}
                onClick={() => setActiveEra(null)}
              >
                All Eras
              </button>
              {ERAS.map(era => (
                <button
                  key={era.id}
                  className={`era-btn ${activeEra === era.id ? 'active' : ''}`}
                  onClick={() => setActiveEra(era.id)}
                  style={{ '--era-color': era.color }}
                >
                  {era.name}
                  <span className="era-range">{era.range}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="timeline-section">
          <div className="timeline-line"></div>
          
          {filteredEvents.length === 0 ? (
            <div className="no-results">
              <span className="no-icon">🔍</span>
              <h3>No events found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="events-timeline">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`timeline-event ${getImportanceClass(event.importance)} ${index % 2 === 0 ? 'left' : 'right'}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="event-marker">
                    <span className="event-icon">{event.icon}</span>
                  </div>
                  <div className="event-card">
                    <div className="event-year">
                      <span className="year-value">{event.year} AH</span>
                      <span className="year-greg">{event.gregorianDate.split(',')[1] || event.gregorianDate}</span>
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-arabic">{event.titleArabic}</p>
                    <p className="event-desc">{event.shortDesc}</p>
                    <button className="read-more-btn">
                      Read Full Story
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="back-nav">
          <Link to="/islamic-resources" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Islamic Resources
          </Link>
        </div>
      </div>

      {selectedEvent && (
        <div className="event-modal-overlay" onClick={closeModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-header">
              <span className="modal-icon">{selectedEvent.icon}</span>
              <div className="modal-title-section">
                <h2>{selectedEvent.title}</h2>
                <p className="modal-arabic">{selectedEvent.titleArabic}</p>
              </div>
            </div>

            <div className="modal-dates">
              <div className="date-badge hijri">
                <span className="date-label">Hijri Date</span>
                <span className="date-value">{selectedEvent.hijriDate}</span>
              </div>
              <div className="date-badge gregorian">
                <span className="date-label">Gregorian Date</span>
                <span className="date-value">{selectedEvent.gregorianDate}</span>
              </div>
            </div>

            <div className="modal-content">
              <div className="story-section">
                <h3>The Full Story</h3>
                <div className="story-text">
                  {selectedEvent.fullStory.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="facts-section">
                <h3>Key Facts</h3>
                <ul className="facts-list">
                  {selectedEvent.keyFacts.map((fact, idx) => (
                    <li key={idx}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedEvent.relatedVerses && selectedEvent.relatedVerses.length > 0 && (
                <div className="verses-section">
                  <h3>Related Quranic References</h3>
                  {selectedEvent.relatedVerses.map((verse, idx) => (
                    <blockquote key={idx} className="verse-quote">
                      {verse}
                    </blockquote>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="share-btn" onClick={() => {
                navigator.share?.({
                  title: selectedEvent.title,
                  text: selectedEvent.shortDesc,
                  url: window.location.href
                });
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
                </svg>
                Share This Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricalDates;
