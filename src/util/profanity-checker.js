
import { Filter } from 'bad-words';

const filter = new Filter(); // Initialize bad-words filter
const customWords = ['dick']; // Custom words to exclude
filter.addWords(...customWords); // Add custom words to the filter
/**
 * Converts leetspeak/symbols to letters and checks for profanity
 * @param {string} text
 * @returns {boolean} true if the input is profane
 */
export function sanitizeAndCheckProfanity(text = "") {
  const leetMap = {
    '@': 'a',
    '4': 'a',
    '$': 's',
    '5': 's',
    '!': 'i',
    '1': 'i',
    '3': 'e',
    '0': 'o',
    '7': 't',
    '+': 't',
    '|': 'i',
    '€': 'e',
    '£': 'l',
    '§': 's'
  };

  let cleaned = text.toLowerCase().replace(/[^a-z0-9@!$#%^&*()+_\-=\[\]{};':"\\|,.<>\/?]/g, "");

  // Convert symbols to letters
  cleaned = cleaned.replace(/[@4$53107+|€£§]/g, char => leetMap[char] || char);

  return filter.isProfane(cleaned);
}