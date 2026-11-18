import { tr, setLang, detectLang, LANGS } from './i18n.js';

// Boîtes de dialogue natives traduites
const prompt = (m, d) => window.prompt(tr(m), d == null ? d : tr(String(d)));
const confirm = (m) => window.confirm(tr(m));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const video = $('#video'), canvas = $('#canvas'), ctx = canvas.getContext('2d');
const once = (el, ev) => new Promise((r) => el.addEventListener(ev, r, { once: true }));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
let W = 1920, H = 1080;

/* =========================================================
   Stockage : IndexedDB (projets + vidéos), localStorage (réglages, modèles)
   ========================================================= */
const dbp = new Promise((res, rej) => {
  const r = indexedDB.open('sublime', 1);
  r.onupgradeneeded = () => { r.result.createObjectStore('projects', { keyPath: 'id' }); r.result.createObjectStore('files'); };
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
async function idb(store, mode, fn) {
  const d = await dbp;
  return new Promise((res, rej) => {
    const tx = d.transaction(store, mode), req = fn(tx.objectStore(store));
    tx.oncomplete = () => res(req?.result);
    tx.onerror = () => rej(tx.error);
  });
}
const db = {
  all: () => idb('projects', 'readonly', (s) => s.getAll()),
  get: (id) => idb('projects', 'readonly', (s) => s.get(id)),
  put: (p) => idb('projects', 'readwrite', (s) => s.put(p)),
  del: (id) => Promise.all([idb('projects', 'readwrite', (s) => s.delete(id)), idb('files', 'readwrite', (s) => s.delete(id))]),
  file: (id) => idb('files', 'readonly', (s) => s.get(id)),
  putFile: (id, blob) => idb('files', 'readwrite', (s) => s.put(blob, id)),
  clear: () => Promise.all([idb('projects', 'readwrite', (s) => s.clear()), idb('files', 'readwrite', (s) => s.clear())]),
};
const ls = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage bloqué */ } },
};

// Modèles Whisper « _timestamped » : ils donnent le timing de chaque mot
const MODELS = [
  { id: 'onnx-community/whisper-large-v3-turbo_timestamped', label: 'Ultra précis · ~1 Go', gpu: true },
  { id: 'onnx-community/whisper-small_timestamped', label: 'Précis · ~250 Mo' },
  { id: 'onnx-community/whisper-base_timestamped', label: 'Rapide · ~80 Mo' },
];
const HAS_GPU = !!navigator.gpu;
const DEFAULT_SETTINGS = { lang: 'french', model: MODELS[HAS_GPU ? 0 : 1].id, wps: 4, aspect: 'auto', autosave: true, bitrate: 12, fps: 30, theme: 'dark', glossary: '', ui: detectLang() };
const settings = { ...DEFAULT_SETTINGS, ...ls.get('sublime:settings', {}) };
if (!MODELS.some((m) => m.id === settings.model)) settings.model = DEFAULT_SETTINGS.model; // anciens modèles moins précis
$$('.model-sel').forEach((s) => (s.innerHTML = MODELS.map((m) => `<option value="${m.id}">${m.label}${m.gpu && !HAS_GPU ? ' (lent sans carte graphique)' : ''}</option>`).join('')));
const saveSettings = () => ls.set('sublime:settings', settings);
$('[data-set=ui]').innerHTML = Object.entries(LANGS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
$('#uiLang').innerHTML = Object.keys(LANGS).map((k) => `<option value="${k}">🌐 ${k.toUpperCase()}</option>`).join('');
$('#uiLang').value = settings.ui;
$('#uiLang').onchange = (e) => {
  settings.ui = e.target.value;
  saveSettings();
  setLang(settings.ui);
  if (!$('#v-settings').classList.contains('hidden')) renderSettings();
  if (!$('#v-stats').classList.contains('hidden')) renderStats();
};
setLang(settings.ui);
let myTemplates = ls.get('sublime:templates', []);

/* =========================================================
   Styles
   ========================================================= */
const BASE = { font: 'Montserrat', weight: 700, size: 72, upper: false, color: '#ffffff', hi: '#7c3aed', strokeColor: '#000000', stroke: 0, glow: false, shadow: true, bgOn: false, bgColor: '#7c3aed', bgOpacity: 0.7, pad: { t: 12, b: 12, l: 28, r: 28 }, mode: 'box', anim: 'pop', animDur: 150, y: 0.8, maxW: 86 };
const PRESETS = [
  { name: 'Violet', hi: '#7c3aed', mode: 'box', tile: { color: '#fff', box: '#7c3aed' } },
  { name: 'Classique', font: 'Inter', weight: 600, mode: 'none', anim: 'fade', bgOn: true, bgColor: '#000000', bgOpacity: 0.6, tile: { color: '#fff', bg: true } },
  { name: 'Hormozi', weight: 900, upper: true, size: 84, hi: '#ffd60a', stroke: 14, mode: 'color', tile: { color: '#ffd60a', stroke: true } },
  { name: 'Glace', font: 'Poppins', weight: 800, hi: '#22d3ee', glow: true, shadow: false, mode: 'color', anim: 'fade', tile: { color: '#22d3ee', glow: '#22d3ee' } },
  { name: 'Rose', weight: 900, upper: true, hi: '#ff3d8b', stroke: 12, mode: 'color', anim: 'reveal', tile: { color: '#ff3d8b', stroke: true } },
  { name: 'Toxic', font: 'Bebas Neue', weight: 400, upper: true, size: 110, hi: '#39ff88', glow: true, shadow: false, mode: 'color', tile: { color: '#39ff88', glow: '#39ff88' } },
  { name: 'Comic', font: 'Bangers', weight: 400, upper: true, size: 100, hi: '#ff9f1c', stroke: 18, mode: 'color', anim: 'slide', tile: { color: '#fff', stroke: true } },
  { name: 'Magenta', font: 'Poppins', weight: 700, hi: '#e040fb', mode: 'box', bgOn: true, bgColor: '#1a1025', bgOpacity: 0.8, tile: { color: '#e040fb' } },
];
const presetStyle = (i) => { const { name, tile, ...p } = PRESETS[i]; return structuredClone({ ...BASE, ...p }); };

const state = { id: null, segs: [], style: presetStyle(0), preset: 0, wps: settings.wps, aspect: '16:9', sel: -1, active: -1, zoom: 1, markers: [], showSubs: true, showVideo: true, transcribed: false, created: 0 };
let file = null, recording = false, clipboard = null;

/* =========================================================
   Petits outils d'interface
   ========================================================= */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 2400);
}
function openMenu(anchor, items) {
  const m = $('#menu'), r = anchor.getBoundingClientRect();
  m.innerHTML = '';
  for (const it of items) {
    const b = document.createElement('button');
    b.textContent = it.label;
    if (it.danger) b.className = 'danger';
    b.onclick = () => { m.classList.add('hidden'); it.fn(); };
    m.append(b);
  }
  m.classList.remove('hidden');
  m.style.top = `${Math.min(r.bottom + 6, innerHeight - m.offsetHeight - 8)}px`;
  m.style.left = `${Math.max(8, Math.min(r.right - m.offsetWidth, innerWidth - m.offsetWidth - 8))}px`;
}
addEventListener('pointerdown', (e) => { if (!e.target.closest('#menu')) $('#menu').classList.add('hidden'); }, true);
const fill = (r) => r.style.setProperty('--p', `${((r.value - r.min) / (r.max - r.min)) * 100}%`);
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(3).padStart(6, '0')}`;
const ago = (ts) => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'à l\'instant';
  if (m < 60) return `il y a ${m} min`;
  if (m < 1440) return `il y a ${Math.floor(m / 60)} h`;
  return `il y a ${Math.floor(m / 1440)} j`;
};

/* =========================================================
   Navigation entre les pages
   ========================================================= */
const RENDER = { projects: renderProjects, templates: renderTemplates, stats: renderStats, settings: renderSettings };
function go(view) {
  $$('.view').forEach((v) => v.classList.toggle('hidden', v.id !== `v-${view}`));
  $$('.side [data-go]').forEach((b) => b.classList.toggle('on', b.dataset.go === view));
  if (view !== 'editor') video.pause();
  RENDER[view]?.();
  if (view === 'editor') requestAnimationFrame(renderTimeline);
}
document.addEventListener('click', (e) => {
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); go(g.dataset.go); }
});

function applyTheme() {
  document.documentElement.dataset.theme = settings.theme;
  $('#themeUse').setAttribute('href', settings.theme === 'dark' ? '#i-moon' : '#i-sun');
}
$('#btnTheme').onclick = () => { settings.theme = settings.theme === 'dark' ? 'light' : 'dark'; saveSettings(); applyTheme(); renderSettings(); };
applyTheme();

/* =========================================================
   Projets : création, ouverture, sauvegarde
   ========================================================= */
async function newProject(f) {
  if (!f?.type.startsWith('video')) return toast('Ce fichier n\'est pas une vidéo');
  file = f;
  Object.assign(state, { id: crypto.randomUUID(), segs: [], markers: [], sel: -1, wps: settings.wps, transcribed: false, created: Date.now(), aspect: null });
  $('#projName').value = f.name.replace(/\.[^.]+$/, '');
  $('#lang').value = settings.lang; $('#model').value = settings.model; $('#lang').onchange();
  try { await db.putFile(state.id, f); } catch { toast('Vidéo trop lourde pour être sauvegardée, le projet reste ouvert'); }
  openVideo();
  go('editor');
}
async function openProject(id) {
  const p = await db.get(id), blob = await db.file(id);
  if (!p || !blob) return toast('Projet introuvable');
  file = blob;
  Object.assign(state, { id: p.id, segs: p.segs, markers: p.markers || [], style: { ...BASE, ...p.style }, preset: p.preset, wps: p.wps, aspect: p.aspect, transcribed: p.transcribed, created: p.created, sel: -1 });
  $('#projName').value = p.name;
  syncControls();
  openVideo();
  go('editor');
}
function openVideo() {
  video.src = URL.createObjectURL(file);
  video.muted = false;
}

let saveT;
function persist(now) {
  if (!state.id) return;
  if (!settings.autosave && !now) return;
  clearTimeout(saveT);
  saveT = setTimeout(async () => {
    const prev = await db.get(state.id);
    await db.put({
      id: state.id, name: $('#projName').value.trim() || 'Sans titre', created: state.created, updated: Date.now(),
      duration: video.duration || 0, thumb: prev?.thumb || state.thumb || '', aspect: state.aspect,
      segs: state.segs, markers: state.markers, style: state.style, preset: state.preset, wps: state.wps, transcribed: state.transcribed,
    }).catch(() => toast('Sauvegarde impossible'));
    if (now) toast('Projet enregistré');
  }, now ? 0 : 400);
}
$('#projName').onchange = () => persist();

$('#fileInput').onchange = (e) => newProject(e.target.files[0]);
$('[data-new]').onchange = (e) => newProject(e.target.files[0]);
addEventListener('dragover', (e) => { e.preventDefault(); $('#drop').classList.add('over'); });
addEventListener('dragleave', () => $('#drop').classList.remove('over'));
addEventListener('drop', (e) => {
  e.preventDefault();
  $('#drop').classList.remove('over');
  const f = e.dataTransfer.files[0];
  if (f?.name.toLowerCase().endsWith('.srt')) importSrt(f); else newProject(f);
});

video.addEventListener('loadedmetadata', () => {
  $('#drop').classList.add('hidden');
  canvas.classList.remove('hidden');
  $$('#btnTranscribe, #btnAdd, #btnExport, #btnPreview, #btnSync').forEach((b) => (b.disabled = false));
  const auto = video.videoHeight > video.videoWidth ? '9:16' : '16:9';
  setAspect(state.aspect || (settings.aspect === 'auto' ? auto : settings.aspect));
  $('#tDur').textContent = fmt(video.duration);
  $('#trForm').classList.toggle('hidden', state.transcribed);
  $('#trDone').classList.toggle('hidden', !state.transcribed);
  history.length = 0; hIdx = -1;
  commit();
  makeThumbs();
});

const SIZES = { '16:9': [1920, 1080], '9:16': [1080, 1920], '1:1': [1080, 1080], '4:5': [1080, 1350] };
function setAspect(a) {
  state.aspect = a;
  [W, H] = SIZES[a];
  canvas.width = W; canvas.height = H;
  $('#aspect').value = a;
}
$('#aspect').onchange = (e) => { setAspect(e.target.value); persist(); };

async function makeThumbs() {
  const v = document.createElement('video');
  v.src = video.src; v.muted = true;
  await once(v, 'loadeddata');
  const c = document.createElement('canvas'); c.width = 320; c.height = 180;
  const g = c.getContext('2d'), urls = [], n = 10;
  for (let i = 0; i < n; i++) {
    v.currentTime = ((i + 0.5) * v.duration) / n;
    await once(v, 'seeked');
    const s = Math.max(320 / v.videoWidth, 180 / v.videoHeight);
    g.drawImage(v, (320 - v.videoWidth * s) / 2, (180 - v.videoHeight * s) / 2, v.videoWidth * s, v.videoHeight * s);
    urls.push(c.toDataURL('image/jpeg', 0.7));
  }
  $('#strip').innerHTML = urls.map((u) => `<i style="background-image:url(${u})"></i>`).join('');
  state.thumb = urls[Math.floor(n / 3)];
  const p = state.id && (await db.get(state.id));
  if (p) { p.thumb = state.thumb; db.put(p); } else persist(true);
}

/* =========================================================
   Rendu des sous-titres (aperçu, export et vignettes de modèles)
   ========================================================= */
const ease = (x) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;
const hexA = (hex, a) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;

function drawCaption(g, st, seg, t, W, H) {
  const k = Math.min(W, H) / 1080, size = st.size * k, dur = st.animDur / 1000;
  g.font = `${st.weight} ${size}px "${st.font}"`;
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  g.lineJoin = 'round';
  const space = g.measureText(' ').width, maxW = (W * st.maxW) / 100;

  const lines = [[]];
  let lw = 0;
  for (const w of seg.words) {
    const txt = st.upper ? w.text.toUpperCase() : w.text;
    const item = { ...w, txt, w: g.measureText(txt).width };
    const cur = lines.at(-1), nw = cur.length ? lw + space + item.w : item.w;
    if (nw > maxW && cur.length) { lines.push([item]); lw = item.w; } else { cur.push(item); lw = nw; }
  }

  const lh = size * 1.25, enter = ease((t - seg.start) / dur);
  let y0 = H * st.y - ((lines.length - 1) * lh) / 2;
  if (st.anim === 'slide') y0 += (1 - enter) * size * 0.8;
  const segScale = st.anim === 'pop' ? 0.82 + 0.18 * enter : 1;
  g.save();
  g.globalAlpha = st.anim === 'fade' || st.anim === 'slide' ? enter : 1;
  // Le « pop » agrandit tout le bloc autour de son centre (pas chaque mot, sinon les espaces se creusent)
  g.translate(W / 2, H * st.y); g.scale(segScale, segScale); g.translate(-W / 2, -H * st.y);

  lines.forEach((line, i) => {
    const total = line.reduce((a, w) => a + w.w, 0) + space * (line.length - 1);
    const y = y0 + i * lh;
    let x = W / 2 - total / 2;
    if (st.bgOn && st.bgOpacity > 0) {
      const p = st.pad;
      g.fillStyle = hexA(st.bgColor, st.bgOpacity);
      g.beginPath(); g.roundRect(x - p.l * k, y - size / 2 - p.t * k, total + (p.l + p.r) * k, size + (p.t + p.b) * k, size * 0.22); g.fill();
    }
    for (const w of line) {
      const active = t >= w.start && t < w.end;
      if (st.anim !== 'reveal' || t >= w.start) {
        const p = Math.min(1, (t - w.start) / Math.max(dur * 0.8, 0.05));
        let sc = 1;
        if (active && st.anim === 'pop') sc *= 1 + (st.mode === 'box' ? 0.06 : 0.12) * Math.sin(p * Math.PI);
        if (st.anim === 'reveal' && p < 1) sc *= 0.55 + 0.45 * ease(p);
        g.save();
        g.translate(x + w.w / 2, y);
        g.scale(sc, sc);
        if (active && st.mode === 'box') {
          g.fillStyle = st.hi;
          g.beginPath(); g.roundRect(-w.w / 2 - size * 0.1, -lh / 2 + size * 0.1, w.w + size * 0.2, lh - size * 0.2, size * 0.14); g.fill();
        }
        if (st.glow) { g.shadowColor = active ? st.hi : hexA(st.hi, 0.6); g.shadowBlur = 36 * k; }
        else if (st.shadow) { g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 16 * k; g.shadowOffsetY = 6 * k; }
        if (st.stroke) {
          g.lineWidth = st.stroke * k; g.strokeStyle = st.strokeColor;
          g.strokeText(w.txt, -w.w / 2, 0);
          if (!st.glow) g.shadowColor = 'transparent';
        }
        g.fillStyle = active && st.mode === 'color' ? st.hi : st.color;
        g.fillText(w.txt, -w.w / 2, 0);
        g.restore();
      }
      x += w.w + space;
    }
  });
  g.restore();
}

function draw() {
  const t = video.currentTime;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  if (video.videoWidth && state.showVideo) {
    const s = Math.max(W / video.videoWidth, H / video.videoHeight);
    ctx.drawImage(video, (W - video.videoWidth * s) / 2, (H - video.videoHeight * s) / 2, video.videoWidth * s, video.videoHeight * s);
  }
  if (!state.showSubs) return;
  const seg = state.segs.find((s) => t >= s.start && t < s.end);
  if (seg) drawCaption(ctx, state.style, seg, t, W, H);
}

/* =========================================================
   Boucle principale
   ========================================================= */
const seekEl = $('#seek');
let seeking = false;
(function tick() {
  if (!$('#v-editor').classList.contains('hidden') || recording) {
    draw();
    const t = video.currentTime, d = video.duration || 0;
    $('#tCur').textContent = clock(t);
    if (d && !seeking) { seekEl.value = (t / d) * 1000; fill(seekEl); }
    if (d) {
      const x = 12 + (t / d) * (inner.clientWidth - 24);
      $('#playhead').style.left = `${x}px`;
      const sc = $('#tlScroll');
      if (!video.paused && (x > sc.scrollLeft + sc.clientWidth - 40 || x < sc.scrollLeft)) sc.scrollLeft = x - 60;
    }
    const a = state.segs.findIndex((s) => t >= s.start && t < s.end);
    if (a !== state.active) {
      $$('.seg.on, .block.on').forEach((el) => el.classList.remove('on'));
      if (a >= 0) {
        const li = $(`.seg[data-i="${a}"]`);
        li?.classList.add('on');
        if (!video.paused) li?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        $(`.block[data-i="${a}"]`)?.classList.add('on');
      }
      state.active = a;
    }
    if (recording) $('#exportBar').style.width = `${(t / (d || 1)) * 100}%`;
  }
  requestAnimationFrame(tick);
})();

/* =========================================================
   Lecture
   ========================================================= */
let ac, audioDest;
function ensureAudio() {
  if (ac) return ac.resume();
  ac = new AudioContext();
  const src = ac.createMediaElementSource(video);
  audioDest = ac.createMediaStreamDestination();
  src.connect(ac.destination);
  src.connect(audioDest);
}
function togglePlay() {
  if (!video.src) return;
  ensureAudio();
  video.paused ? video.play() : video.pause();
}
const seek = (t) => { if (video.duration) video.currentTime = Math.max(0, Math.min(video.duration - 0.01, t)); };
$('#btnPlay').onclick = togglePlay;
canvas.onclick = togglePlay;
video.onplay = video.onpause = () => $('#playUse').setAttribute('href', video.paused ? '#i-play' : '#i-pause');
seekEl.oninput = () => { seeking = true; fill(seekEl); seek((seekEl.value / 1000) * video.duration); };
seekEl.onchange = () => (seeking = false);
$('#btnPrev').onclick = () => { const t = video.currentTime - 0.25, s = [...state.segs].reverse().find((s) => s.start < t); seek(s ? s.start : 0); };
$('#btnNext').onclick = () => { const s = state.segs.find((s) => s.start > video.currentTime + 0.01); if (s) seek(s.start); };
$('#btnEnd').onclick = () => seek(video.duration);
$('#btnVol').onclick = () => { video.muted = !video.muted; $('#volUse').setAttribute('href', video.muted ? '#i-mute' : '#i-vol'); };
$('#btnFull').onclick = () => canvas.requestFullscreen?.();
$('#btnPreview').onclick = async () => { seek(0); await canvas.requestFullscreen?.(); ensureAudio(); video.play(); };

/* =========================================================
   Données des sous-titres
   ========================================================= */
const mkSeg = (words) => ({ start: words[0].start, end: words.at(-1).end, words });
const segText = (s) => s.words.map((w) => w.text).join(' ');

function regroup(words) {
  words = words.reduce((a, w) => { // ponctuation isolée (« ! » à la française) collée au mot précédent
    if (a.length && /^[!?:;»…]+$/.test(w.text)) a[a.length - 1] = { ...a.at(-1), text: `${a.at(-1).text} ${w.text}`, end: w.end };
    else a.push(w);
    return a;
  }, []);
  const segs = [];
  let cur = [];
  for (const w of words) {
    if (cur.length && (cur.length >= state.wps || w.start - cur.at(-1).end > 0.6 || /[.!?…]$/.test(cur.at(-1).text))) { segs.push(mkSeg(cur)); cur = []; }
    cur.push(w);
  }
  if (cur.length) segs.push(mkSeg(cur));
  segs.forEach((s, i) => { const n = segs[i + 1]; if (n && n.start - s.end < 0.4) s.end = n.start; });
  return segs;
}
function setText(seg, text) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  const step = (seg.end - seg.start) / (parts.length || 1);
  seg.words = parts.map((p, i) => ({ text: p, start: seg.start + i * step, end: seg.start + (i + 1) * step }));
}
function retime(seg, from, words) {
  const r = (seg.end - seg.start) / (from.end - from.start || 1);
  seg.words = words.map((w) => ({ ...w, start: seg.start + (w.start - from.start) * r, end: seg.start + (w.end - from.start) * r }));
}
function sortSegs() {
  const sel = state.segs[state.sel];
  state.segs.sort((a, b) => a.start - b.start);
  state.sel = state.segs.indexOf(sel);
}

/* Historique annuler / rétablir */
const history = [];
let hIdx = -1;
function commit() {
  history.splice(hIdx + 1);
  history.push(JSON.stringify({ segs: state.segs, markers: state.markers }));
  if (history.length > 150) history.shift();
  hIdx = history.length - 1;
  persist();
  renderAll();
}
function undoRedo(d) {
  const i = hIdx + d;
  if (i < 0 || i >= history.length) return;
  hIdx = i;
  Object.assign(state, JSON.parse(history[i]));
  state.sel = -1;
  persist();
  renderAll();
}
$('#btnUndo').onclick = () => undoRedo(-1);
$('#btnRedo').onclick = () => undoRedo(1);
$$('[data-act]').forEach((b) => (b.onclick = () => undoRedo(b.dataset.act === 'undo' ? -1 : 1)));

/* =========================================================
   Liste des sous-titres
   ========================================================= */
const parseT = (str) => { const [m, s] = str.trim().split(':'); return s === undefined ? +m : +m * 60 + +s; };
function renderAll() {
  $('#segList').innerHTML = state.segs.map((s, i) =>
    `<li class="seg${i === state.sel ? ' sel' : ''}" data-i="${i}">
      <button class="seg-p" aria-label="Lire cette ligne"><svg><use href="#i-play"/></svg></button>
      <div>
        <div class="seg-t"><span class="tin" contenteditable="plaintext-only" data-k="start">${fmt(s.start)}</span> – <span class="tin" contenteditable="plaintext-only" data-k="end">${fmt(s.end)}</span></div>
        <div class="seg-x" contenteditable="plaintext-only" spellcheck="true" lang="${({ french: 'fr', english: 'en', spanish: 'es', german: 'de', italian: 'it', portuguese: 'pt' })[lang.value] || 'fr'}">${esc(segText(s))}</div>
      </div>
      <button class="seg-m" aria-label="Options"><svg class="f"><use href="#i-dots"/></svg></button>
    </li>`).join('');
  renderTimeline();
  state.active = -2;
}
function select(i) {
  state.sel = i;
  $$('.seg.sel, .block.sel').forEach((el) => el.classList.remove('sel'));
  $(`.seg[data-i="${i}"]`)?.classList.add('sel');
  $(`.block[data-i="${i}"]`)?.classList.add('sel');
}

const list = $('#segList');
list.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.isContentEditable) { e.preventDefault(); e.target.blur(); } });
list.addEventListener('focusout', (e) => {
  const li = e.target.closest('.seg');
  if (!li) return;
  const s = state.segs[+li.dataset.i];
  if (e.target.matches('.seg-x')) {
    const txt = e.target.textContent.trim();
    if (txt === segText(s)) return;
    if (!txt) state.segs.splice(+li.dataset.i, 1); else setText(s, txt);
    return commit();
  }
  if (e.target.matches('.tin')) {
    const v = parseT(e.target.textContent), k = e.target.dataset.k;
    if (Number.isNaN(v) || Math.abs(v - s[k]) < 0.0005) return renderAll();
    const from = { start: s.start, end: s.end };
    s[k] = Math.max(0, v);
    if (s.end <= s.start + 0.05) s.end = s.start + 0.1;
    retime(s, from, s.words);
    sortSegs();
    commit();
  }
});
list.addEventListener('click', (e) => {
  const li = e.target.closest('.seg');
  if (!li) return;
  const i = +li.dataset.i;
  select(i);
  if (e.target.closest('.seg-p')) { seek(state.segs[i].start + 0.01); ensureAudio(); video.play(); return; }
  if (e.target.closest('.seg-m')) {
    return openMenu(e.target.closest('.seg-m'), [
      { label: 'Dupliquer', fn: () => { const c = structuredClone(state.segs[i]), d = c.end - c.start; c.start += d; c.end += d; c.words.forEach((w) => { w.start += d; w.end += d; }); state.segs.splice(i + 1, 0, c); sortSegs(); commit(); } },
      { label: 'Corriger un mot (dictionnaire)…', fn: () => { const w = (getSelection().toString().trim() || prompt('Quel mot est mal écrit ?', '') || '').trim(); if (w) addToGlossary(w); } },
      { label: 'Fusionner avec la suivante', fn: () => { const n = state.segs[i + 1]; if (!n) return toast('Pas de ligne suivante'); state.segs[i].words.push(...n.words); state.segs[i].end = n.end; state.segs.splice(i + 1, 1); commit(); } },
      { label: 'Supprimer', danger: true, fn: () => { state.segs.splice(i, 1); state.sel = -1; commit(); } },
    ]);
  }
  if (!e.target.isContentEditable) seek(state.segs[i].start + 0.01);
});
$('#btnAdd').onclick = () => {
  const t = video.currentTime, seg = { start: t, end: Math.min(t + 1.5, video.duration || t + 1.5), words: [] };
  setText(seg, tr('Nouveau sous-titre'));
  state.segs.push(seg);
  state.sel = state.segs.length - 1;
  sortSegs();
  commit();
  const el = $(`.seg[data-i="${state.sel}"] .seg-x`);
  el?.scrollIntoView({ block: 'nearest' });
  el?.focus();
  if (el) getSelection().selectAllChildren(el);
};

/* =========================================================
   Timeline
   ========================================================= */
const inner = $('#tlInner');
const pxPerSec = () => (inner.clientWidth - 24) / (video.duration || 1);
const timeAt = (clientX) => (clientX - inner.getBoundingClientRect().left - 12) / pxPerSec();

function renderTimeline() {
  inner.style.width = `${state.zoom * 100}%`;
  const d = video.duration || 0, pps = pxPerSec();
  $('#laneSubs').innerHTML = state.segs.map((s, i) =>
    `<div data-notr class="block${i === state.sel ? ' sel' : ''}${i === state.active ? ' on' : ''}" data-i="${i}" style="left:${12 + s.start * pps}px;width:${Math.max(4, (s.end - s.start) * pps - 3)}px">${esc(segText(s))}</div>`).join('');
  $('#strip').style.left = '12px';
  $('#strip').style.right = '12px';
  const step = [1, 2, 5, 10, 15, 30, 60, 120].find((x) => x * pps >= 90) || 300;
  let html = '';
  if (d) for (let t = 0; t <= d + 0.001; t += step / 4) {
    const maj = Math.abs(t / step - Math.round(t / step)) < 0.001;
    html += `<i class="tk${maj ? ' maj' : ''}" style="left:${12 + t * pps}px">${maj ? `<span>${clock(t)}</span>` : ''}</i>`;
  }
  $('#ruler').innerHTML = html;
  $('#markers').innerHTML = state.markers.map((m, i) => `<i class="marker" data-i="${i}" title="Double-clic pour supprimer" style="left:${12 + m * pps}px"></i>`).join('');
}
new ResizeObserver(() => renderTimeline()).observe($('#tlScroll'));

function scrub(e) {
  seek(timeAt(e.clientX));
  const mv = (ev) => seek(timeAt(ev.clientX));
  addEventListener('pointermove', mv);
  addEventListener('pointerup', () => removeEventListener('pointermove', mv), { once: true });
}
$('#ruler').onpointerdown = scrub;
$('#strip').parentElement.onpointerdown = scrub;
$('#markers').onclick = (e) => { const m = e.target.closest('.marker'); if (m) seek(state.markers[+m.dataset.i]); };
$('#markers').ondblclick = (e) => { const m = e.target.closest('.marker'); if (m) { state.markers.splice(+m.dataset.i, 1); commit(); } };

// Glisser un bloc : déplacer, ou étirer par les bords
$('#laneSubs').addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.block');
  if (!b) return scrub(e);
  const i = +b.dataset.i, s = state.segs[i], r = b.getBoundingClientRect();
  select(i);
  const mode = e.clientX - r.left < 8 ? 'l' : r.right - e.clientX < 8 ? 'r' : 'm';
  const from = { start: s.start, end: s.end }, words = structuredClone(s.words), x0 = e.clientX, pps = pxPerSec();
  let moved = false;
  b.setPointerCapture(e.pointerId);
  b.onpointermove = (ev) => {
    if (Math.abs(ev.clientX - x0) > 3) moved = true;
    if (!moved) return;
    const dt = (ev.clientX - x0) / pps;
    if (mode === 'm') { const d = Math.max(-from.start, dt); s.start = from.start + d; s.end = from.end + d; }
    if (mode === 'l') s.start = Math.max(0, Math.min(from.start + dt, s.end - 0.1));
    if (mode === 'r') s.end = Math.max(from.end + dt, s.start + 0.1);
    retime(s, from, words);
    b.style.left = `${12 + s.start * pps}px`;
    b.style.width = `${(s.end - s.start) * pps - 3}px`;
  };
  b.onpointerup = () => {
    b.onpointermove = b.onpointerup = null;
    if (moved) { sortSegs(); commit(); } else seek(s.start + 0.01);
  };
});

function splitAt() {
  const t = video.currentTime, i = state.segs.findIndex((s) => t > s.start + 0.05 && t < s.end - 0.05);
  if (i < 0) return toast('Place le curseur sur une ligne pour la scinder');
  const s = state.segs[i], a = s.words.filter((w) => (w.start + w.end) / 2 < t), b = s.words.filter((w) => (w.start + w.end) / 2 >= t);
  if (!a.length || !b.length) return toast('Il faut au moins un mot de chaque côté');
  state.segs.splice(i, 1, { start: s.start, end: t, words: a }, { start: t, end: s.end, words: b });
  commit();
}
function delSel() {
  if (state.sel < 0) return toast('Sélectionne une ligne');
  state.segs.splice(state.sel, 1);
  state.sel = -1;
  commit();
}
function cutSel() {
  if (state.sel < 0) return toast('Sélectionne une ligne');
  clipboard = structuredClone(state.segs[state.sel]);
  delSel();
  toast('Coupé. Ctrl+V pour coller au curseur');
}
function paste() {
  if (!clipboard) return;
  const c = structuredClone(clipboard), d = video.currentTime - c.start;
  c.start += d; c.end += d;
  c.words.forEach((w) => { w.start += d; w.end += d; });
  state.segs.push(c);
  state.sel = state.segs.length - 1;
  sortSegs();
  commit();
}
const addMarker = () => { state.markers.push(video.currentTime); commit(); };
$('#btnSplit').onclick = splitAt;
$('#btnDel').onclick = delSel;
$('#btnCut').onclick = cutSel;
$('#btnMarker').onclick = addMarker;

const zoomEl = $('#zoom');
function setZoom(z) {
  state.zoom = Math.max(1, Math.min(10, z));
  zoomEl.value = state.zoom;
  fill(zoomEl);
  $('#zoomSel').value = [1, 2, 4, 8].includes(state.zoom) ? state.zoom : '';
  renderTimeline();
}
zoomEl.oninput = () => setZoom(+zoomEl.value);
$('#zoomSel').onchange = (e) => setZoom(+e.target.value || 1);
$('#btnZIn').onclick = () => setZoom(state.zoom * 1.5);
$('#btnZOut').onclick = () => setZoom(state.zoom / 1.5);
$('#eyeSubs').onclick = (e) => { state.showSubs = !state.showSubs; e.currentTarget.classList.toggle('off', !state.showSubs); };
$('#eyeVid').onclick = (e) => { state.showVideo = !state.showVideo; e.currentTarget.classList.toggle('off', !state.showVideo); };

addEventListener('keydown', (e) => {
  const c = e.ctrlKey || e.metaKey;
  if (c && e.key.toLowerCase() === 's') { e.preventDefault(); return persist(true); }
  if (e.target.matches('input, textarea, select, [contenteditable]') || $('#v-editor').classList.contains('hidden')) return;
  const k = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  else if (c && k === 'z') { e.preventDefault(); undoRedo(e.shiftKey ? 1 : -1); }
  else if (c && k === 'y') { e.preventDefault(); undoRedo(1); }
  else if (c && k === 'x') cutSel();
  else if (c && k === 'v') paste();
  else if (e.key === 'Delete' || e.key === 'Backspace') delSel();
  else if (k === 's') splitAt();
  else if (k === 'm') addMarker();
  else if (e.key === 'ArrowLeft') seek(video.currentTime - (e.shiftKey ? 1 : 0.1));
  else if (e.key === 'ArrowRight') seek(video.currentTime + (e.shiftKey ? 1 : 0.1));
});

/* =========================================================
   Onglets
   ========================================================= */
function tabs(bar, paneSel) {
  bar.onclick = (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('button', bar).forEach((x) => x.classList.toggle('on', x === b));
    $$(paneSel).forEach((p) => p.classList.toggle('hidden', p.dataset.pane !== b.dataset.pane));
  };
}
tabs($('#subTabs'), '#v-editor .pane');
tabs($('#propTabs'), '.ppane');
$('#btnHelp').onclick = (e) => openMenu(e.currentTarget, [
  { label: 'Espace : lecture / pause', fn: () => {} },
  { label: 'S : scinder · M : marqueur', fn: () => {} },
  { label: 'Suppr : supprimer la ligne', fn: () => {} },
  { label: 'Ctrl+Z / Ctrl+Y : annuler / rétablir', fn: () => {} },
  { label: 'Ctrl+S : enregistrer', fn: () => {} },
]);

/* =========================================================
   Transcription IA
   ========================================================= */
const lang = $('#lang');
lang.onchange = () => { $('#flag').dataset.lang = lang.value; };
lang.value = settings.lang; $('#model').value = settings.model; lang.onchange();
$('#btnRedoTr').onclick = () => { $('#trDone').classList.add('hidden'); $('#trForm').classList.remove('hidden'); };

let worker;
$('#btnTranscribe').onclick = async () => {
  const btn = $('#btnTranscribe'), prog = $('#progress'), label = $('span', prog), bar = $('i', prog);
  btn.disabled = true;
  prog.classList.remove('hidden');
  label.textContent = 'Extraction de l\'audio…';
  bar.style.width = '0';
  const done = () => { btn.disabled = false; prog.classList.add('hidden'); };
  try {
    const actx = new AudioContext({ sampleRate: 16000 });
    const buf = await actx.decodeAudioData(await file.arrayBuffer());
    actx.close();
    const audio = buf.getChannelData(0).slice();
    worker ??= new Worker('worker.js', { type: 'module' });
    worker.onmessage = ({ data: m }) => {
      if (m.type === 'progress') { label.textContent = m.text; bar.style.width = `${m.value}%`; return; }
      done();
      if (m.type === 'error') return toast(`Erreur : ${m.text}`);
      let words = [];
      if (m.word) words = joinChunks(m.chunks);
      else for (const c of m.chunks) { const [s, e] = c.timestamp, seg = { start: s, end: e ?? s + 0.4, words: [] }; setText(seg, c.text); words.push(...seg.words); }
      if (!words.length) return toast('Aucune parole détectée');
      const fixed = applyGlossary(words);
      words = fixed.words;
      state.segs = regroup(words);
      if (fixed.n) toast(`${fixed.n} mot${fixed.n > 1 ? 's' : ''} corrigé${fixed.n > 1 ? 's' : ''} par ton dictionnaire`);
      state.sel = -1;
      state.transcribed = true;
      $('#trForm').classList.add('hidden');
      $('#trDone').classList.remove('hidden');
      commit();
    };
    worker.postMessage({ audio, model: $('#model').value, lang: lang.value }, [audio.buffer]);
  } catch (e) {
    done();
    toast(`Impossible de lire l'audio : ${e.message}`);
  }
};

/* =========================================================
   Orthographe : recollage des morceaux de mots + dictionnaire perso
   ========================================================= */
// Whisper découpe parfois un mot en morceaux (« aujourd' » + « hui », « l' » + « homme », « -t-il »).
// Un morceau sans espace devant, ou de la ponctuation, se recolle au mot précédent.
function joinChunks(chunks) {
  const words = [];
  for (const c of chunks) {
    const raw = c.text, t = raw.trim();
    if (!t) continue;
    const [s, e] = c.timestamp, end = e ?? s + 0.3;
    const prev = words.at(-1);
    const glue = prev && (!/^\s/.test(raw) || /^[,.…)\]%]/.test(t) || /['’]$/.test(prev.text) || /^-(t-)?(il|elle|on|ils|elles|je|tu|nous|vous|ce|là|ci|moi|toi|le|la|les)\b/i.test(t));
    if (glue) { prev.text += t; prev.end = end; }
    else if (prev && /^[!?;:»]+$/.test(t)) { prev.text += ` ${t}`; prev.end = end; } // « mot ! » à la française
    else words.push({ text: t, start: s, end });
  }
  return words;
}

// Comparaison « à l'oreille » : sans accents ni casse, sons proches fusionnés
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const phon = (s) => norm(s).replace(/ph/g, 'f').replace(/qu|ck|q|c(?=[aoukrlt])/g, 'k').replace(/y/g, 'i').replace(/h/g, '').replace(/(.)\1+/g, '$1');
function dist(a, b) { // Damerau-Levenshtein : une inversion de lettres compte pour 1
  const d = [...Array(a.length + 1)].map((_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1]));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
}
function parseGlossary() {
  return settings.glossary.split('\n').map((l) => {
    const [word, rest = ''] = l.split('=');
    return { word: word.trim(), variants: rest.split(',').map((v) => norm(v)).filter(Boolean) };
  }).filter((g) => g.word);
}
// Remplace les mots mal transcrits par la bonne orthographe du dictionnaire.
// 1) variantes listées après « = » (même sur plusieurs mots : « et si ») ; 2) mots qui sonnent pareil (≥ 4 lettres).
function applyGlossary(words) {
  const gl = parseGlossary();
  if (!gl.length) return { words, n: 0 };
  const out = [];
  let n = 0;
  for (let i = 0; i < words.length;) {
    let hit = null;
    for (const g of gl) {
      const gw = g.word.split(/\s+/).length;
      for (const len of [...new Set([gw, 2, 1])]) { // le mot du dictionnaire peut couvrir 1 à 2 mots transcrits
        if (i + len > words.length) continue;
        const span = words.slice(i, i + len), txt = span.map((w) => w.text).join(' ');
        const tail = txt.match(/[^\p{L}\p{N}]+$/u)?.[0] || ''; // garde la ponctuation finale
        const core = txt.slice(0, txt.length - tail.length);
        if (core === g.word) continue;
        const nc = norm(core), pc = phon(core), pg = phon(g.word);
        const exact = nc === norm(g.word) || g.variants.includes(nc);
        const fuzzy = len === gw && pg.length >= 4 && pc[0] === pg[0] && dist(pc, pg) <= (pg.length >= 8 ? 2 : 1);
        if (exact || fuzzy) { hit = { len, word: { text: g.word + tail, start: span[0].start, end: span.at(-1).end } }; break; }
      }
      if (hit) break;
    }
    if (hit) { out.push(hit.word); i += hit.len; n++; } else out.push(words[i++]);
  }
  return { words: out, n };
}
$('#btnGloss').onclick = () => {
  if (!parseGlossary().length) { toast('Ton dictionnaire est vide : ajoute des mots dans Paramètres'); return go('settings'); }
  const r = applyGlossary(state.segs.flatMap((s) => s.words));
  if (!r.n) return toast('Rien à corriger');
  state.segs = regroup(r.words);
  commit();
  toast(`${r.n} correction${r.n > 1 ? 's' : ''} appliquée${r.n > 1 ? 's' : ''}`);
};
function addToGlossary(wrong) {
  const good = prompt(`Bonne orthographe pour « ${wrong} » ?`, wrong);
  if (!good) return;
  settings.glossary = `${settings.glossary.trim()}\n${good}${norm(good) !== norm(wrong) ? ` = ${wrong}` : ''}`.trim();
  saveSettings();
  $('#btnGloss').click();
}

/* =========================================================
   Onglet Éditer : rechercher/remplacer, texte manuel, SRT
   ========================================================= */
$('#btnReplace').onclick = () => {
  const f = $('#findIn').value;
  if (!f) return toast('Écris le mot à chercher');
  const re = new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  let n = 0;
  for (const s of state.segs) for (const w of s.words) {
    const nt = w.text.replace(re, () => { n++; return $('#replIn').value; });
    w.text = nt;
  }
  state.segs.forEach((s) => (s.words = s.words.filter((w) => w.text.trim())));
  state.segs = state.segs.filter((s) => s.words.length);
  commit();
  toast(n ? `${n} remplacement${n > 1 ? 's' : ''}` : 'Aucun résultat');
};
$('#btnSync').onclick = () => {
  const parts = $('#script').value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return toast('Colle d\'abord ton texte');
  const step = video.duration / parts.length;
  state.segs = regroup(parts.map((p, i) => ({ text: p, start: i * step, end: (i + 1) * step })));
  commit();
  toast('Texte placé. Ajuste les blocs dans la timeline');
};
function importSrt(f) {
  if (!state.id) return toast('Ouvre d\'abord une vidéo');
  f.text().then((txt) => {
    const toS = (p) => { const m = p.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000 : NaN; };
    const segs = txt.replace(/\r/g, '').trim().split(/\n\s*\n/).map((b) => {
      const l = b.split('\n'), i = l.findIndex((x) => x.includes('-->'));
      if (i < 0) return null;
      const [a, c] = l[i].split('-->').map(toS);
      const seg = { start: a, end: c, words: [] };
      setText(seg, l.slice(i + 1).join(' ').replace(/<[^>]+>/g, ''));
      return seg;
    }).filter((s) => s && s.words.length && !Number.isNaN(s.start + s.end));
    if (!segs.length) return toast('Fichier .srt illisible');
    state.segs = segs;
    commit();
    toast(`${segs.length} sous-titres importés`);
  });
}
$('#srtInput').onchange = (e) => { if (e.target.files[0]) importSrt(e.target.files[0]); e.target.value = ''; };

/* =========================================================
   Panneau de style
   ========================================================= */
function tileHtml(p, i, cls = 'preset') {
  const t = p.tile, f = p.font || BASE.font, sh = [];
  if (t.stroke) sh.push('0 2px 0 #000', '0 0 3px #000', '0 0 2px #000');
  if (t.glow) sh.push(`0 0 14px ${t.glow}`);
  const box = t.box ? `background:${t.box};padding:2px 8px;border-radius:6px;` : t.bg ? 'background:rgba(0,0,0,.7);padding:2px 8px;border-radius:6px;' : '';
  return `<button class="${cls}" data-i="${i}" title="${p.name}"><span style="font-family:'${f}';font-weight:${p.weight || BASE.weight};color:${t.color};${box}text-shadow:${sh.join(',') || 'none'}">Aa</span></button>`;
}
$('#presets').innerHTML = PRESETS.map((p, i) => tileHtml(p, i)).join('');
$('#presets').onclick = (e) => { const b = e.target.closest('.preset'); if (b) applyStyle(presetStyle(+b.dataset.i), +b.dataset.i); };
function applyStyle(st, preset = -1) {
  state.style = structuredClone({ ...BASE, ...st });
  state.preset = preset;
  syncControls();
  persist();
}

let linked = true;
function syncControls() {
  const st = state.style;
  $$('.preset').forEach((b) => b.classList.toggle('on', +b.dataset.i === state.preset));
  const set = (id, v) => { $(id).value = v; };
  set('#font', st.font); set('#weight', st.weight);
  set('#size', st.size); $('#vSize').textContent = `${st.size} px`;
  set('#color', st.color); set('#hi', st.hi); set('#strokeColor', st.strokeColor);
  set('#stroke', st.stroke); $('#vStroke').textContent = `${st.stroke} px`;
  $('#shadow').checked = st.shadow;
  $('#bgOn').checked = st.bgOn;
  set('#bgColor', st.bgColor);
  set('#opacity', Math.round(st.bgOpacity * 100)); $('#vOpacity').textContent = `${Math.round(st.bgOpacity * 100)}%`;
  $$('.margins input').forEach((i) => (i.value = st.pad[i.dataset.m]));
  $('#btnLink').classList.toggle('on', linked);
  set('#animDur', st.animDur); $('#vAnimDur').textContent = `${st.animDur} ms`;
  set('#posY', Math.round(st.y * 100)); $('#vY').textContent = `${Math.round(st.y * 100)}%`;
  set('#maxW', st.maxW); $('#vMaxW').textContent = `${st.maxW}%`;
  set('#wps', state.wps); $('#vWps').textContent = state.wps;
  $('#upper').checked = st.upper;
  $$('.cards[data-k] button').forEach((b) => b.classList.toggle('on', st[b.parentElement.dataset.k] === b.dataset.v));
  $$('#v-editor input[type=range]').forEach(fill);
}
const bind = (sel, ev, fn) => $(sel).addEventListener(ev, (e) => { fn(e.target); state.preset = -1; syncControls(); persist(); });
bind('#font', 'change', (el) => (state.style.font = el.value));
bind('#weight', 'change', (el) => (state.style.weight = +el.value));
bind('#size', 'input', (el) => (state.style.size = +el.value));
bind('#color', 'input', (el) => (state.style.color = el.value));
bind('#hi', 'input', (el) => (state.style.hi = el.value));
bind('#strokeColor', 'input', (el) => { state.style.strokeColor = el.value; if (!state.style.stroke) state.style.stroke = 8; });
bind('#stroke', 'input', (el) => (state.style.stroke = +el.value));
bind('#shadow', 'change', (el) => (state.style.shadow = el.checked));
bind('#bgOn', 'change', (el) => (state.style.bgOn = el.checked));
bind('#bgColor', 'input', (el) => { state.style.bgColor = el.value; state.style.bgOn = true; });
bind('#opacity', 'input', (el) => (state.style.bgOpacity = el.value / 100));
bind('#animDur', 'input', (el) => (state.style.animDur = +el.value));
bind('#posY', 'input', (el) => (state.style.y = el.value / 100));
bind('#maxW', 'input', (el) => (state.style.maxW = +el.value));
bind('#upper', 'change', (el) => (state.style.upper = el.checked));
$$('.margins input').forEach((inp) => inp.addEventListener('input', () => {
  const v = Math.max(0, Math.min(200, +inp.value || 0)), p = state.style.pad;
  if (linked) { // lié : haut/bas ensemble, gauche/droite ensemble
    if ('tb'.includes(inp.dataset.m)) p.t = p.b = v; else p.l = p.r = v;
    $$('.margins input').forEach((i) => i !== inp && (i.value = p[i.dataset.m]));
  } else p[inp.dataset.m] = v;
  state.style.bgOn = true;
  $('#bgOn').checked = true;
  persist();
}));
$('#btnLink').onclick = () => { linked = !linked; syncControls(); };
$$('.cards[data-k]').forEach((c) => c.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  state.style[c.dataset.k] = b.dataset.v;
  state.preset = -1;
  syncControls(); persist();
}));
$('#posQuick').onclick = (e) => { const b = e.target.closest('button'); if (b) { state.style.y = +b.dataset.y; syncControls(); persist(); } };
bind('#wps', 'input', (el) => {
  state.wps = +el.value;
  const words = state.segs.flatMap((s) => s.words);
  if (words.length) { state.segs = regroup(words); commit(); }
});
syncControls();
for (const f of ['Montserrat', 'Poppins', 'Inter']) for (const w of [400, 500, 600, 700, 800, 900]) document.fonts.load(`${w} 40px "${f}"`);
document.fonts.load('400 40px "Bebas Neue"');
document.fonts.load('400 40px "Bangers"');

/* =========================================================
   Page Modèles
   ========================================================= */
const SAMPLE = { start: 0, end: 3, words: [{ text: 'Ton', start: 0, end: 0.5 }, { text: 'style', start: 0.5, end: 1.2 }, { text: 'ici', start: 1.2, end: 2 }] };
function previewUrl(st) {
  const c = document.createElement('canvas'); c.width = 640; c.height = 360;
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 640, 360);
  gr.addColorStop(0, '#2a1458'); gr.addColorStop(0.55, '#b4479a'); gr.addColorStop(1, '#f59e0b');
  g.fillStyle = gr; g.fillRect(0, 0, 640, 360);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, 640, 360);
  drawCaption(g, { ...st, size: st.size * 2.2, stroke: st.stroke * 2, y: 0.55, anim: st.anim === 'reveal' ? 'none' : st.anim }, SAMPLE, 1.0, 640, 360);
  return c.toDataURL('image/jpeg', 0.85);
}
function tplCard(name, st, sub, id) {
  return `<div class="card" data-tpl="${id}">
    <img class="cv" alt="" src="${previewUrl({ ...BASE, ...st })}">
    <div class="meta"><div><b>${esc(name)}</b><small>${sub}</small></div>
    ${String(id).startsWith('u') ? `<button class="icon-btn sm" data-tdel="${id}" title="Supprimer"><svg><use href="#i-trash"/></svg></button>` : ''}</div></div>`;
}
async function renderTemplates() {
  await document.fonts.ready;
  $('#builtinTpl').innerHTML = PRESETS.map((p, i) => tplCard(p.name, presetStyle(i), `${p.font || BASE.font} · ${p.anim || BASE.anim}`, `b${i}`)).join('');
  $('#myTpl').innerHTML = myTemplates.length
    ? myTemplates.map((t) => tplCard(t.name, t.style, `Créé ${ago(t.created)}`, `u${t.id}`)).join('')
    : '<div class="empty">Aucun modèle perso. Règle un style dans l\'éditeur puis « Enregistrer le style actuel ».</div>';
}
function saveTemplate() {
  const name = prompt('Nom du modèle', `Mon style ${myTemplates.length + 1}`);
  if (!name) return;
  myTemplates.push({ id: Date.now().toString(36), name, created: Date.now(), style: structuredClone(state.style) });
  ls.set('sublime:templates', myTemplates);
  toast('Modèle enregistré');
  if (!$('#v-templates').classList.contains('hidden')) renderTemplates();
}
$('#btnSaveTpl').onclick = saveTemplate;
$('#btnSaveTpl2').onclick = saveTemplate;
$('#v-templates').addEventListener('click', (e) => {
  const del = e.target.closest('[data-tdel]');
  if (del) {
    myTemplates = myTemplates.filter((t) => `u${t.id}` !== del.dataset.tdel);
    ls.set('sublime:templates', myTemplates);
    return renderTemplates();
  }
  const card = e.target.closest('[data-tpl]');
  if (!card) return;
  const id = card.dataset.tpl;
  if (id.startsWith('b')) applyStyle(presetStyle(+id.slice(1)), +id.slice(1));
  else applyStyle(myTemplates.find((t) => `u${t.id}` === id).style);
  toast('Style appliqué');
  go('editor');
});

/* =========================================================
   Page Projets
   ========================================================= */
async function renderProjects() {
  const ps = (await db.all()).sort((a, b) => b.updated - a.updated);
  $('#projGrid').innerHTML = ps.length ? ps.map((p) => `
    <div class="card" data-open="${p.id}">
      <div class="cv" style="background-image:url(${p.thumb})"></div>
      ${p.id === state.id ? '<span class="badge">Ouvert</span>' : ''}
      <div class="meta"><div><b data-notr>${esc(p.name)}</b><small>${p.segs.length} sous-titres · ${clock(p.duration)} · ${ago(p.updated)}</small></div>
      <button class="icon-btn sm" data-pmenu="${p.id}" aria-label="Options"><svg class="f"><use href="#i-dots"/></svg></button></div>
    </div>`).join('')
    : '<div class="empty">Aucun projet pour l\'instant. Clique sur « Nouveau projet » et choisis une vidéo.</div>';
}
$('#projGrid').addEventListener('click', async (e) => {
  const m = e.target.closest('[data-pmenu]');
  if (m) {
    e.stopPropagation();
    const id = m.dataset.pmenu;
    return openMenu(m, [
      { label: 'Ouvrir', fn: () => openProject(id) },
      { label: 'Renommer', fn: async () => { const p = await db.get(id), n = prompt('Nouveau nom', p.name); if (n) { p.name = n; await db.put(p); if (id === state.id) $('#projName').value = n; renderProjects(); } } },
      { label: 'Exporter les sous-titres (.srt)', fn: async () => { const p = await db.get(id); downloadSrt(p.segs, p.name); } },
      { label: 'Supprimer', danger: true, fn: async () => { if (confirm('Supprimer ce projet et sa vidéo ? C\'est définitif.')) { await db.del(id); if (id === state.id) location.reload(); else renderProjects(); } } },
    ]);
  }
  const c = e.target.closest('[data-open]');
  if (c) c.dataset.open === state.id ? go('editor') : openProject(c.dataset.open);
});
$('#btnProjMenu').onclick = (e) => openMenu(e.currentTarget, [
  { label: 'Renommer', fn: () => { $('#projName').focus(); $('#projName').select(); } },
  { label: 'Enregistrer (Ctrl+S)', fn: () => persist(true) },
  { label: 'Nouveau projet…', fn: () => $('[data-new]').click() },
  { label: 'Tous les projets', fn: () => go('projects') },
]);

/* =========================================================
   Page Statistiques
   ========================================================= */
const cps = (s) => segText(s).length / Math.max(0.1, s.end - s.start); // caractères par seconde
async function renderStats() {
  const ps = await db.all();
  const segs = ps.reduce((a, p) => a + p.segs.length, 0);
  const words = ps.reduce((a, p) => a + p.segs.reduce((b, s) => b + s.words.length, 0), 0);
  const dur = ps.reduce((a, p) => a + (p.duration || 0), 0);
  const kpi = (icon, v, l) => `<div class="kpi"><svg><use href="#${icon}"/></svg><div><b>${v}</b><span>${l}</span></div></div>`;
  $('#kpis').innerHTML = kpi('i-folder', ps.length, 'Projets') + kpi('i-lines', segs, 'Sous-titres') + kpi('i-text', words, 'Mots transcrits') + kpi('i-clock', clock(dur), 'Vidéo traitée');

  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 6 + i); return d; });
  const counts = days.map((d) => ps.filter((p) => p.updated >= d && p.updated < +d + 864e5).length);
  const max = Math.max(1, ...counts);
  $('#bars').innerHTML = days.map((d, i) => `<div><i style="height:${(counts[i] / max) * 80}%">${counts[i] ? `<b>${counts[i]}</b>` : ''}</i>${d.toLocaleDateString(settings.ui, { weekday: 'short' })}</div>`).join('');

  const use = {};
  for (const p of ps) { const n = PRESETS[p.preset]?.name || 'Perso'; use[n] = (use[n] || 0) + 1; }
  const top = Object.entries(use).sort((a, b) => b[1] - a[1]).slice(0, 6);
  $('#styleUse').innerHTML = top.length ? top.map(([n, c]) => `<div><span>${n}</span><div class="bar"><i style="width:${(c / ps.length) * 100}%"></i></div><b>${c}</b></div>`).join('') : '<p class="hint">Pas encore de données.</p>';

  if (!state.segs.length) { $('#readab').innerHTML = '<p class="hint">Ouvre un projet avec des sous-titres pour voir son analyse.</p>'; return; }
  const n = state.segs.length, w = state.segs.reduce((a, s) => a + s.words.length, 0);
  const spoken = state.segs.reduce((a, s) => a + (s.end - s.start), 0);
  const fast = state.segs.map((s, i) => ({ s, i, c: cps(s) })).filter((x) => x.c > 20).sort((a, b) => b.c - a.c);
  $('#readab').innerHTML = `
    <div class="read-kpis">
      <div><b>${Math.round((w / Math.max(1, spoken)) * 60)}</b><span>mots / minute</span></div>
      <div><b>${(spoken / n).toFixed(1)} s</b><span>durée moyenne d'une ligne</span></div>
      <div><b>${(w / n).toFixed(1)}</b><span>mots par ligne</span></div>
      <div><b>${fast.length}</b><span>lignes trop rapides</span></div>
    </div>
    ${fast.length ? `<p class="hint" style="text-align:left;margin-bottom:8px">Au-delà de 20 caractères par seconde, la ligne est dure à lire. Clique pour la corriger :</p>
      <div class="fast">${fast.slice(0, 8).map((x) => `<button data-fix="${x.i}"><em>${x.c.toFixed(0)} car/s</em><span data-notr>${esc(segText(x.s))}</span></button>`).join('')}</div>`
    : '<p class="ok-msg">Toutes les lignes se lisent confortablement.</p>'}`;
}
$('#readab').addEventListener('click', (e) => {
  const b = e.target.closest('[data-fix]');
  if (!b) return;
  go('editor');
  select(+b.dataset.fix);
  seek(state.segs[+b.dataset.fix].start + 0.01);
  $(`.seg[data-i="${b.dataset.fix}"]`)?.scrollIntoView({ block: 'center' });
});

/* =========================================================
   Page Paramètres
   ========================================================= */
async function renderSettings() {
  $$('[data-set]').forEach((el) => {
    const v = settings[el.dataset.set];
    if (el.type === 'checkbox') el.checked = v; else el.value = v;
  });
  $('#glossary').value = settings.glossary;
  const est = await navigator.storage?.estimate?.();
  $('#storage').textContent = est ? `${(est.usage / 1048576).toFixed(1)} Mo` : '—';
}
$('#v-settings').addEventListener('change', (e) => {
  const el = e.target.closest('[data-set]');
  if (!el) return;
  const k = el.dataset.set;
  settings[k] = el.type === 'checkbox' ? el.checked : 'num' in el.dataset ? +el.value : el.value;
  saveSettings();
  if (k === 'theme') applyTheme();
  if (k === 'ui') { setLang(settings.ui); $('#uiLang').value = settings.ui; renderSettings(); }
  toast('Paramètre enregistré');
});
$('#glossary').onchange = (e) => { settings.glossary = e.target.value; saveSettings(); toast('Dictionnaire enregistré'); };
$('#btnWipe').onclick = async () => {
  if (!confirm('Effacer tous les projets, vidéos et modèles enregistrés dans ce navigateur ? C\'est définitif.')) return;
  await db.clear();
  localStorage.removeItem('sublime:templates');
  location.reload();
};

/* =========================================================
   Exports
   ========================================================= */
function download(blob, name) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
const projName = () => $('#projName').value.trim() || 'sublime';
function downloadSrt(segs, name) {
  if (!segs.length) return toast('Aucun sous-titre à exporter');
  const ts = (s) => new Date(s * 1000).toISOString().slice(11, 23).replace('.', ',');
  const srt = segs.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(s.end)}\n${segText(s)}\n`).join('\n');
  download(new Blob([srt], { type: 'text/plain' }), `${name}.srt`);
}
/* Export rapide : décodage + encodage matériel (WebCodecs via Mediabunny), bien plus rapide que le temps réel.
   La boîte « Enregistrer sous » s'ouvre d'abord, puis la vidéo est écrite directement dans le fichier choisi. */
const MB = 'https://cdn.jsdelivr.net/npm/mediabunny@1.65.0/+esm';
let conversion = null;
async function exportVideo() {
  if (!state.id) return;
  const name = `${projName()}.mp4`;
  let handle = null;
  if (window.showSaveFilePicker) {
    try {
      handle = await showSaveFilePicker({ suggestedName: name, types: [{ description: 'Vidéo MP4', accept: { 'video/mp4': ['.mp4'] } }] });
    } catch (e) { if (e.name === 'AbortError') return; }
  }
  video.pause();
  $('#exportTitle').textContent = 'Export en cours…';
  $('#exportBar').style.width = '0';
  $('#overlay').classList.remove('hidden');
  const t0 = performance.now();
  let writable;
  try {
    const mb = await import(MB);
    if (!(await mb.canEncodeVideo('avc', { width: W, height: H }))) throw new Error('no-avc');
    const input = new mb.Input({ source: new mb.BlobSource(file), formats: mb.ALL_FORMATS });
    writable = handle && (await handle.createWritable());
    const target = writable ? new mb.StreamTarget(writable, { chunked: true }) : new mb.BufferTarget();
    const output = new mb.Output({ format: new mb.Mp4OutputFormat({ fastStart: writable ? false : 'in-memory' }), target });
    const cv = new OffscreenCanvas(W, H), g = cv.getContext('2d'), st = state.style, segs = state.segs;
    conversion = await mb.Conversion.init({
      input, output,
      video: {
        codec: 'avc', bitrate: settings.bitrate * 1e6, processedWidth: W, processedHeight: H, forceTranscode: true,
        process: (sample) => {
          const t = sample.timestamp, sw = sample.displayWidth, sh = sample.displayHeight, s = Math.max(W / sw, H / sh);
          g.fillStyle = '#000';
          g.fillRect(0, 0, W, H);
          sample.draw(g, (W - sw * s) / 2, (H - sh * s) / 2, sw * s, sh * s);
          const seg = segs.find((x) => t >= x.start && t < x.end);
          if (seg) drawCaption(g, st, seg, t, W, H);
          return cv;
        },
      },
    });
    if (!conversion.isValid) throw new Error('invalid');
    conversion.onProgress = (p) => { $('#exportBar').style.width = `${p * 100}%`; };
    await conversion.execute();
    if (!writable) download(new Blob([target.buffer], { type: 'video/mp4' }), name);
    toast(`Vidéo enregistrée en ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  } catch (e) {
    await writable?.abort?.().catch(() => {});
    if (e?.name === 'ConversionCanceledError' || conversion?.canceled) toast('Export annulé');
    else { toast('Export rapide indisponible, export en temps réel…'); return exportRealtime(); }
  } finally {
    conversion = null;
    $('#overlay').classList.add('hidden');
  }
}
$('#btnCancelExport').onclick = () => conversion?.cancel();

/* Secours pour les navigateurs sans WebCodecs : enregistrement en temps réel */
async function exportRealtime() {
  $('#exportTitle').textContent = 'Export en temps réel…';
  ensureAudio();
  video.muted = false;
  $('#volUse').setAttribute('href', '#i-vol');
  const stream = canvas.captureStream(settings.fps);
  audioDest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
  const mime = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: settings.bitrate * 1e6 });
  const parts = [];
  rec.ondataavailable = (e) => e.data.size && parts.push(e.data);
  video.pause();
  video.currentTime = 0;
  await once(video, 'seeked');
  recording = true;
  $('#overlay').classList.remove('hidden');
  rec.start(1000);
  await video.play();
  await once(video, 'ended');
  rec.stop();
  await once(rec, 'stop');
  recording = false;
  $('#overlay').classList.add('hidden');
  download(new Blob(parts, { type: mime }), `${projName()}.${mime.includes('mp4') ? 'mp4' : 'webm'}`);
  toast('Export terminé');
}
$('#btnExport').onclick = (e) => openMenu(e.currentTarget, [
  { label: `Vidéo ${state.aspect} avec sous-titres`, fn: exportVideo },
  { label: 'Sous-titres (.srt)', fn: () => downloadSrt(state.segs, projName()) },
  { label: 'Image actuelle (.png)', fn: () => canvas.toBlob((b) => download(b, `${projName()}.png`)) },
]);

/* Rouvre automatiquement le dernier projet */
db.all().then((ps) => {
  const last = ps.sort((a, b) => b.updated - a.updated)[0];
  if (last) openProject(last.id);
}).catch(() => {});
