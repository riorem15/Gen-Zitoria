import fs from 'fs';
import { faseF_materi } from './fase_f_materi.js';
import { faseF_quizzes } from './fase_f_quizzes.js';
import { historyPhases } from '../src/data/historyContent.js';

const newHistoryPhases = historyPhases.map(phase => {
  if (phase.id === "fase_f") {
    return {
      ...phase,
      chapters: faseF_materi.map(ch => ({
        id: ch.id,
        title: ch.title,
        summary: ch.summary,
        contentByLevel: ch.contentByLevel
      }))
    };
  }
  return phase;
});

fs.writeFileSync('src/data/historyContent.js', 'export const historyPhases = ' + JSON.stringify(newHistoryPhases, null, 2) + ';');

import { historyQuizzes } from '../src/data/historyQuizzes.js';

let updatedQuizzes = {
  ...historyQuizzes,
  ...faseF_quizzes
};

let quizzesOutput = 'export const historyQuizzes = ' + JSON.stringify(updatedQuizzes, null, 2) + ';';
fs.writeFileSync('src/data/historyQuizzes.js', quizzesOutput);

console.log("Successfully patched historyContent.js and historyQuizzes.js with Fase F content.");
