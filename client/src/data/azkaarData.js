const azkaarCategories = [
  {
    id: 'morning',
    nameAr: 'أذكار الصباح',
    nameEn: 'Morning Adhkar',
    icon: '🌅',
    description: 'Supplications to recite in the morning after Fajr prayer',
    count: 27
  },
  {
    id: 'evening',
    nameAr: 'أذكار المساء',
    nameEn: 'Evening Adhkar',
    icon: '🌙',
    description: 'Supplications to recite in the evening after Asr prayer',
    count: 27
  },
  {
    id: 'after-prayer',
    nameAr: 'أذكار بعد الصلاة',
    nameEn: 'After Prayer Adhkar',
    icon: '🕌',
    description: 'Supplications to recite after completing the obligatory prayers',
    count: 15
  },
  {
    id: 'sleep',
    nameAr: 'أذكار النوم',
    nameEn: 'Before Sleep',
    icon: '😴',
    description: 'Supplications to recite before going to sleep',
    count: 18
  },
  {
    id: 'waking',
    nameAr: 'أذكار الاستيقاظ',
    nameEn: 'Upon Waking Up',
    icon: '☀️',
    description: 'Supplications to recite when waking up from sleep',
    count: 5
  },
  {
    id: 'eating',
    nameAr: 'أذكار الطعام',
    nameEn: 'Food & Drink',
    icon: '🍽️',
    description: 'Supplications before and after eating and drinking',
    count: 8
  },
  {
    id: 'travel',
    nameAr: 'أذكار السفر',
    nameEn: 'Travel Duas',
    icon: '✈️',
    description: 'Supplications for traveling and journeys',
    count: 12
  },
  {
    id: 'home',
    nameAr: 'أذكار المنزل',
    nameEn: 'Entering & Leaving Home',
    icon: '🏠',
    description: 'Supplications when entering or leaving the home',
    count: 4
  },
  {
    id: 'masjid',
    nameAr: 'أذكار المسجد',
    nameEn: 'Entering & Leaving Masjid',
    icon: '🕋',
    description: 'Supplications when entering or leaving the mosque',
    count: 4
  },
  {
    id: 'wudu',
    nameAr: 'أذكار الوضوء',
    nameEn: 'Wudu (Ablution)',
    icon: '💧',
    description: 'Supplications before and after performing ablution',
    count: 3
  },
  {
    id: 'protection',
    nameAr: 'أذكار الحماية',
    nameEn: 'Protection Duas',
    icon: '🛡️',
    description: 'Supplications for protection from evil and harm',
    count: 15
  },
  {
    id: 'forgiveness',
    nameAr: 'أذكار الاستغفار',
    nameEn: 'Seeking Forgiveness',
    icon: '🤲',
    description: 'Supplications for seeking forgiveness from Allah',
    count: 10
  },
  {
    id: 'anxiety',
    nameAr: 'أذكار الهم والحزن',
    nameEn: 'Anxiety & Distress',
    icon: '💚',
    description: 'Supplications for relief from anxiety and sadness',
    count: 8
  },
  {
    id: 'sickness',
    nameAr: 'أذكار المرض',
    nameEn: 'When Sick',
    icon: '🏥',
    description: 'Supplications when feeling unwell or visiting the sick',
    count: 7
  },
  {
    id: 'rain',
    nameAr: 'أذكار المطر',
    nameEn: 'Rain & Weather',
    icon: '🌧️',
    description: 'Supplications during rain, thunder, and wind',
    count: 5
  },
  {
    id: 'rabbana',
    nameAr: 'أدعية ربنا القرآنية',
    nameEn: '40 Rabbana Duas',
    icon: '📖',
    description: 'Quranic supplications starting with "Our Lord"',
    count: 40
  },
  {
    id: 'names-allah',
    nameAr: 'أسماء الله الحسنى',
    nameEn: '99 Names of Allah',
    icon: '✨',
    description: 'The beautiful names of Allah with meanings',
    count: 99
  },
  {
    id: 'clothing',
    nameAr: 'أذكار اللباس',
    nameEn: 'Wearing Clothes',
    icon: '👕',
    description: 'Supplications when wearing new or old clothes',
    count: 3
  },
  {
    id: 'restroom',
    nameAr: 'أذكار الخلاء',
    nameEn: 'Restroom',
    icon: '🚿',
    description: 'Supplications when entering and leaving the restroom',
    count: 2
  },
  {
    id: 'marriage',
    nameAr: 'أذكار الزواج',
    nameEn: 'Marriage Duas',
    icon: '💍',
    description: 'Supplications for marriage and newlyweds',
    count: 5
  },
  {
    id: 'children',
    nameAr: 'أذكار الأبناء',
    nameEn: 'For Children',
    icon: '👶',
    description: 'Supplications for protecting and blessing children',
    count: 6
  },
  {
    id: 'hajj',
    nameAr: 'أذكار الحج والعمرة',
    nameEn: 'Hajj & Umrah',
    icon: '🕋',
    description: 'Supplications for Hajj and Umrah rituals',
    count: 20
  },
  {
    id: 'death',
    nameAr: 'أذكار الموت والجنازة',
    nameEn: 'Death & Funeral',
    icon: '⚰️',
    description: 'Supplications related to death, funeral, and visiting graves',
    count: 12
  },
  {
    id: 'gratitude',
    nameAr: 'أذكار الشكر',
    nameEn: 'Gratitude & Praise',
    icon: '🙏',
    description: 'Supplications expressing gratitude to Allah',
    count: 8
  }
];

const morningAdhkar = [
  {
    id: 1,
    arabic: "أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "A'udhu billahi minash-shaytanir-rajim. Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa Huwal-'Aliyyul-'Adhim.",
    translation: "I seek refuge in Allah from Satan the accursed. Allah! There is no god but He, the Living, the Self-subsisting, Eternal. No slumber can seize Him nor sleep. His are all things in the heavens and on earth. Who is there that can intercede in His presence except as He permits? He knows what is before them and what is behind them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and He feels no fatigue in guarding and preserving them. And He is the Most High, the Most Great.",
    reference: "Ayat al-Kursi - Surah Al-Baqarah 2:255",
    repeat: 1,
    virtue: "Whoever recites this when he rises in the morning will be protected from the jinn until he retires in the evening, and whoever recites it when he retires in the evening will be protected from them until he rises in the morning."
  },
  {
    id: 2,
    arabic: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم\n\nقُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
    transliteration: "Bismillahir-Rahmanir-Rahim. Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One. Allah, the Eternal, Absolute. He begets not, nor is He begotten. And there is none like unto Him.",
    reference: "Surah Al-Ikhlas (112)",
    repeat: 3,
    virtue: "Recited 3 times in the morning and evening will suffice you in all respects."
  },
  {
    id: 3,
    arabic: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم\n\nقُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    transliteration: "Bismillahir-Rahmanir-Rahim. Qul a'udhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge with the Lord of the Dawn. From the mischief of created things. From the mischief of Darkness as it overspreads. From the mischief of those who practice secret arts. And from the mischief of the envious one as he practices envy.",
    reference: "Surah Al-Falaq (113)",
    repeat: 3,
    virtue: "Recited 3 times in the morning and evening will suffice you in all respects."
  },
  {
    id: 4,
    arabic: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم\n\nقُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝ مَلِكِ ٱلنَّاسِ ۝ إِلَٰهِ ٱلنَّاسِ ۝ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
    transliteration: "Bismillahir-Rahmanir-Rahim. Qul a'udhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge with the Lord of Mankind. The King of Mankind. The God of Mankind. From the mischief of the Whisperer who withdraws. Who whispers into the hearts of mankind. Among jinn and among mankind.",
    reference: "Surah An-Nas (114)",
    repeat: 3,
    virtue: "Recited 3 times in the morning and evening will suffice you in all respects."
  },
  {
    id: 5,
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    transliteration: "Asbahna wa-asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. Rabbi as'aluka khayra ma fi hadhal-yawmi wa khayra ma ba'dah, wa a'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba'dah, Rabbi a'udhu bika minal-kasali wa su'il-kibar, Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent. My Lord, I ask You for the good of this day and the good of what follows it and I seek refuge in You from the evil of this day and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from torment in the Hellfire and punishment in the grave.",
    reference: "Muslim 4/2088",
    repeat: 1,
    virtue: "A comprehensive morning supplication seeking good and protection."
  },
  {
    id: 6,
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu wa ilaykan-nushur.",
    translation: "O Allah, by Your leave we have reached the morning, and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
    reference: "At-Tirmidhi 5/466",
    repeat: 1,
    virtue: "Acknowledgment that all matters are in Allah's hands."
  },
  {
    id: 7,
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bi-ni'matika 'alayya, wa abu'u laka bi-dhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Ant.",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I seek refuge in You from the evil of which I have committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    reference: "Bukhari 7/150 - Sayyidul Istighfar",
    repeat: 1,
    virtue: "This is Sayyidul-Istighfar (The Master of Seeking Forgiveness). Whoever recites this with conviction in the evening and dies that night shall enter Paradise, and whoever recites it with conviction in the morning and dies that day shall enter Paradise."
  },
  {
    id: 8,
    arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ",
    transliteration: "Allahumma inni asbahtu ush-hiduka, wa ush-hidu hamalata 'arshika, wa mala'ikataka, wa jami'a khalqika, annaka Antallahu la ilaha illa Anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa Rasuluk.",
    translation: "O Allah, verily I have reached the morning and call on You, the bearers of Your throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner and that Muhammad is Your servant and Messenger.",
    reference: "Abu Dawud 4/317",
    repeat: 4,
    virtue: "Whoever recites this four times in the morning or evening, Allah will free him from the Fire."
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    transliteration: "Allahumma ma asbaha bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu wa lakash-shukr.",
    translation: "O Allah, what blessing I or any of Your creation have risen upon, is from You alone, without partner, so for You is all praise and unto You all thanks.",
    reference: "Abu Dawud 4/318",
    repeat: 1,
    virtue: "Whoever recites this in the morning has indeed offered his gratitude for the day."
  },
  {
    id: 10,
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Ant. Allahumma inni a'udhu bika minal-kufri, wal-faqri, wa a'udhu bika min 'adhabil-qabri, la ilaha illa Ant.",
    translation: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You. O Allah, I seek refuge in You from disbelief and poverty and I seek refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
    reference: "Abu Dawud 4/324",
    repeat: 3,
    virtue: "Seeking health and protection from major trials."
  },
  {
    id: 11,
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَـهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyal-lahu la ilaha illa Huwa 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adhim.",
    translation: "Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.",
    reference: "Abu Dawud 4/321, Surah At-Tawbah 9:129",
    repeat: 7,
    virtue: "Allah will grant whoever recites this seven times in the morning or evening whatever he desires from this world or the next."
  },
  {
    id: 12,
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    translation: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Hearing, The All-Knowing.",
    reference: "Abu Dawud 4/323, At-Tirmidhi 5/465",
    repeat: 3,
    virtue: "Whoever recites it three times in the morning will not be afflicted by any calamity before evening, and whoever recites it three times in the evening will not be afflicted by any calamity before morning."
  },
  {
    id: 13,
    arabic: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    transliteration: "Raditu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin sallallahu 'alayhi wa sallama nabiyya.",
    translation: "I am pleased with Allah as a Lord, and Islam as a religion and Muhammad (peace be upon him) as a Prophet.",
    reference: "Abu Dawud 4/318",
    repeat: 3,
    virtue: "Allah will surely please whoever recites this three times every morning or evening."
  },
  {
    id: 14,
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    transliteration: "Ya Hayyu ya Qayyum, bi-rahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn.",
    translation: "O Ever Living, O Self-Subsisting and Supporter of all, by Your mercy I seek assistance, rectify for me all of my affairs and do not leave me to myself, even for the blink of an eye.",
    reference: "Al-Hakim 1/545",
    repeat: 1,
    virtue: "A comprehensive supplication taught by the Prophet (peace be upon him)."
  },
  {
    id: 15,
    arabic: "أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلَامِ، وَعَلَى كَلِمَةِ الإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
    transliteration: "Asbahna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alayhi wa sallam, wa 'ala millati abina Ibrahima hanifan Musliman wa ma kana minal-mushrikin.",
    translation: "We rise upon the fitrah (natural disposition) of Islam, and the word of pure faith, and upon the religion of our Prophet Muhammad (peace be upon him) and the religion of our forefather Ibrahim, who was a Muslim and of true faith and was not of those who associate others with Allah.",
    reference: "Ahmad 3/406",
    repeat: 1,
    virtue: "Affirming one's faith in Islam each morning."
  },
  {
    id: 16,
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    transliteration: "Subhanallahi wa bihamdih.",
    translation: "Glory is to Allah and praise is to Him.",
    reference: "Muslim 4/2071",
    repeat: 100,
    virtue: "Whoever says this one hundred times a day, will have his sins forgiven even if they were as much as the foam of the sea."
  },
  {
    id: 17,
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir.",
    translation: "None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    reference: "Bukhari 4/95, Muslim 3/1357",
    repeat: 10,
    virtue: "Whoever says this ten times will have the reward of freeing four slaves from the Children of Isma'il."
  },
  {
    id: 18,
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir.",
    translation: "None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    reference: "Abu Dawud 4/319",
    repeat: 100,
    virtue: "Whoever says this one hundred times a day will have the reward of freeing ten slaves, a hundred good deeds will be written for him and a hundred bad deeds will be erased, and he will have a protection from Shaytan throughout the day until the evening."
  },
  {
    id: 19,
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    transliteration: "Subhanallahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatih.",
    translation: "Glory is to Allah and praise is to Him, by the multitude of His creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.",
    reference: "Muslim 4/2090",
    repeat: 3,
    virtue: "The Prophet (peace be upon him) said these words are better than anything Juwairiyah had been saying since morning prayers."
  },
  {
    id: 20,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    transliteration: "Allahumma inni as'aluka 'ilman nafi'a, wa rizqan tayyiba, wa 'amalan mutaqabbala.",
    translation: "O Allah, I ask You for beneficial knowledge, goodly provision and acceptable deeds.",
    reference: "Ibn Majah and others",
    repeat: 1,
    virtue: "A supplication the Prophet (peace be upon him) used to say in the morning."
  },
  {
    id: 21,
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha wa atubu ilayh.",
    translation: "I seek Allah's forgiveness and I repent to Him.",
    reference: "Bukhari, Muslim",
    repeat: 100,
    virtue: "The Prophet (peace be upon him) used to seek Allah's forgiveness one hundred times a day."
  }
];

const eveningAdhkar = [
  {
    id: 1,
    arabic: "أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "A'udhu billahi minash-shaytanir-rajim. Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa Huwal-'Aliyyul-'Adhim.",
    translation: "I seek refuge in Allah from Satan the accursed. Allah! There is no god but He, the Living, the Self-subsisting, Eternal. No slumber can seize Him nor sleep. His are all things in the heavens and on earth. Who is there that can intercede in His presence except as He permits? He knows what is before them and what is behind them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and He feels no fatigue in guarding and preserving them. And He is the Most High, the Most Great.",
    reference: "Ayat al-Kursi - Surah Al-Baqarah 2:255",
    repeat: 1,
    virtue: "Whoever recites this when he retires in the evening will be protected from the jinn until he rises in the morning."
  },
  {
    id: 2,
    arabic: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم\n\nقُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
    transliteration: "Bismillahir-Rahmanir-Rahim. Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One. Allah, the Eternal, Absolute. He begets not, nor is He begotten. And there is none like unto Him.",
    reference: "Surah Al-Ikhlas (112)",
    repeat: 3,
    virtue: "Recited 3 times in the morning and evening will suffice you in all respects."
  },
  {
    id: 3,
    arabic: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم\n\nقُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    transliteration: "Bismillahir-Rahmanir-Rahim. Qul a'udhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge with the Lord of the Dawn. From the mischief of created things. From the mischief of Darkness as it overspreads. From the mischief of those who practice secret arts. And from the mischief of the envious one as he practices envy.",
    reference: "Surah Al-Falaq (113)",
    repeat: 3,
    virtue: "Recited 3 times in the morning and evening will suffice you in all respects."
  },
  {
    id: 4,
    arabic: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم\n\nقُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝ مَلِكِ ٱلنَّاسِ ۝ إِلَٰهِ ٱلنَّاسِ ۝ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
    transliteration: "Bismillahir-Rahmanir-Rahim. Qul a'udhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge with the Lord of Mankind. The King of Mankind. The God of Mankind. From the mischief of the Whisperer who withdraws. Who whispers into the hearts of mankind. Among jinn and among mankind.",
    reference: "Surah An-Nas (114)",
    repeat: 3,
    virtue: "Recited 3 times in the morning and evening will suffice you in all respects."
  },
  {
    id: 5,
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    transliteration: "Amsayna wa-amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. Rabbi as'aluka khayra ma fi hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba'daha, Rabbi a'udhu bika minal-kasali wa su'il-kibar, Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent. My Lord, I ask You for the good of this night and the good of what follows it and I seek refuge in You from the evil of this night and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from torment in the Hellfire and punishment in the grave.",
    reference: "Muslim 4/2088",
    repeat: 1,
    virtue: "A comprehensive evening supplication seeking good and protection."
  },
  {
    id: 6,
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu wa ilaykal-masir.",
    translation: "O Allah, by Your leave we have reached the evening, and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
    reference: "At-Tirmidhi 5/466",
    repeat: 1,
    virtue: "Acknowledgment that all matters are in Allah's hands."
  },
  {
    id: 7,
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bi-ni'matika 'alayya, wa abu'u laka bi-dhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Ant.",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I seek refuge in You from the evil of which I have committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    reference: "Bukhari 7/150 - Sayyidul Istighfar",
    repeat: 1,
    virtue: "This is Sayyidul-Istighfar (The Master of Seeking Forgiveness). Whoever recites this with conviction in the evening and dies that night shall enter Paradise."
  },
  {
    id: 8,
    arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ",
    transliteration: "Allahumma inni amsaytu ush-hiduka, wa ush-hidu hamalata 'arshika, wa mala'ikataka, wa jami'a khalqika, annaka Antallahu la ilaha illa Anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa Rasuluk.",
    translation: "O Allah, verily I have reached the evening and call on You, the bearers of Your throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner and that Muhammad is Your servant and Messenger.",
    reference: "Abu Dawud 4/317",
    repeat: 4,
    virtue: "Whoever recites this four times in the evening, Allah will free him from the Fire."
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    transliteration: "Allahumma ma amsa bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu wa lakash-shukr.",
    translation: "O Allah, what blessing I or any of Your creation have received this evening, is from You alone, without partner, so for You is all praise and unto You all thanks.",
    reference: "Abu Dawud 4/318",
    repeat: 1,
    virtue: "Whoever recites this in the evening has indeed offered his gratitude for the night."
  },
  {
    id: 10,
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Ant. Allahumma inni a'udhu bika minal-kufri, wal-faqri, wa a'udhu bika min 'adhabil-qabri, la ilaha illa Ant.",
    translation: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You. O Allah, I seek refuge in You from disbelief and poverty and I seek refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
    reference: "Abu Dawud 4/324",
    repeat: 3,
    virtue: "Seeking health and protection from major trials."
  },
  {
    id: 11,
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَـهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyal-lahu la ilaha illa Huwa 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adhim.",
    translation: "Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.",
    reference: "Abu Dawud 4/321, Surah At-Tawbah 9:129",
    repeat: 7,
    virtue: "Allah will grant whoever recites this seven times in the evening whatever he desires from this world or the next."
  },
  {
    id: 12,
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    translation: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Hearing, The All-Knowing.",
    reference: "Abu Dawud 4/323, At-Tirmidhi 5/465",
    repeat: 3,
    virtue: "Whoever recites it three times in the evening will not be afflicted by any calamity before morning."
  },
  {
    id: 13,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bi-kalimatil-lahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
    reference: "Muslim 4/2081",
    repeat: 3,
    virtue: "Whoever recites this three times in the evening, no poisonous sting shall harm him that night."
  },
  {
    id: 14,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنْ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنْ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal, wa a'udhu bika minal-jubni wal-bukhl, wa a'udhu bika min ghalabatid-dayni wa qahrir-rijal.",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
    reference: "Bukhari 7/158",
    repeat: 1,
    virtue: "Comprehensive protection from spiritual and worldly afflictions."
  }
];

const afterPrayerAdhkar = [
  {
    id: 1,
    arabic: "أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ",
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah.",
    translation: "I seek Allah's forgiveness, I seek Allah's forgiveness, I seek Allah's forgiveness.",
    reference: "Muslim 1/414",
    repeat: 3,
    virtue: "Seeking forgiveness immediately after prayer."
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Allahumma Antas-Salam, wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
    translation: "O Allah, You are As-Salam (the One Free from all defects and deficiencies), and from You is all peace, blessed are You, O Possessor of majesty and honor.",
    reference: "Muslim 1/414",
    repeat: 1,
    virtue: "Acknowledging Allah's perfection after prayer."
  },
  {
    id: 3,
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. Allahumma la mani'a lima a'tayt, wa la mu'tiya lima mana't, wa la yanfa'u dhal-jaddi minkal-jadd.",
    translation: "None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent. O Allah, none can prevent what You have willed to bestow and none can bestow what You have willed to prevent, and no wealth or majesty can benefit anyone, for from You comes all wealth and majesty.",
    reference: "Bukhari 1/255, Muslim 1/414",
    repeat: 1,
    virtue: "Taught by the Prophet (peace be upon him) to be said after every prayer."
  },
  {
    id: 4,
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ، لَا إِلَهَ إِلَّا اللهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ، وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. La hawla wa la quwwata illa billah. La ilaha illallah, wa la na'budu illa iyyah, lahun-ni'matu wa lahul-fadl, wa lahuth-thana'ul-hasan. La ilaha illallahu mukhlisina lahud-dina wa law karihal-kafirun.",
    translation: "None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent. There is no might nor power except with Allah. None has the right to be worshipped except Allah and we worship none except Him. For Him is all favor, grace, and glorious praise. None has the right to be worshipped except Allah and we are sincere in faith and devotion to Him although the disbelievers detest it.",
    reference: "Muslim 1/415",
    repeat: 1,
    virtue: "The Prophet (peace be upon him) used to say this after every obligatory prayer."
  },
  {
    id: 5,
    arabic: "سُبْحَانَ اللهِ",
    transliteration: "Subhanallah.",
    translation: "Glory is to Allah.",
    reference: "Muslim 1/418",
    repeat: 33,
    virtue: "Part of the 99 tasbeeh after prayer."
  },
  {
    id: 6,
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah.",
    translation: "Praise is to Allah.",
    reference: "Muslim 1/418",
    repeat: 33,
    virtue: "Part of the 99 tasbeeh after prayer."
  },
  {
    id: 7,
    arabic: "اللهُ أَكْبَرُ",
    transliteration: "Allahu Akbar.",
    translation: "Allah is the Greatest.",
    reference: "Muslim 1/418",
    repeat: 33,
    virtue: "Part of the 99 tasbeeh after prayer."
  },
  {
    id: 8,
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir.",
    translation: "None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    reference: "Muslim 1/418",
    repeat: 1,
    virtue: "Said once to complete the 100 after prayer. Whoever says this will have all his sins forgiven even if they were as much as the foam of the sea."
  },
  {
    id: 9,
    arabic: "أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...",
    transliteration: "A'udhu billahi minash-shaytanir-rajim. Allahu la ilaha illa Huwal-Hayyul-Qayyum...",
    translation: "I seek refuge in Allah from Satan the accursed. Allah! There is no god but He, the Living, the Self-subsisting, Eternal... (Ayat al-Kursi)",
    reference: "An-Nasa'i, Al-Hakim",
    repeat: 1,
    virtue: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing shall prevent him from entering Paradise except death."
  }
];

const sleepAdhkar = [
  {
    id: 1,
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your name O Allah, I die and I live.",
    reference: "Bukhari 11/113",
    repeat: 1,
    virtue: "The Prophet (peace be upon him) used to say this when going to sleep."
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak.",
    translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
    reference: "Abu Dawud 4/311",
    repeat: 3,
    virtue: "The Prophet (peace be upon him) used to say this when lying down to sleep."
  },
  {
    id: 3,
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    transliteration: "Bismika Rabbi wada'tu janbi, wa bika arfa'uh, fa-in amsakta nafsi farhamha, wa in arsaltaha fahfadhha bima tahfadhu bihi 'ibadikas-salihin.",
    translation: "In Your name my Lord, I lie down and in Your name I rise, so if You should take my soul then have mercy upon it, and if You should return my soul then protect it in the manner You do so with Your righteous servants.",
    reference: "Bukhari 11/126",
    repeat: 1,
    virtue: "Entrusting oneself to Allah before sleep."
  },
  {
    id: 4,
    arabic: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
    transliteration: "Allahumma innaka khalaqta nafsi wa Anta tawaffaha, laka mamatuha wa mahyaha, in ahyaytaha fahfadhha, wa in amattaha faghfir laha. Allahumma inni as'alukal-'afiyah.",
    translation: "O Allah, verily You have created my soul and You shall take its life, to You belongs its life and death. If You should keep my soul alive then protect it, and if You should take its life then forgive it. O Allah, I ask You for well-being.",
    reference: "Muslim 4/2083",
    repeat: 1,
    virtue: "Acknowledging that life and death belong to Allah."
  },
  {
    id: 5,
    arabic: "اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الْأَرْضِ، وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ. اللَّهُمَّ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ، وَأَغْنِنَا مِنَ الْفَقْرِ",
    transliteration: "Allahumma Rabbas-samawati wa Rabbal-ard, wa Rabbal-'Arshil-'Adhim, Rabbana wa Rabba kulli shay', faliqal-habbi wan-nawa, wa munzilit-Tawrati wal-Injili wal-Furqan. A'udhu bika min sharri kulli shay'in Anta akhidhun bi-nasiyatih. Allahumma Antal-Awwalu falaysa qablaka shay', wa Antal-Akhiru falaysa ba'daka shay', wa Antadh-Dhahiru falaysa fawqaka shay', wa Antal-Batinu falaysa dunaka shay', iqdi 'annad-dayn, wa aghina minal-faqr.",
    translation: "O Allah, Lord of the seven heavens and the earth and Lord of the exalted throne, our Lord and Lord of all things, Splitter of the seed and the date-stone, Revealer of the Torah, the Gospel and the Quran. I seek refuge in You from the evil of all things that You have power over. O Allah, You are The First, nothing was before You, You are The Last, nothing is after You, You are The Most High, nothing is above You, You are The Most Near, nothing is nearer than You. Remove our debts and enrich us against poverty.",
    reference: "Muslim 4/2084",
    repeat: 1,
    virtue: "Comprehensive supplication before sleep."
  },
  {
    id: 6,
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana, wa kafana, wa awana, fakam mimman la kafiya lahu wa la mu'wi.",
    translation: "Praise is to Allah Who has provided us with food and drink, sufficed us and given us an abode for how many are there with no provision and no home.",
    reference: "Muslim 4/2085",
    repeat: 1,
    virtue: "Expressing gratitude before sleep."
  }
];

const wakingAdhkar = [
  {
    id: 1,
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    reference: "Bukhari 11/113",
    repeat: 1,
    virtue: "The first thing to say upon waking up."
  },
  {
    id: 2,
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ، رَبِّ اغْفِرْ لِي",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. Subhanallah, walhamdu lillah, wa la ilaha illallah, wallahu Akbar, wa la hawla wa la quwwata illa billahil-'Aliyyil-'Adhim. Rabbighfir li.",
    translation: "None has the right to be worshipped except Allah, alone without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent. Glory is to Allah, praise is to Allah, none has the right to be worshipped except Allah, Allah is the greatest and there is no might nor power except with Allah, The Most High, The Supreme. My Lord, forgive me.",
    reference: "Bukhari",
    repeat: 1,
    virtue: "Whoever wakes up and says this, his supplication will be answered. If he performs ablution and prays, his prayer will be accepted."
  }
];

const protectionDuas = [
  {
    id: 1,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bi-kalimatil-lahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
    reference: "Muslim 4/2081",
    repeat: 3,
    virtue: "For protection from all harm and evil."
  },
  {
    id: 2,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    transliteration: "A'udhu bi-kalimatil-lahit-tammati min kulli shaytanin wa hammah, wa min kulli 'aynin lammah.",
    translation: "I seek refuge in the perfect words of Allah from every devil and every venomous reptile, and from every evil eye.",
    reference: "Bukhari 4/119",
    repeat: 1,
    virtue: "The Prophet (peace be upon him) used to commend Hasan and Husain with these words."
  },
  {
    id: 3,
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    translation: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Hearing, The All-Knowing.",
    reference: "Abu Dawud 4/323",
    repeat: 3,
    virtue: "Whoever recites this three times will not be afflicted by any calamity."
  },
  {
    id: 4,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِوَجْهِكَ الْكَرِيمِ، وَكَلِمَاتِكَ التَّامَّاتِ مِنْ شَرِّ مَا أَنْتَ آخِذٌ بِنَاصِيَتِهِ",
    transliteration: "Allahumma inni a'udhu bi-wajhikal-karim, wa kalimatikattammati min sharri ma Anta akhidhun bi-nasiyatih.",
    translation: "O Allah, I seek refuge in Your noble face and perfect words from the evil of that which You have power over.",
    reference: "Abu Dawud",
    repeat: 1,
    virtue: "Comprehensive protection seeking Allah's noble attributes."
  },
  {
    id: 5,
    arabic: "اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
    transliteration: "Allahummah-fadhni min bayni yadayya, wa min khalfi, wa 'an yamini, wa 'an shimali, wa min fawqi, wa a'udhu bi-'adhamatika an ughtala min tahti.",
    translation: "O Allah, protect me from the front and from behind, from my right and from my left, and from above me, and I seek refuge in Your greatness from being taken unaware from below me.",
    reference: "Abu Dawud, Ibn Majah",
    repeat: 1,
    virtue: "Protection from all directions."
  }
];

const getAllAzkaar = (categoryId) => {
  switch(categoryId) {
    case 'morning': return morningAdhkar;
    case 'evening': return eveningAdhkar;
    case 'after-prayer': return afterPrayerAdhkar;
    case 'sleep': return sleepAdhkar;
    case 'waking': return wakingAdhkar;
    case 'protection': return protectionDuas;
    default: return [];
  }
};

export { azkaarCategories, morningAdhkar, eveningAdhkar, afterPrayerAdhkar, sleepAdhkar, wakingAdhkar, protectionDuas, getAllAzkaar };
