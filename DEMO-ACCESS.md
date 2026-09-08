# Demo access

`demo.edsynk.ng` is a **private product preview**. Share the per-role credentials below with the people you invite — each opens that role's view of the app.

| Role         | Username | Password    |
| ------------ | -------- | ----------- |
| School owner | `owner`  | `Owner$925` |
| Teacher      | `teacher`| `Teach$418` |
| Student      | `student`| `Learn$736` |
| Parent       | `parent` | `Home$254`  |

## How to change them

The credentials live in the `CREDS` object near the bottom of **`index.html`**:

```js
var CREDS = {
  owner:   { pw: "Owner$925", url: "admin/admin-dashboard.html" },
  teacher: { pw: "Teach$418", url: "teacher/teacher-home.html" },
  student: { pw: "Learn$736", url: "student/student-home.html" },
  parent:  { pw: "Home$254",  url: "parent/parent-home.html" }
};
```

Edit any `pw` (or add/remove a role), commit, push — Vercel redeploys automatically. Keep this file in sync when you change them.

## Give each guest their own private-feeling credentials

Each key in `CREDS` is a separate login, and **several logins can point to the same view** — so you can hand every person a unique username + password that all land on, say, the owner dashboard. Each guest thinks their credentials are just for them (and you can rename/remove one without affecting the others):

```js
var CREDS = {
  owner:   { pw: "Owner$925",   url: "admin/admin-dashboard.html" }, // your master
  musa:    { pw: "Musa-7742",   url: "admin/admin-dashboard.html" }, // → owner view
  aisha:   { pw: "Aisha-1093",  url: "admin/admin-dashboard.html" }, // → owner view
  investor:{ pw: "Vc-2026-x",   url: "admin/admin-dashboard.html" }, // → owner view
  teacher: { pw: "Teach$418",   url: "teacher/teacher-home.html" }
};
```

So: one username per person, any of them routed to whichever role view you want them to see. (Still a soft gate — see below.)

## Important — this is a *soft* gate

On a static site the role pages are still reachable by direct URL, and these passwords are visible in the page source. It stops **casual** visitors, not a determined one. For real, un-bypassable protection, turn on **Vercel → Settings → Deployment Protection → Password Protection** (one password over the entire deployment) and give that password out instead.
