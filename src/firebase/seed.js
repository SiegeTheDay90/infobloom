import { createProfile } from "./dataFunctions.js";

// --- Helper Functions ---
const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Avery", "Quinn", "Riley", "Skyler"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Lopez", "Wilson"];
const subjects = ["Math", "Science", "English", "History", "Physical Education", "Performing Arts", "Visual Arts"];
const careers = ["Doctor", "Engineer", "Artist", "Teacher", "Scientist", "Game Developer"];
const socialMedia = ["Instagram", "TikTok", "YouTube", "Snapchat", "Discord", "Twitter/X", "I don't use social media"];
const languages = ["English", "Spanish", "Mandarin", "French", "Arabic"];
const quotes = [
  "Believe in yourself!",
  "Every day is a new beginning.",
  "Mistakes are proof you are trying.",
  "Stay curious and kind.",
  "Hard work beats talent."
];
const superpowers = ["Invisibility", "Flight", "Heat Vision", "Telepathy", "Time Travel", "Teleportation"];
const petTypes = ["Dog", "Cat", "Fish", "Hamster", "Lizard"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr) {
  const count = 1 + Math.floor(Math.random() * arr.length);
  return [...new Set(Array.from({ length: count }, () => getRandomItem(arr)))];
}

function generateFakeUser(index) {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const uid = `user${index}-${crypto.randomUUID()}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@school.edu`;

  // Approximate age 13–15
  const year = 2009 + Math.floor(Math.random() * 3);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  const birthDate = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);

  const hasPets = Math.random() < 0.5;
  const petType = hasPets ? getRandomItem(petTypes) : "";

  return {
    uid,
    email,
    firstName,
    lastName,
    preferredName: firstName,
    birthDate,
    classPeriod: String(1 + Math.floor(Math.random() * 7)),
    heightInInches: 55 + Math.floor(Math.random() * 21),
    hoursOfSleep: +(5 + Math.random() * 5).toFixed(1),
    screenTimeHours: +(1 + Math.random() * 6).toFixed(1),
    favoriteSubject: getRandomItem(subjects),
    careerInterest: getRandomItem(careers),
    favoriteSocialMedia: getRandomItem(socialMedia),
    languagesSpoken: getRandomSubset(languages),
    hasPets,
    petType,
    motivationalQuote: getRandomItem(quotes),
    superpower: getRandomItem(superpowers),

    // 🆕 New Fields
    countriesVisited: Math.floor(Math.random() * 11), // 0–10
    siblings: Math.floor(Math.random() * 6),           // 0–5
    shoeSize: +(4.5 + Math.random() * 7.5).toFixed(1), // ~4.5–12.0
    foodSpending: Math.floor(25 + Math.random() * 125) // $25–$150
  };
}

// --- Seed Function ---
export async function seedUsers(count = 100) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const fakeUser = generateFakeUser(i);
    const result = await createProfile(fakeUser);
    if (result) {
      console.log(`✅ Created: ${fakeUser.email}`);
      results.push(result);
    } else {
      console.warn(`❌ Failed to create: ${fakeUser.email}`);
    }
  }

  console.log(`\nDone! ${results.length} users created out of ${count}.`);
}
