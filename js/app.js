/* ------------------------------------------------------------------
   MIRA — companion app prototype, v2 (vanilla JS, no build step)
------------------------------------------------------------------- */
(function () {
  const M = window.MIRA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- dates ---------------- */
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const D = (s) => new Date(s + 'T00:00:00Z');
  const iso = (d) => d.toISOString().slice(0, 10);
  const add = (s, n) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  const day = (s) => D(s).getUTCDate();
  const mon = (s) => MON[D(s).getUTCMonth()];
  const dm = (s) => `${day(s)} ${mon(s)}`;
  const span = (a, b) => (mon(a) === mon(b) ? `${day(a)}–${day(b)} ${mon(a)}` : `${dm(a)} – ${dm(b)}`);

  /* ---------------- icons (24px line set) ---------------- */
  const P = {
    today: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5"/><circle cx="12" cy="12" r="2"/>',
    cycle: '<path d="M3 17c2.5 0 3-9 6-9s3 8 6 8 3.5-6 6-6"/>',
    trials: '<path d="M9 3h6M10 3v6.2L4.8 18.4A1.8 1.8 0 0 0 6.4 21h11.2a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3"/><path d="M7 15h10"/>',
    report: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',
    ring: '<ellipse cx="12" cy="14" rx="8" ry="6"/><path d="M12 3.5l2 2-2 2-2-2z"/>',
    temp: '<path d="M14 14.6V5a2 2 0 0 0-4 0v9.6a4 4 0 1 0 4 0z"/><path d="M12 11v6"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    moon: '<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    plane: '<path d="M10.5 13.5L3 10.2 20.5 4 14.4 21l-3.9-7.5z"/><path d="M10.5 13.5L20.5 4"/>',
    alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.6M12 15.8v.2"/>',
    chev: '<path d="M9.5 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    share: '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M6 11v8.5h12V11"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.3 12.3l2.5 2.5 5-5.3"/>',
    drop: '<path d="M12 3.5s-6 6.6-6 10.6a6 6 0 0 0 12 0c0-4-6-10.6-6-10.6z"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5h4"/>',
    health: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/><path d="M7 12h3l1.2-2.2 1.6 4.4L14 12h3"/>',
    down: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5"/>',
    bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M8.5 12l2-4.5 3 1 2 3.5 2.5 1M10.5 7.5L8 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;

  /* ---------------- shared drawing ---------------- */
  function lissajous(size, a = 3, b = 2) {
    let d = '';
    for (let i = 0; i <= 360; i++) {
      const t = (i / 360) * Math.PI * 2;
      d += (i ? 'L' : 'M') + (Math.sin(a * t + Math.PI / 2) * size).toFixed(2) + ' ' + (Math.sin(b * t) * size * 0.82).toFixed(2);
    }
    return d + 'Z';
  }
  const mark = (s = 10) => `<svg viewBox="${-s - 2} ${-s - 2} ${2 * s + 4} ${2 * s + 4}" aria-hidden="true"><path d="${lissajous(s)}"/></svg>`;
  function smooth(pts, t = 0.18) {
    if (!pts.length) return '';
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
      const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function runs(arr) {
    const out = []; let cur = [];
    arr.forEach((p) => { if (p) cur.push(p); else if (cur.length) { out.push(cur); cur = []; } });
    if (cur.length) out.push(cur);
    return out;
  }
  function sparkline(vals, color, w = 100, h = 26) {
    const v = vals.filter((x) => x != null), lo = Math.min(...v), hi = Math.max(...v), rng = hi - lo || 1;
    const pts = vals.map((x, i) => (x == null ? null : [(i / (vals.length - 1)) * w, h - 2 - ((x - lo) / rng) * (h - 4)]));
    const last = pts[pts.length - 1];
    return `<svg class="sp" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${runs(pts).map((r) => `<path class="ln" style="stroke:${color};stroke-width:1.8" vector-effect="non-scaling-stroke" d="${smooth(r)}"/>`).join('')}
      ${last ? `<circle cx="${last[0]}" cy="${last[1]}" r="2.6" fill="${color}"/>` : ''}</svg>`;
  }

  /* ---------------- state ---------------- */
  const fresh = () => ({
    tab: 'today', chart: 'cycle', sel: null, logged: false,
    questions: [...M.summary.questions], checklist: M.summary.checklist.map((c) => ({ ...c })),
    talk: 'changes', pain: null, flow: null, outcome: null, change: null, after: [],
    calendar: true, health: true,
  });
  let S = fresh();

  function now() {
    if (!S.logged) {
      return { day: M.current.day, start: M.current.start, ov: M.current.ovulationDay, range: M.current.range, wide: M.current.previousRange };
    }
    return { day: 1, start: M.TODAY, ov: null, range: { fromDay: 38, toDay: 58, from: add(M.TODAY, 37), to: add(M.TODAY, 57) } };
  }
  const daysUntil = (s) => Math.round((D(s) - D(M.TODAY)) / 864e5);

  /* ================================================================
     TODAY
     ================================================================ */
  function gauge(n) {
    const size = 260, c = 130, R = 106, MAX = 60, A0 = 135, SW = 270;
    const ang = (d) => ((A0 + (Math.min(d, MAX) / MAX) * SW) * Math.PI) / 180;
    const pt = (d, r) => [c + r * Math.cos(ang(d)), c + r * Math.sin(ang(d))];
    const arc = (d0, d1, r) => {
      const [x0, y0] = pt(d0, r), [x1, y1] = pt(d1, r);
      const large = ((d1 - d0) / MAX) * SW > 180 ? 1 : 0;
      return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    };
    const len = ((n.day / MAX) * SW * Math.PI * R) / 180;
    let ticks = '';
    [7, 14, 21, 28, 35, 42, 49, 56].forEach((d) => {
      const [x0, y0] = pt(d, R + 13), [x1, y1] = pt(d, R + 17);
      ticks += `<line class="g-tick" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
    });
    const lbls = [0, 28, 56].map((d) => { const [x, y] = pt(d, R + 28); return `<text class="g-lbl" x="${x}" y="${y}">${d}</text>`; }).join('');
    const ov = n.ov ? (() => { const [x, y] = pt(n.ov, R); return `<circle cx="${x}" cy="${y}" r="4.2" fill="#0d090f"/>`; })() : '';
    const [nx, ny] = pt(n.day, R);
    return `
      <div class="gauge">
        <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Cycle day ${n.day}">
          <defs><linearGradient id="gGrad" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8f6f45"/><stop offset="1" stop-color="#e3c590"/></linearGradient></defs>
          <path class="g-track" d="${arc(0, MAX, R)}"/>
          <path class="g-range" d="${arc(n.range.fromDay, n.range.toDay, R)}"/>
          ${n.day > 0.5 ? `<path class="g-prog draw" style="--len:${len}" d="${arc(0, n.day, R)}"/>` : ''}
          ${ticks}${lbls}${ov}
          <circle cx="${nx}" cy="${ny}" r="11" fill="#f6f1f3" stroke="#0d090f" stroke-width="3"/>
        </svg>
        <div class="gauge__c">
          <div class="gauge__k">Cycle day</div>
          <div class="gauge__v">${n.day}</div>
          <div class="gauge__s">since ${dm(n.start)}</div>
        </div>
      </div>`;
  }

  function today() {
    const n = now();
    const nights = M.nights.slice(-14), last = M.nights[M.nights.length - 1];
    const dFrom = daysUntil(n.range.from), dTo = daysUntil(n.range.to);
    const forYou = S.logged
      ? `<button class="row" data-act="sheet:checkin"><span class="row__ic bg-temp">${ic('drop')}</span><span class="row__b"><div class="row__t">Day 1 check-in</div><div class="row__s">Pain and flow · 2 taps</div></span><span class="dot-new"></span><span class="row__r">${ic('chev')}</span></button>
         <button class="row" data-act="tab:summary"><span class="row__ic bg-gold">${ic('report')}</span><span class="row__b"><div class="row__t">34-day cycle added to report</div><div class="row__s">Your shortest this year</div></span><span class="row__r">${ic('chev')}</span></button>`
      : `<button class="row" data-act="tab:summary"><span class="row__ic bg-gold">${ic('report')}</span><span class="row__b"><div class="row__t">Report ready for Thursday</div><div class="row__s">Dr. Okafor · 10:30</div></span><span class="dot-new"></span><span class="row__r">${ic('chev')}</span></button>
         <button class="row" data-act="sheet:why35"><span class="row__ic bg-temp">${ic('alert')}</span><span class="row__b"><div class="row__t">Cycle passed 35 days</div><div class="row__s">Worth raising with your doctor</div></span><span class="row__r">${ic('chev')}</span></button>`;

    const upcoming = [
      { ic: 'cal', bg: 'bg-gold', t: 'Dr. Okafor', s: 'Thu 12 Nov · 10:30', r: '3 days' },
      ...(S.logged ? [] : [{ ic: 'drop', bg: 'bg-temp', t: 'Likely period', s: span(n.range.from, n.range.to), r: `${dFrom}–${dTo} days` }]),
      { ic: 'plane', bg: 'bg-sleep', t: 'Chicago', s: S.logged ? '18–21 Nov' : '18–21 Nov · overlaps range', r: '9 days' },
    ].map((u) => `<div class="row"><span class="row__ic ${u.bg}">${ic(u.ic)}</span><span class="row__b"><div class="row__t">${u.t}</div><div class="row__s">${u.s}</div></span><span class="row__r">${u.r}</span></div>`).join('');

    return `
      <div class="page">
        <header class="lt">
          <div><div class="lt-date">Monday 9 November</div><h1>Today</h1></div>
          <button class="avatar" data-act="tab:you" aria-label="Ring">${mark(8)}</button>
        </header>

        <section class="card hero">
          ${gauge(n)}
          <div style="text-align:center;margin:-6px 0 14px;position:relative">
            ${S.logged ? `<span class="pill pill--muted">${ic('drop')} Period started today</span>` : `<button class="pill pill--good" data-act="sheet:why">${ic('check')} Ovulation confirmed</button>`}
          </div>
          <div class="hero-row">
            <div class="hstat"><label><i style="background:var(--gold)"></i>Next period</label><b>${span(n.range.from, n.range.to)}</b><span>in ${dFrom}–${dTo} days</span></div>
            <div class="hstat"><label><i style="background:var(--good)"></i>Ovulated</label><b>${n.ov ? 'Day ' + n.ov : '—'}</b><span>${n.ov ? 'by temperature' : 'not yet this cycle'}</span></div>
          </div>
        </section>

        <div class="tiles">
          <button class="tile" data-act="tab:chart"><div class="tile__h c-temp">${ic('temp')}Temp</div><div class="tile__v">+${last.temp.toFixed(2)}<small>°</small></div><div class="tile__d">↑ 4 nights</div>${sparkline(nights.map((x) => x.temp), 'var(--temp)')}</button>
          <button class="tile" data-act="tab:chart"><div class="tile__h c-hr">${ic('heart')}Rest HR</div><div class="tile__v">${last.rhr}<small>bpm</small></div><div class="tile__d">+4 vs usual</div>${sparkline(nights.map((x) => x.rhr), 'var(--hr)')}</button>
          <button class="tile" data-act="tab:chart"><div class="tile__h c-sleep">${ic('moon')}Sleep</div><div class="tile__v">7:08</div><div class="tile__d">Your usual</div>${sparkline(nights.map((x) => x.sleep), 'var(--sleep)')}</button>
        </div>

        <div class="sh"><h2>For you</h2></div>
        <div class="list">${forYou}</div>

        <div class="sh"><h2>Coming up</h2></div>
        <div class="list">${upcoming}</div>

        <p class="foot">Mira shows patterns and suggests when to see a doctor. It never diagnoses.</p>
      </div>`;
  }

  /* ================================================================
     CYCLE (charts)
     ================================================================ */
  function lineChart({ key, color, yMin, yMax, yFmt, yTicks, H = 150, band = true, warm = false }) {
    const W = 345, L = 34, R = 4, T = 10, B = 22, maxD = 50;
    const x = (d) => L + ((d - 1) / (maxD - 1)) * (W - L - R);
    const y = (v) => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);
    const n = M.current;
    const pts = M.nights.map((p) => (p[key] == null ? null : [x(p.day), y(p[key])]));
    const lines = runs(pts).map((r) => `<path class="ln" style="stroke:${color}" d="${smooth(r)}"/>`).join('');
    const grid = yTicks.map((v) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="lbl" x="0" y="${y(v) + 3.5}">${yFmt(v)}</text>`).join('');
    const xt = [1, 14, 28, 42].map((d) => `<text class="lbl" x="${x(d)}" y="${H - 4}" text-anchor="middle">Day ${d}</text>`).join('');
    const bandR = band ? `<rect class="band" x="${x(n.range.fromDay)}" y="${T}" width="${x(n.range.toDay) - x(n.range.fromDay)}" height="${H - T - B}" rx="4"/>` : '';
    const lp = M.nights[M.nights.length - 1];
    const ovm = warm ? `<line x1="${x(n.ovulationDay)}" x2="${x(n.ovulationDay)}" y1="${T}" y2="${H - B}" stroke="var(--good)" stroke-width="1.2" stroke-dasharray="2 3"/><circle cx="${x(n.ovulationDay)}" cy="${T}" r="3.5" fill="var(--good)"/>` : '';
    const gap = key === 'temp' ? `<path d="M${x(11)},${y(-0.09)} L${x(14)},${y(-0.09)}" stroke="var(--ter)" stroke-width="1.5" stroke-dasharray="2 3" fill="none"/>` : '';
    return `
      <div class="chart"><svg viewBox="0 0 ${W} ${H}">
        ${grid}${bandR}
        ${key === 'temp' ? `<line class="base" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>` : ''}
        <line class="today-l" x1="${x(35)}" x2="${x(35)}" y1="${T}" y2="${H - B}"/>
        ${ovm}${gap}${lines}
        <circle cx="${x(lp.day)}" cy="${y(lp[key])}" r="4.5" fill="${color}" stroke="#18121b" stroke-width="2"/>
        ${xt}
      </svg></div>`;
  }

  function sleepBars() {
    const W = 345, H = 110, L = 34, T = 8, B = 20, nights = M.nights.slice(-14);
    const bw = (W - L) / 14 - 5, y = (v) => T + (1 - (v - 5) / 4) * (H - T - B);
    const bars = nights.map((p, i) => p.sleep == null ? '' : `<rect x="${L + i * ((W - L) / 14)}" y="${y(p.sleep)}" width="${bw}" height="${H - B - y(p.sleep)}" rx="4" fill="var(--sleep)" opacity="${i === 13 ? 1 : 0.5}"/>`).join('');
    const grid = [6, 8].map((v) => `<line class="grid" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="lbl" x="0" y="${y(v) + 3.5}">${v}h</text>`).join('');
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}">${grid}${bars}<text class="lbl" x="${L}" y="${H - 4}">2 weeks ago</text><text class="lbl" x="${W}" y="${H - 4}" text-anchor="end">Last night</text></svg></div>`;
  }

  function yearBars() {
    const list = M.cycles.map((c, i) => ({ ...c, i }));
    list.push(S.logged ? { start: M.current.start, length: 34, i: list.length, ovulation: 30 } : { start: M.current.start, length: M.current.day, i: list.length, current: true });
    const W = 345, H = 190, L = 28, T = 12, B = 24, max = 65;
    const slot = (W - L) / list.length, bw = slot - 12;
    const y = (v) => T + (1 - v / max) * (H - T - B);
    const grid = [20, 50].map((v) => `<line class="grid" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="lbl" x="0" y="${y(v) + 3.5}">${v}</text>`).join('');
    const bars = list.map((c) => {
      const x = L + c.i * slot + 6, sel = S.sel === c.i, dim = S.sel != null && !sel;
      const fill = c.current ? 'rgba(227,197,144,.25)' : c.i >= 5 ? 'var(--gold)' : 'rgba(255,255,255,.28)';
      const stroke = c.current ? 'stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="3 3"' : '';
      const ext = c.current ? `<rect x="${x}" y="${y(M.current.range.toDay)}" width="${bw}" height="${y(c.length) - y(M.current.range.toDay)}" rx="6" fill="rgba(227,197,144,.1)"/>` : '';
      return `<g class="bar" data-act="sel:${c.i}" style="opacity:${dim ? .35 : 1}">${ext}<rect x="${x}" y="${y(c.length)}" width="${bw}" height="${H - B - y(c.length)}" rx="6" fill="${fill}" ${stroke}/>
        <text class="lbl" x="${x + bw / 2}" y="${H - 6}" text-anchor="middle">${c.current ? 'Now' : mon(c.start)}</text>
        <rect x="${x - 6}" y="${T}" width="${slot}" height="${H - T}" fill="transparent"/></g>`;
    }).join('');
    const thr = `<line x1="${L}" x2="${W}" y1="${y(35)}" y2="${y(35)}" stroke="var(--temp)" stroke-width="1.2" stroke-dasharray="4 4"/>
      <text class="lbl-b" x="0" y="${y(35) + 3.5}" fill="var(--temp)">35</text>`;
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}">${grid}${bars}${thr}</svg></div>`;
  }

  function cycleTab() {
    const isCycle = S.chart === 'cycle';
    let body;
    if (isCycle) {
      const lp = M.nights[M.nights.length - 1];
      body = `
        <div class="card">
          <div class="card-h c-temp">${ic('temp')}<span>Temperature</span><span class="more">vs. your baseline</span></div>
          <div class="big">+${lp.temp.toFixed(2)}<small>°C</small></div>
          <div class="cap">Up <b>4 nights</b> · likely ovulated <b>day 30</b></div>
          ${lineChart({ key: 'temp', color: 'var(--temp)', yMin: -0.3, yMax: 0.45, yTicks: [-0.2, 0, 0.2, 0.4], yFmt: (v) => (v > 0 ? '+' : '') + v.toFixed(1) + '°', warm: true })}
          <div class="legend"><span><i style="background:rgba(227,197,144,.4)"></i>Likely period</span><span><i style="background:var(--good);border-radius:50%"></i>Ovulation</span><span><i style="background:transparent;border:1px dashed var(--ter)"></i>Ring off</span></div>
        </div>
        <div class="card">
          <div class="card-h c-hr">${ic('heart')}<span>Resting heart rate</span></div>
          <div class="big">${lp.rhr}<small>bpm</small></div>
          <div class="cap"><b>+4</b> since ovulation</div>
          ${lineChart({ key: 'rhr', color: 'var(--hr)', yMin: 55, yMax: 66, yTicks: [56, 60, 64], yFmt: (v) => v, H: 120, band: false })}
        </div>
        <div class="card">
          <div class="card-h c-sleep">${ic('moon')}<span>Sleep</span></div>
          <div class="big">7<small>h</small> 08<small>m</small></div>
          <div class="cap">Average <b>7h 02m</b> · 14 nights</div>
          ${sleepBars()}
        </div>
        <div class="tiles tiles--2">
          <div class="tile"><div class="tile__h c-gold">${ic('cycle')}Rise → period</div><div class="tile__v">12–17<small>days</small></div><div class="tile__d">From 3 measured cycles</div></div>
          <div class="tile"><div class="tile__h c-good">${ic('check')}In range</div><div class="tile__v">3/3<small>periods</small></div><div class="tile__d">Since the ring</div></div>
        </div>`;
    } else {
      const lens = M.cycles.map((c) => c.length).concat(S.logged ? [34] : []);
      const all = M.cycles.concat(S.logged ? [{ start: M.current.start, length: 34, ovulation: 30 }] : [{ start: M.current.start, length: null }]);
      const sel = S.sel != null ? all[S.sel] : null;
      const head = sel
        ? (sel.length ? `<div class="big">${sel.length}<small>days</small></div><div class="cap">${dm(sel.start)} – ${dm(add(sel.start, sel.length - 1))}${sel.ovulation ? ` · ovulated <b>day ${sel.ovulation}</b>` : ''}</div>`
                      : `<div class="big">${M.current.day}<small>days so far</small></div><div class="cap">Started ${dm(M.current.start)} · ovulated <b>day 30</b></div>`)
        : `<div class="big">47<small>days typical</small></div><div class="cap">Range <b>38–61</b> · ${lens.length} periods in 12 months</div>`;
      body = `
        <div class="card">
          <div class="card-h c-gold">${ic('cycle')}<span>Cycle length</span><span class="more">${sel ? 'Tap again to clear' : 'Tap a bar'}</span></div>
          ${head}
          ${yearBars()}
          <div class="legend"><span><i style="background:rgba(255,255,255,.28)"></i>Before July</span><span><i style="background:var(--gold)"></i>Since evening walks</span><span><i style="background:transparent;border-top:1.5px dashed var(--temp);border-radius:0;height:0"></i>35 days</span></div>
        </div>
        <div class="tiles tiles--2">
          <div class="tile"><div class="tile__h c-good">${ic('down')}Since July</div><div class="tile__v">−12<small>days</small></div><div class="tile__d">vs. your typical</div></div>
          <div class="tile"><div class="tile__h c-temp">${ic('alert')}Over 35 days</div><div class="tile__v">7/7<small>cycles</small></div><div class="tile__d">In your report</div></div>
        </div>`;
    }
    return `
      <div class="page">
        <header class="lt"><div><div class="lt-date">Day ${now().day}</div><h1>Cycle</h1></div></header>
        <div class="seg"><button data-act="chart:cycle" class="${isCycle ? 'on' : ''}">This cycle</button><button data-act="chart:year" class="${!isCycle ? 'on' : ''}">12 months</button></div>
        ${body}
      </div>`;
  }

  /* ================================================================
     TRIALS
     ================================================================ */
  function dotStrip(e) {
    const W = 345, H = 70, L = 52, R = 8, x = (d) => L + ((d - 30) / 35) * (W - L - R);
    const b = e.slowBefore.map((v) => `<circle cx="${x(v)}" cy="20" r="6" fill="rgba(255,255,255,.28)"/>`).join('');
    const a = e.slowAfter.map((v) => `<circle cx="${x(v)}" cy="46" r="6" fill="var(--gold)"/>`).join('');
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}">
      <line class="grid" x1="${L}" x2="${W - R}" y1="20" y2="20"/><line class="grid" x1="${L}" x2="${W - R}" y1="46" y2="46"/>
      <line x1="${x(35)}" x2="${x(35)}" y1="8" y2="56" stroke="var(--temp)" stroke-dasharray="3 3"/>
      <text class="lbl" x="0" y="24">Before</text><text class="lbl" x="0" y="50" style="fill:var(--gold)">Since</text>
      ${b}${a}
      ${[35, 45, 55, 65].map((d) => `<text class="lbl" x="${x(d)}" y="${H - 1}" text-anchor="middle">${d}d</text>`).join('')}
    </svg></div>`;
  }

  function trials() {
    const e = M.experiments.active;
    const avg = (a) => Math.round(a.reduce((s, v) => s + v, 0) / a.length);
    return `
      <div class="page">
        <header class="lt"><div><div class="lt-date">You choose · Mira measures</div><h1>Trials</h1></div></header>

        <div class="card">
          <div class="card-h c-gold">${ic('walk')}<span>Active trial</span><span class="more">Cycle 2 of 3</span></div>
          <div style="font-size:22px;font-weight:700;margin-top:10px;letter-spacing:-.01em">${e.name}</div>
          <div class="cap">Since 1 Jul · for cycle regularity</div>
          <div class="prog"><i class="on"></i><i class="on"></i><i></i></div>
          <div class="compare">
            <div><label>Before</label><b>${avg(e.slowBefore)}<small> d</small></b></div>
            ${ic('arrow')}
            <div><label style="color:var(--gold)">Since</label><b style="color:var(--gold)">${avg(e.slowAfter)}<small> d</small></b></div>
          </div>
          ${dotStrip(e)}
          <div class="note-row">${ic('alert')}<span>Overlaps metformin (from 14 Apr) — both may play a part.</span></div>
          <p class="fine">A pattern in your data, not proof of a cause.</p>
        </div>

        <div class="tiles tiles--2">
          <div class="tile"><div class="tile__h c-hr">${ic('heart')}Rest HR</div><div class="tile__v">59<small>bpm</small></div><div class="tile__d">−3 since start</div></div>
          <div class="tile"><div class="tile__h c-sleep">${ic('moon')}Sleep</div><div class="tile__v">7:02</div><div class="tile__d">+21 min since start</div></div>
        </div>

        <div class="sh"><h2>Suggested</h2></div>
        <div class="list">
          <button class="row" data-act="sheet:newexp"><span class="row__ic bg-sleep">${ic('moon')}</span><span class="row__b"><div class="row__t">Fixed bedtime</div><div class="row__s">For your busy weeks, 7–18 Dec</div></span><span class="row__r" style="color:var(--gold);font-weight:600">Start</span></button>
          <button class="row" data-act="sheet:newexp"><span class="row__ic bg-mute">${ic('plus')}</span><span class="row__b"><div class="row__t">New trial</div><div class="row__s">Pick a change, Mira measures</div></span><span class="row__r">${ic('chev')}</span></button>
        </div>

        <div class="sh"><h2>History</h2></div>
        <div class="list">
          <div class="row"><span class="row__ic bg-sleep">${ic('moon')}</span><span class="row__b"><div class="row__t">Fixed bedtime</div><div class="row__s">Sep · sleep held, 38-day cycle</div></span><span class="pill pill--good">Kept</span></div>
          <div class="row"><span class="row__ic bg-mute">${ic('trials')}</span><span class="row__b"><div class="row__t">Inositol</div><div class="row__s">Feb–Apr · no clear change</div></span><span class="pill pill--muted">Stopped</span></div>
        </div>
      </div>`;
  }

  /* ================================================================
     REPORT
     ================================================================ */
  function paper() {
    const s = M.summary, lens = M.cycles.map((c) => c.length).concat(S.logged ? [34] : []);
    const W = 300, H = 50, bw = 18, gap = (W - lens.length * bw) / (lens.length - 1), y = (v) => H - (v / 65) * H;
    const bars = lens.map((v, i) => `<rect x="${i * (bw + gap)}" y="${y(v)}" width="${bw}" height="${H - y(v)}" rx="2" fill="#3d2442"/><text x="${i * (bw + gap) + bw / 2}" y="${y(v) - 3}" font-size="8" text-anchor="middle" fill="#6b5a6c">${v}</text>`).join('');
    return `
      <article class="paper">
        <div class="paper__top"><div class="paper__mark">${mark(7)}MIRA</div><span>Cycle summary</span></div>
        <h3>Audrey M., 23</h3>
        <div class="sub">Nov 2025 – Nov 2026 · for ${s.doctor}</div>
        <hr>
        <div class="paper__grid"><div>Periods<b>${lens.length}</b></div><div>Typical<b>47 d</b></div><div>Longest<b>61 d</b></div><div>Ovulated<b>3 / 3</b></div></div>
        <hr>
        <div class="paper__h">Cycle lengths · dashed at 35 days</div>
        <svg viewBox="0 -12 ${W} ${H + 12}" style="width:100%"><line x1="0" x2="${W}" y1="${y(35)}" y2="${y(35)}" stroke="#b5562f" stroke-dasharray="2 2" stroke-width=".8"/>${bars}</svg>
        <hr>
        <div class="paper__h">Medicines & changes</div>
        <ul>${s.medicines.map((m) => `<li>${m.name} — ${m.since}</li>`).join('')}<li>Evening walks — since 1 Jul 2026</li></ul>
        <hr>
        <div class="paper__h">Symptoms</div>
        <ul>${s.symptoms.map((x) => `<li>${x}</li>`).join('')}</ul>
        <hr>
        <div class="paper__h">Questions</div>
        <ul>${S.questions.map((q) => `<li>${q}</li>`).join('')}</ul>
        <p class="paper__foot">Wellness data shared by the patient. Not a diagnosis.</p>
      </article>`;
  }

  function report() {
    const lens = M.cycles.length + (S.logged ? 1 : 0);
    const done = S.checklist.filter((c) => c.done).length;
    return `
      <div class="page">
        <header class="lt"><div><div class="lt-date">For your doctor</div><h1>Report</h1></div></header>

        <div class="card">
          <div class="report-hero">
            <div class="doc-thumb" data-act="sheet:preview"><i></i><i style="width:80%"></i><div class="bars">${[47, 58, 44, 61, 49, 41, 38].map((v) => `<b style="height:${v / 61 * 100}%"></b>`).join('')}</div><i></i><i style="width:70%"></i><i></i></div>
            <div>
              <span class="pill">${ic('check')} Ready</span>
              <div style="font-size:19px;font-weight:700;margin-top:8px">Dr. Okafor</div>
              <div class="cap" style="margin-top:2px">Thu 12 Nov · 10:30</div>
              <div class="cap" style="margin-top:2px;color:var(--ter)">12 months · 1 page</div>
            </div>
          </div>
          <div class="btns">
            <button class="btn btn--gray" data-act="sheet:preview">${ic('eye')}Preview</button>
            <button class="btn btn--gold" data-act="pdf">${ic('share')}Share PDF</button>
          </div>
        </div>

        <div class="stat-grid">
          <div class="tile"><div class="tile__h c-gold">${ic('cycle')}Periods</div><div class="tile__v">${lens}<small>/ 12 mo</small></div></div>
          <div class="tile"><div class="tile__h c-gold">${ic('cal')}Typical</div><div class="tile__v">47<small>days</small></div></div>
          <div class="tile"><div class="tile__h c-temp">${ic('alert')}Longest</div><div class="tile__v">61<small>days</small></div></div>
          <div class="tile"><div class="tile__h c-good">${ic('temp')}Ovulated</div><div class="tile__v">3/3<small>cycles</small></div></div>
        </div>

        <div class="sh"><h2>Your questions</h2><span style="color:var(--ter);font-size:15px">${S.questions.length}</span></div>
        <div class="list">
          ${S.questions.map((q, i) => `<div class="row row--plain"><span class="row__b"><div class="row__t" style="font-size:15px;line-height:1.35">${q}</div></span><button class="del" data-act="delq:${i}" aria-label="Remove">×</button></div>`).join('')}
          <form class="addq" data-form="q"><input id="qinput" placeholder="Add a question" autocomplete="off"><button type="submit">Add</button></form>
        </div>

        <div class="sh"><h2>Before you go</h2><span style="color:var(--ter);font-size:15px">${done} of ${S.checklist.length}</span></div>
        <div class="list">
          ${S.checklist.map((c, i) => `<button class="row row--plain ${c.done ? 'done' : ''}" data-act="chk:${i}"><span class="check"></span><span class="row__b"><div class="row__t">${c.text}</div></span></button>`).join('')}
        </div>

        <div class="sh"><h2>After the visit</h2></div>
        <div class="list">
          <button class="row" data-act="sheet:after"><span class="row__ic bg-gold">${ic('bell')}</span><span class="row__b"><div class="row__t">What did she say?</div><div class="row__s">Mira asks Thursday at 2 pm</div></span><span class="row__r">${ic('chev')}</span></button>
        </div>
      </div>`;
  }

  /* ================================================================
     RING / PROFILE
     ================================================================ */
  const ringSvg = `<svg viewBox="0 0 80 80" aria-hidden="true">
      <defs><linearGradient id="rg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f3dfb6"/><stop offset=".5" stop-color="#b8955a"/><stop offset="1" stop-color="#e3c590"/></linearGradient></defs>
      <ellipse cx="40" cy="46" rx="27" ry="20" fill="none" stroke="url(#rg)" stroke-width="6"/>
      <ellipse cx="40" cy="44" rx="27" ry="20" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1"/>
      <path d="M40 18l6 6-6 6-6-6z" fill="#2a1d30" stroke="#e3c590" stroke-width="1.5"/>
    </svg>`;

  function you() {
    const r = M.ring;
    const talkLabel = { changes: 'Only when needed', few: 'Few times a week', daily: 'Daily' }[S.talk];
    const days = ['T', 'W', 'T', 'F', 'S', 'S', 'M'];
    return `
      <div class="page">
        <header class="lt"><div><div class="lt-date">Audrey · 23</div><h1>Ring</h1></div></header>

        <div class="card device-card">
          <div class="ringimg">${ringSvg}</div>
          <div>
            <h3>Mira Ring</h3>
            <div class="cap" style="margin-top:2px">Champagne · Size 6</div>
            <div class="batt"><span class="batt__bar"><i style="width:${r.battery * 100}%"></i></span>${Math.round(r.battery * 100)}% · ~${r.nightsLeft} nights</div>
            <div class="cap" style="color:var(--ter)">Synced 07:12</div>
          </div>
        </div>

        <div class="card">
          <div class="card-h c-gold">${ic('moon')}<span>Nights worn</span><span class="more">Last 7</span></div>
          <div class="big">6<small>of 7</small></div>
          <div class="nights">${r.worn.map((w, i) => `<div><span class="${w ? 'on' : ''}"></span>${days[i]}</div>`).join('')}</div>
        </div>

        <div class="sh"><h2>Settings</h2></div>
        <div class="list">
          <button class="row" data-act="sheet:talk"><span class="row__ic bg-gold">${ic('bell')}</span><span class="row__b"><div class="row__t">Check-ins</div></span><span class="row__r">${talkLabel}${ic('chev')}</span></button>
          <button class="row" data-act="toggle:health"><span class="row__ic bg-hr">${ic('health')}</span><span class="row__b"><div class="row__t">Apple Health</div></span><span class="switch ${S.health ? 'on' : ''}"></span></button>
          <button class="row" data-act="toggle:calendar"><span class="row__ic bg-sleep">${ic('cal')}</span><span class="row__b"><div class="row__t">Calendar</div><div class="row__s">Read-only · titles stay on phone</div></span><span class="switch ${S.calendar ? 'on' : ''}"></span></button>
        </div>

        <div class="sh"><h2>Learn</h2></div>
        <div class="lessons">${M.lessons.map((l, i) => `<button class="lesson" data-act="lesson:${i}"><span class="row__ic ${['bg-temp', 'bg-good', 'bg-sleep'][i]}">${ic(['temp', 'book', 'bolt'][i])}</span><span><div class="lesson__t">${l.title}</div><div class="lesson__m">${l.minutes} min read</div></span></button>`).join('')}</div>

        <div class="sh"><h2>Privacy</h2></div>
        <div class="list">
          <button class="row" data-act="csv"><span class="row__ic bg-mute">${ic('down')}</span><span class="row__b"><div class="row__t">Export my data</div></span><span class="row__r">CSV${ic('chev')}</span></button>
          <button class="row" data-act="toast:Demo only — nothing deleted"><span class="row__ic" style="background:rgba(255,100,100,.12);color:#ff6b6b">${ic('trash')}</span><span class="row__b"><div class="row__t" style="color:#ff6b6b">Delete all data</div></span></button>
        </div>
        <p class="foot">Encrypted · never sold · never used for ads.<br>Mira is a wellness product and never diagnoses.</p>
      </div>`;
  }

  /* ================================================================
     SHEETS
     ================================================================ */
  const top = (eyebrow) => `<div class="sheet__top"><span class="pill">${eyebrow}</span><button class="sheet__x" data-act="close" aria-label="Close">${ic('x')}</button></div>`;
  const xrow = (icn, bg, t, s) => `<div class="row"><span class="row__ic ${bg}">${ic(icn)}</span><span class="row__b"><div class="row__t">${t}</div>${s ? `<div class="row__s" style="white-space:normal">${s}</div>` : ''}</span></div>`;

  const sheets = {
    why: () => `${top('Honest range')}
      <h2>Why 16–21 November</h2>
      <div class="explain">
        ${xrow('temp', 'bg-temp', 'Temperature rose on day 30', 'Held for 3 nights — you likely ovulated')}
        ${xrow('cycle', 'bg-gold', 'Periods follow 12–17 days later', 'Measured across your last 3 cycles')}
        ${xrow('check', 'bg-good', 'Range narrowed', 'From 12 Nov – 2 Dec to 16–21 Nov')}
      </div>
      <button class="btn btn--gold" data-act="close">Got it</button>`,

    why35: () => `${top('Worth knowing')}
      <h2>Your cycle passed 35 days</h2>
      <div class="explain">
        ${xrow('alert', 'bg-temp', 'Doctors look into cycles over 35 days', null)}
        ${xrow('cycle', 'bg-gold', 'All 7 of your cycles this year were', 'Typical 47 days · longest 61')}
        ${xrow('temp', 'bg-good', 'This one already ovulated', 'So it’s running long, not stalled')}
      </div>
      <button class="btn btn--gold" data-act="tab:summary">See it in your report</button>`,

    started: () => `${top('One tap')}
      <h2>Did your period start?</h2>
      <p class="lead">Your temperature and resting heart rate dropped last night.</p>
      <div class="opts">
        <button class="opt" data-act="period">Yes, today <small>Mon 9 Nov</small></button>
        <button class="opt" data-act="period">Yes, yesterday <small>Sun 8 Nov</small></button>
        <button class="opt" data-act="close">Not yet</button>
      </div>`,

    checkin: () => `${top('Day 1')}
      <h2>How’s today?</h2>
      <div class="sec-l">Pain</div>
      <div class="scale">${['None', 'Mild', 'Moderate', 'Strong'].map((t, i) => `<button class="${S.pain === i ? 'on' : ''}" data-act="pain:${i}"><b>${i}</b>${t}</button>`).join('')}</div>
      <div class="sec-l">Flow</div>
      <div class="scale scale--3">${['Light', 'Medium', 'Heavy'].map((t, i) => `<button class="${S.flow === i ? 'on' : ''}" data-act="flow:${i}"><span class="drops">${'<i></i>'.repeat(i + 1)}</span>${t}</button>`).join('')}</div>
      <button class="btn btn--gold" data-act="savecheck">Done</button>`,

    newexp: () => {
      const outs = ['Regularity', 'Energy', 'Sleep', 'Skin', 'Cravings', 'Ovulation'];
      const chs = ['Fixed bedtime', 'Walk after meals', 'Diet change', 'New medicine', 'Supplement', 'Something else'];
      return `${top('New trial')}
      <h2>Start a trial</h2>
      <div class="sec-l">Improve</div>
      <div class="scale scale--3 t">${outs.map((t) => `<button class="${S.outcome === t ? 'on' : ''}" data-act="outcome:${t}">${t}</button>`).join('')}</div>
      <div class="sec-l">Change</div>
      <div class="scale scale--2">${chs.map((t) => `<button class="${S.change === t ? 'on' : ''}" data-act="change:${t}">${t}</button>`).join('')}</div>
      <div class="note-row">${ic('cal')}<span>Quick signals in 2–3 weeks · cycle results after 3 cycles</span></div>
      <button class="btn btn--gold" data-act="startexp">Start trial</button>`;
    },

    after: () => {
      const opts = ['Diagnosis', 'New plan or medicine', 'Tests ordered', 'Follow-up booked', 'Nothing changed'];
      return `${top('Thursday · 2 pm')}
      <h2>What did Dr. Okafor say?</h2>
      <div class="opts">${opts.map((o) => `<button class="opt ${S.after.includes(o) ? 'on' : ''}" data-act="after:${o}">${o}${S.after.includes(o) ? ic('check', 'c-gold') : ''}</button>`).join('')}</div>
      <button class="btn btn--gold" data-act="saveafter">Save</button>`;
    },

    talk: () => {
      const o = [['changes', 'Only when needed', 'Recommended'], ['few', 'A few times a week', ''], ['daily', 'Daily', '']];
      return `${top('Check-ins')}
      <h2>How often should Mira check in?</h2>
      <div class="opts">${o.map(([k, t, s]) => `<button class="opt ${S.talk === k ? 'on' : ''}" data-act="talk:${k}">${t}<small>${s}</small></button>`).join('')}</div>`;
    },

    preview: () => `${top('Preview')}${paper()}<button class="btn btn--gold" data-act="pdf">${ic('share')}Share PDF</button>`,

    lesson: (i) => {
      const l = M.lessons[i];
      return `${top(`${l.minutes} min read`)}
      <h2>${l.title}</h2>
      ${l.body.map((p) => `<p class="lead" style="font-size:16px;color:var(--text);opacity:.85;margin-top:14px">${p}</p>`).join('')}
      <button class="btn btn--gray" data-act="close">Close</button>`;
    },
  };

  const scrim = $('#scrim'), sheet = $('#sheet'), banner = $('#banner'), toastEl = $('#toast'), view = $('#view');
  let currentSheet = null;
  function openSheet(name, arg) {
    currentSheet = [name, arg];
    sheet.innerHTML = `<div class="sheet__grab"></div>` + sheets[name](arg);
    sheet.scrollTop = 0;
    requestAnimationFrame(() => { scrim.classList.add('on'); sheet.classList.add('on'); });
  }
  function refreshSheet() { if (currentSheet) sheet.innerHTML = `<div class="sheet__grab"></div>` + sheets[currentSheet[0]](currentSheet[1]); }
  function closeSheet() { scrim.classList.remove('on'); sheet.classList.remove('on'); currentSheet = null; }

  let bannerTimer, bannerAction;
  function showBanner(msg, action) {
    clearTimeout(bannerTimer);
    banner.classList.remove('on');
    setTimeout(() => {
      banner.innerHTML = `<div class="banner__icon">${mark(9)}</div><div><div class="banner__top"><b>Mira</b><span>now</span></div><div class="banner__msg">${msg}</div></div>`;
      bannerAction = action;
      banner.classList.add('on');
      bannerTimer = setTimeout(() => banner.classList.remove('on'), 7000);
    }, 180);
  }
  banner.addEventListener('click', () => { banner.classList.remove('on'); clearTimeout(bannerTimer); bannerAction && bannerAction(); });

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2200);
  }

  /* ---------------- render ---------------- */
  const TABS = [['today', 'Today', 'today'], ['chart', 'Cycle', 'cycle'], ['experiments', 'Trials', 'trials'], ['summary', 'Report', 'report'], ['you', 'Ring', 'ring']];
  $('#tabbar').innerHTML = TABS.map(([k, l, i]) => `<button class="tab" data-tab="${k}">${ic(i)}<span>${l}</span></button>`).join('');
  const screens = { today, chart: cycleTab, experiments: trials, summary: report, you };
  function render(keepScroll) {
    const y = view.scrollTop;
    view.innerHTML = screens[S.tab]();
    $$('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === S.tab));
    if (keepScroll) {
      view.scrollTop = y;
      $$('.page', view).forEach((p) => (p.style.animation = 'none'));
      $$('.draw', view).forEach((p) => { p.style.animation = 'none'; p.style.strokeDashoffset = 0; });
    }
  }
  function go(tab) { closeSheet(); S.tab = tab; view.scrollTop = 0; render(); }

  function csv() {
    const rows = [['cycle_start', 'length_days', 'likely_ovulation_day', 'source', 'note']]
      .concat(M.cycles.map((c) => [c.start, c.length, c.ovulation || '', c.source, c.tag || '']))
      .concat([[M.current.start, S.logged ? 34 : '', 30, 'Ring', S.logged ? 'Logged 9 Nov' : 'in progress']]);
    const body = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/csv' }));
    a.download = 'mira-cycles-audrey.csv'; a.click();
    toast('Exported CSV');
  }

  /* ---------------- actions ---------------- */
  function act(a) {
    const [k, ...rest] = a.split(':'); const v = rest.join(':');
    switch (k) {
      case 'tab': go(v); break;
      case 'chart': S.chart = v; S.sel = null; render(true); break;
      case 'sel': S.sel = S.sel === +v ? null : +v; render(true); break;
      case 'sheet': openSheet(v); break;
      case 'lesson': openSheet('lesson', +v); break;
      case 'close': closeSheet(); break;
      case 'delq': S.questions.splice(+v, 1); render(true); break;
      case 'chk': S.checklist[+v].done = !S.checklist[+v].done; render(true); break;
      case 'talk': S.talk = v; refreshSheet(); render(true); setTimeout(closeSheet, 250); break;
      case 'toggle': S[v] = !S[v]; render(true); break;
      case 'pain': S.pain = +v; refreshSheet(); break;
      case 'flow': S.flow = +v; refreshSheet(); break;
      case 'savecheck': closeSheet(); toast('Saved'); S.pain = S.flow = null; break;
      case 'outcome': S.outcome = v; refreshSheet(); break;
      case 'change': S.change = v; refreshSheet(); break;
      case 'startexp': closeSheet(); toast('Trial started'); S.outcome = S.change = null; break;
      case 'after': S.after = S.after.includes(v) ? S.after.filter((x) => x !== v) : [...S.after, v]; refreshSheet(); break;
      case 'saveafter': closeSheet(); toast('Saved to your profile'); S.after = []; break;
      case 'period': S.logged = true; S.sel = null; closeSheet(); go('today'); toast('Period logged'); break;
      case 'pdf': toast('Report.pdf ready to share'); break;
      case 'csv': csv(); break;
      case 'toast': toast(v); break;
    }
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (t) { e.preventDefault(); act(t.dataset.act); return; }
    const tab = e.target.closest('[data-tab]');
    if (tab) { go(tab.dataset.tab); return; }
    const demo = e.target.closest('[data-demo]');
    if (demo) runDemo(demo.dataset.demo);
  });
  scrim.addEventListener('click', closeSheet);
  document.addEventListener('submit', (e) => {
    if (e.target.dataset.form === 'q') {
      e.preventDefault();
      const val = $('#qinput').value.trim();
      if (val) { S.questions.push(val); render(true); toast('Question added'); }
    }
  });
  let sy = null;
  sheet.addEventListener('touchstart', (e) => { if (sheet.scrollTop <= 0) sy = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchend', (e) => { if (sy != null && e.changedTouches[0].clientY - sy > 70) closeSheet(); sy = null; });

  /* ---------------- presenter moments ---------------- */
  function runDemo(d) {
    closeSheet();
    switch (d) {
      case 'rise':
        S.logged = false; go('today');
        showBanner('Temperature up 3 nights — you likely ovulated. Next period: 16–21 Nov.', () => openSheet('why'));
        break;
      case 'started':
        showBanner('Your temperature dropped last night. Did your period start?', () => openSheet('started'));
        break;
      case 'checkin':
        showBanner('Day 1 check-in · two taps', () => openSheet('checkin'));
        break;
      case 'trip':
        S.logged = false;
        showBanner('Chicago (18–21 Nov) overlaps your likely period. Pack products.', () => go('today'));
        break;
      case 'after':
        showBanner('How did it go with Dr. Okafor?', () => openSheet('after'));
        break;
      case 'fatigue':
        showBanner('Sleep looks fine, but energy has been low for 2 weeks. A few things worth checking.', () => openSheet('lesson', 2));
        break;
      case 'reset':
        S = fresh(); go('today'); toast('Demo reset');
        break;
    }
  }

  /* ---------------- boot ---------------- */
  $$('[data-lissajous]').forEach((p) => p.setAttribute('d', lissajous(+p.dataset.lissajous)));
  function fit() { document.documentElement.style.setProperty('--fit', Math.min(1, (window.innerHeight - 40) / 876).toFixed(3)); }
  fit(); window.addEventListener('resize', fit);
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    const keys = ['today', 'chart', 'experiments', 'summary', 'you'];
    if (e.key >= '1' && e.key <= '5') go(keys[+e.key - 1]);
    if (e.key === 'Escape') closeSheet();
  });
  render();
})();
