export const hadithCollections = [
  {
    id: 'bukhari',
    name: 'Sahih al-Bukhari',
    nameArabic: 'صحيح البخاري',
    author: 'Imam Bukhari',
    authorArabic: 'الإمام البخاري',
    totalHadith: 7563,
    description: 'The most authentic collection of Hadith, compiled by Imam Muhammad al-Bukhari.',
    descriptionArabic: 'أصح كتاب بعد كتاب الله، جمعه الإمام محمد البخاري',
    category: 'the_9_books',
    icon: '📚'
  },
  {
    id: 'muslim',
    name: 'Sahih Muslim',
    nameArabic: 'صحيح مسلم',
    author: 'Imam Muslim',
    authorArabic: 'الإمام مسلم',
    totalHadith: 7500,
    description: 'The second most authentic collection of Hadith, compiled by Imam Muslim ibn al-Hajjaj.',
    descriptionArabic: 'ثاني أصح كتاب بعد البخاري، جمعه الإمام مسلم بن الحجاج',
    category: 'the_9_books',
    icon: '📖'
  },
  {
    id: 'abudawud',
    name: 'Sunan Abu Dawud',
    nameArabic: 'سنن أبي داود',
    author: 'Imam Abu Dawud',
    authorArabic: 'الإمام أبو داود',
    totalHadith: 5274,
    description: 'One of the six major Hadith collections, focusing on legal matters.',
    descriptionArabic: 'أحد الكتب الستة، يركز على الأحكام الفقهية',
    category: 'the_9_books',
    icon: '📜'
  },
  {
    id: 'tirmidhi',
    name: "Jami' at-Tirmidhi",
    nameArabic: 'جامع الترمذي',
    author: 'Imam Tirmidhi',
    authorArabic: 'الإمام الترمذي',
    totalHadith: 3956,
    description: 'A collection known for its legal commentary and grading of Hadith.',
    descriptionArabic: 'جامع الترمذي المعروف بالتعليقات الفقهية وتصنيف الأحاديث',
    category: 'the_9_books',
    icon: '📗'
  },
  {
    id: 'nasai',
    name: "Sunan an-Nasa'i",
    nameArabic: 'سنن النسائي',
    author: "Imam an-Nasa'i",
    authorArabic: 'الإمام النسائي',
    totalHadith: 5758,
    description: 'A major Hadith collection with strict criteria for authenticity.',
    descriptionArabic: 'من الكتب الستة بمعايير صارمة للصحة',
    category: 'the_9_books',
    icon: '📘'
  },
  {
    id: 'ibnmajah',
    name: 'Sunan Ibn Majah',
    nameArabic: 'سنن ابن ماجه',
    author: 'Imam Ibn Majah',
    authorArabic: 'الإمام ابن ماجه',
    totalHadith: 4341,
    description: 'The sixth of the major Hadith collections.',
    descriptionArabic: 'السادس من الكتب الستة الرئيسية',
    category: 'the_9_books',
    icon: '📕'
  },
  {
    id: 'malik',
    name: 'Muwatta Malik',
    nameArabic: 'موطأ مالك',
    author: 'Imam Malik',
    authorArabic: 'الإمام مالك',
    totalHadith: 1832,
    description: 'One of the earliest written collections, compiled by the founder of the Maliki school.',
    descriptionArabic: 'من أوائل المصنفات، جمعه مؤسس المذهب المالكي',
    category: 'the_9_books',
    icon: '📙'
  },
  {
    id: 'ahmad',
    name: 'Musnad Ahmad',
    nameArabic: 'مسند أحمد',
    author: 'Imam Ahmad ibn Hanbal',
    authorArabic: 'الإمام أحمد بن حنبل',
    totalHadith: 27647,
    description: 'One of the largest Hadith collections, organized by narrator.',
    descriptionArabic: 'أكبر المسانيد، مرتب على أسماء الصحابة',
    category: 'the_9_books',
    icon: '📚'
  },
  {
    id: 'darimi',
    name: 'Sunan ad-Darimi',
    nameArabic: 'سنن الدارمي',
    author: 'Imam ad-Darimi',
    authorArabic: 'الإمام الدارمي',
    totalHadith: 3503,
    description: 'An important early collection of Hadith.',
    descriptionArabic: 'من المصنفات المبكرة المهمة',
    category: 'the_9_books',
    icon: '📖'
  },
  {
    id: 'riyadussalihin',
    name: 'Riyad as-Salihin',
    nameArabic: 'رياض الصالحين',
    author: 'Imam an-Nawawi',
    authorArabic: 'الإمام النووي',
    totalHadith: 1896,
    description: 'A compilation of authentic Hadith covering all aspects of Islamic ethics.',
    descriptionArabic: 'مجموعة من الأحاديث الصحيحة تغطي جميع جوانب الأخلاق الإسلامية',
    category: 'other_books',
    icon: '🌿'
  },
  {
    id: 'shamail',
    name: 'Shamail al-Muhammadiyah',
    nameArabic: 'الشمائل المحمدية',
    author: 'Imam Tirmidhi',
    authorArabic: 'الإمام الترمذي',
    totalHadith: 415,
    description: 'A collection describing the appearance and character of Prophet Muhammad ﷺ.',
    descriptionArabic: 'وصف شكل وأخلاق النبي محمد ﷺ',
    category: 'other_books',
    icon: '✨'
  },
  {
    id: 'bulugh',
    name: 'Bulugh al-Maram',
    nameArabic: 'بلوغ المرام',
    author: 'Ibn Hajar al-Asqalani',
    authorArabic: 'ابن حجر العسقلاني',
    totalHadith: 1596,
    description: 'A collection of Hadith focusing on Islamic jurisprudence.',
    descriptionArabic: 'مجموعة أحاديث تركز على الفقه الإسلامي',
    category: 'other_books',
    icon: '⚖️'
  },
  {
    id: 'adab',
    name: 'Al-Adab Al-Mufrad',
    nameArabic: 'الأدب المفرد',
    author: 'Imam Bukhari',
    authorArabic: 'الإمام البخاري',
    totalHadith: 1322,
    description: 'A collection dedicated to Islamic manners and etiquette.',
    descriptionArabic: 'مجموعة مخصصة للآداب والأخلاق الإسلامية',
    category: 'other_books',
    icon: '🎓'
  },
  {
    id: 'mishkat',
    name: 'Mishkat al-Masabih',
    nameArabic: 'مشكاة المصابيح',
    author: 'Al-Khatib at-Tabrizi',
    authorArabic: 'الخطيب التبريزي',
    totalHadith: 6294,
    description: 'A comprehensive collection based on Masabih as-Sunnah.',
    descriptionArabic: 'مجموعة شاملة مبنية على مصابيح السنة',
    category: 'other_books',
    icon: '💡'
  },
  {
    id: 'nawawi40',
    name: 'Forty Hadith of Imam Nawawi',
    nameArabic: 'الأربعون النووية',
    author: 'Imam an-Nawawi',
    authorArabic: 'الإمام النووي',
    totalHadith: 42,
    description: 'A collection of 42 fundamental Hadith covering core Islamic principles.',
    descriptionArabic: 'مجموعة من 42 حديثاً أساسياً تغطي أصول الإسلام',
    category: 'forties',
    icon: '🔢'
  },
  {
    id: 'qudsi40',
    name: 'Forty Hadith Qudsi',
    nameArabic: 'الأربعون القدسية',
    author: 'Various Scholars',
    authorArabic: 'علماء متعددون',
    totalHadith: 40,
    description: 'Sacred Hadith where Prophet Muhammad ﷺ reports words from Allah.',
    descriptionArabic: 'أحاديث قدسية يروي فيها النبي ﷺ كلام الله',
    category: 'forties',
    icon: '🌟'
  },
  {
    id: 'shahwaliullah40',
    name: 'Forty Hadith of Shah Waliullah',
    nameArabic: 'أربعون الشاه ولي الله',
    author: 'Shah Waliullah Dehlawi',
    authorArabic: 'الشاه ولي الله الدهلوي',
    totalHadith: 40,
    description: 'A collection of forty Hadith selected by Shah Waliullah.',
    descriptionArabic: 'مجموعة من أربعين حديثاً اختارها الشاه ولي الله',
    category: 'forties',
    icon: '📿'
  }
];

export const hadithCategories = {
  the_9_books: {
    name: 'The Six Books & More',
    nameArabic: 'الكتب الستة وغيرها',
    description: 'The most authentic and widely referenced Hadith collections'
  },
  other_books: {
    name: 'Other Major Collections',
    nameArabic: 'مجموعات رئيسية أخرى',
    description: 'Important compilations covering ethics, jurisprudence, and character'
  },
  forties: {
    name: 'Forty Hadith Collections',
    nameArabic: 'كتب الأربعين',
    description: 'Concise collections of fundamental teachings'
  }
};

export const getCollectionById = (id) => {
  return hadithCollections.find(c => c.id === id);
};

export const getCollectionsByCategory = (category) => {
  return hadithCollections.filter(c => c.category === category);
};

export const supportedLanguages = [
  { code: 'en', name: 'English', nameNative: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nameNative: 'العربية', dir: 'rtl' },
  { code: 'ur', name: 'Urdu', nameNative: 'اردو', dir: 'rtl' },
  { code: 'bn', name: 'Bengali', nameNative: 'বাংলা', dir: 'ltr' }
];
