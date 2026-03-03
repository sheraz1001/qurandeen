import React from 'react';

const tajweedColors = {
  'h': { className: 'tajweed-silent', title: 'Hamzah Wasl (Silent)' },
  'l': { className: 'tajweed-lam-shamsiyyah', title: 'Lam Shamsiyyah' },
  'n': { className: 'tajweed-madd-obligatory', title: 'Madd Lazim (Obligatory)' },
  'p': { className: 'tajweed-madd-permissible', title: 'Madd Muttasil (Permissible)' },
  'q': { className: 'tajweed-qalqalah', title: 'Qalqalah' },
  'g': { className: 'tajweed-ghunnah', title: 'Ghunnah' },
  'i': { className: 'tajweed-ikhfa', title: 'Ikhfa' },
  'f': { className: 'tajweed-ikhfa-shafawi', title: 'Ikhfa Shafawi' },
  'd': { className: 'tajweed-idgham-ghunnah', title: 'Idgham with Ghunnah' },
  'e': { className: 'tajweed-idgham-no-ghunnah', title: 'Idgham without Ghunnah' },
  'b': { className: 'tajweed-iqlab', title: 'Iqlab' },
  's': { className: 'tajweed-silent', title: 'Silent' }
};

export const parseTajweed = (text, selectedScript) => {
  if (!text || selectedScript !== 'quran-tajweed') {
    return <span>{text}</span>;
  }

  const parts = [];
  let i = 0;
  let key = 0;
  let buffer = '';

  while (i < text.length) {
    if (text[i] === '[') {
      if (buffer) {
        parts.push(<span key={key++}>{buffer}</span>);
        buffer = '';
      }

      const codeMatch = text.substring(i).match(/^\[([a-z])(?::\d+)?\[/);
      if (codeMatch) {
        const code = codeMatch[1];
        const startContentIdx = i + codeMatch[0].length;
        const endBracketIdx = text.indexOf(']', startContentIdx);

        if (endBracketIdx !== -1) {
          const content = text.substring(startContentIdx, endBracketIdx);
          const tajweed = tajweedColors[code] || { className: '', title: '' };

          parts.push(
            <span key={key++} className={tajweed.className} title={tajweed.title}>
              {content}
            </span>
          );

          i = endBracketIdx + 1;
          continue;
        }
      }
      buffer += text[i];
      i++;
    } else {
      buffer += text[i];
      i++;
    }
  }

  if (buffer) {
    parts.push(<span key={key++}>{buffer}</span>);
  }

  return <>{parts}</>;
};
