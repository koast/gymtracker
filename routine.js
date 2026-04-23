/* routine.js - Shared routine data (pure ASCII + Unicode escapes) */
/* Loaded before app.js and stats.js on every page                  */

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

/* JS day -> gym tab index (0=Mon...4=Fri, null=weekend) */
/* JS:  0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat */
var JS_TO_GYM = [null, 0, 1, 2, 3, 4, null];
