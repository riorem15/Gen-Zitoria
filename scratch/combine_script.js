
import fs from 'fs';

const chapters = [1, 2, 3, 4, 5, 6, 7];
let finalContent = `/**
 * Bank Soal Zitora (Total 1050 Soal)
 * Dikategorikan berdasarkan:
 * - LOTS: C1-C2
 * - MOTS: C3-C4
 * - HOTS: C5-C6
 */

export const historyQuizzes = {
`;

chapters.forEach(c => {
    const filePath = `scratch/full_chap${c}.js`;
    let content = fs.readFileSync(filePath, 'utf8');
    // Extract the object part: export const chapX = { ... }; -> { ... }
    content = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    finalContent += `  "chap_${c}": ${content}${c === 7 ? '' : ',\n'}`;
});

finalContent += `\n};`;

fs.writeFileSync('src/data/historyQuizzes.js', finalContent);
console.log('Successfully updated src/data/historyQuizzes.js with 1050 questions.');
