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
      list.push({
        id,
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
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@aikisa.edu.pk`,
        guardianContact: `+92 300 ${1000000 + (id * 8923) % 8999999}`,
      });
      id++;
    }
  }
  return list;
}

export const INITIAL_STUDENTS = buildStudents();

export const INITIAL_TEACHERS = [
  { id: 1, name: "Ms. Areeba Nadeem", subject: "English & Digital Media", classes: [8, 9], rating: 4.8, status: "Active", email: "areeba.nadeem@aikisa.edu.pk", phone: "+92 321 4567890" },
  { id: 2, name: "Mr. Bilal Hassan", subject: "Computer Science", classes: [6, 7], rating: 4.6, status: "Active", email: "bilal.hassan@aikisa.edu.pk", phone: "+92 333 5678901" },
  { id: 3, name: "Mrs. Sana Iqbal", subject: "Mathematics", classes: [3, 4, 5], rating: 4.9, status: "Active", email: "sana.iqbal@aikisa.edu.pk", phone: "+92 345 6789012" },
  { id: 4, name: "Mr. Danish Farooq", subject: "Social Studies", classes: [1, 2], rating: 4.5, status: "On Leave", email: "danish.farooq@aikisa.edu.pk", phone: "+92 312 7890123" },
  { id: 5, name: "Ms. Iqra Malik", subject: "Islamiat & Urdu", classes: [10], rating: 4.7, status: "Active", email: "iqra.malik@aikisa.edu.pk", phone: "+92 301 8901234" },
];

export const MONTHLY_TREND = MONTHS.slice(0, 9).map((m, i) => ({
  month: m,
  attendance: Math.round(78 + Math.sin(i / 1.3) * 8 + i * 0.6),
  performance: Math.round(65 + Math.cos(i / 1.6) * 6 + i * 1.4),
}));

export const INITIAL_REPORTS = [
  { id: 1, teacher: "Ms. Areeba Nadeem", title: "Class 9 — Monthly Progress Report", submitted: "2 hours ago", status: "Pending", class: 9, category: "Progress Report", content: "Students in Class 9 showed commendable engagement with Canva visual posts and TEDx presentation exercises." },
  { id: 2, teacher: "Mr. Bilal Hassan", title: "Class 6 — Coding Assessment Summary", submitted: "5 hours ago", status: "Pending", class: 6, category: "Technical Assessment", content: "Basic logic constructs and scratch projects completed by 92% of the class with remarkable creativity." },
  { id: 3, teacher: "Mrs. Sana Iqbal", title: "Class 4 — Attendance Exception Report", submitted: "Yesterday", status: "Pending", class: 4, category: "Attendance", content: "Minor drop in attendance during the mid-month flu outbreak; recovering steadily." },
  { id: 4, teacher: "Ms. Iqra Malik", title: "Class 10 — Weak Point Analysis", submitted: "2 days ago", status: "Pending", class: 10, category: "Academic Analysis", content: "Identified need for focused mock interviews and grammar accuracy workshops for upcoming senior assessments." },
];

export const INITIAL_AUDIT_LOGS = [
  { id: 1, actor: "Ms. Areeba Nadeem", action: "Marked attendance", target: "Class 9 · 5 students", time: "Today, 9:12 AM" },
  { id: 2, actor: "Super Admin", action: "Approved report", target: "Class 6 Coding Assessment", time: "Today, 8:40 AM" },
  { id: 3, actor: "Mr. Bilal Hassan", action: "Assigned daily task", target: "Coding · 4 students", time: "Yesterday, 4:55 PM" },
  { id: 4, actor: "Super Admin", action: "Updated class roster", target: "Class 3", time: "Yesterday, 2:10 PM" },
  { id: 5, actor: "Mrs. Sana Iqbal", action: "Generated mark sheet", target: "Class 5 · September", time: "2 days ago" },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "New report pending approval", desc: "Class 9 monthly progress report submitted by Ms. Areeba.", time: "10m ago", type: "report", read: false },
  { id: 2, title: "Low attendance alert", desc: "Class 6 attendance dropped below 75% this week.", time: "1h ago", type: "alert", read: false },
  { id: 3, title: "Mark sheets generated", desc: "September mark sheets are ready for Class 8 & 9.", time: "3h ago", type: "success", read: false },
  { id: 4, title: "New teacher onboarded", desc: "Ms. Iqra Malik joined as Islamiat & Urdu teacher.", time: "1d ago", type: "info", read: true },
];

export const INITIAL_CALENDAR_EVENTS = {
  5: "Report Deadline",
  12: "Parent Meeting",
  18: "Mid-term Review",
  24: "Mark Sheet Release",
  28: "Annual Coding Exhibition",
};
