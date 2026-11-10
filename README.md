# Mira — companion app (class demo build)

**Live demo:** https://mira-app-ashen.vercel.app

iOS-style prototype of the app that pairs with the Mira Ring. Built from the
Mira Product Spec (v1.0) and the ENGM 191 knowledge base. Nothing connects to
a device; all data is invented and lives in `js/data.js`.

## Present it from a laptop
Open `index.html` in Chrome or Safari (double-click works, no install, no internet —
fonts are bundled). On a wide window you get the iPhone frame plus a presenter
column; the "Moments Mira reaches out" list fires notifications inside the phone.

- Keys 1–5 switch tabs (Today, Cycle, Trials, Report, Ring); Esc closes a sheet.
- "Reset" (bottom of the presenter column) restores the starting story.
- Present full-screen (Ctrl/Cmd+Shift+F in Chrome) so the phone renders larger.

## Put it on an iPhone
Serve the folder (e.g. `python3 -m http.server 5180`), open
`http://<laptop-ip>:5180` in Safari on the phone, then Share → Add to Home Screen.
It opens full-screen with no frame.

## The story (pinned to Monday 9 November 2026)
Audrey, 23, PCOS. Cycle day 35. Her temperature rose on day 30, so the honest
range narrowed from 12 Nov–2 Dec to 16–21 Nov — which overlaps her Chicago trip.
Her summary for Dr. Okafor (Thursday 12 Nov) is ready. Since July she has been
running a walk-after-dinner trial; her cycles shortened from 44–61 to 41 and 38
days, overlapping metformin, which Mira points out honestly.

The earlier editorial design is kept in `_v1-editorial/` for comparison.
