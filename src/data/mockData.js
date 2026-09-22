import { CLASS_NUMS, MONTHS } from "../constants/navigation";

export const FIRST_NAMES = [
  "Ayesha", "Bilal", "Hina", "Zaid", "Sara", "Ahmed", "Mahnoor", "Usman",
  "Fatima", "Hamza", "Areeba", "Talha", "Sana", "Danish", "Iqra", "Fahad",
  "Noor", "Zainab", "Rayyan", "Laiba", "Umer", "Mariam", "Kashif", "Alishba"
];

export const LAST_NAMES = [
  "Khan", "Ali", "Raza", "Malik", "Sheikh", "Iqbal", "Chaudhry", "Farooq", "Aslam", "Baig"
];

export const STRENGTH_POOL = [
  ["Public speaking", "Consistency"],
  ["Creativity", "Fast learner"],
  ["Leadership", "Teamwork"],
  ["Writing", "Research"],
  ["Coding logic", "Discipline"],
  ["Design sense", "Communication"],
];

export const WEAK_POOL = [
  ["Time management"],
  ["Grammar accuracy"],
  ["Confidence on camera"],
  ["Attention to detail"],
  ["Consistency in submissions"],
  ["Editing speed"],
];

export function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function buildStudents() {
  const list = [];
  let id = 1;
  for (const cls of CLASS_NUMS) {
    const count = 3 + Math.floor(seededRand(cls * 7) * 3); // 3-5 per class
    for (let i = 0; i < count; i++) {
      const fn = FIRST_NAMES[(id * 3 + i) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(id * 5 + i) % LAST_NAMES.length];
      const attendance = Math.round(70 + seededRand(id * 1.7) * 29);
      const performance = Math.round(55 + seededRand(id * 2.3) * 44);
      const tasksCompleted = Math.round(6 + seededRand(id * 3.1) * 14);
      const socialIdx = id % 3;
      const socialMedia =
        socialIdx === 0 ? `linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}` :
        socialIdx === 1 ? `instagram.com/${fn.toLowerCase()}_${ln.toLowerCase()}` :
        `facebook.com/${fn.toLowerCase()}.${ln.toLowerCase()}`;
      list.push({
        id,
        studentId: `KISA-2026-${cls}-${String(id).padStart(3, "0")}`,
        name: `${fn} ${ln}`,
        class: cls,
        attendance,
        performance,
        tasksCompleted,
        strengths: STRENGTH_POOL[id % STRENGTH_POOL.length],
        weakPoints: WEAK_POOL[id % WEAK_POOL.length],
        avatarHue: (id * 47) % 360,
        present: seededRand(id * 9.1) > 0.22,
        gender: id % 2 === 0 ? "Female" : "Male",
        socialMedia,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@aikisa.edu.pk`,
      });
      id++;
    }
  }
  return list;
}

export const INITIAL_STUDENTS = [];

export const INITIAL_TEACHERS = [];

export const INITIAL_REPORTS = [];

export const INITIAL_AUDIT_LOGS = [];

export const INITIAL_NOTIFICATIONS = [];

export const INITIAL_CALENDAR_EVENTS = {};

export const MONTHLY_TREND = [];
