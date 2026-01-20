const fs = require('fs');

const translations = {
  "before-sleep-13": "Read the last two verses of Surah Al-Baqarah at night and they will suffice you.",
  "after-dream-2": "If one sees a bad dream, let him blow (spit lightly) to his left three times and seek refuge with Allah from Satan and from the evil of what he saw, and not tell anyone about it. It will not harm him.",
  "after-dream-3": "If one sees a bad dream, let him turn to his other side.",
  "after-dream-4": "If one sees a bad dream, let him get up and pray if he wishes.",
  "after-dream-5": "Good dreams are from Allah and bad dreams are from Satan. If one sees what he dislikes, let him spit to his left three times and seek refuge with Allah from Satan. It will not harm him, and he should not tell anyone about it. If he sees a good dream, let him rejoice and not tell anyone except those whom he loves.",
  "qunut-witr-2": "O Allah, guide me among those You have guided. Grant me well-being among those You have granted well-being. Take me into Your charge among those You have taken into Your charge. Bless me in what You have given me. Protect me from the evil of what You have decreed. You decree and none can decree against You. He whom You support can never be humiliated and he whom You oppose can never be honored. Blessed are You, our Lord, and Exalted.",
  "qunut-witr-3": "O Allah, I seek refuge with Your pleasure from Your anger, and with Your forgiveness from Your punishment, and I seek refuge with You from You. I cannot praise You enough; You are as You have praised Yourself.",
  "distress-4": "O Allah, O Allah, my Lord, I do not associate anything with Him.",
  "meeting-enemy-3": "O Allah, we ask You to strike at their necks, and we seek refuge with You from their evil.",
  "fear-of-oppression-2": "Allah is sufficient for us, and He is the best Disposer of affairs.",
  "category-2-2": "The Prophet (peace be upon him) said: Should I not tell you of a treasure from the treasures of Paradise? It is: There is no might and no power except with Allah.",
  "category-2-3": "There is no might and no power except with Allah, the Most High, the Most Great.",
  "category-2-4": "I seek refuge with Allah, the All-Hearing, All-Knowing, from the accursed Satan.",
  "category-3-2": "O Allah, I seek refuge with You from associating partners with You while I know, and I seek Your forgiveness for what I do not know.",
  "against-shaytan-3": "Recite the verses of Ayat al-Kursi for protection from Satan.",
  "category-4-2": "Whoever recites Surah Al-Ikhlas ten times, Allah will build for him a house in Paradise.",
  "dying-patient-2": "The Messenger of Allah (peace be upon him) entered upon Abu Salamah after his death and his eyes were open. He closed them and said: When the soul is taken, the sight follows it.",
  "dying-patient-3": "Do not supplicate for yourselves anything but good, for indeed the angels say Ameen to what you say.",
  "funeral-prayer-2": "O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females. O Allah, whomever of us You keep alive, keep him alive in Islam, and whomever of us You cause to die, let him die in faith. O Allah, do not deprive us of his reward and do not lead us astray after him.",
  "funeral-prayer-3": "O Allah, so-and-so son of so-and-so is under Your protection and in the rope of Your security. Protect him from the trial of the grave and the punishment of the Fire. You are the faithful and the truthful. Forgive him and have mercy on him; You are the Forgiving, the Merciful.",
  "funeral-prayer-4": "O Allah, Your servant and son of Your maidservant was in need of Your mercy, and You are free from need of punishing him. If he was righteous, add to his rewards; if he was a sinner, overlook his sins.",
  "funeral-child-2": "O Allah, protect him from the punishment of the grave.",
  "funeral-child-3": "O Allah, make him a preceding reward and a treasure stored for his parents.",
  "condolence-2": "May Allah magnify your reward, give you good condolence, and forgive your deceased.",
  "wind-2": "When the Prophet (peace be upon him) saw clouds or wind, anxiety showed on his face. He was asked about it and said: I fear that punishment may be in it.",
  "rain-seeking-2": "O Allah, give us rain that will help us, is wholesome, productive, beneficial, not harmful, now and not later.",
  "rain-seeking-3": "O Allah, quench the thirst of Your servants and Your animals, spread Your mercy, and bring Your dead land back to life.",
  "breaking-fast-2": "O Allah, for You I have fasted and upon Your provision I have broken my fast.",
  "before-eating-2": "O Allah, bless for us what You have provided and protect us from the punishment of the Fire. In the name of Allah.",
  "after-eating-2": "Praise be to Allah Who has fed us this food and provided it for us without any power or strength from ourselves.",
  "fasting-at-food-1": "When one of you is invited to food and he is fasting, let him say: I am fasting.",
  "first-fruit-1": "O Allah, bless us in our fruit, bless us in our city, bless us in our sa' (measure) and our mudd (measure).",
  "resident-for-traveler-2": "I entrust to Allah your religion, your faithfulness, and the ends of your deeds.",
  "virtues-salawat-2": "O Allah, send prayers upon Muhammad and upon the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim; You are indeed Praiseworthy, Glorious. And bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim; You are indeed Praiseworthy, Glorious.",
  "virtues-salawat-3": "Whoever sends one blessing upon me, Allah will send ten blessings upon him.",
  "virtues-salawat-4": "The Prophet (peace be upon him) said: Do not make my grave a place of celebration. Send blessings upon me, for your blessings reach me wherever you are.",
  "virtues-salawat-5": "The stingy person is the one in whose presence I am mentioned and he does not send blessings upon me.",
  "spreading-salam-2": "A man asked the Prophet (peace be upon him): Which Islam is best? He said: You feed people, and give the greeting of peace to those you know and those you do not know.",
  "spreading-salam-3": "By the One in Whose Hand is my soul, you will not enter Paradise until you believe, and you will not believe until you love one another. Shall I not tell you of something which, if you do it, you will love one another? Spread the greeting of peace among yourselves.",
  "after-insulting-1": "When the Quraysh insulted the Prophet (peace be upon him), he said: O Allah, forgive my people, for they do not know.",
  "istighfar-3": "The Prophet (peace be upon him) said: By Allah, I seek Allah's forgiveness and turn to Him in repentance more than seventy times a day.",
  "istighfar-4": "O Allah, I seek Your forgiveness for my sins and I ask You for Your mercy. O Allah, increase me in knowledge, and do not let my heart deviate after You have guided me, and grant me mercy from Yourself. Indeed, You are the Bestower.",
  "istighfar-5": "The Prophet (peace be upon him) said: Glad tidings to the one who finds in his record much seeking of forgiveness.",
  "istighfar-6": "I seek Allah's forgiveness and repent to Him. (Repeat 100 times a day)",
  "category-25-6": "The Prophet (peace be upon him) said: The phrase 'SubhanAllah wal-hamdulillah wa la ilaha illallah wallahu Akbar' is more beloved to me than everything upon which the sun rises.",
  "category-25-7": "There are two blessings about which many people are negligent: good health and free time.",
  "category-25-8": "The Prophet (peace be upon him) said: Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your occupation, and your life before your death.",
  "category-25-9": "The Prophet (peace be upon him) was asked: Which words are the best? He said: Those which Allah chose for His angels: SubhanAllahi wa bihamdihi (Glory be to Allah and praise be to Him).",
  "category-25-10": "The Prophet (peace be upon him) said: The one who recites SubhanAllah one hundred times in the morning and one hundred times in the evening is like one who performed Hajj one hundred times.",
  "category-25-11": "The Prophet (peace be upon him) said: Whoever says 'La ilaha illallah' sincerely from his heart will enter Paradise.",
  "category-25-12": "The Prophet (peace be upon him) said: Renew your faith. It was said: O Messenger of Allah, how do we renew our faith? He said: Say often 'La ilaha illallah' (There is no deity but Allah)."
};

let content = fs.readFileSync('client/src/data/azkaarData.js', 'utf8');

let count = 0;
for (const [duaId, translation] of Object.entries(translations)) {
  const escapedTranslation = translation.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const regex = new RegExp(`("id": "${duaId}",\\s*"arabic": "[^"]*",\\s*"translation": )"",?`, 's');
  if (regex.test(content)) {
    content = content.replace(regex, `$1"${escapedTranslation}",`);
    count++;
  }
}

fs.writeFileSync('client/src/data/azkaarData.js', content);
console.log(`Added ${count} final translations`);
