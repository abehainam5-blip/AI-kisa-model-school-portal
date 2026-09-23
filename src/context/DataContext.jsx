import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
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

const dateKey = (date = new Date()) => {
  const value = date instanceof Date ? date : new Date(date);
  return value.toISOString().slice(0, 10);
};

const startOfWeek = (date = new Date()) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - 6);
  return value;
};

function generateStudentId(classNumber, existingCount) {
  const year = new Date().getFullYear();
  const seq = String(existingCount + 1).padStart(3, "0");
  return `KISA-${year}-${classNumber}-${seq}`;
}

export function DataProvider({ children }) {
  const { currentUser, role, token } = useAuth();
  const { showToast } = useToast();

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR_EVENTS);
  const [globalSearch, setGlobalSearch] = useState("");
  const [saving, setSaving] = useState({});

  // Attendance state: map of { [studentId]: boolean }
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    INITIAL_STUDENTS.forEach((s) => {
      init[s.id] = s.present;
    });
    return init;
  });
  const [attendanceHistory, setAttendanceHistory] = useState(() => ({
    [new Date().toISOString().slice(0, 10)]: INITIAL_STUDENTS.reduce((map, student) => {
      map[student.id] = student.present;
      return map;
    }, {})
  }));

  // Daily Tasks running log
  const [tasksLog, setTasksLog] = useState([
    { id: 1, studentId: 1, student: INITIAL_STUDENTS[0]?.name, task: "Canva Post", time: "9:20 AM", status: "done", date: dateKey() },
    { id: 2, studentId: 2, student: INITIAL_STUDENTS[1]?.name, task: "Coding", time: "10:05 AM", status: "not_done", date: dateKey() },
  ]);

  const [activeSessions, setActiveSessions] = useState(() => ({
    [currentUser?.email || "teacher@aikisa.edu.pk"]: { name: currentUser?.name || "Current user", role, lastSeen: Date.now() }
  }));
  const [substituteMode, setSubstituteMode] = useState(false);
  const [proxyTeacherId, setProxyTeacherId] = useState(null);

  const substituteOptions = useMemo(() => (
    teachers.filter((teacher) => teacher.status !== "On Leave" && teacher.email !== currentUser?.email)
  ), [teachers, currentUser]);

  const activeProxyTeacher = useMemo(() => {
    if (!substituteMode || !proxyTeacherId) return null;
    return teachers.find((teacher) => Number(teacher.id) === Number(proxyTeacherId)) || null;
  }, [substituteMode, proxyTeacherId, teachers]);

  useEffect(() => {
    if (!currentUser?.email) return;
    setActiveSessions((prev) => ({
      ...prev,
      [currentUser.email]: { name: currentUser.name, role, lastSeen: Date.now() }
    }));
    const timer = window.setInterval(() => {
      setActiveSessions((prev) => ({
        ...prev,
        [currentUser.email]: { name: currentUser.name, role, lastSeen: Date.now() }
      }));
    }, 30000);
    return () => window.clearInterval(timer);
  }, [currentUser, role]);

  useEffect(() => {
    if (!token) return;
    fetch('/backend/api/progress.php?from=' + dateKey(startOfWeek()) + '&to=' + dateKey(), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!payload?.success) return;
        const remoteTasks = (payload.data?.tasks || []).map((task) => ({
          id: Number(task.id), studentId: Number(task.student_id),
          student: students.find((student) => student.id === Number(task.student_id))?.name || 'Student',
          task: task.task, status: task.status, date: task.task_date,
          time: new Date(task.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        }));
        if (remoteTasks.length) setTasksLog((previous) => [...remoteTasks, ...previous.filter((task) => !remoteTasks.some((remote) => remote.id === task.id))]);
        const remoteAttendance = payload.data?.attendance || [];
        if (remoteAttendance.length) setAttendanceHistory((previous) => {
          const next = { ...previous };
          remoteAttendance.forEach((record) => {
            next[record.attendance_date] = { ...(next[record.attendance_date] || {}), [Number(record.student_id)]: record.present === true || record.present === 't' };
          });
          return next;
        });
      })
      .catch(() => undefined);
  }, [token, students]);

  // Filter students based on active role
  const roleStudents = useMemo(() => {
    if (role === "teacher") {
      const targetTeacher = activeProxyTeacher || {
        classes: currentUser?.classes?.length ? currentUser.classes : [8, 9],
      };
      const assignedClasses = targetTeacher.classes?.length ? targetTeacher.classes : [8, 9];
      return students.filter((s) => assignedClasses.includes(s.class));
    }
    return students;
  }, [students, role, currentUser, activeProxyTeacher]);

  // Log an audit action
  const logAudit = (action, target) => {
    const actorName = substituteMode && activeProxyTeacher
      ? `${currentUser?.name || "Covering Teacher"} (covering ${activeProxyTeacher.name})`
      : currentUser?.name || "System";

    const newLog = {
      id: Date.now(),
      actor: actorName,
      action,
      target,
      time: "Just now"
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Mutations update local state immediately. The async boundary lets forms
  // show a reliable loading state and leaves room for API persistence later.
  const runMutation = async (key, mutation) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      return await mutation();
    } catch (error) {
      const errorMessage = error?.message || error?.data || error?.toString() || String(error) || "The change could not be saved.";
      showToast(errorMessage, "error");
      throw error;
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Student Actions
  const addStudent = (studentData) => runMutation("students", async () => {
    if (students.some((student) => student.email?.toLowerCase() === studentData.email?.toLowerCase())) {
      throw new Error("A student with this email already exists.");
    }
    const id = Date.now();
    const generatedStudentId = studentData.studentId || generateStudentId(Number(studentData.class), students.length);
    const localStudent = {
      id, studentId: generatedStudentId, name: studentData.name, class: Number(studentData.class),
      attendance: 85,
      performance: 75, tasksCompleted: 0,
      strengths: studentData.strengths && studentData.strengths.length ? studentData.strengths : STRENGTH_POOL[0],
      weakPoints: studentData.weakPoints && studentData.weakPoints.length ? studentData.weakPoints : WEAK_POOL[0],
      avatarHue: (id * 47) % 360, present: true,
      gender: studentData.gender || "Not Specified",
      socialMedia: studentData.socialMedia || "",
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, ".")}@aikisa.edu.pk`,
    };
    if (!token) throw new Error("You must be signed in to create student records.");
    const response = await fetch("/backend/api/add_student.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({
        name: studentData.name,
        email: studentData.email,
        class: studentData.class,
        gender: studentData.gender,
        socialMedia: studentData.socialMedia
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      const apiError = payload.error || payload.message || payload.data || "Unable to create the student record.";
      throw new Error(typeof apiError === 'object' ? JSON.stringify(apiError) : apiError);
    }
    const persisted = payload.data?.student || {};
    const newStudent = {
      ...localStudent,
      ...persisted,
      class: Number(persisted.class_number || localStudent.class),
      attendance: Number(persisted.attendance ?? localStudent.attendance),
      performance: Number(persisted.performance ?? localStudent.performance)
    };
    setStudents((prev) => [newStudent, ...prev]);
    setAttendance((prev) => ({ ...prev, [newStudent.id || id]: true }));
    logAudit("Added student", `${newStudent.name} · Class ${newStudent.class}`);
    showToast(`Student ${newStudent.name} added successfully!`, "success");
    return newStudent;
  });

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
  const setStudentAttendance = (studentId, isPresent, selectedDate = dateKey()) => {
    const date = dateKey(selectedDate);
    setAttendance((prev) => ({ ...prev, [studentId]: isPresent }));
    setAttendanceHistory((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [studentId]: isPresent }
    }));
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, present: isPresent } : s))
    );
    if (token) {
      fetch('/backend/api/progress.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'attendance', student_id: studentId, present: isPresent, date })
      }).catch(() => showToast('Attendance is only saved locally until the server reconnects.', 'error'));
    }
  };

  const markAllAttendance = (studentIds, isPresent, selectedDate = dateKey()) => {
    const date = dateKey(selectedDate);
    setAttendance((prev) => {
      const next = { ...prev };
      studentIds.forEach((id) => {
        next[id] = isPresent;
      });
      return next;
    });
    setAttendanceHistory((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), ...Object.fromEntries(studentIds.map((id) => [id, isPresent])) }
    }));
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
  const assignTask = async (studentId, taskKey, customNote = "", selectedDate = dateKey()) => runMutation("tasks", async () => {
    const student = students.find((s) => s.id === studentId);
    const taskDef = TASK_TYPES.find((t) => t.key === taskKey);
    if (!student || !taskDef) throw new Error("Please select a valid student and task.");

    const sourceTeacherLabel = substituteMode && activeProxyTeacher
      ? `${currentUser?.name || "Covering teacher"} covering ${activeProxyTeacher.name}`
      : currentUser?.name || "Teacher";

    const newLogItem = {
      id: Date.now(),
      studentId,
      student: student.name,
      task: taskDef.label + (customNote ? ` (${customNote})` : ""),
      time: "Just now",
      date: dateKey(selectedDate),
      status: "done",
      actor: sourceTeacherLabel,
    };

    setTasksLog((prev) => [newLogItem, ...prev]);

    if (token) {
      const response = await fetch('/backend/api/progress.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_id: studentId, task: newLogItem.task, status: newLogItem.status, date: newLogItem.date })
      });
      if (!response.ok) throw new Error('Unable to save the task to the server.');
    }

    // Increment completed tasks
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, tasksCompleted: (s.tasksCompleted || 0) + 1 } : s
      )
    );

    logAudit("Assigned daily task", `${taskDef.label} → ${student.name}`);
    showToast(`Assigned ${taskDef.label} to ${student.name}`, "success");
    return newLogItem;
  });

  const setTaskStatus = (taskId, status) => {
    setTasksLog((prev) => prev.map((task) => task.id === taskId ? { ...task, status } : task));
    const task = tasksLog.find((item) => item.id === taskId);
    if (task) logAudit(status === "done" ? "Marked task done" : "Marked task not done", `${task.task} → ${task.student}`);
    if (task && token) {
      fetch('/backend/api/progress.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_id: task.studentId, task: task.task, status, date: task.date })
      }).catch(() => showToast('Task status is only saved locally until the server reconnects.', 'error'));
    }
  };

  const weeklyInsights = useMemo(() => {
    const taskRows = roleStudents.map((student) => {
      const rows = tasksLog.filter((task) => task.studentId === student.id && new Date(`${task.date}T00:00:00`) >= startOfWeek());
      const completed = rows.filter((task) => task.status !== "not_done").length;
      const pending = rows.length - completed;
      const mastery = rows.length ? Math.round((completed / rows.length) * 100) : 0;
      const weak = student.weakPoints?.[0] || "Consistency";
      const progress = mastery >= 80 ? "Strong task mastery" : mastery >= 50 ? "Steady progress" : "Needs weekly support";
      return { student, total: rows.length, completed, pending, mastery, weak, progress, neglected: pending > completed ? [weak] : [] };
    });
    const total = taskRows.reduce((sum, row) => sum + row.total, 0);
    const completed = taskRows.reduce((sum, row) => sum + row.completed, 0);
    return {
      byStudent: taskRows,
      total,
      completed,
      pending: total - completed,
      completionRate: total ? Math.round((completed / total) * 100) : 0
    };
  }, [roleStudents, tasksLog]);

  const dailyInsights = useMemo(() => {
    const today = dateKey();
    return roleStudents.map((student) => {
      const rows = tasksLog.filter((task) => task.studentId === student.id && task.date === today);
      return {
        student,
        completed: rows.filter((task) => task.status !== "not_done"),
        missed: rows.filter((task) => task.status === "not_done")
      };
    });
  }, [roleStudents, tasksLog]);

  const teacherAnalytics = useMemo(() => teachers.map((teacher) => {
    const teacherStudents = students.filter((student) => teacher.classes.includes(student.class));
    const rows = teacherStudents.flatMap((student) => tasksLog.filter((task) => task.studentId === student.id));
    const top = [...teacherStudents].sort((a, b) => b.performance - a.performance)[0];
    const weakest = [...teacherStudents].sort((a, b) => a.performance - b.performance)[0];
    const completed = rows.filter((task) => task.status !== "not_done").length;
    return { teacher, top, weakest, totalTasks: rows.length, completedTasks: completed, missedTasks: rows.length - completed };
  }), [teachers, students, tasksLog]);

  // Teacher Actions
  const addTeacher = (teacherData) => runMutation("teachers", async () => {
    if (teachers.some((teacher) => teacher.email?.toLowerCase() === teacherData.email?.toLowerCase())) {
      throw new Error("A teacher with this email already exists.");
    }
    const newId = Date.now();
    const localTeacher = {
      id: newId,
      name: teacherData.name,
      subject: teacherData.subject,
      classes: teacherData.classes.map(Number),
      rating: 5.0,
      status: "Active",
      email: teacherData.email || `${teacherData.name.toLowerCase().replace(/\s+/g, ".")}@aikisa.edu.pk`,
    };
    let newTeacher = localTeacher;

    if (!token) {
      throw new Error("You must be signed in as a Super Admin to create teacher accounts.");
    }
    if (token) {
      const response = await fetch("/backend/api/add_teacher.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({
          name: teacherData.name,
          email: teacherData.email,
          password: teacherData.password
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Unable to create the teacher account.");
      }
      const user = payload.data?.user || {};
      newTeacher = {
        ...localTeacher,
        ...user,
        id: user.id || newId,
        status: user.status === "active" ? "Active" : localTeacher.status
      };
    }

    setTeachers((prev) => [...prev, newTeacher]);
    logAudit("Added teacher", `${newTeacher.name} · ${newTeacher.subject}`);
    showToast(`Teacher ${newTeacher.name} registered.`, "success");
    return newTeacher;
  });

  // Reports Actions
  const submitReport = (reportData) => runMutation("reports", async () => {
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
    return newReport;
  });

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
  const addCalendarEvent = (day, title) => runMutation("calendar", async () => {
    setCalendarEvents((prev) => ({
      ...prev,
      [day]: title
    }));
    logAudit("Created calendar event", `${title} on Day ${day}`);
    showToast(`Event "${title}" added to Calendar on Day ${day}.`, "success");
    return { day, title };
  });

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
        attendanceHistory,
        tasksLog,
        setTaskStatus,
        weeklyInsights,
        dailyInsights,
        teacherAnalytics,
        activeSessions,
        substituteMode,
        setSubstituteMode,
        proxyTeacherId,
        setProxyTeacherId,
        substituteOptions,
        activeProxyTeacher,
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
        clearNotification,
        saving
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
