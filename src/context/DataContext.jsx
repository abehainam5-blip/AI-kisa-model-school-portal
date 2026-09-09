import React, { createContext, useContext, useState, useMemo } from "react";
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CALENDAR_EVENTS,
  STRENGTH_POOL,
  WEAK_POOL
} from "../data/mockData";
import { TASK_TYPES } from "../constants/taskTypes";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const DataContext = createContext();

export function DataProvider({ children }) {
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR_EVENTS);
  const [globalSearch, setGlobalSearch] = useState("");

  // Attendance state: map of { [studentId]: boolean }
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    INITIAL_STUDENTS.forEach((s) => {
      init[s.id] = s.present;
    });
    return init;
  });

  // Daily Tasks running log
  const [tasksLog, setTasksLog] = useState([
    { id: 1, studentId: 1, student: INITIAL_STUDENTS[0]?.name, task: "Canva Post", time: "9:20 AM" },
    { id: 2, studentId: 2, student: INITIAL_STUDENTS[1]?.name, task: "Coding", time: "10:05 AM" },
  ]);

  // Filter students based on active role
  const roleStudents = useMemo(() => {
    if (role === "teacher") {
      return students.filter((s) => currentUser?.classes?.includes(s.class));
    }
    return students;
  }, [students, role, currentUser]);

  // Log an audit action
  const logAudit = (action, target) => {
    const newLog = {
      id: Date.now(),
      actor: currentUser?.name || "System",
      action,
      target,
      time: "Just now"
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Student Actions
  const addStudent = (studentData) => {
    const id = Date.now();
    const newStudent = {
      id,
      name: studentData.name,
      class: Number(studentData.class),
      attendance: Number(studentData.attendance) || 85,
      performance: Number(studentData.performance) || 75,
      tasksCompleted: 0,
      strengths: studentData.strengths && studentData.strengths.length ? studentData.strengths : STRENGTH_POOL[0],
      weakPoints: studentData.weakPoints && studentData.weakPoints.length ? studentData.weakPoints : WEAK_POOL[0],
      avatarHue: (id * 47) % 360,
      present: true,
      gender: studentData.gender || "Not Specified",
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, ".")}@aikisa.edu.pk`,
      guardianContact: studentData.guardianContact || "+92 300 0000000"
    };

    setStudents((prev) => [newStudent, ...prev]);
    setAttendance((prev) => ({ ...prev, [id]: true }));
    logAudit("Added student", `${newStudent.name} · Class ${newStudent.class}`);
    showToast(`Student ${newStudent.name} added successfully!`, "success");
    return newStudent;
  };

  const updateStudent = (id, updatedFields) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    logAudit("Updated student info", `Student ID #${id}`);
    showToast("Student details updated.", "info");
  };

  const deleteStudent = (id) => {
    const st = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    logAudit("Removed student", st ? `${st.name} (Class ${st.class})` : `ID #${id}`);
    showToast(`Student ${st?.name || ""} removed.`, "error");
  };

  // Attendance Actions
  const setStudentAttendance = (studentId, isPresent) => {
    setAttendance((prev) => ({ ...prev, [studentId]: isPresent }));
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, present: isPresent } : s))
    );
  };

  const markAllAttendance = (studentIds, isPresent) => {
    setAttendance((prev) => {
      const next = { ...prev };
      studentIds.forEach((id) => {
        next[id] = isPresent;
      });
      return next;
    });
    setStudents((prev) =>
      prev.map((s) => (studentIds.includes(s.id) ? { ...s, present: isPresent } : s))
    );
    logAudit(
      isPresent ? "Marked all present" : "Marked all absent",
      `${studentIds.length} students`
    );
    showToast(
      `Marked all ${studentIds.length} students as ${isPresent ? "Present" : "Absent"}.`,
      "success"
    );
  };

  // Task Actions
  const assignTask = (studentId, taskKey, customNote = "") => {
    const student = students.find((s) => s.id === studentId);
    const taskDef = TASK_TYPES.find((t) => t.key === taskKey);
    if (!student || !taskDef) return;

    const newLogItem = {
      id: Date.now(),
      studentId,
      student: student.name,
      task: taskDef.label + (customNote ? ` (${customNote})` : ""),
      time: "Just now"
    };

    setTasksLog((prev) => [newLogItem, ...prev]);

    // Increment completed tasks
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, tasksCompleted: (s.tasksCompleted || 0) + 1 } : s
      )
    );

    logAudit("Assigned daily task", `${taskDef.label} → ${student.name}`);
    showToast(`Assigned ${taskDef.label} to ${student.name}`, "success");
  };

  // Teacher Actions
  const addTeacher = (teacherData) => {
    const newId = Date.now();
    const newTeacher = {
      id: newId,
      name: teacherData.name,
      subject: teacherData.subject,
      classes: teacherData.classes.map(Number),
      rating: 5.0,
      status: "Active",
      email: teacherData.email || `${teacherData.name.toLowerCase().replace(/\s+/g, ".")}@aikisa.edu.pk`,
      phone: teacherData.phone || "+92 300 1234567"
    };
    setTeachers((prev) => [...prev, newTeacher]);
    logAudit("Added teacher", `${newTeacher.name} · ${newTeacher.subject}`);
    showToast(`Teacher ${newTeacher.name} registered.`, "success");
    return newTeacher;
  };

  // Reports Actions
  const submitReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      teacher: currentUser?.name || "Teacher",
      title: reportData.title,
      class: Number(reportData.class) || 8,
      category: reportData.category || "Progress Report",
      content: reportData.content || "",
      submitted: "Just now",
      status: "Pending"
    };
    setReports((prev) => [newReport, ...prev]);
    logAudit("Submitted report for review", newReport.title);
    showToast("Report submitted for Super Admin review.", "success");

    // Add notification for admin
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "New report submitted",
        desc: `${newReport.title} submitted by ${newReport.teacher}.`,
        time: "Just now",
        type: "report",
        read: false
      },
      ...prev
    ]);
  };

  const updateReportStatus = (reportId, newStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    const target = reports.find((r) => r.id === reportId);
    logAudit(
      newStatus === "Approved" ? "Approved report" : "Rejected report",
      target ? target.title : `Report #${reportId}`
    );
    showToast(
      `Report "${target?.title || ""}" was ${newStatus.toLowerCase()}.`,
      newStatus === "Approved" ? "success" : "error"
    );
  };

  // Calendar Actions
  const addCalendarEvent = (day, title) => {
    setCalendarEvents((prev) => ({
      ...prev,
      [day]: title
    }));
    logAudit("Created calendar event", `${title} on Day ${day}`);
    showToast(`Event "${title}" added to Calendar on Day ${day}.`, "success");
  };

  // Notification Actions
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read.", "info");
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        students,
        roleStudents,
        teachers,
        reports,
        auditLogs,
        notifications,
        calendarEvents,
        attendance,
        tasksLog,
        globalSearch,
        setGlobalSearch,
        addStudent,
        updateStudent,
        deleteStudent,
        setStudentAttendance,
        markAllAttendance,
        assignTask,
        addTeacher,
        submitReport,
        updateReportStatus,
        addCalendarEvent,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
