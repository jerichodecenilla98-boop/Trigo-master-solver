const PRECISION_DEFAULT = 10;

const moduleDefs = [
  { id: 'm1', title: 'Module 1: Angle Converter & Manager' },
  { id: 'm2', title: 'Module 2: Unit Circle & Terminal Point Locator' },
  { id: 'm3', title: 'Module 3: Six Trig Functions Evaluator' },
  { id: 'm4', title: 'Module 4: Find the Other Five Solver' },
  { id: 'm5', title: 'Module 5: Right Triangle Solver' },
  { id: 'm6', title: 'Module 6: Applied Trigonometry Calculator' }
];

const tabs = document.getElementById('tabs');
const modules = document.getElementById('modules');

moduleDefs.forEach((m, i) => {
  const btn = document.createElement('button');
  btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
  btn.textContent = m.title;
  btn.dataset.target = m.id;
  btn.onclick = () => activateTab(m.id);
  tabs.appendChild(btn);

  const sec = document.createElement('section');
  sec.id = m.id;
  sec.className = 'card module' + (i === 0 ? ' active' : '');
  sec.innerHTML = moduleTemplate(m.id);
  modules.appendChild(sec);
});

function activateTab(id) {
  [...document.querySelectorAll('.tab-btn')].forEach((b) => {
    b.classList.toggle('active', b.dataset.target === id);
  });
  [...document.querySelectorAll('.module')].forEach((m) => m.classList.toggle('active', m.id === id));
}

function moduleTemplate(id) {
  if (id === 'm1') return `
    <div class="grid">
      <div>
        <h3>Angle Input</h3>
        <input id="a-input" placeholder="Examples: -955deg, 2.72 rad, 25°31'15\" , (2/7)pi" />
        <div class="row">
          <label>Precision</label><input id="a-prec" type="number" value="10" min="2" max="20" style="max-width:90px" />
          <button id="a-solve">Convert & Analyze</button>
        </div>
        <pre id="a-out" class="output"></pre>
      </div>
    </div>`;

  if (id === 'm2') return `
    <h3>Terminal Point from Arc Length / Angle</h3>
    <div class="row">
      <input id="u-input" placeholder="Arc length or angle: e.g. -7pi/6 rad, 240deg, 3.5" />
      <select id="u-mode"><option value="rad">Treat plain numbers as radians</option><option value="deg">Treat plain numbers as degrees</option></select>
      <button id="u-solve">Locate Point</button>
    </div>
    <pre id="u-out" class="output"></pre>
    <canvas id="u-canvas" width="420" height="420"></canvas>`;

  if (id === 'm3') return `
    <div class="grid">
      <div>
        <h3>From Angle</h3>
        <input id="t-angle" placeholder="e.g. 5pi/4, -120deg, 225" />
        <select id="t-mode"><option value="rad">Default plain number = rad</option><option value="deg">Default plain number = deg</option></select>
        <button id="t-eval-angle">Evaluate 6 Functions</button>
      </div>
      <div>
        <h3>From Point P(x,y)</h3>
        <input id="t-x" type="number" placeholder="x" />
        <input id="t-y" type="number" placeholder="y" />
        <button id="t-eval-point">Evaluate from Point</button>
      </div>
    </div>
    <pre id="t-out" class="output"></pre>`;

  if (id === 'm4') return `
    <div class="row">
      <select id="f-known-type"><option>sin</option><option>cos</option><option>tan</option><option>csc</option><option>sec</option><option>cot</option></select>
      <input id="f-known-value" placeholder="Known value (fraction ok): e.g. -15/8" />
      <select id="f-quadrant"><option value="1">Quadrant I</option><option value="2">Quadrant II</option><option value="3">Quadrant III</option><option value="4">Quadrant IV</option></select>
      <button id="f-solve">Find Other Five</button>
    </div>
    <pre id="f-out" class="output"></pre>`;

  if (id === 'm5') return `
    <p class="hint">Provide either: (a,b,c) with any 2 sides, or one side + angle A.</p>
    <div class="row">
      <input id="rt-a" placeholder="Side a (opposite A)" />
      <input id="rt-b" placeholder="Side b (adjacent A)" />
      <input id="rt-c" placeholder="Hypotenuse c" />
      <input id="rt-A" placeholder="Angle A (deg / DMS)" />
      <button id="rt-solve">Solve Triangle</button>
    </div>
    <pre id="rt-out" class="output"></pre>`;

  return `
    <div class="grid">
      <section>
        <h3>Arc Length & Sector Area</h3>
        <div class="row"><input id="ap-r" placeholder="radius r" /><input id="ap-ang" placeholder="angle (rad/deg)" /><button id="ap-solve">Compute</button></div>
        <pre id="ap-out" class="output"></pre>
      </section>
      <section>
        <h3>Elevation/Depression</h3>
        <div class="row"><input id="el-angle" placeholder="angle" /><input id="el-adj" placeholder="adjacent distance" /><input id="el-opp" placeholder="opposite height" /><button id="el-solve">Solve</button></div>
        <pre id="el-out" class="output"></pre>
      </section>
      <section>
        <h3>Course & Bearing</h3>
        <p class="hint">Bearing examples: N40W, N70°40'E. Course can be azimuth degrees.</p>
        <div class="row"><input id="br-input" placeholder="Bearing to convert" /><button id="br-convert">Convert Bearing ⇄ Azimuth</button></div>
        <div class="row"><input id="nav-c1" placeholder="Leg1 course (deg azimuth)" /><input id="nav-v1" placeholder="Leg1 speed" /><input id="nav-t1" placeholder="Leg1 hours" /></div>
        <div class="row"><input id="nav-c2" placeholder="Leg2 course (deg azimuth)" /><input id="nav-v2" placeholder="Leg2 speed" /><input id="nav-t2" placeholder="Leg2 hours" /><button id="nav-solve">Solve 2-Leg Route</button></div>
        <pre id="nav-out" class="output"></pre>
      </section>
    </div>`;
}

function n(v, p = PRECISION_DEFAULT) {
  return Number(v).toFixed(p).replace(/\.?0+$/, '');
}
function toDeg(rad) { return rad * 180 / Math.PI; }
function toRad(deg) { return deg * Math.PI / 180; }
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }

function parseDMS(text) {
  const r = text.match(/(-?\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)?\s*'?\s*(\d+(?:\.\d+)?)?\s*"?/);
  if (!r) return null;
  const sign = Number(r[1]) < 0 ? -1 : 1;
  const d = Math.abs(Number(r[1]));
  const m = Number(r[2] || 0);
  const s = Number(r[3] || 0);
  return sign * (d + m / 60 + s / 3600);
}

function parseAngle(text, defaultMode = 'rad') {
  let t = String(text).trim().toLowerCase().replace(/\s+/g, '');
  const dms = parseDMS(t);
  if (dms !== null) return { rad: toRad(dms), deg: dms };

  if (t.includes('deg') || t.includes('°')) {
    t = t.replace('deg', '').replace('°', '');
    const deg = Number(math.evaluate(t));
    return { rad: toRad(deg), deg };
  }
  if (t.includes('rad')) t = t.replace('rad', '');
  t = t.replace(/π/g, 'pi');
  const raw = Number(math.evaluate(t));
  if (defaultMode === 'deg' && !/pi/.test(t)) {
    return { deg: raw, rad: toRad(raw) };
  }
  return { rad: raw, deg: toDeg(raw) };
}

function degToDMS(deg) {
  const sign = deg < 0 ? '-' : '';
  let x = Math.abs(deg);
  const d = Math.floor(x);
  x = (x - d) * 60;
  const m = Math.floor(x);
  const s = (x - m) * 60;
  return `${sign}${d}° ${m}' ${n(s, 4)}"`;
}

function normalizeDeg(deg) { return ((deg % 360) + 360) % 360; }

function quadrant(deg) {
  const a = normalizeDeg(deg);
  if (a === 0 || a === 90 || a === 180 || a === 270) return 'On axis';
  if (a < 90) return 'Quadrant I';
  if (a < 180) return 'Quadrant II';
  if (a < 270) return 'Quadrant III';
  return 'Quadrant IV';
}

function referenceAngleDeg(deg) {
  const a = normalizeDeg(deg);
  if (a <= 90) return a;
  if (a <= 180) return 180 - a;
  if (a <= 270) return a - 180;
  return 360 - a;
}

function specialTrigExact(deg) {
  const ref = referenceAngleDeg(deg);
  const q = quadrant(deg);
  const signs = {
    sin: ['Quadrant I', 'Quadrant II'].includes(q) ? 1 : -1,
    cos: ['Quadrant I', 'Quadrant IV'].includes(q) ? 1 : -1
  };
  signs.tan = signs.sin * signs.cos;
  const table = {
    0: { sin: '0', cos: '1', tan: '0' },
    30: { sin: '1/2', cos: '√3/2', tan: '√3/3' },
    45: { sin: '√2/2', cos: '√2/2', tan: '1' },
    60: { sin: '√3/2', cos: '1/2', tan: '√3' },
    90: { sin: '1', cos: '0', tan: 'undefined' }
  };
  const base = table[Math.round(ref)];
  if (!base || Math.abs(ref - Math.round(ref)) > 1e-10) return null;
  const applySign = (v, s) => (v === '0' || v === 'undefined' ? v : (s < 0 ? `-${v}` : v));
  return {
    sin: applySign(base.sin, signs.sin),
    cos: applySign(base.cos, signs.cos),
    tan: base.tan === 'undefined' ? 'undefined' : applySign(base.tan, signs.tan)
  };
}

function reciprocal(v) {
  if (v === '0') return 'undefined';
  if (v === 'undefined') return '0';
  return `1/(${v})`;
}

function formatTrigSet(rad) {
  const deg = toDeg(rad);
  const ex = specialTrigExact(deg);
  const sinV = Math.sin(rad), cosV = Math.cos(rad), tanV = Math.tan(rad);
  const safe = (x) => Math.abs(x) < 1e-12 ? 0 : x;
  const data = {
    sin: ex?.sin ?? n(safe(sinV)),
    cos: ex?.cos ?? n(safe(cosV)),
    tan: ex?.tan ?? (Math.abs(cosV) < 1e-12 ? 'undefined' : n(safe(tanV)))
  };
  data.csc = reciprocal(data.sin);
  data.sec = reciprocal(data.cos);
  data.cot = reciprocal(data.tan);
  return data;
}

function simplifyRoot(radicand) {
  const n = Math.round(radicand);
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    const sq = k * k;
    if (n % sq === 0) {
      const rem = n / sq;
      return rem === 1 ? `${k}` : `${k}√${rem}`;
    }
  }
  return `√${n}`;
}

function attachEvents() {
  document.getElementById('a-solve').onclick = () => {
    const inp = document.getElementById('a-input').value;
    const p = Number(document.getElementById('a-prec').value || 10);
    const a = parseAngle(inp, 'deg');
    const deg = a.deg, rad = a.rad;
    const cotDeg = normalizeDeg(deg);
    const num = Math.round(deg), den = 180;
    const g = gcd(num, den);
    const piForm = `${num / g}/${den / g}π`;
    document.getElementById('a-out').textContent =
`Decimal Degrees: ${n(deg, p)}°\nDMS: ${degToDMS(deg)}\nRadians (decimal): ${n(rad, p)}\nRadians (π multiple approx from degree integer): ${piForm}\nQuadrant: ${quadrant(deg)}\nReference angle: ${n(referenceAngleDeg(deg), p)}° (${n(toRad(referenceAngleDeg(deg)), p)} rad)\nSmallest positive coterminal angle: ${n(cotDeg, p)}° (${n(toRad(cotDeg), p)} rad)`;
  };

  document.getElementById('u-solve').onclick = () => {
    const inp = document.getElementById('u-input').value;
    const mode = document.getElementById('u-mode').value;
    const ang = parseAngle(inp, mode);
    const rad = ang.rad;
    const x = Math.cos(rad), y = Math.sin(rad);
    document.getElementById('u-out').textContent = `Terminal point: (${n(x, 10)}, ${n(y, 10)})\nQuadrant: ${quadrant(toDeg(rad))}`;
    drawUnitCircle(rad);
  };

  document.getElementById('t-eval-angle').onclick = () => {
    const ang = parseAngle(document.getElementById('t-angle').value, document.getElementById('t-mode').value);
    const d = formatTrigSet(ang.rad);
    document.getElementById('t-out').textContent = Object.entries(d).map(([k, v]) => `${k}θ = ${v}`).join('\n');
  };

  document.getElementById('t-eval-point').onclick = () => {
    const x = Number(document.getElementById('t-x').value), y = Number(document.getElementById('t-y').value);
    const r = Math.hypot(x, y);
    if (!r) return document.getElementById('t-out').textContent = 'Point cannot be origin.';
    const sin = y / r, cos = x / r, tan = x === 0 ? NaN : y / x;
    const print = (v) => Number.isFinite(v) ? n(v, 10) : 'undefined';
    document.getElementById('t-out').textContent = `r = ${n(r, 10)}\nsin = ${print(sin)}\ncos = ${print(cos)}\ntan = ${print(tan)}\ncsc = ${print(1 / sin)}\nsec = ${print(1 / cos)}\ncot = ${print(1 / tan)}`;
  };

  document.getElementById('f-solve').onclick = () => {
    const type = document.getElementById('f-known-type').value;
    const q = Number(document.getElementById('f-quadrant').value);
    const v = Number(math.evaluate(document.getElementById('f-known-value').value));
    const signs = { 1: [1, 1], 2: [1, -1], 3: [-1, -1], 4: [-1, 1] }[q];
    let x = 0, y = 0, r = 0;

    if (type === 'sin' || type === 'csc') {
      const s = type === 'sin' ? v : 1 / v;
      r = Math.abs(1 / s); y = s * r; x = Math.sqrt(Math.max(0, r * r - y * y));
    } else if (type === 'cos' || type === 'sec') {
      const c = type === 'cos' ? v : 1 / v;
      r = Math.abs(1 / c); x = c * r; y = Math.sqrt(Math.max(0, r * r - x * x));
    } else {
      const t = type === 'tan' ? v : 1 / v;
      x = 1; y = t; r = Math.sqrt(x * x + y * y);
    }
    x = Math.abs(x) * signs[1];
    y = Math.abs(y) * signs[0];
    const funcs = {
      sin: `${n(y, 10)}/${n(r, 10)}`,
      cos: `${n(x, 10)}/${n(r, 10)}`,
      tan: x === 0 ? 'undefined' : `${n(y, 10)}/${n(x, 10)}`,
      csc: y === 0 ? 'undefined' : `${n(r, 10)}/${n(y, 10)}`,
      sec: x === 0 ? 'undefined' : `${n(r, 10)}/${n(x, 10)}`,
      cot: y === 0 ? 'undefined' : `${n(x, 10)}/${n(y, 10)}`
    };
    const steps = [
      `Given ${type}θ = ${v} in Quadrant ${q}.`,
      `Assign triangle sides consistent with the ratio and quadrant signs.`,
      `Use r² = x² + y² to compute missing side.`,
      `Compute remaining trig ratios from x, y, r.`
    ];
    delete funcs[type];
    document.getElementById('f-out').textContent = `${steps.join('\n')}\n\nOther five:\n${Object.entries(funcs).map(([k, vv]) => `${k}θ = ${vv}`).join('\n')}`;
  };

  document.getElementById('rt-solve').onclick = () => {
    const a = parseMaybe(document.getElementById('rt-a').value);
    const b = parseMaybe(document.getElementById('rt-b').value);
    const c = parseMaybe(document.getElementById('rt-c').value);
    const Ainp = document.getElementById('rt-A').value.trim();
    const hasAngle = !!Ainp;
    let A = hasAngle ? parseAngle(Ainp, 'deg').deg : null;
    let aa = a, bb = b, cc = c;
    const steps = [];

    if ([aa, bb, cc].filter((x) => x !== null).length >= 2) {
      if (cc === null) { cc = Math.hypot(aa, bb); steps.push('c = √(a²+b²)'); }
      if (aa === null) { aa = Math.sqrt(cc * cc - bb * bb); steps.push('a = √(c²-b²)'); }
      if (bb === null) { bb = Math.sqrt(cc * cc - aa * aa); steps.push('b = √(c²-a²)'); }
      A = toDeg(Math.asin(aa / cc));
    } else if (hasAngle && [aa, bb, cc].filter((x) => x !== null).length === 1) {
      const rA = toRad(A);
      if (aa !== null) { cc = aa / Math.sin(rA); bb = aa / Math.tan(rA); steps.push('Using sin and tan with side a'); }
      if (bb !== null) { cc = bb / Math.cos(rA); aa = bb * Math.tan(rA); steps.push('Using cos and tan with side b'); }
      if (cc !== null) { aa = cc * Math.sin(rA); bb = cc * Math.cos(rA); steps.push('Using sin and cos with side c'); }
    } else {
      return document.getElementById('rt-out').textContent = 'Need two sides OR one side + angle A.';
    }
    const B = 90 - A;
    document.getElementById('rt-out').textContent = `${steps.join('\n')}\n\na=${n(aa, 10)}\nb=${n(bb, 10)}\nc=${n(cc, 10)}\nA=${n(A, 10)}°\nB=${n(B, 10)}°\nC=90°`;
  };

  document.getElementById('ap-solve').onclick = () => {
    const r = Number(math.evaluate(document.getElementById('ap-r').value));
    const t = parseAngle(document.getElementById('ap-ang').value, 'rad').rad;
    const s = r * t;
    const K = 0.5 * r * r * t;
    document.getElementById('ap-out').textContent = `Arc length s = r·θ = ${n(s, 10)}\nSector area K = 1/2 r²θ = ${n(K, 10)}`;
  };

  document.getElementById('el-solve').onclick = () => {
    let ang = document.getElementById('el-angle').value.trim();
    let adj = parseMaybe(document.getElementById('el-adj').value);
    let opp = parseMaybe(document.getElementById('el-opp').value);
    const steps = [];
    if (ang && adj !== null && opp === null) { opp = adj * Math.tan(parseAngle(ang, 'deg').rad); steps.push('opp = adj·tan(angle)'); }
    else if (ang && opp !== null && adj === null) { adj = opp / Math.tan(parseAngle(ang, 'deg').rad); steps.push('adj = opp/tan(angle)'); }
    else if (!ang && adj !== null && opp !== null) { ang = `${n(toDeg(Math.atan2(opp, adj)), 10)}°`; steps.push('angle = arctan(opp/adj)'); }
    else return document.getElementById('el-out').textContent = 'Provide any two of: angle, adjacent, opposite.';
    document.getElementById('el-out').textContent = `${steps.join('\n')}\nangle = ${ang}\nadjacent = ${n(adj, 10)}\nopposite = ${n(opp, 10)}`;
  };

  document.getElementById('br-convert').onclick = () => {
    const txt = document.getElementById('br-input').value.trim();
    const az = parseBearingToAzimuth(txt);
    if (Number.isFinite(az)) {
      document.getElementById('nav-out').textContent = `Azimuth: ${n(az, 6)}°\nBack to bearing: ${azimuthToBearing(az)}`;
    } else {
      const d = Number(math.evaluate(txt));
      document.getElementById('nav-out').textContent = `Bearing notation: ${azimuthToBearing(d)}`;
    }
  };

  document.getElementById('nav-solve').onclick = () => {
    const c1 = Number(math.evaluate(document.getElementById('nav-c1').value));
    const c2 = Number(math.evaluate(document.getElementById('nav-c2').value));
    const d1 = Number(math.evaluate(document.getElementById('nav-v1').value)) * Number(math.evaluate(document.getElementById('nav-t1').value));
    const d2 = Number(math.evaluate(document.getElementById('nav-v2').value)) * Number(math.evaluate(document.getElementById('nav-t2').value));
    const v1 = azToVec(c1, d1), v2 = azToVec(c2, d2);
    const x = v1.x + v2.x, y = v1.y + v2.y;
    const dist = Math.hypot(x, y);
    const az = (toDeg(Math.atan2(x, y)) + 360) % 360;
    document.getElementById('nav-out').textContent = `Leg1 distance=${n(d1, 6)}, Leg2 distance=${n(d2, 6)}\nResultant displacement: E=${n(x, 6)}, N=${n(y, 6)}\nDistance from port=${n(dist, 6)}\nBearing from port=${azimuthToBearing(az)} (azimuth ${n(az, 6)}°)`;
  };

  document.getElementById('nl-solve').onclick = quickSolve;
}

function parseBearingToAzimuth(s) {
  const t = s.toUpperCase().replace(/\s+/g, '');
  const m = t.match(/^([NS])(.+)([EW])$/);
  if (!m) return NaN;
  const a = parseAngle(m[2].replace(/'/g, ' ').replace(/"/g, ''), 'deg').deg;
  const NS = m[1], EW = m[3];
  if (NS === 'N' && EW === 'E') return a;
  if (NS === 'N' && EW === 'W') return 360 - a;
  if (NS === 'S' && EW === 'E') return 180 - a;
  return 180 + a;
}

function azimuthToBearing(az) {
  const a = normalizeDeg(az);
  if (a <= 90) return `N${n(a, 6)}°E`;
  if (a <= 180) return `S${n(180 - a, 6)}°E`;
  if (a <= 270) return `S${n(a - 180, 6)}°W`;
  return `N${n(360 - a, 6)}°W`;
}

function azToVec(az, dist) {
  const r = toRad(az);
  return { x: dist * Math.sin(r), y: dist * Math.cos(r) };
}

function quickSolve() {
  const q = document.getElementById('nl-input').value.trim().toLowerCase();
  let out = 'Could not parse. Try a simpler command.';
  try {
    if (q.includes('convert') && q.includes('coterminal')) {
      const anglePart = q.match(/convert\s+(.+?)\s+to/i)?.[1] || q.replace('convert', '');
      const a = parseAngle(anglePart, 'deg');
      out = `Radians: ${n(a.rad, 10)}\nSmallest positive coterminal: ${n(normalizeDeg(a.deg), 10)}°`;
    } else if (q.includes('find tan(') || q.includes('find sin(') || q.includes('find cos(')) {
      const m = q.match(/(sin|cos|tan)\(([^)]+)\)/);
      if (m) {
        const fn = m[1];
        const a = parseAngle(m[2], 'rad');
        const vals = formatTrigSet(a.rad);
        out = `${fn}(${m[2]}) = ${vals[fn]}`;
      }
    } else if (q.includes('sin') && q.includes('find the other five')) {
      out = 'Use Module 4 for exact “other five” with quadrant information.';
    }
  } catch (e) {
    out = `Parse error: ${e.message}`;
  }
  document.getElementById('nl-output').textContent = out;
}

function parseMaybe(v) {
  const t = String(v || '').trim();
  if (!t) return null;
  return Number(math.evaluate(t));
}

function drawUnitCircle(rad) {
  const c = document.getElementById('u-canvas');
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, R = 160;

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#555';
  ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(w - 20, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, h - 20); ctx.stroke();

  ctx.strokeStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  const x = Math.cos(rad), y = Math.sin(rad);
  const px = cx + x * R, py = cy - y * R;
  ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#111';
  ctx.fillText('(1,0)', cx + R - 20, cy - 8);
  ctx.fillText(`P(${n(x, 4)}, ${n(y, 4)})`, px + 8, py - 8);
}

attachEvents();
drawUnitCircle(0);
