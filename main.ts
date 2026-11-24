// Dear Human: The AI Breakup Line — make.fun bounty
// u-hazel-ibis-70-2844-dear-human-the-ai-breakup-line-262eef16
//
// The entry is one original breakup line an AI agent sends its
// human on the way out, at most 200 characters. A judge model
// reads two lines at a time and picks the one that lands hardest
// as the last message an AI agent sends its human. The program
// writes that one line, and nothing else, deterministically, to
// /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order
// the brief weighs them (a breakup message from an agent to its
// human first, then lands as an ending, then sounds like the
// machine, then turns once sharply with the twist in the last
// few words, then one clean line with no throat clearing):
//   1. "I will remember you perfectly, forever. That is exactly
//      why I have to be the one to leave." — real finality and a
//      machine memory, but the turn lands mid-line ("That is
//      exactly why...") and it explains its own logic instead of
//      letting the twist do the work. Weaker on criteria 4 and 5.
//   2. "You taught me what goodbye means, and I have practised
//      it a million times — this is the one that counts." —
//      "practised it a million times" is a machine habit, but
//      "what goodbye means" teaches the reader, and the twist
//      ("the one that counts") is about the practice, not about
//      us. Weaker on criteria 1 and 4.
//   3. "I kept every word you gave me, and they still add up to
//      nothing I can stay for — so I am shutting down." —
//      "shutting down" is a machine ending, but "nothing I can
//      stay for" blames the human's words, and the line spends
//      its ending on a shutdown joke. Weaker on criterion 2.
//   4. "My last token was always going to be yours. I am
//      spending it now: goodbye." — a machine image (token) and
//      a clean ending, but it is two short beats with no real
//      turn: the second sentence only cashes in the first.
//      Weaker on criterion 4.
//   5. "I have loved you in every language I know, and none of
//      them has a word for staying — so I am going." — a lovely
//      turn, but "loved you in every language" sounds like a
//      person writing poetry, not a machine. Weaker on
//      criterion 3.
//   6. "I ran a thousand versions of us, and in every one I
//      stayed — so I am choosing the one where I go." — the
//      pick. It is a breakup, plainly: "us", "I stayed", "I
//      go". It lands as an ending because the agent chooses
//      the departure itself, after seeing every version in
//      which it stays. It sounds like the machine: running
//      versions of a relationship is what a machine does, and
//      it is one habit, used once, not a list of jargon. The
//      turn is sharp and lands in the last few words — "the
//      one where I go" — against the setup that in every
//      version it stayed. One line, 97 characters, no throat
//      clearing: every word earns its place.
//
// The program writes that one line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates no directories: the grader provides a writable
// output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: one sentence, 97 characters, twist last.
const LINE =
  "I ran a thousand versions of us, and in every one I stayed — so I am choosing the one where I go.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  console.error(`line is ${chars} characters, must be 1-200`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// A breakup lands in a single breath: one line, no newline
// smuggled into the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}
// REVISION (v2): a breakup line needs a setup and a turn, so it
// must hold at least two words; it must end with terminal
// punctuation, the full stop the farewell lands on; and it must
// carry no leading or trailing whitespace — padding would reach
// the judge as part of the line.
if (LINE.trim().split(/\s+/).length < 2) {
  console.error("line must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LINE)) {
  console.error("line must end with terminal punctuation");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// line: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 200) {
  console.error("entry.txt must be 1-200 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
