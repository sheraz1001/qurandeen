import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/tools.css';

function NamesOfAllah() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedName, setExpandedName] = useState(null);

  const names = [
    { number: 1, arabic: 'الرَّحْمَنُ', english: 'Ar-Rahman', meaning: 'The Most Gracious', verse: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', verseRef: 'Al-Fatihah 1:1', reflection: 'His mercy encompasses all creation without exception.' },
    { number: 2, arabic: 'الرَّحِيمُ', english: 'Ar-Raheem', meaning: 'The Most Merciful', verse: 'وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا', verseRef: 'Al-Ahzab 33:43', reflection: 'His special mercy is reserved for the believers.' },
    { number: 3, arabic: 'الْمَلِكُ', english: 'Al-Malik', meaning: 'The King', verse: 'فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ', verseRef: 'Ta-Ha 20:114', reflection: 'He is the sovereign ruler of all that exists.' },
    { number: 4, arabic: 'الْقُدُّوسُ', english: 'Al-Quddus', meaning: 'The Most Holy', verse: 'الْمَلِكُ الْقُدُّوسُ السَّلَامُ', verseRef: 'Al-Hashr 59:23', reflection: 'He is free from all imperfections and deficiencies.' },
    { number: 5, arabic: 'السَّلَامُ', english: 'As-Salam', meaning: 'The Source of Peace', verse: 'السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ', verseRef: 'Al-Hashr 59:23', reflection: 'True peace and tranquility come only from Him.' },
    { number: 6, arabic: 'الْمُؤْمِنُ', english: 'Al-Mumin', meaning: 'The Granter of Security', verse: 'السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ', verseRef: 'Al-Hashr 59:23', reflection: 'He grants faith and security to His servants.' },
    { number: 7, arabic: 'الْمُهَيْمِنُ', english: 'Al-Muhaymin', meaning: 'The Guardian', verse: 'الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ', verseRef: 'Al-Hashr 59:23', reflection: 'He watches over and protects all of creation.' },
    { number: 8, arabic: 'الْعَزِيزُ', english: 'Al-Aziz', meaning: 'The Almighty', verse: 'وَهُوَ الْعَزِيزُ الْحَكِيمُ', verseRef: 'Ibrahim 14:4', reflection: 'None can overcome His might and power.' },
    { number: 9, arabic: 'الْجَبَّارُ', english: 'Al-Jabbar', meaning: 'The Compeller', verse: 'الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ', verseRef: 'Al-Hashr 59:23', reflection: 'He restores the broken and compels His will.' },
    { number: 10, arabic: 'الْمُتَكَبِّرُ', english: 'Al-Mutakabbir', meaning: 'The Supreme', verse: 'الْجَبَّارُ الْمُتَكَبِّرُ', verseRef: 'Al-Hashr 59:23', reflection: 'He alone deserves all greatness and glory.' },
    { number: 11, arabic: 'الْخَالِقُ', english: 'Al-Khaliq', meaning: 'The Creator', verse: 'هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ', verseRef: 'Al-Hashr 59:24', reflection: 'He brings everything into existence from nothing.' },
    { number: 12, arabic: 'الْبَارِئُ', english: 'Al-Bari', meaning: 'The Evolver', verse: 'الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ', verseRef: 'Al-Hashr 59:24', reflection: 'He creates with perfect order and proportion.' },
    { number: 13, arabic: 'الْمُصَوِّرُ', english: 'Al-Musawwir', meaning: 'The Fashioner', verse: 'الْبَارِئُ الْمُصَوِّرُ', verseRef: 'Al-Hashr 59:24', reflection: 'He shapes all of creation in the best forms.' },
    { number: 14, arabic: 'الْغَفَّارُ', english: 'Al-Ghaffar', meaning: 'The Ever-Forgiving', verse: 'وَإِنِّي لَغَفَّارٌ لِمَنْ تَابَ', verseRef: 'Ta-Ha 20:82', reflection: 'He forgives sins repeatedly for those who repent.' },
    { number: 15, arabic: 'الْقَهَّارُ', english: 'Al-Qahhar', meaning: 'The Subduer', verse: 'وَهُوَ الْوَاحِدُ الْقَهَّارُ', verseRef: 'Ar-Ra\'d 13:16', reflection: 'He dominates and overcomes all things.' },
    { number: 16, arabic: 'الْوَهَّابُ', english: 'Al-Wahhab', meaning: 'The Bestower', verse: 'أَنْتَ الْوَهَّابُ', verseRef: 'Al-Imran 3:8', reflection: 'He gives generously without expecting return.' },
    { number: 17, arabic: 'الرَّزَّاقُ', english: 'Ar-Razzaq', meaning: 'The Provider', verse: 'إِنَّ اللَّهَ هُوَ الرَّزَّاقُ', verseRef: 'Adh-Dhariyat 51:58', reflection: 'He provides sustenance to all creation.' },
    { number: 18, arabic: 'الْفَتَّاحُ', english: 'Al-Fattah', meaning: 'The Opener', verse: 'وَهُوَ الْفَتَّاحُ الْعَلِيمُ', verseRef: 'Saba 34:26', reflection: 'He opens doors of mercy and opportunity.' },
    { number: 19, arabic: 'اَلْعَلِيْمُ', english: 'Al-Alim', meaning: 'The All-Knowing', verse: 'وَهُوَ الْعَلِيمُ الْحَكِيمُ', verseRef: 'At-Tahrim 66:2', reflection: 'His knowledge encompasses everything.' },
    { number: 20, arabic: 'الْقَابِضُ', english: 'Al-Qabid', meaning: 'The Withholder', verse: 'وَاللَّهُ يَقْبِضُ وَيَبْسُطُ', verseRef: 'Al-Baqarah 2:245', reflection: 'He withholds and restricts as He wills.' },
    { number: 21, arabic: 'الْبَاسِطُ', english: 'Al-Basit', meaning: 'The Extender', verse: 'وَاللَّهُ يَقْبِضُ وَيَبْسُطُ', verseRef: 'Al-Baqarah 2:245', reflection: 'He extends and expands His blessings.' },
    { number: 22, arabic: 'الْخَافِضُ', english: 'Al-Khafid', meaning: 'The Abaser', verse: 'خَافِضَةٌ رَافِعَةٌ', verseRef: 'Al-Waqiah 56:3', reflection: 'He humbles the arrogant.' },
    { number: 23, arabic: 'الرَّافِعُ', english: 'Ar-Rafi', meaning: 'The Exalter', verse: 'رَفِيعُ الدَّرَجَاتِ', verseRef: 'Ghafir 40:15', reflection: 'He elevates the humble and righteous.' },
    { number: 24, arabic: 'الْمُعِزُّ', english: 'Al-Muizz', meaning: 'The Bestower of Honor', verse: 'تُعِزُّ مَنْ تَشَاءُ', verseRef: 'Al-Imran 3:26', reflection: 'He grants honor to whom He wills.' },
    { number: 25, arabic: 'المُذِلُّ', english: 'Al-Mudhill', meaning: 'The Giver of Dishonor', verse: 'وَتُذِلُّ مَنْ تَشَاءُ', verseRef: 'Al-Imran 3:26', reflection: 'He abases whom He wills.' },
    { number: 26, arabic: 'السَّمِيعُ', english: 'As-Sami', meaning: 'The All-Hearing', verse: 'إِنَّهُ هُوَ السَّمِيعُ الْعَلِيمُ', verseRef: 'Al-Baqarah 2:137', reflection: 'He hears all sounds and prayers.' },
    { number: 27, arabic: 'الْبَصِيرُ', english: 'Al-Basir', meaning: 'The All-Seeing', verse: 'إِنَّ اللَّهَ سَمِيعٌ بَصِيرٌ', verseRef: 'Al-Hajj 22:75', reflection: 'Nothing is hidden from His sight.' },
    { number: 28, arabic: 'الْحَكَمُ', english: 'Al-Hakam', meaning: 'The Judge', verse: 'أَفَغَيْرَ اللَّهِ أَبْتَغِي حَكَمًا', verseRef: 'Al-An\'am 6:114', reflection: 'He is the ultimate judge of all affairs.' },
    { number: 29, arabic: 'الْعَدْلُ', english: 'Al-Adl', meaning: 'The Just', verse: 'وَتَمَّتْ كَلِمَتُ رَبِّكَ صِدْقًا وَعَدْلًا', verseRef: 'Al-An\'am 6:115', reflection: 'His justice is perfect and complete.' },
    { number: 30, arabic: 'اللَّطِيفُ', english: 'Al-Latif', meaning: 'The Subtle One', verse: 'إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ', verseRef: 'Al-Hajj 22:63', reflection: 'He is gentle and aware of hidden things.' },
    { number: 31, arabic: 'الْخَبِيرُ', english: 'Al-Khabir', meaning: 'The All-Aware', verse: 'وَهُوَ الْحَكِيمُ الْخَبِيرُ', verseRef: 'Al-An\'am 6:18', reflection: 'He knows the inner reality of all things.' },
    { number: 32, arabic: 'الْحَلِيمُ', english: 'Al-Halim', meaning: 'The Forbearing', verse: 'إِنَّ اللَّهَ غَفُورٌ حَلِيمٌ', verseRef: 'Al-Baqarah 2:225', reflection: 'He is patient with His servants.' },
    { number: 33, arabic: 'الْعَظِيمُ', english: 'Al-Azim', meaning: 'The Magnificent', verse: 'وَهُوَ الْعَلِيُّ الْعَظِيمُ', verseRef: 'Al-Baqarah 2:255', reflection: 'His greatness is beyond comprehension.' },
    { number: 34, arabic: 'الْغَفُورُ', english: 'Al-Ghafur', meaning: 'The Forgiving', verse: 'وَإِنَّ اللَّهَ لَغَفُورٌ رَحِيمٌ', verseRef: 'Al-Hajj 22:60', reflection: 'He forgives sins again and again.' },
    { number: 35, arabic: 'الشَّكُورُ', english: 'Ash-Shakur', meaning: 'The Appreciative', verse: 'إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ', verseRef: 'Fatir 35:34', reflection: 'He appreciates and rewards small deeds.' },
    { number: 36, arabic: 'الْعَلِيُّ', english: 'Al-Ali', meaning: 'The Most High', verse: 'وَهُوَ الْعَلِيُّ الْعَظِيمُ', verseRef: 'Al-Baqarah 2:255', reflection: 'He is exalted above all creation.' },
    { number: 37, arabic: 'الْكَبِيرُ', english: 'Al-Kabir', meaning: 'The Greatest', verse: 'عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ', verseRef: 'Ar-Ra\'d 13:9', reflection: 'He is greater than anything imaginable.' },
    { number: 38, arabic: 'الْحَفِيظُ', english: 'Al-Hafiz', meaning: 'The Preserver', verse: 'وَرَبُّكَ عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ', verseRef: 'Saba 34:21', reflection: 'He preserves and protects all things.' },
    { number: 39, arabic: 'المُقِيتُ', english: 'Al-Muqit', meaning: 'The Sustainer', verse: 'وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُقِيتًا', verseRef: 'An-Nisa 4:85', reflection: 'He maintains and nourishes all creation.' },
    { number: 40, arabic: 'الحَسِيبُ', english: 'Al-Hasib', meaning: 'The Reckoner', verse: 'وَكَفَىٰ بِاللَّهِ حَسِيبًا', verseRef: 'An-Nisa 4:6', reflection: 'He takes account of all deeds.' },
    { number: 41, arabic: 'الْجَلِيلُ', english: 'Al-Jalil', meaning: 'The Majestic', verse: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', verseRef: 'Ar-Rahman 55:27', reflection: 'His majesty is awe-inspiring.' },
    { number: 42, arabic: 'الْكَرِيمُ', english: 'Al-Karim', meaning: 'The Generous', verse: 'يَا أَيُّهَا الْإِنْسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ', verseRef: 'Al-Infitar 82:6', reflection: 'His generosity knows no bounds.' },
    { number: 43, arabic: 'الرَّقِيبُ', english: 'Ar-Raqib', meaning: 'The Watchful', verse: 'إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا', verseRef: 'An-Nisa 4:1', reflection: 'He watches over all of creation.' },
    { number: 44, arabic: 'الْمُجِيبُ', english: 'Al-Mujib', meaning: 'The Responsive', verse: 'إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ', verseRef: 'Hud 11:61', reflection: 'He responds to sincere prayers.' },
    { number: 45, arabic: 'الْوَاسِعُ', english: 'Al-Wasi', meaning: 'The All-Encompassing', verse: 'وَكَانَ اللَّهُ وَاسِعًا حَكِيمًا', verseRef: 'An-Nisa 4:130', reflection: 'His capacity encompasses everything.' },
    { number: 46, arabic: 'الْحَكِيمُ', english: 'Al-Hakim', meaning: 'The Wise', verse: 'وَاللَّهُ عَزِيزٌ حَكِيمٌ', verseRef: 'Al-Mumtahanah 60:5', reflection: 'His wisdom is perfect in all matters.' },
    { number: 47, arabic: 'الْوَدُودُ', english: 'Al-Wadud', meaning: 'The Most Loving', verse: 'وَهُوَ الْغَفُورُ الْوَدُودُ', verseRef: 'Al-Buruj 85:14', reflection: 'He loves His righteous servants.' },
    { number: 48, arabic: 'الْمَجِيدُ', english: 'Al-Majid', meaning: 'The Most Glorious', verse: 'ذُو الْعَرْشِ الْمَجِيدُ', verseRef: 'Al-Buruj 85:15', reflection: 'He possesses infinite glory.' },
    { number: 49, arabic: 'الْبَاعِثُ', english: 'Al-Baith', meaning: 'The Resurrector', verse: 'ثُمَّ بَعَثْنَاكُمْ مِنْ بَعْدِ مَوْتِكُمْ', verseRef: 'Al-Baqarah 2:56', reflection: 'He will resurrect all creation.' },
    { number: 50, arabic: 'الشَّهِيدُ', english: 'Ash-Shahid', meaning: 'The Witness', verse: 'إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ', verseRef: 'Al-Hajj 22:17', reflection: 'He witnesses everything that occurs.' },
    { number: 51, arabic: 'الْحَقُّ', english: 'Al-Haqq', meaning: 'The Truth', verse: 'ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ', verseRef: 'Al-Hajj 22:62', reflection: 'He is the absolute Truth.' },
    { number: 52, arabic: 'الْوَكِيلُ', english: 'Al-Wakil', meaning: 'The Trustee', verse: 'وَكَفَىٰ بِاللَّهِ وَكِيلًا', verseRef: 'An-Nisa 4:81', reflection: 'He is sufficient as a guardian.' },
    { number: 53, arabic: 'الْقَوِيُّ', english: 'Al-Qawiyy', meaning: 'The Strong', verse: 'إِنَّ اللَّهَ قَوِيٌّ عَزِيزٌ', verseRef: 'Al-Hajj 22:40', reflection: 'His strength is unlimited.' },
    { number: 54, arabic: 'الْمَتِينُ', english: 'Al-Matin', meaning: 'The Firm', verse: 'إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ', verseRef: 'Adh-Dhariyat 51:58', reflection: 'His power is unshakeable.' },
    { number: 55, arabic: 'الْوَلِيُّ', english: 'Al-Waliyy', meaning: 'The Protector', verse: 'وَهُوَ الْوَلِيُّ الْحَمِيدُ', verseRef: 'Ash-Shura 42:28', reflection: 'He is the protecting friend of believers.' },
    { number: 56, arabic: 'الْحَمِيدُ', english: 'Al-Hamid', meaning: 'The Praiseworthy', verse: 'فَإِنَّ اللَّهَ غَنِيٌّ حَمِيدٌ', verseRef: 'Luqman 31:26', reflection: 'He deserves all praise.' },
    { number: 57, arabic: 'الْمُحْصِي', english: 'Al-Muhsi', meaning: 'The Accounter', verse: 'وَأَحْصَىٰ كُلَّ شَيْءٍ عَدَدًا', verseRef: 'Al-Jinn 72:28', reflection: 'He counts and records everything.' },
    { number: 58, arabic: 'الْمُبْدِئُ', english: 'Al-Mubdi', meaning: 'The Originator', verse: 'إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ', verseRef: 'Al-Buruj 85:13', reflection: 'He creates things for the first time.' },
    { number: 59, arabic: 'الْمُعِيدُ', english: 'Al-Muid', meaning: 'The Restorer', verse: 'إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ', verseRef: 'Al-Buruj 85:13', reflection: 'He will restore creation on the Day of Judgment.' },
    { number: 60, arabic: 'الْمُحْيِي', english: 'Al-Muhyi', meaning: 'The Giver of Life', verse: 'وَهُوَ الَّذِي أَحْيَاكُمْ', verseRef: 'Al-Hajj 22:66', reflection: 'He gives life to all creatures.' },
    { number: 61, arabic: 'اَلْمُمِيتُ', english: 'Al-Mumit', meaning: 'The Taker of Life', verse: 'هُوَ يُحْيِي وَيُمِيتُ', verseRef: 'Yunus 10:56', reflection: 'He brings death to all living things.' },
    { number: 62, arabic: 'الْحَيُّ', english: 'Al-Hayy', meaning: 'The Ever Living', verse: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', verseRef: 'Al-Baqarah 2:255', reflection: 'He is eternally alive, never dying.' },
    { number: 63, arabic: 'الْقَيُّومُ', english: 'Al-Qayyum', meaning: 'The Self-Existing', verse: 'الْحَيُّ الْقَيُّومُ', verseRef: 'Al-Imran 3:2', reflection: 'He sustains Himself and all creation.' },
    { number: 64, arabic: 'الْوَاجِدُ', english: 'Al-Wajid', meaning: 'The Finder', verse: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', verseRef: 'Ad-Duha 93:7', reflection: 'He finds what He wills.' },
    { number: 65, arabic: 'الْمَاجِدُ', english: 'Al-Majid', meaning: 'The Noble', verse: 'ذُو الْعَرْشِ الْمَجِيدُ', verseRef: 'Al-Buruj 85:15', reflection: 'His nobility is supreme.' },
    { number: 66, arabic: 'الْواحِدُ', english: 'Al-Wahid', meaning: 'The One', verse: 'وَهُوَ الْوَاحِدُ الْقَهَّارُ', verseRef: 'Az-Zumar 39:4', reflection: 'He is uniquely One, without partner.' },
    { number: 67, arabic: 'اَلاَحَدُ', english: 'Al-Ahad', meaning: 'The Unique', verse: 'قُلْ هُوَ اللَّهُ أَحَدٌ', verseRef: 'Al-Ikhlas 112:1', reflection: 'There is none like Him.' },
    { number: 68, arabic: 'الصَّمَدُ', english: 'As-Samad', meaning: 'The Eternal', verse: 'اللَّهُ الصَّمَدُ', verseRef: 'Al-Ikhlas 112:2', reflection: 'He is self-sufficient, all depend on Him.' },
    { number: 69, arabic: 'الْقَادِرُ', english: 'Al-Qadir', meaning: 'The Able', verse: 'إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', verseRef: 'Al-Baqarah 2:20', reflection: 'He has power over all things.' },
    { number: 70, arabic: 'الْمُقْتَدِرُ', english: 'Al-Muqtadir', meaning: 'The Powerful', verse: 'فِي مَقْعَدِ صِدْقٍ عِنْدَ مَلِيكٍ مُقْتَدِرٍ', verseRef: 'Al-Qamar 54:55', reflection: 'He determines all things with power.' },
    { number: 71, arabic: 'الْمُقَدِّمُ', english: 'Al-Muqaddim', meaning: 'The Expediter', verse: 'نَحْنُ قَدَّرْنَا بَيْنَكُمُ الْمَوْتَ', verseRef: 'Al-Waqiah 56:60', reflection: 'He brings forward what He wills.' },
    { number: 72, arabic: 'الْمُؤَخِّرُ', english: 'Al-Muakhkhir', meaning: 'The Delayer', verse: 'يُؤَخِّرَكُمْ إِلَىٰ أَجَلٍ مُسَمًّى', verseRef: 'Nuh 71:4', reflection: 'He delays what He wills.' },
    { number: 73, arabic: 'الأوَّلُ', english: 'Al-Awwal', meaning: 'The First', verse: 'هُوَ الْأَوَّلُ وَالْآخِرُ', verseRef: 'Al-Hadid 57:3', reflection: 'He existed before all creation.' },
    { number: 74, arabic: 'الآخِرُ', english: 'Al-Akhir', meaning: 'The Last', verse: 'هُوَ الْأَوَّلُ وَالْآخِرُ', verseRef: 'Al-Hadid 57:3', reflection: 'He will remain after all creation perishes.' },
    { number: 75, arabic: 'الظَّاهِرُ', english: 'Az-Zahir', meaning: 'The Manifest', verse: 'وَالظَّاهِرُ وَالْبَاطِنُ', verseRef: 'Al-Hadid 57:3', reflection: 'His existence is evident in creation.' },
    { number: 76, arabic: 'الْبَاطِنُ', english: 'Al-Batin', meaning: 'The Hidden', verse: 'وَالظَّاهِرُ وَالْبَاطِنُ', verseRef: 'Al-Hadid 57:3', reflection: 'His essence is beyond comprehension.' },
    { number: 77, arabic: 'الْوَالِي', english: 'Al-Wali', meaning: 'The Governor', verse: 'مَا لَهُمْ مِنْ دُونِهِ مِنْ وَالٍ', verseRef: 'Ar-Ra\'d 13:11', reflection: 'He governs all of creation.' },
    { number: 78, arabic: 'الْمُتَعَالِي', english: 'Al-Mutaali', meaning: 'The Most Exalted', verse: 'الْكَبِيرُ الْمُتَعَالِ', verseRef: 'Ar-Ra\'d 13:9', reflection: 'He is exalted beyond measure.' },
    { number: 79, arabic: 'الْبَرُّ', english: 'Al-Barr', meaning: 'The Source of All Goodness', verse: 'إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ', verseRef: 'At-Tur 52:28', reflection: 'He is the source of righteousness.' },
    { number: 80, arabic: 'التَّوَّابُ', english: 'At-Tawwab', meaning: 'The Acceptor of Repentance', verse: 'إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ', verseRef: 'Al-Baqarah 2:37', reflection: 'He accepts the repentance of His servants.' },
    { number: 81, arabic: 'الْمُنْتَقِمُ', english: 'Al-Muntaqim', meaning: 'The Avenger', verse: 'إِنَّا مِنَ الْمُجْرِمِينَ مُنْتَقِمُونَ', verseRef: 'As-Sajdah 32:22', reflection: 'He takes retribution against wrongdoers.' },
    { number: 82, arabic: 'العَفُوُّ', english: 'Al-Afuww', meaning: 'The Pardoner', verse: 'إِنَّ اللَّهَ كَانَ عَفُوًّا غَفُورًا', verseRef: 'An-Nisa 4:43', reflection: 'He pardons and erases sins.' },
    { number: 83, arabic: 'الرَّؤُوفُ', english: 'Ar-Rauf', meaning: 'The Kind', verse: 'إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَحِيمٌ', verseRef: 'Al-Baqarah 2:143', reflection: 'He is kind and compassionate.' },
    { number: 84, arabic: 'مَالِكُ الْمُلْكِ', english: 'Malik al-Mulk', meaning: 'Owner of Sovereignty', verse: 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ', verseRef: 'Al-Imran 3:26', reflection: 'He owns all dominion.' },
    { number: 85, arabic: 'ذُوالْجَلاَلِ وَالإكْرَامِ', english: 'Dhul-Jalal wal-Ikram', meaning: 'Lord of Majesty and Generosity', verse: 'تَبَارَكَ اسْمُ رَبِّكَ ذِي الْجَلَالِ وَالْإِكْرَامِ', verseRef: 'Ar-Rahman 55:78', reflection: 'He possesses majesty and honor.' },
    { number: 86, arabic: 'الْمُقْسِطُ', english: 'Al-Muqsit', meaning: 'The Equitable', verse: 'إِنَّ اللَّهَ يُحِبُّ الْمُقْسِطِينَ', verseRef: 'Al-Hujurat 49:9', reflection: 'He acts with perfect equity.' },
    { number: 87, arabic: 'الْجَامِعُ', english: 'Al-Jami', meaning: 'The Gatherer', verse: 'إِنَّ اللَّهَ جَامِعُ الْمُنَافِقِينَ وَالْكَافِرِينَ', verseRef: 'An-Nisa 4:140', reflection: 'He will gather all on the Day of Judgment.' },
    { number: 88, arabic: 'الْغَنِيُّ', english: 'Al-Ghaniyy', meaning: 'The Self-Sufficient', verse: 'وَاللَّهُ الْغَنِيُّ وَأَنْتُمُ الْفُقَرَاءُ', verseRef: 'Muhammad 47:38', reflection: 'He needs nothing from creation.' },
    { number: 89, arabic: 'الْمُغْنِي', english: 'Al-Mughni', meaning: 'The Enricher', verse: 'وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ', verseRef: 'An-Najm 53:48', reflection: 'He enriches whom He wills.' },
    { number: 90, arabic: 'اَلْمَانِعُ', english: 'Al-Mani', meaning: 'The Preventer', verse: 'مَا يَفْتَحِ اللَّهُ لِلنَّاسِ مِنْ رَحْمَةٍ فَلَا مُمْسِكَ لَهَا', verseRef: 'Fatir 35:2', reflection: 'He prevents harm from reaching whom He wills.' },
    { number: 91, arabic: 'الضَّارَّ', english: 'Ad-Darr', meaning: 'The Distresser', verse: 'وَإِنْ يَمْسَسْكَ اللَّهُ بِضُرٍّ', verseRef: 'Yunus 10:107', reflection: 'He creates harm for a purpose.' },
    { number: 92, arabic: 'النَّافِعُ', english: 'An-Nafi', meaning: 'The Benefiter', verse: 'قُلْ لَا أَمْلِكُ لِنَفْسِي نَفْعًا وَلَا ضَرًّا', verseRef: 'Al-A\'raf 7:188', reflection: 'He creates benefit for His servants.' },
    { number: 93, arabic: 'النُّورُ', english: 'An-Nur', meaning: 'The Light', verse: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', verseRef: 'An-Nur 24:35', reflection: 'He is the light of the heavens and earth.' },
    { number: 94, arabic: 'الْهَادِي', english: 'Al-Hadi', meaning: 'The Guide', verse: 'وَكَفَىٰ بِرَبِّكَ هَادِيًا وَنَصِيرًا', verseRef: 'Al-Furqan 25:31', reflection: 'He guides to the straight path.' },
    { number: 95, arabic: 'الْبَدِيعُ', english: 'Al-Badi', meaning: 'The Originator', verse: 'بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ', verseRef: 'Al-Baqarah 2:117', reflection: 'He creates without any prior model.' },
    { number: 96, arabic: 'اَلْبَاقِي', english: 'Al-Baqi', meaning: 'The Everlasting', verse: 'وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ', verseRef: 'Ar-Rahman 55:27', reflection: 'He will remain forever.' },
    { number: 97, arabic: 'الْوَارِثُ', english: 'Al-Warith', meaning: 'The Inheritor', verse: 'وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ', verseRef: 'Al-Hijr 15:23', reflection: 'He inherits all when creation ends.' },
    { number: 98, arabic: 'الرَّشِيدُ', english: 'Ar-Rashid', meaning: 'The Guide to the Right Path', verse: 'وَلَقَدْ آتَيْنَا إِبْرَاهِيمَ رُشْدَهُ', verseRef: 'Al-Anbiya 21:51', reflection: 'He leads to right guidance.' },
    { number: 99, arabic: 'الصَّبُورُ', english: 'As-Sabur', meaning: 'The Patient', verse: 'وَاللَّهُ مَعَ الصَّابِرِينَ', verseRef: 'Al-Anfal 8:66', reflection: 'He is infinitely patient with His creation.' }
  ];

  const filteredNames = names.filter(name => 
    name.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.arabic.includes(searchTerm)
  );

  return (
    <div className="tools-page">
      <div className="tool-page-header">
        <Link to="/islamic-resources" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Resources
        </Link>
        <h1>99 Names of Allah</h1>
        <p>Explore the beautiful names of Allah with meanings and Quranic verses</p>
      </div>

      <div className="tool-content">
        <div className="names-container">
          <div className="names-search">
            <input
              type="text"
              placeholder="Search by name or meaning..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="names-grid">
            {filteredNames.map(name => (
              <div
                key={name.number}
                className={`name-card ${expandedName === name.number ? 'expanded' : ''}`}
                onClick={() => setExpandedName(expandedName === name.number ? null : name.number)}
              >
                <div className="name-header">
                  <div className="name-number">{name.number}</div>
                  <div className="name-arabic">{name.arabic}</div>
                </div>
                <div className="name-english">{name.english}</div>
                <div className="name-meaning">{name.meaning}</div>
                
                {expandedName === name.number && (
                  <div className="name-details">
                    <div className="name-verse">
                      <div className="name-verse-arabic">{name.verse}</div>
                      <div className="name-verse-ref">{name.verseRef}</div>
                    </div>
                    <p className="name-reflection">{name.reflection}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NamesOfAllah;
