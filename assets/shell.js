/* Edsynk preview shell — light sidebar v4, responsive + collapsible. One source of truth for all dashboard pages. */
(function(){
const active = document.body.dataset.active || 'Dashboard';
const persona = document.body.dataset.persona || 'admin';
const isPortal = persona==='student'||persona==='parent';
const isHQ = persona==='platform';
const profileHref = persona==='student'?'../student/profile.html':persona==='parent'?'../parent/profile.html':persona==='admin'?'../admin/settings.html':'#';

const css = `
#esk-sidebar{width:268px;transition:width .25s cubic-bezier(.2,.8,.2,1), transform .25s cubic-bezier(.2,.8,.2,1)}
@media (min-width:1024px){#esk-sidebar{position:sticky;top:0;height:100vh;align-self:flex-start;overflow:hidden}}
#esk-sidebar .nav-scroll,#esk-sidebar nav{scrollbar-width:thin;scrollbar-color:#C7D8F7 transparent}
#esk-sidebar nav::-webkit-scrollbar{width:5px}
#esk-sidebar nav::-webkit-scrollbar-track{background:transparent}
#esk-sidebar nav::-webkit-scrollbar-thumb{background:#C7D8F7;border-radius:99px}
#esk-sidebar nav:hover::-webkit-scrollbar-thumb{background:#2177EF}
#esk-sidebar .lbl,#esk-sidebar .sec,#esk-sidebar .grow-bits{transition:opacity .15s}
body.esk-collapsed #esk-sidebar{width:76px}
body.esk-collapsed #esk-sidebar .lbl,body.esk-collapsed #esk-sidebar .sec,body.esk-collapsed #esk-sidebar .grow-bits{opacity:0;pointer-events:none;width:0;overflow:hidden;white-space:nowrap}
body.esk-collapsed #esk-sidebar .nav-a{justify-content:center;padding-left:0;padding-right:0}
body.esk-collapsed #esk-sidebar .idcard{justify-content:center;padding:10px 0}
@media (max-width:1023px){
  #esk-sidebar{position:fixed;inset-block:0;left:0;z-index:50;transform:translateX(-105%);box-shadow:0 12px 48px rgba(11,42,86,.25)}
  body.esk-mobile-open #esk-sidebar{transform:translateX(0)}
  #esk-backdrop{position:fixed;inset:0;z-index:40;background:rgba(11,42,86,.35);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .2s}
  body.esk-mobile-open #esk-backdrop{opacity:1;pointer-events:auto}
}`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

const I = {
  home:'<path d="M3 12l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  students:'<path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/>',
  staff:'<circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0113 0"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15z"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
  results:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 13l4-4 4 3 5-6"/>',
  send:'<path d="M3 11l18-8-8 18-2-8z"/>',
  cal2:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008.6 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 8.6a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.66.27 1.18.79 1.51 1.51H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  collapse:'<path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>',
  burger:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  spark:'<path d="M12 3l1.9 5.7L19.5 10l-5.6 1.3L12 17l-1.9-5.7L4.5 10l5.6-1.3z"/>',
  chat:'<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
  money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  bell:'<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/>',
  bus:'<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M4 11h16M8 19v-3M16 19v-3"/><circle cx="8" cy="16" r=".5"/><circle cx="16" cy="16" r=".5"/>',
  bed:'<path d="M3 7v12M3 13h18a2 2 0 012 2v4M21 19v-4"/><path d="M7 13V9h6a3 3 0 013 3v1"/>',
  cap:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5"/>',
  star:'<path d="M12 3l2.6 6.3L21 10l-5 4.3L17.5 21 12 17.3 6.5 21 8 14.3 3 10l6.4-.7z"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11.5 11.5L20 3l1.5 1.5-1.5 1.5 1.5 1.5L19 11l-1.5-1.5L15 12"/>',
  flag:'<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
  flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7.5 15h9"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  clip:'<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V3h6v1M9 9h6M9 13h6M9 17h4"/>'
};
const icon=(p,s=16)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">${p}</svg>`;

const item=(name,ic,href,badge)=>{
  const isA=name===active;
  return `<a href="${href}" title="${name}" class="nav-a flex items-center gap-3 rounded-lg px-3 h-10 text-[13.5px] mt-0.5 ${isA?'bg-blue text-white font-medium shadow-lift':'text-steel hover:bg-mist/40 hover:text-charcoal'}">
    ${icon(ic)}<span class="lbl flex-1">${name}</span>${badge||''}</a>`;
};
const lockedItem=(name,tag,tagCls,href='#')=>`<a href="${href}" title="${name} — coming soon" class="nav-a flex items-center gap-3 rounded-lg px-3 h-9 text-[13px] text-excused hover:text-steel">
  ${icon(I.lock,14)}<span class="lbl flex-1">${name}</span><span class="lbl text-[9.5px] font-semibold uppercase tracking-wide ${tagCls}">${tag}</span></a>`;

document.getElementById('sidebar-root').outerHTML = `
<div id="esk-backdrop" onclick="document.body.classList.remove('esk-mobile-open')"></div>
<aside id="esk-sidebar" class="shrink-0 bg-white border-r border-whisper/80 flex flex-col">
  <div class="px-3.5 pt-4 pb-3">
    <div class="idcard flex items-center gap-3 rounded-xl bg-canvas ring-1 ring-whisper/80 px-3 py-3 cursor-pointer hover:ring-mist">
      <div class="h-9 w-9 rounded-lg ${isHQ?'bg-ink':'bg-blue'} grid place-items-center font-bold text-[15px] text-white shadow-lift shrink-0">${isHQ?'E':'AF'}</div>
      <div class="lbl min-w-0">
        <p class="text-[13px] font-semibold truncate leading-tight">${isHQ?'Edsynk HQ':'Al-edsynk-intl Academy'}</p>
        <p class="text-[11px] text-blue font-medium mt-0.5">${isHQ?'Platform console · production':isPortal?'Bauchi · 2025/26':'Pro plan · Bauchi'}</p>
      </div>
      <svg class="lbl ml-auto text-steel/60 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>
    </div>
    <button class="grow-bits mt-3 w-full flex items-center gap-2.5 rounded-lg bg-canvas hover:bg-mist/40 ring-1 ring-whisper/80 px-3 h-9 text-[12.5px] text-steel/80">
      ${icon(I.search,13)}<span>Search anything…</span>
      <kbd class="ml-auto font-mono text-[10px] bg-white ring-1 ring-whisper rounded px-1.5 py-0.5 text-steel/70">⌘K</kbd>
    </button>
  </div>

  <nav class="flex-1 px-3 pb-3 overflow-y-auto overflow-x-hidden">
    ${isHQ?`
    <p class="sec px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Platform</p>
    ${item('HQ Dashboard',I.home,'../platform/hq-dashboard.html')}
    ${item('Analytics',I.chart,'../platform/hq-analytics.html')}
    ${item('Schools',I.students,'../platform/hq-schools.html','<span class="lbl font-mono text-[10.5px] text-steel/70">3</span>')}
    ${item('Onboarding',I.send,'../platform/hq-onboarding.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">4 in pipe</span>')}
    ${item('Broadcasts',I.bell,'../platform/hq-announcements.html')}
    ${item('Content Library',I.book,'../platform/hq-content.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Revenue</p>
    ${item('Billing & Invoices',I.results,'../platform/hq-billing.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-alert">1 overdue</span>')}
    ${item('Payments',I.money,'../platform/hq-payments.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-confirm">₦19.2M</span>')}
    ${item('Plans & Pricing',I.book,'../platform/hq-plans.html')}
    ${item('AI Usage & Costs',I.spark,'../platform/hq-ai-usage.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Operations</p>
    ${item('System Health',I.chart,'../platform/hq-health.html','<span class="lbl h-2 w-2 rounded-full bg-confirm"></span>')}
    ${item('Jobs & Backups',I.cal2,'../platform/hq-jobs.html')}
    ${item('Support Inbox',I.send,'../platform/hq-support.html','<span class="h-5 min-w-5 px-1 grid place-items-center rounded-full bg-caution text-white font-mono text-[10px] font-semibold">3</span>')}
    ${item('Feature Flags',I.flag,'../platform/hq-feature-flags.html')}
    ${item('API Keys',I.key,'../platform/hq-api-keys.html')}
    ${item('HQ Team',I.staff,'../platform/hq-staff.html')}
    ${item('Audit Log',I.lock,'../platform/hq-audit.html')}
    ${item('Platform Settings',I.cog,'../platform/hq-settings.html')}
    `:persona==='student'?`
    <p class="sec px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">My School</p>
    ${item('Home',I.home,'../student/student-home.html')}
    ${item('Notifications',I.bell,'../student/notifications.html','<span class="lbl h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">3</span>')}
    ${item('My Exams',I.results,'../student/exams.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">23 Jun</span>')}
    ${item('My Results',I.chart,'../student/results.html')}
    ${item('Report Card',I.results,'../student/report-card.html')}
    ${item('My Timetable',I.cal2,'../student/timetable.html')}
    ${item('Attendance',I.cal,'../student/attendance.html')}
    ${item('Transcripts',I.book,'../student/transcripts.html')}
    ${item('Fees',I.money,'../student/fees.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">₦29.4k</span>')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Learn</p>
    ${item('Assignments',I.book,'../student/assignments.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">2 to do</span>')}
    ${item('EdMentor',I.spark,'../student/edmentor-home.html','<span class="lbl font-mono text-[10.5px] text-steel/70">23</span>')}
    ${item('Hifz',I.book,'../student/hifz.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-blue/70">Juz 8</span>')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">School life</p>
    ${item('Messages',I.chat,'../student/messages.html')}
    ${item('Library',I.book,'../student/library.html')}
    ${item('Clubs',I.star,'../student/clubs.html')}
    ${item('Announcements',I.send,'../student/announcements.html')}
    `:persona==='parent'?`
    <p class="sec px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">My Children</p>
    ${item('Home',I.home,'../parent/parent-home.html')}
    ${item('All Children',I.students,'../parent/multiple-children.html','<span class="lbl font-mono text-[10.5px] text-steel/70">2</span>')}
    ${item('Notifications',I.bell,'../parent/notifications.html','<span class="lbl h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">4</span>')}
    ${item('Results',I.chart,'../parent/results.html')}
    ${item('Report Card',I.results,'../parent/report-card.html')}
    ${item('Exams',I.results,'../parent/exams.html')}
    ${item('Timetable',I.cal2,'../parent/timetable.html')}
    ${item('Attendance',I.cal,'../parent/attendance.html')}
    ${item('EdMentor Activity',I.spark,'../parent/edmentor-activity.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">School</p>
    ${item('Fees & Payments',I.money,'../parent/fees.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-alert">₦29.4k</span>')}
    ${item('Messages',I.chat,'../parent/messages.html','<span class="h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">1</span>')}
    ${item('Health',I.heart,'../parent/health.html')}
    ${item('Transport',I.bus,'../parent/transport.html')}
    ${item('Permission Slips',I.clip,'../parent/permission-slips.html')}
    ${item('Announcements',I.send,'../parent/announcements.html')}
    ${item('Calendar',I.cal2,'../parent/calendar.html')}
    `:persona==='teacher'?`
    <p class="sec px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Teaching</p>
    ${item('My Classes',I.home,'../teacher/teacher-home.html')}
    ${item('Notifications',I.bell,'../teacher/notifications.html','<span class="lbl h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">3</span>')}
    ${item('My Timetable',I.cal2,'../teacher/teacher-schedule.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">exam wk</span>')}
    ${item('Score Entry',I.results,'../teacher/score-entry.html')}
    ${item('Gradebook',I.chart,'../teacher/gradebook.html')}
    ${item('Question Bank',I.book,'../teacher/question-bank.html')}
    ${item('Assignments',I.book,'../teacher/assignments.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">52 to grade</span>')}
    ${item('My Submissions',I.chart,'../teacher/submissions.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-alert">1 rejected</span>')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">My Class — JSS 2A</p>
    ${item('Daily Register',I.cal,'../teacher/daily-register.html')}
    ${item('Traits',I.staff,'../teacher/traits.html')}
    ${item('Lesson Notes',I.book,'../teacher/lesson-notes.html')}
    ${item('Class Analytics',I.chart,'../teacher/class-analytics.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">School</p>
    ${item('Messages',I.chat,'../teacher/messages.html','<span class="h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">2</span>')}
    ${item('Announcements',I.send,'../teacher/announcements.html')}
    ${item('EdAssess',I.spark,'../teacher/edassess.html')}
    ${item('My Leave',I.cal,'../teacher/leave.html')}
    `:persona==='cashier'?`
    <p class="sec px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Accounts</p>
    ${item('Cashier',I.home,'../cashier/cashier-dashboard.html')}
    ${item('Payments',I.money,'../cashier/payments.html')}
    ${item('Receipts',I.clip,'../cashier/receipts.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Reference</p>
    ${item('Fee structure',I.results,'../admin/fees.html')}
    `:`
    <p class="sec px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Overview</p>
    ${item('Dashboard',I.home,'../admin/admin-dashboard.html')}
    ${item('Notifications',I.bell,'../admin/notifications.html','<span class="lbl h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">5</span>')}
    ${item('Students',I.students,'../admin/students-list.html','<span class="lbl font-mono text-[10.5px] text-steel/70">412</span>')}
    ${item('Admissions',I.send,'../admin/admissions.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-caution">12 new</span>')}
    ${item('Staff',I.staff,'../admin/staff.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Academics</p>
    ${item('Subjects & Classes',I.book,'../admin/subjects-classes.html')}
    ${item('Timetable',I.cal2,'../admin/timetable-builder.html')}
    ${item('Attendance',I.cal,'../admin/attendance.html')}
    ${item('Results',I.results,'../admin/results-center.html','<span class="h-5 min-w-5 px-1 grid place-items-center rounded-full bg-caution text-white font-mono text-[10px] font-semibold">4</span>')}
    ${item('Promotion',I.chart,'../admin/promotion.html')}
    ${item('Conduct',I.shield,'../admin/conduct.html')}
    ${item('Reports',I.chart,'../admin/reports.html')}
    ${item('Result Analysis',I.chart,'../admin/result-analysis.html')}
    ${item('Academic Years',I.cal2,'../admin/academic-years.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Finance</p>
    ${item('Fees & Payments',I.money,'../admin/fees.html','<span class="lbl text-[9.5px] font-semibold uppercase tracking-wide text-alert">₦6.5M due</span>')}
    ${item('Invoice Templates',I.results,'../admin/invoice-templates.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Staff & HR</p>
    ${item('Teacher Attendance',I.shield,'../admin/teacher-attendance.html')}
    ${item('Staff Leave',I.cal,'../admin/staff-leave.html')}
    ${item('Payroll',I.money,'../admin/payroll.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">School</p>
    ${item('Messages',I.chat,'../admin/messages.html','<span class="h-5 min-w-5 px-1 grid place-items-center rounded-full bg-alert text-white font-mono text-[10px] font-semibold">1</span>')}
    ${item('Comms Log',I.send,'../admin/communication-log.html')}
    ${item('Permission Slips',I.clip,'../admin/permission-slips.html')}
    ${item('Announcements',I.send,'../admin/announcements.html')}
    ${item('Calendar',I.cal2,'../admin/calendar.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Modules</p>
    ${item('Library',I.book,'../admin/library.html')}
    ${item('Health Records',I.heart,'../admin/health-records.html')}
    ${item('Transport',I.bus,'../admin/transport.html')}
    ${item('Hostel',I.bed,'../admin/hostel.html')}
    ${item('Alumni',I.cap,'../admin/alumni.html')}
    ${item('Clubs',I.star,'../admin/clubs-activities.html')}
    <p class="sec px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-steel/60">Edsynk AI</p>
    ${item('EdInsight',I.spark,'../admin/edinsight.html')}
    ${item('EdAssess',I.spark,'../admin/edassess.html')}
    ${item('EdMentor',I.spark,'../admin/edmentor-admin.html','<span class="lbl text-[9px] font-semibold uppercase tracking-wide text-blue/70">Sept</span>')}
    <div class="grow-bits mt-5 mx-1 rounded-xl ring-1 ring-whisper/80 bg-canvas/70 p-1.5">
      <p class="px-2.5 pt-1.5 pb-1 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-blue/70">Coming with the new session</p>
      ${lockedItem('CBT Exams','Sept','text-blue/80','../admin/cbt-exams.html')}
      ${lockedItem('Transcripts','Sept','text-blue/80','../admin/transcripts.html')}
    </div>
    ${item('School Setup',I.cog,'../admin/setup-wizard.html')}
    ${item('Bulk Import',I.send,'../admin/bulk-import.html')}
    ${item('Roles & Access',I.lock,'../admin/roles.html')}
    ${item('Parent Portal',I.cog,'../admin/parent-portal-settings.html')}
    ${item('Audit Log',I.lock,'../admin/audit-log.html')}
    ${item('Settings',I.cog,'../admin/settings.html')}
    ${item('Help & Support',I.chat,'../admin/help-support.html')}
    `}
  </nav>

  <div class="p-3 border-t border-whisper/80">
    <a href="${profileHref}" class="idcard flex items-center gap-3 rounded-xl hover:bg-mist/40 px-3 py-2.5 cursor-pointer">
      <div class="h-8 w-8 rounded-full bg-wash ring-1 ring-mist grid place-items-center text-[11px] font-semibold text-blue shrink-0">${isHQ?'M':persona==='teacher'?'MI':persona==='student'?'FA':persona==='parent'?'MA':persona==='cashier'?'GE':'UA'}</div>
      <div class="lbl min-w-0">
        <p class="text-[12.5px] font-medium truncate">${isHQ?'Muhammad':persona==='teacher'?'Mallam Musa Ibrahim':persona==='student'?'Fatima Abubakar':persona==='parent'?'Hajiya Maryam Abubakar':persona==='cashier'?'Mrs. Grace Eze':'Ustadh Abdullahi'}</p>
        <p class="text-[10.5px] text-steel/70">${isHQ?'Founder · super-admin':persona==='teacher'?'Teacher · Form teacher JSS 2A':persona==='student'?'Student · JSS 2A':persona==='parent'?'Parent · 2 children':persona==='cashier'?'Cashier · Accounts':'School owner'}</p>
      </div>
      <svg class="lbl ml-auto text-steel/50" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
    </a>
  </div>
</aside>`;

// Inject toggle buttons into the page header (first flex group)
const headerLeft = document.querySelector('header > div');
if(headerLeft){
  const btn=document.createElement('button');
  btn.className='h-9 w-9 grid place-items-center rounded-lg border border-whisper text-steel hover:bg-mist/40 shrink-0';
  btn.innerHTML=icon(I.burger,16);
  btn.title='Menu';
  btn.onclick=()=>{
    if(window.innerWidth<1024) document.body.classList.toggle('esk-mobile-open');
    else document.body.classList.toggle('esk-collapsed');
  };
  headerLeft.prepend(btn);
}
// Close drawer when a nav link is tapped on mobile
document.querySelectorAll('#esk-sidebar a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('esk-mobile-open')));
})();
