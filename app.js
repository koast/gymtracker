/* =============================================
   GYMTRACKER PRO - Main Application Logic
   Data stored in localStorage per user
   ============================================= */

const App = (() => {

  // ??? Constants ???
  const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  const WEEK_KEY = 'gymtracker_weekstart';

  // ??? State ???
  let currentUser = null;
  let currentDay  = 0;

  // ??? Storage helpers ???
  function storageKey(suffix) {
    return `gymtracker_${currentUser}_${suffix}`;
  }

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  // ??? User / Login ???
  function login() {
    const input = document.getElementById('usernameInput');
    const name  = (input.value || '').trim().replace(/[^a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ\s]/g, '');
    if (!name) {
      showToast('Introduce tu nombre de usuario');
      input.focus();
      return;
    }
    currentUser = name.toLowerCase().replace(/\s+/g, '_').slice(0, 20);
    save('gymtracker_lastuser', currentUser);
    showApp(name);
  }

  function logout() {
    currentUser = null;
    document.getElementById('appScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('usernameInput').value = '';
  }

  function showApp(displayName) {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
    document.getElementById('headerUser').textContent = '?? ' + displayName;
    checkWeekReset();
    loadAllData();
    updateWeekProgress();
  }

  // ??? Week reset ???
  function checkWeekReset() {
    const stored = load(storageKey('weekstart'), null);
    const now    = weekStartISO();
    if (stored !== now) {
      save(storageKey('weekstart'), now);
    }
  }

  function weekStartISO() {
    const d = new Date();
    const day = d.getDay();
    const diff = (day === 0) ? -6 : 1 - day; // Monday
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    return mon.toISOString().slice(0, 10);
  }

  function resetWeek() {
    if (!confirm('¿Reiniciar semana? Se borrarán todos los pesos, reps y estados de esta semana.')) return;
    const keys = [
      storageKey('sets'),
      storageKey('notes'),
      storageKey('exdone'),
      storageKey('daydone'),
    ];
    keys.forEach(k => localStorage.removeItem(k));
    save(storageKey('weekstart'), weekStartISO());
    loadAllData();
    updateWeekProgress();
    showToast('? Nueva semana iniciada');
  }

  // ??? Data save/load ???
  function getSetsData()  { return load(storageKey('sets'),   {}); }
  function getNotesData() { return load(storageKey('notes'),  {}); }
  function getExDone()    { return load(storageKey('exdone'), {}); }
  function getDayDone()   { return load(storageKey('daydone'),{}); }

  function saveSet(dayIdx, exIdx, setIdx, field, value) {
    const data = getSetsData();
    const key  = `${dayIdx}_${exIdx}_${setIdx}`;
    if (!data[key]) data[key] = {};
    data[key][field] = value;
    save(storageKey('sets'), data);
  }

  function saveNote(dayIdx, exIdx, value) {
    const data = getNotesData();
    data[`${dayIdx}_${exIdx}`] = value;
    save(storageKey('notes'), data);
  }

  function toggleExDone(dayIdx, exIdx) {
    const data = getExDone();
    const key  = `${dayIdx}_${exIdx}`;
    data[key]  = !data[key];
    save(storageKey('exdone'), data);
    renderExDone(dayIdx, exIdx, data[key]);
  }

  function completeDay(dayIdx) {
    const data   = getDayDone();
    data[dayIdx] = !data[dayIdx];
    save(storageKey('daydone'), data);
    renderDayStatus(dayIdx, data[dayIdx]);
    updateWeekProgress();
    if (data[dayIdx]) showToast('?? ¡Día completado! Buen trabajo');
  }

  // ??? Render state ???
  function renderExDone(dayIdx, exIdx, done) {
    const span = document.getElementById(`exDone-${dayIdx}-${exIdx}`);
    const btn  = span ? span.closest('.btn-done') : null;
    const card = btn  ? btn.closest('.exercise-card') : null;
    if (span) span.textContent = done ? '?' : '?';
    if (btn)  btn.classList.toggle('done', done);
    if (card) card.classList.toggle('ex-completed', done);
  }

  function renderDayStatus(dayIdx, done) {
    const span  = document.getElementById(`dayStatus-${dayIdx}`);
    const btn   = span ? span.closest('.btn-complete-day') : null;
    const tab   = document.querySelector(`.tab-btn[data-day="${dayIdx}"]`);
    if (span) span.textContent = done ? '? Día completado' : 'Marcar día completado ?';
    if (btn)  btn.classList.toggle('completed', done);
    if (tab)  tab.classList.toggle('day-done', done);
  }

  function loadAllData() {
    const setsData  = getSetsData();
    const notesData = getNotesData();
    const exDone    = getExDone();
    const dayDone   = getDayDone();

    // Restore sets inputs
    Object.entries(setsData).forEach(([key, val]) => {
      const [d, e, s] = key.split('_').map(Number);
      const panel = document.getElementById(`panel-${d}`);
      if (!panel) return;
      const cards = panel.querySelectorAll('.exercise-card');
      const card  = cards[e];
      if (!card) return;
      const rows = card.querySelectorAll('.set-row');
      if (!rows[s]) return;
      const weightInput = rows[s].querySelector('.input-weight');
      const repsInput   = rows[s].querySelector('.input-reps');
      if (weightInput && val.weight) weightInput.value = val.weight;
      if (repsInput   && val.reps)   repsInput.value   = val.reps;
    });

    // Restore notes
    Object.entries(notesData).forEach(([key, val]) => {
      const [d, e] = key.split('_').map(Number);
      const panel = document.getElementById(`panel-${d}`);
      if (!panel) return;
      const cards      = panel.querySelectorAll('.exercise-card');
      const noteInput  = cards[e] ? cards[e].querySelector('.input-note') : null;
      if (noteInput && val) noteInput.value = val;
    });

    // Restore exercise done states
    Object.entries(exDone).forEach(([key, done]) => {
      const [d, e] = key.split('_').map(Number);
      renderExDone(d, e, done);
    });

    // Restore day done states
    Object.entries(dayDone).forEach(([idx, done]) => {
      renderDayStatus(Number(idx), done);
    });
  }

  // ??? Week progress bar ???
  function updateWeekProgress() {
    const dayDone   = getDayDone();
    const completed = Object.values(dayDone).filter(Boolean).length;
    const pct       = (completed / 5) * 100;
    const fill      = document.getElementById('weekProgressFill');
    const text      = document.getElementById('weekProgressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${completed}/5 días`;
  }

  // ??? Day tab switching ???
  function switchDay(idx) {
    // Deactivate old
    document.querySelector(`.day-panel.active`)?.classList.remove('active');
    document.querySelector(`.tab-btn.active`)?.classList.remove('active');
    // Activate new
    document.getElementById(`panel-${idx}`)?.classList.add('active');
    document.querySelector(`.tab-btn[data-day="${idx}"]`)?.classList.add('active');
    currentDay = idx;
  }

  // ??? Toast notification ???
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2500);
  }

  // ??? Init ???
  function init() {
    // Auto login if last user exists
    const last = load('gymtracker_lastuser', null);
    if (last) {
      currentUser = last;
      const displayName = last.replace(/_/g, ' ');
      document.getElementById('usernameInput').value = displayName;
      showApp(displayName);
    }

    // Enter key on login input
    const input = document.getElementById('usernameInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') login();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  // ??? Public API ???
  return { login, logout, switchDay, saveSet, saveNote, toggleExDone, completeDay, resetWeek };

})();
