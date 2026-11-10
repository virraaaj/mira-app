/* ------------------------------------------------------------------
   MIRA — demo data
   Persona: Audrey, 23, PCOS (spec §1.1). Everything here is invented
   for a class demo; nothing is connected to a real device or account.
   "Today" is pinned so the story lines up every time you present.
------------------------------------------------------------------- */

(function () {
  const TODAY = '2026-11-09';

  // Seeded PRNG so the sensor noise is identical on every run.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(191);
  const jitter = (amp) => (rand() * 2 - 1) * amp;
  const r2 = (n) => Math.round(n * 100) / 100;

  // Twelve months of cycles. The first four come from Apple Health
  // (dates only); the ring arrived on 2 June 2026.
  const cycles = [
    { start: '2025-11-02', length: 47, source: 'Apple Health', ovulation: null, tag: 'First period after stopping the pill' },
    { start: '2025-12-19', length: 58, source: 'Apple Health', ovulation: null, tag: 'Holidays · travel home' },
    { start: '2026-02-15', length: 44, source: 'Apple Health', ovulation: null, tag: 'Started inositol' },
    { start: '2026-03-31', length: 61, source: 'Apple Health', ovulation: null, tag: 'Job interviews · from calendar' },
    { start: '2026-05-31', length: 49, source: 'Ring from 2 Jun', ovulation: 36, tag: 'Ring baseline built' },
    { start: '2026-07-19', length: 41, source: 'Ring', ovulation: 28, tag: 'Evening walks began 1 Jul' },
    { start: '2026-08-29', length: 38, source: 'Ring', ovulation: 23, tag: 'Exam weeks · from calendar' },
  ];

  const current = {
    start: '2026-10-06',
    day: 35,
    ovulationDay: 30,
    riseConfirmed: '2026-11-07',
    range: { from: '2026-11-16', to: '2026-11-21', fromDay: 42, toDay: 47 },
    previousRange: { from: '2026-11-12', to: '2026-12-02', fromDay: 38, toDay: 58 },
    periodDays: 5,
  };

  // Nightly readings for the current cycle: night n belongs to cycle day n.
  // Nights 12–13 were flagged for poor contact — shown as gaps, never guessed.
  const nights = [];
  for (let d = 1; d <= 34; d++) {
    const missing = d === 12 || d === 13;
    let temp;
    if (d <= 30) temp = -0.09 + jitter(0.04) + (d <= 2 ? 0.05 : 0);
    else temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.18, 0.27, 0.30, 0.31][d - 1];
    const rhr = d <= 30 ? 59 + jitter(1.4) : [61.4, 62.6, 62.9, 63.1][d - 31];
    const sleep = 7.1 + jitter(0.55) + (d >= 20 && d <= 24 ? -0.7 : 0);
    nights.push({
      day: d,
      temp: missing ? null : r2(temp),
      rhr: missing ? null : Math.round(rhr),
      sleep: missing ? null : r2(sleep),
    });
  }

  // Calendar (read-only, labels only — event titles stay on the phone).
  const ahead = [
    { date: '2026-11-12', end: null, kind: 'appointment', title: 'Dr. Okafor · 10:30', note: 'Your summary is ready' },
    { date: '2026-11-16', end: '2026-11-21', kind: 'range', title: 'Likely period', note: 'Narrowed on Saturday' },
    { date: '2026-11-18', end: '2026-11-21', kind: 'travel', title: 'Chicago', note: 'Overlaps your range · pack products' },
    { date: '2026-12-07', end: '2026-12-18', kind: 'busy', title: 'Busy weeks', note: 'From your calendar' },
  ];

  const experiments = {
    active: {
      name: 'A walk after dinner',
      started: '2026-07-01',
      outcome: 'Cycle regularity',
      quick: [
        { label: 'Resting heart rate', before: '62 bpm', after: '59 bpm', note: 'Settled in week 3' },
        { label: 'Sleep', before: '6 h 41 m', after: '7 h 02 m', note: 'Most noticeable on weeknights' },
      ],
      slowBefore: [47, 58, 44, 61, 49],
      slowAfter: [41, 38],
      overlap: 'Metformin began eleven weeks earlier, on 14 April, so Mira can’t tell which change helped — possibly both.',
      durability: 'Around 25 November, after your third cycle, Mira will ask: still working?',
    },
    past: [
      { name: 'Inositol, daily', when: 'Feb – Apr 2026', result: 'Cycles of 44 and 61 days. No clear change from your usual.', kept: false },
      { name: 'Fixed bedtime in exam weeks', when: 'Sep 2026', result: 'Sleep held at 7 h on 9 of 11 nights. Cycle followed at 38 days.', kept: true },
    ],
    suggestion: {
      title: 'Your next busy stretch is 7–18 December',
      body: 'Your two longest cycles followed weeks like this. Want to try keeping your fixed bedtime through it? Mira will measure.',
    },
  };

  const summary = {
    doctor: 'Dr. Adaeze Okafor',
    clinic: 'Gynaecology · Dartmouth Health',
    when: 'Thursday 12 November, 10:30',
    period: 'November 2025 – November 2026',
    medicines: [
      { name: 'Metformin 500 mg, twice daily', since: 'since 14 Apr 2026', note: 'prescribed' },
      { name: 'Combined pill', since: 'stopped Aug 2025', note: 'first period 11 weeks later' },
      { name: 'Inositol', since: 'Feb – Apr 2026', note: 'self-started, stopped' },
    ],
    symptoms: [
      'Tired most weeks, even after full nights (rated low on 9 of the last 14 days)',
      'Skin flares in the days before a period',
      'Moderate pain on days 1–2; heavy flow in 2 of 7 periods',
    ],
    questions: [
      'Is a 61-day gap long enough that we should repeat bloods?',
      'My cycles have been shorter since July — should anything change with metformin?',
      'Could being tired be linked to B12 while I’m on metformin?',
    ],
    checklist: [
      { text: 'Top concern written down', done: true },
      { text: 'Medicines and start dates confirmed', done: true },
      { text: 'Questions added', done: true },
      { text: 'Bring last lab results (March)', done: false },
    ],
  };

  const ring = {
    name: 'Mira Ring',
    jacket: 'Champagne jacket',
    size: 'Size 6 · left ring finger',
    battery: 0.64,
    nightsLeft: 4,
    lastSync: '07:12 this morning',
    worn: [1, 1, 1, 0, 1, 1, 1], // last seven nights, Tue → Mon
    baselineSince: '2 June 2026',
  };

  const lessons = [
    { title: 'Why your temperature rises', minutes: 2, body: [
      'After you ovulate, the hormone progesterone warms you by about a third of a degree, and you stay warm until your next period.',
      'The ring reads this at night from your finger, against your own baseline — not a textbook one. A rise that holds for three nights is a sign you likely ovulated. Mira calls it after the fact; it never forecasts it.',
      'Cycles with no clear rise happen, especially with PCOS. They are your body’s pattern, not something you did wrong.' ] },
    { title: 'There is no single PCOS diet', minutes: 3, body: [
      'The 2023 international PCOS guideline found no diet that beats another. What helps is the one you can keep.',
      'Habits can help without weight loss. Many people see changes in energy or cycles before anything else moves.',
      'If eating has started to feel stressful, that matters more than any plan — it’s a good thing to mention to your doctor.' ] },
    { title: 'When tired doesn’t match your sleep', minutes: 2, body: [
      'Your nights look fine, but you’ve rated your energy low on most days for two weeks. Some common causes are worth checking with a doctor:',
      'Iron, if periods are heavy. Thyroid. Vitamin B12, if you take metformin. Low mood, which often shows up as tiredness first.',
      'Mira has added this to your summary for Thursday. It isn’t a diagnosis — just a pattern worth a conversation.' ] },
  ];

  window.MIRA = {
    TODAY, user: { name: 'Audrey', age: 23, profile: 'PCOS diagnosed 2025', since: 'Apple Health from Nov 2025 · ring since June' },
    cycles, current, nights, ahead, experiments, summary, ring, lessons,
  };
})();
