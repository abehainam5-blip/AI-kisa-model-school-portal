import React from "react";
import { Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

function certificateMarkup({ student, teacherName, mastery }) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `<!doctype html><html><head><title>AI KISA Achievement Certificate</title><style>
    @page{size:A4 landscape;margin:0}body{margin:0;background:#08060f;color:#f1eefb;font-family:Georgia,serif}.page{width:100vw;height:100vh;display:grid;place-items:center}.certificate{width:82%;height:72%;padding:42px;border:2px solid #a855f7;box-shadow:0 0 42px #7c3aed66;background:radial-gradient(circle at 50% 0,#30115a,#0d0a1a 60%);text-align:center}.brand{font:700 18px Arial;color:#e879f9;letter-spacing:4px}.kicker{margin-top:42px;font:600 14px Arial;letter-spacing:3px;color:#a9a3c6}.name{margin:18px 0;font-size:52px;color:#fff}.copy{font:18px Arial;color:#d8d1f3}.score{margin:24px auto;padding:10px 22px;width:max-content;border:1px solid #a855f7;border-radius:999px;color:#f5b942;font:700 20px Arial}.footer{display:flex;justify-content:space-between;margin-top:48px;font:13px Arial;color:#a9a3c6}.footer strong{display:block;color:#f1eefb;margin-top:8px}</style></head><body><main class="page"><section class="certificate"><div class="brand">AI KISA MODEL SCHOOL</div><div class="kicker">ACHIEVEMENT CERTIFICATE</div><div class="copy">This certificate is proudly awarded to</div><div class="name">${student.name}</div><div class="copy">for maintaining outstanding weekly task mastery and academic focus.</div><div class="score">Weekly Task Mastery: ${mastery}%</div><div class="footer"><div>Teacher<strong>${teacherName}</strong></div><div>Date<strong>${date}</strong></div><div>Performance<strong>${student.performance}%</strong></div></div></section></main><script>window.onload=()=>window.print();</script></body></html>`;
}

export function CertificateButton({ student, compact = false }) {
  const { currentUser } = useAuth();
  const { weeklyInsights } = useData();
  const insight = weeklyInsights.byStudent.find((item) => item.student.id === student?.id);
  const mastery = insight?.mastery || 0;
  const eligible = mastery >= 80 && student?.performance >= 80;

  const generate = () => {
    if (!eligible) return;
    const popup = window.open("", "_blank", "noopener,noreferrer,width=1100,height=780");
    if (!popup) return;
    popup.document.write(certificateMarkup({ student, teacherName: currentUser?.name || "AI KISA Teacher", mastery }));
    popup.document.close();
  };

  return <button className={`btn ${compact ? "btn-ghost btn-sm" : "btn-primary btn-sm"}`} onClick={generate} disabled={!eligible} title={eligible ? "Print or save this certificate as PDF" : "Requires at least 80% weekly mastery and performance"}><Award size={13} /> {eligible ? "Achievement Certificate" : "Certificate Locked"}</button>;
}
