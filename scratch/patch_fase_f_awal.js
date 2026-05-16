import fs from 'fs';
import { faseFAwal_materi } from './fase_f_awal_materi.js';
import { faseFAwal_quizzes } from './fase_f_awal_quizzes.js';

// We need to rebuild the historyPhases, but retaining Fase E.
// Since we generated Fase E in patch_fase_e.js, we can import it.
import { historyPhases } from '../src/data/historyContent.js';

const newHistoryPhases = historyPhases.map(phase => {
  if (phase.id === "fase_f_awal") {
    return {
      ...phase,
      chapters: faseFAwal_materi.map(ch => ({
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

// For Quizzes
import { historyQuizzes } from '../src/data/historyQuizzes.js';

let updatedQuizzes = {
  ...historyQuizzes,
  ...faseFAwal_quizzes
};

let quizzesOutput = 'export const historyQuizzes = ' + JSON.stringify(updatedQuizzes, null, 2) + ';';
fs.writeFileSync('src/data/historyQuizzes.js', quizzesOutput);

console.log("Successfully patched historyContent.js and historyQuizzes.js with Fase F Awal content.");
