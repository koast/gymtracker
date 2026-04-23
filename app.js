/* ==============================================
   GymTracker Pro - app.js
   Pure ASCII: special chars as Unicode escapes
   Features:
     - Storage by ISO week number per user
     - Auto-opens today's tab on load
     - Per-set done toggle
     - Previous week data shown as hints
   ============================================== */

/* ---- Routine data (Unicode escapes for non-ASCII) ---- */
var ROUTINE = [
  {
    title:    'Lunes \u2013 PUSH',
    tabLabel: 'LUN',
    tabEmoji: '&#x1F7E6;',
    desc:     'Pecho &middot; Hombro &middot; Tr\u00edceps',
    exercises: [
      { name: 'Press Banca',                sets: 4, badge: '4 &times; 5\u20138 reps',   yt: 'press+banca+tecnica+correcta' },
      { name: 'Press Inclinado Mancuernas', sets: 3, badge: '3 &times; 8\u201310 reps',  yt: 'press+inclinado+mancuernas+tecnica' },
      { name: 'Press Militar',              sets: 3, badge: '3 &times; 6\u201310 reps',  yt: 'press+militar+tecnica+barra' },
      { name: 'Elevaciones Laterales',      sets: 3, badge: '3 &times; 12\u201315 reps', yt: 'elevaciones+laterales+hombro+tecnica' },
      { name: 'Tr\u00edceps Polea Cuerda',  sets: 3, badge: '3 &times; 10\u201315 reps', yt: 'triceps+polea+cuerda+tecnica' }
    ]
  },
  {
    title:    'Martes \u2013 PULL',
    tabLabel: 'MAR',
    tabEmoji: '&#x1F7E9;',
    desc:     'Espalda &middot; B\u00edceps',
    exercises: [
      { name: 'Dominadas / Jal\u00f3n', sets: 4, badge: '4 &times; 6\u201310 reps',  yt: 'dominadas+tecnica+correcta' },
      { name: 'Remo con Barra',          sets: 3, badge: '3 &times; 6\u201310 reps',  yt: 'remo+con+barra+tecnica' },
      { name: 'Jal\u00f3n al Pecho',     sets: 3, badge: '3 &times; 8\u201312 reps',  yt: 'jalon+al+pecho+tecnica+correcta' },
      { name: 'Remo Polea',              sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'remo+polea+sentado+tecnica' },
      { name: 'Curl B\u00edceps Barra',  sets: 3, badge: '3 &times; 8\u201312 reps',  yt: 'curl+biceps+barra+tecnica+correcta' }
    ]
  },
  {
    title:    'Mi\u00e9rcoles \u2013 LEGS',
    tabLabel: 'MI\u00c9',
    tabEmoji: '&#x1F7E8;',
    desc:     'Pierna Completa',
    exercises: [
      { name: 'Sentadilla',                       sets: 4, badge: '4 &times; 5\u20138 reps',   yt: 'sentadilla+tecnica+correcta+principiantes' },
      { name: 'Prensa',                           sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'prensa+de+piernas+tecnica+correcta' },
      { name: 'Curl Femoral',                     sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'curl+femoral+maquina+tecnica' },
      { name: 'Extensi\u00f3n Cu\u00e1driceps',   sets: 3, badge: '3 &times; 12\u201315 reps', yt: 'extension+cuadriceps+maquina+tecnica' },
      { name: 'Zancadas / Step-ups',              sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'zancadas+step+ups+tecnica+pierna' }
    ]
  },
  {
    title:    'Jueves \u2013 UPPER',
    tabLabel: 'JUE',
    tabEmoji: '&#x1F7E5;',
    desc:     'Torso Mixto Fuerza',
    exercises: [
      { name: 'Press Inclinado Barra',  sets: 3, badge: '3 &times; 6\u20138 reps',   yt: 'press+inclinado+barra+tecnica' },
      { name: 'Remo Barra',             sets: 3, badge: '3 &times; 6\u20138 reps',   yt: 'remo+barra+pendlay+tecnica' },
      { name: 'Fondos',                 sets: 3, badge: '3 &times; 8\u201312 reps',  yt: 'fondos+paralelas+tecnica+pecho+triceps' },
      { name: 'Dominadas Supinas',      sets: 3, badge: '3 &times; 6\u201310 reps',  yt: 'dominadas+supinas+chin+up+tecnica' },
      { name: 'Elevaciones Laterales',  sets: 3, badge: '3 &times; 12\u201315 reps', yt: 'elevaciones+laterales+hombro+tecnica' }
    ]
  },
  {
    title:    'Viernes \u2013 FULL BODY',
    tabLabel: 'VIE',
    tabEmoji: '&#x1F7EA;',
    desc:     'Bombeo + Core',
    exercises: [
      { name: 'Prensa',                              sets: 3, badge: '3 &times; 10\u201315 reps', yt: 'prensa+de+piernas+tecnica+correcta' },
      { name: 'Jal\u00f3n al Pecho',                sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'jalon+al+pecho+tecnica+correcta' },
      { name: 'Press Pecho M\u00e1quina',           sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'press+pecho+maquina+tecnica' },
      { name: 'Curl Mancuernas',                    sets: 3, badge: '3 &times; 10\u201312 reps', yt: 'curl+mancuernas+biceps+tecnica' },
      { name: 'Core \u2013 Plancha + Elevaciones',  sets: 1, badge: '10 min &middot; circuito',  yt: 'rutina+core+plancha+elevacion+piernas+10+minutos', isCore: true }
    ]
  }
];

/* ---- JS day -> gym tab index (0=Mon...4=Fri, null=weekend) ---- */
/* JS:  0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat         */
var JS_TO_GYM = [null, 0, 1, 2, 3, 4, null];

var App = (function () {

  var currentUser    = null;
  var currentWeekKey = null;
  var prevWeekKey    = null;
  var currentDay     = 0;

  /* ---- ISO week helpers ---- */
  function isoWeekYear(date) {
    var d   = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    var jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var wk   = Math.ceil((((d - jan1) / 86400000) + 1) / 7);
    return { year: d.getUTCFullYear(), week: wk };
  }

  function weekKey(date) {
    var iw = isoWeekYear(date);
    return iw.year + '_W' + String(iw.week).padStart(2, '0');
  }

  /* ---- Storage helpers ---- */
  function sk(suffix)        { return 'gt_' + currentUser + '_' + currentWeekKey + '_' + suffix; }
  function skw(wk, suffix)   { return 'gt_' + currentUser + '_' + wk + '_' + suffix; }

  function load(key, def) {
    try {
      var v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  }

  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---- Login / Logout ---- */
  function login() {
    var inp = document.getElementById('usernameInput');
    var raw = (inp.value || '').trim();
    if (!raw) { showToast('Escribe tu nombre'); inp.focus(); return; }
    currentUser = raw.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20) || 'user';
    localStorage.setItem('gt_lastuser', JSON.stringify({ id: currentUser, name: raw }));
    initKeys();
    showApp(raw);
  }

  function logout() {
    currentUser = null;
    document.getElementById('appScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('usernameInput').value = '';
  }

  function initKeys() {
    var now  = new Date();
    var prev = new Date(now);
    prev.setDate(now.getDate() - 7);
    currentWeekKey = weekKey(now);
    prevWeekKey    = weekKey(prev);
  }

  function showApp(displayName) {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
    document.getElementById('headerUser').textContent = displayName;
    var iw = isoWeekYear(new Date());
    document.getElementById('weekLabel').textContent =
      'Semana ' + iw.week + ' / ' + iw.year;
    buildDOM();
    loadAllData();
    autoOpenToday();
    updateWeekProgress();
  }

  /* ---- Build DOM ---- */
  function buildDOM() {
    var tabsEl   = document.getElementById('dayTabs');
    var panelsEl = document.getElementById('dayPanels');

    tabsEl.innerHTML = ROUTINE.map(function (day, d) {
      return '<button class="tab-btn' + (d === 0 ? ' active' : '') +
        '" data-day="' + d + '" onclick="App.switchDay(' + d + ')">' +
        '<span class="tab-emoji">' + day.tabEmoji + '</span>' +
        '<span class="tab-label">' + day.tabLabel + '</span>' +
        '</button>';
    }).join('');

    panelsEl.innerHTML = ROUTINE.map(function (day, d) {
      return '<div class="day-panel' + (d === 0 ? ' active' : '') + '" id="panel-' + d + '">' +
        '<div class="day-header">' +
          '<h2>' + day.tabEmoji + ' ' + day.title + '</h2>' +
          '<p class="day-desc">' + day.desc + '</p>' +
          '<button class="btn-complete-day" onclick="App.completeDay(' + d + ')">' +
            '<span id="dayStatus-' + d + '">Marcar d&iacute;a completado &#x2713;</span>' +
          '</button>' +
        '</div>' +
        '<div class="exercises-list" id="exercises-' + d + '">' +
          day.exercises.map(function (ex, e) { return buildExCard(d, e, ex); }).join('') +
        '</div>' +
        '</div>';
    }).join('');
  }

  function buildExCard(d, e, ex) {
    var setsHtml = '';
    for (var s = 0; s < ex.sets; s++) {
      var id    = d + '-' + e + '-' + s;
      var label = ex.isCore ? 'Tiempo' : ('Serie ' + (s + 1));
      var wPh   = ex.isCore ? 'min'   : 'kg';
      var rPh   = ex.isCore ? 'rondas': 'reps';
      setsHtml +=
        '<div class="set-row' + '" id="setrow-' + id + '">' +
          '<span class="set-label">' + label + '</span>' +
          '<div class="set-inputs">' +
            '<input type="number" class="input-weight" placeholder="' + wPh + '" min="0" step="0.5"' +
              ' oninput="App.saveSet(' + d + ',' + e + ',' + s + ',\'weight\',this.value)" />' +
            '<input type="number" class="input-reps" placeholder="' + rPh + '" min="0"' +
              ' oninput="App.saveSet(' + d + ',' + e + ',' + s + ',\'reps\',this.value)" />' +
          '</div>' +
          '<button id="setDone-' + id + '" class="btn-set-done"' +
            ' onclick="App.toggleSetDone(' + d + ',' + e + ',' + s + ')" title="Marcar serie">' +
            '&#x2713;</button>' +
        '</div>' +
        '<div class="set-prev-hint" id="prevhint-' + id + '"></div>';
    }

    return '<div class="exercise-card" id="excard-' + d + '-' + e + '">' +
      '<div class="ex-header">' +
        '<div class="ex-info">' +
          '<h3 class="ex-name">' + ex.name + '</h3>' +
          '<span class="ex-sets-reps">' + ex.badge + '</span>' +
        '</div>' +
        '<div class="ex-actions">' +
          '<a href="https://www.youtube.com/results?search_query=' + ex.yt + '"' +
            ' target="_blank" class="btn-video" rel="noopener noreferrer">&#x25B6; Ver</a>' +
        '</div>' +
      '</div>' +
      '<div class="sets-grid">' + setsHtml + '</div>' +
      '<div class="ex-note">' +
        '<input type="text" class="input-note" placeholder="Nota (opcional)"' +
          ' id="note-' + d + '-' + e + '"' +
          ' oninput="App.saveNote(' + d + ',' + e + ',this.value)" />' +
      '</div>' +
    '</div>';
  }

  /* ---- Data operations ---- */
  function getSets()     { return load(sk('sets'),    {}); }
  function getDayDone()  { return load(sk('daydone'), {}); }
  function getPrevSets() { return load(skw(prevWeekKey, 'sets'), {}); }

  function saveSet(d, e, s, field, value) {
    var data = getSets();
    var k    = d + '_' + e + '_' + s;
    if (!data[k]) data[k] = {};
    data[k][field] = value;
    /* hide prev-week hint as soon as user types */
    var hint = document.getElementById('prevhint-' + d + '-' + e + '-' + s);
    if (hint) hint.style.display = 'none';
    save(sk('sets'), data);
  }

  function toggleSetDone(d, e, s) {
    var data = getSets();
    var k    = d + '_' + e + '_' + s;
    if (!data[k]) data[k] = {};
    data[k].done = !data[k].done;
    save(sk('sets'), data);
    applySetDone(d, e, s, !!data[k].done);
    checkAllSetsDone(d, e);
  }

  function applySetDone(d, e, s, done) {
    var btn = document.getElementById('setDone-' + d + '-' + e + '-' + s);
    var row = document.getElementById('setrow-' + d + '-' + e + '-' + s);
    if (btn) btn.classList.toggle('done', done);
    if (row) row.classList.toggle('set-completed', done);
  }

  function checkAllSetsDone(d, e) {
    var data = getSets();
    var ex   = ROUTINE[d].exercises[e];
    var all  = true;
    for (var s = 0; s < ex.sets; s++) {
      var k = d + '_' + e + '_' + s;
      if (!data[k] || !data[k].done) { all = false; break; }
    }
    var card = document.getElementById('excard-' + d + '-' + e);
    if (card) card.classList.toggle('ex-completed', all);
  }

  function saveNote(d, e, value) {
    var notes = load(sk('notes'), {});
    notes[d + '_' + e] = value;
    save(sk('notes'), notes);
  }

  function completeDay(d) {
    var data = getDayDone();
    data[d]  = !data[d];
    save(sk('daydone'), data);
    applyDayDone(d, !!data[d]);
    updateWeekProgress();
    if (data[d]) showToast('D\u00eda completado! Buen trabajo &#x1F525;');
  }

  function applyDayDone(d, done) {
    var span = document.getElementById('dayStatus-' + d);
    var btn  = span ? span.closest('.btn-complete-day') : null;
    var tab  = document.querySelector('.tab-btn[data-day="' + d + '"]');
    if (span) span.innerHTML = done
      ? '&#x2705; D\u00eda completado'
      : 'Marcar d\u00eda completado &#x2713;';
    if (btn) btn.classList.toggle('completed', done);
    if (tab) tab.classList.toggle('day-done', done);
  }

  function resetWeek() {
    if (!confirm('Reiniciar semana actual? Se borran los datos de esta semana.')) return;
    ['sets', 'notes', 'daydone'].forEach(function (s) {
      localStorage.removeItem(sk(s));
    });
    loadAllData();
    updateWeekProgress();
    showToast('Semana reiniciada');
  }

  /* ---- Load saved data ---- */
  function loadAllData() {
    var setsData  = getSets();
    var notesData = load(sk('notes'), {});
    var dayDone   = getDayDone();
    var prevSets  = getPrevSets();

    /* Restore current-week sets */
    Object.keys(setsData).forEach(function (key) {
      var val   = setsData[key];
      var parts = key.split('_');
      var d = +parts[0], e = +parts[1], s = +parts[2];
      var row = document.getElementById('setrow-' + d + '-' + e + '-' + s);
      if (!row) return;
      var wIn = row.querySelector('.input-weight');
      var rIn = row.querySelector('.input-reps');
      if (wIn && val.weight !== undefined && val.weight !== '') wIn.value = val.weight;
      if (rIn && val.reps   !== undefined && val.reps   !== '') rIn.value = val.reps;
      applySetDone(d, e, s, !!val.done);
      checkAllSetsDone(d, e);
    });

    /* Previous week hints — shown only if current week has no data */
    Object.keys(prevSets).forEach(function (key) {
      var val = prevSets[key];
      if (!val.weight && !val.reps) return;
      var cur = setsData[key];
      if (cur && (cur.weight || cur.reps)) return; /* already has data this week */
      var parts = key.split('_');
      var d = +parts[0], e = +parts[1], s = +parts[2];
      var hint = document.getElementById('prevhint-' + d + '-' + e + '-' + s);
      if (hint) {
        hint.textContent = 'Sem.ant: ' + (val.weight || '-') + 'kg x ' + (val.reps || '-') + ' reps';
        hint.style.display = 'block';
      }
    });

    /* Notes */
    Object.keys(notesData).forEach(function (key) {
      var val   = notesData[key];
      var parts = key.split('_');
      var inp   = document.getElementById('note-' + parts[0] + '-' + parts[1]);
      if (inp && val) inp.value = val;
    });

    /* Day done states */
    Object.keys(dayDone).forEach(function (idx) {
      applyDayDone(+idx, !!dayDone[idx]);
    });
  }

  /* ---- Progress bar ---- */
  function updateWeekProgress() {
    var dayDone = getDayDone();
    var count   = Object.values(dayDone).filter(Boolean).length;
    var fill    = document.getElementById('weekProgressFill');
    var text    = document.getElementById('weekProgressText');
    if (fill) fill.style.width = (count / 5 * 100) + '%';
    if (text) text.textContent = count + '/5 d\u00edas';
  }

  /* ---- Auto-open today's tab ---- */
  function autoOpenToday() {
    var gymDay = JS_TO_GYM[new Date().getDay()];
    switchDay(gymDay !== null ? gymDay : 0);
  }

  /* ---- Tab switching ---- */
  function switchDay(idx) {
    var oldPanel = document.querySelector('.day-panel.active');
    var oldTab   = document.querySelector('.tab-btn.active');
    if (oldPanel) oldPanel.classList.remove('active');
    if (oldTab)   oldTab.classList.remove('active');
    var panel = document.getElementById('panel-' + idx);
    var tab   = document.querySelector('.tab-btn[data-day="' + idx + '"]');
    if (panel) panel.classList.add('active');
    if (tab)   tab.classList.add('active');
    currentDay = idx;
  }

  /* ---- Toast ---- */
  var toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.innerHTML = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.add('hidden'); }, 2500);
  }

  /* ---- Init ---- */
  function init() {
    var raw = localStorage.getItem('gt_lastuser');
    if (raw) {
      try {
        var data = JSON.parse(raw);
        currentUser = data.id;
        initKeys();
        document.getElementById('usernameInput').value = data.name;
        showApp(data.name);
      } catch (e) { /* ignore corrupt data */ }
    }
    var inp = document.getElementById('usernameInput');
    if (inp) {
      inp.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter') login();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  /* Public API */
  return {
    login:         login,
    logout:        logout,
    switchDay:     switchDay,
    saveSet:       saveSet,
    saveNote:      saveNote,
    toggleSetDone: toggleSetDone,
    completeDay:   completeDay,
    resetWeek:     resetWeek
  };

}());
