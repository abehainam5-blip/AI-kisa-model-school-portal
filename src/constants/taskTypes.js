import {
  PenSquare, Mic, MessageSquare, Video, Image as ImageIcon,
  Languages, BookOpen, Code2, GraduationCap, Ban, Megaphone,
  Sparkles, FolderKanban, MoreHorizontal
} from "lucide-react";

export const TASK_TYPES = [
  { key: "canva", label: "Canva Post", icon: PenSquare, color: "#a855f7" },
  { key: "tedx", label: "TEDx Review", icon: Mic, color: "#8b5cf6" },
  { key: "interview_taken", label: "Interview Taken", icon: MessageSquare, color: "#7c3aed" },
  { key: "interview_given", label: "Interview Given", icon: MessageSquare, color: "#6d28d9" },
  { key: "faceless", label: "Faceless Video", icon: Video, color: "#c026d3" },
  { key: "poster", label: "Poster", icon: ImageIcon, color: "#a21caf" },
  { key: "english_lang", label: "English Language", icon: Languages, color: "#9333ea" },
  { key: "story", label: "Story Post", icon: BookOpen, color: "#8b5cf6" },
  { key: "coding", label: "Coding", icon: Code2, color: "#7c3aed" },
  { key: "english_class", label: "English Class", icon: GraduationCap, color: "#a855f7" },
  { key: "no_work", label: "No Work", icon: Ban, color: "#6b7280" },
  { key: "digital_marketing", label: "Digital Marketing", icon: Megaphone, color: "#c026d3" },
  { key: "gemini", label: "Gemini", icon: Sparkles, color: "#f5a623" },
  { key: "project", label: "Project", icon: FolderKanban, color: "#8b5cf6" },
  { key: "other", label: "Other", icon: MoreHorizontal, color: "#9ca3af" },
];
