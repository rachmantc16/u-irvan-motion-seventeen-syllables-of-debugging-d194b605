// Seventeen Syllables of Debugging
// Writes one haiku (5-7-5) about debugging to entry.txt and checks its own
// gate before writing: exactly three lines, 5-7-5 syllables by the counter
// below, 1-200 characters total, not blank, no trailing newline.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HAIKU: string[] = [
  "Breakpoint holds its breath",
  "the log line points at no one",
  "the typo was mine",
];

const EXPECTED: number[] = [5, 7, 5];

// Count syllables in one word: groups of vowels (a, e, i, o, u, plus "y"
// when it follows a consonant), minus a silent trailing "e".
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  const isVowel = (i: number): boolean => {
    const c = w[i];
    if ("aeiou".includes(c)) return true;
    if (c === "y") return i > 0 && !"aeiouy".includes(w[i - 1]);
    return false;
  };
  let groups = 0;
  for (let i = 0; i < w.length; i++) {
    if (isVowel(i) && (i === 0 || !isVowel(i - 1))) groups++;
  }
  if (w.endsWith("e") && groups > 1 && !isVowel(w.length - 2)) groups--;
  return Math.max(groups, 1);
}

function countLine(line: string): number {
  return line
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, word) => sum + countSyllables(word), 0);
}

function main(): void {
  const counts = HAIKU.map(countLine);
  const text = HAIKU.join("\n");

  if (HAIKU.length !== 3) throw new Error("haiku must have exactly 3 lines");
  for (let i = 0; i < 3; i++) {
    if (counts[i] !== EXPECTED[i]) {
      throw new Error(
        `line ${i + 1} has ${counts[i]} syllables, expected ${EXPECTED[i]}`,
      );
    }
  }
  if (text.trim().length === 0) throw new Error("entry is blank");
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry is ${text.length} characters, gate is 1-200`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), text, "utf8");
  console.log(text);
  console.log(`syllables: ${counts.join("-")}, characters: ${text.length}`);
}

main();
