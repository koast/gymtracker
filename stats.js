/* ==============================================
   stats.js - Statistics page
   Pure ASCII: special chars as Unicode escapes
   Reads localStorage data for the current user
   and renders SVG weight-history charts.
   ============================================== */

var Stats = (function () {

  var currentUser = null;

  /* ---- ISO week helpers (mirrored from app.js) ---- */
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

  /* ---- Build array of the last N week descriptors ---- */
  function getLastNWeeks(n) {
    var result = [];
    var today  = new Date();
    for (var i = n - 1; i >= 0; i--) {
      var d  = new Date(today);
      d.setDate(today.getDate() - i * 7);
      var iw = isoWeekYear(d);
      result.push({ key: weekKey(d), label: 'S' + iw.week });
    }
    return result;
  }

  /* ---- Load sets data from localStorage ---- */
  function loadWeekSets(weekK) {
    try {
      var v = localStorage.getItem('gt_' + currentUser + '_' + weekK + '_sets');
      return v ? JSON.parse(v) : {};
    } catch (e) { return {}; }
  }

  /* Return max weight logged for exercise (d,e) in a sets snapshot */
  function getMaxWeight(sets, d, e) {
    var max = null;
    Object.keys(sets).forEach(function (k) {
      var parts = k.split('_');
      if (+parts[0] === d && +parts[1] === e) {
        var w = parseFloat(sets[k].weight);
        if (!isNaN(w) && w > 0 && (max === null || w > max)) max = w;
      }
    });
    return max;
  }

  /* Return total successful reps for exercise (d,e) in a sets snapshot */
  function getTotalReps(sets, d, e) {
    var total = 0;
    Object.keys(sets).forEach(function (k) {
      var parts = k.split('_');
      if (+parts[0] === d && +parts[1] === e) {
        var r = parseInt(sets[k].reps, 10);
        if (!isNaN(r) && r > 0) total += r;
      }
    });
    return total || null;
  }

  /* ---- SVG line chart ---- */
  function buildSvgChart(points) {
    var nonNull = points.filter(function (p) { return p.weight !== null; });
    if (nonNull.length === 0) {
      return '<div class="no-data">Sin datos a\u00fan \u2014 empieza a registrar pesos</div>';
    }

    var W = 320, H = 110;
    var padL = 10, padR = 10, padT = 22, padB = 22;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;
    var n = points.length;

    /* Y scale */
    var ws     = nonNull.map(function (p) { return p.weight; });
    var maxW   = Math.max.apply(null, ws);
    var minW   = Math.min.apply(null, ws);
    var range  = maxW - minW;
    if (range < 5) { var mid = (maxW + minW) / 2; minW = mid - 5; maxW = mid + 5; range = 10; }
    var extra  = range * 0.15;
    var yMin   = Math.max(0, minW - extra);
    var yMax   = maxW + extra;
    var yRange = yMax - yMin;

    function toX(i) { return padL + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2); }
    function toY(w) { return padT + chartH - ((w - yMin) / yRange) * chartH; }

    /* Path with gap handling for null points */
    var pathD  = '';
    var inLine = false;
    points.forEach(function (p, i) {
      if (p.weight === null) { inLine = false; return; }
      var x = toX(i).toFixed(1), y = toY(p.weight).toFixed(1);
      pathD  += (inLine ? 'L ' : 'M ') + x + ' ' + y + ' ';
      inLine  = true;
    });

    /* Dots, value labels, area fill */
    var areaPoints = '';
    var firstX = null, lastX = null, bottomY = (padT + chartH).toFixed(1);
    nonNull.forEach(function (p, idx) {
      var i = points.indexOf(p);
      var x = toX(i), y = toY(p.weight);
      if (firstX === null) firstX = x.toFixed(1);
      lastX = x.toFixed(1);
    });

    /* Build area path */
    var areaD = '';
    var areaInLine = false;
    points.forEach(function (p, i) {
      if (p.weight === null) { areaInLine = false; return; }
      var x = toX(i).toFixed(1), y = toY(p.weight).toFixed(1);
      areaD += (areaInLine ? 'L ' : 'M ') + x + ' ' + y + ' ';
      areaInLine = true;
    });
    /* Close area to baseline */
    if (areaD && lastX !== null) {
      areaD += 'L ' + lastX + ' ' + bottomY + ' L ' + firstX + ' ' + bottomY + ' Z';
    }

    var dots = '', vals = '', xlabels = '';
    points.forEach(function (p, i) {
      var x = toX(i).toFixed(1);
      xlabels += '<text x="' + x + '" y="' + (H - 5) + '" text-anchor="middle" class="chart-label">' + p.label + '</text>';
      if (p.weight === null) return;
      var y = toY(p.weight);
      dots += '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="3.5" class="chart-dot"/>';
      vals += '<text x="' + x + '" y="' + (y - 7).toFixed(1) + '" text-anchor="middle" class="chart-val">' + p.weight + '</text>';
    });

    return '<svg class="stats-chart" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#4f9eff" stop-opacity="0.25"/>' +
          '<stop offset="100%" stop-color="#4f9eff" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>' +
      (areaD ? '<path d="' + areaD.trim() + '" fill="url(#areaGrad)"/>' : '') +
      (pathD ? '<path d="' + pathD.trim() + '" class="chart-line"/>' : '') +
      dots + vals + xlabels +
    '</svg>';
  }

  /* ---- One exercise stats card ---- */
  function buildExCard(ex, points) {
    /* Trend indicator: compare last two non-null weeks */
    var nonNull = points.filter(function (p) { return p.weight !== null; });
    var trend   = '';
    if (nonNull.length >= 2) {
      var prev = nonNull[nonNull.length - 2].weight;
      var last = nonNull[nonNull.length - 1].weight;
      var diff = (last - prev).toFixed(1);
      if (diff > 0) {
        trend = '<span class="trend up">&#x2191; +' + diff + 'kg</span>';
      } else if (diff < 0) {
        trend = '<span class="trend down">&#x2193; ' + diff + 'kg</span>';
      } else {
        trend = '<span class="trend eq">&mdash; igual</span>';
      }
    }

    return '<div class="stats-ex-card">' +
      '<div class="stats-ex-header">' +
        '<span class="stats-ex-title">' + ex.name + '</span>' +
        (trend ? trend : '') +
      '</div>' +
      buildSvgChart(points) +
    '</div>';
  }

  /* ---- Build all charts ---- */
  function buildCharts(weeks) {
    var tabsEl    = document.getElementById('statsTabs');
    var contentEl = document.getElementById('statsContent');
    if (!tabsEl || !contentEl) return;

    /* Preload all week sets to avoid repeated localStorage reads */
    var weekSets = weeks.map(function (wk) { return loadWeekSets(wk.key); });

    tabsEl.innerHTML = ROUTINE.map(function (day, d) {
      return '<button class="tab-btn' + (d === 0 ? ' active' : '') +
        '" data-day="' + d + '" onclick="Stats.switchDay(' + d + ')">' +
        '<span class="tab-emoji">' + day.tabEmoji + '</span>' +
        '<span class="tab-label">' + day.tabLabel + '</span>' +
        '</button>';
    }).join('');

    contentEl.innerHTML = ROUTINE.map(function (day, d) {
      var cardsHtml = day.exercises.map(function (ex, e) {
        var points = weeks.map(function (wk, wi) {
          return { label: wk.label, weight: getMaxWeight(weekSets[wi], d, e) };
        });
        return buildExCard(ex, points);
      }).join('');

      return '<div class="day-panel' + (d === 0 ? ' active' : '') + '" id="stats-panel-' + d + '">' +
        '<div class="day-header">' +
          '<h2>' + day.tabEmoji + ' ' + day.title + '</h2>' +
          '<p class="day-desc">' + day.desc + '</p>' +
        '</div>' +
        '<div class="exercises-list stats-list">' + cardsHtml + '</div>' +
      '</div>';
    }).join('');
  }

  /* ---- Tab switching ---- */
  function switchDay(idx) {
    document.querySelectorAll('#statsTabs .tab-btn').forEach(function (btn) {
      btn.classList.toggle('active', +btn.getAttribute('data-day') === idx);
    });
    document.querySelectorAll('#statsContent .day-panel').forEach(function (panel, i) {
      panel.classList.toggle('active', i === idx);
    });
  }

  /* ---- Init ---- */
  function init() {
    var raw = localStorage.getItem('gt_lastuser');
    if (!raw) { window.location.href = 'index.html'; return; }
    var data;
    try { data = JSON.parse(raw); } catch (e) { window.location.href = 'index.html'; return; }
    currentUser = data.id;
    var userEl = document.getElementById('statsUser');
    if (userEl) userEl.textContent = data.name;
    buildCharts(getLastNWeeks(8));
  }

  document.addEventListener('DOMContentLoaded', init);

  return { switchDay: switchDay };

}());
