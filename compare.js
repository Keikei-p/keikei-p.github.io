/* 比較ページ共通: 条件でしぼる(表の列を強調) + 確認リストの進み具合
   ページごとの質問・タイプは、HTML内の <script id="cmp-config"> (JSON)から読み込みます。 */
(function () {
  'use strict';

  /* ---------- 条件でしぼる ---------- */

  var cfgEl = document.getElementById('cmp-config');
  var filter = document.getElementById('cmp-filter');
  var answer = document.getElementById('cmp-answer');
  var resetBtn = document.getElementById('cmp-reset');
  var cfg = null;

  if (cfgEl && filter && answer) {
    try { cfg = JSON.parse(cfgEl.textContent); } catch (e) { cfg = null; }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildFilter() {
    cfg.questions.forEach(function (q, qi) {
      var fs = document.createElement('fieldset');
      fs.className = 'cmp-field';

      var lg = document.createElement('legend');
      lg.textContent = q.legend;
      fs.appendChild(lg);

      if (q.hint) {
        var hint = document.createElement('p');
        hint.className = 'cmp-hint';
        hint.textContent = q.hint;
        fs.appendChild(hint);
      }

      var wrap = document.createElement('div');
      wrap.className = 'cmp-opts';
      q.options.forEach(function (o, oi) {
        var label = document.createElement('label');
        label.className = 'cmp-opt';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'cmp-q' + qi;
        input.value = String(oi);
        var span = document.createElement('span');
        span.textContent = o.label;
        label.appendChild(input);
        label.appendChild(span);
        wrap.appendChild(label);
      });
      fs.appendChild(wrap);
      filter.appendChild(fs);
    });
  }

  function readAnswers() {
    return cfg.questions.map(function (q, qi) {
      var c = filter.querySelector('input[name="cmp-q' + qi + '"]:checked');
      return c ? parseInt(c.value, 10) : -1;
    });
  }

  function markColumns(topIdx) {
    var cells = document.querySelectorAll('[data-col]');
    Array.prototype.forEach.call(cells, function (c) {
      var on = topIdx !== null && parseInt(c.getAttribute('data-col'), 10) === topIdx;
      c.classList.toggle('is-match', on);
    });
  }

  function update() {
    var types = cfg.types;
    var qs = cfg.questions;
    var ans = readAnswers();
    var done = ans.filter(function (a) { return a >= 0; }).length;

    resetBtn.hidden = done === 0;

    if (done < qs.length) {
      markColumns(null);
      answer.innerHTML = '<p class="cmp-answer-wait">あと ' + (qs.length - done) +
        ' 問選ぶと、合いそうなタイプがわかります。</p>';
      return;
    }

    var scores = types.map(function () { return 0; });
    ans.forEach(function (ai, qi) {
      var p = qs[qi].options[ai].p;
      for (var k = 0; k < scores.length; k++) { scores[k] += p[k]; }
    });

    var tie = cfg.tieOrder || types.map(function (_, i) { return i; });
    var order = types.map(function (_, i) { return i; }).sort(function (a, b) {
      return scores[b] - scores[a] || tie.indexOf(a) - tie.indexOf(b);
    });
    var top = order[0];
    var second = order[1];

    // 理由: 点数の高い回答から最大3つ
    var found = [];
    ans.forEach(function (ai, qi) {
      var o = qs[qi].options[ai];
      var text = o.w && o.w[String(top)];
      if (text) { found.push({ pts: o.p[top], text: text }); }
    });
    found.sort(function (a, b) { return b.pts - a.pts; });
    var reasons = found.slice(0, 3).map(function (f) { return f.text; });
    if (!reasons.length) { reasons.push('回答の傾向から、バランスよく当てはまるタイプです。'); }

    var t = types[top];
    var html = '<p class="cmp-answer-kicker">いちばん合いそうなのは</p>' +
      '<p class="cmp-answer-title">' + esc(t.name) + '</p>' +
      '<p class="cmp-answer-tag">' + esc(t.tagline) + '</p>' +
      '<p>' + esc(t.message) + '</p>' +
      '<h3 class="cmp-answer-sub">そう考えた理由</h3>' +
      '<ul class="cmp-reasons">' + reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';

    if (scores[top] > 0 && scores[second] / scores[top] >= 0.85) {
      html += '<p class="cmp-answer-also">「' + esc(types[second].name) + '」も、ほぼ同じくらい合いそうです。</p>';
    }
    html += '<p class="cmp-answer-note">上の表で、合いそうなタイプの列が色づいています。目安なので、最終的には各社の公式サイトで条件をご確認ください。</p>';

    answer.innerHTML = html;
    markColumns(top);
  }

  function resetFilter() {
    var inputs = filter.querySelectorAll('input[type="radio"]');
    Array.prototype.forEach.call(inputs, function (i) { i.checked = false; });
    update();
    var first = filter.querySelector('input[type="radio"]');
    if (first) { first.focus(); }
  }

  if (cfg) {
    buildFilter();
    filter.addEventListener('change', update);
    if (resetBtn) { resetBtn.addEventListener('click', resetFilter); }
    update();
  }

  /* ---------- 確認リスト ---------- */

  var list = document.getElementById('cmp-checklist');
  var count = document.getElementById('cmp-check-count');

  if (list && count) {
    var boxes = list.querySelectorAll('input[type="checkbox"]');
    var updateChecks = function () {
      var n = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) { n += 1; } });
      var all = n === boxes.length;
      count.textContent = n + ' / ' + boxes.length + ' 確認済み' + (all ? '。準備ができました' : '');
      count.classList.toggle('is-done', all);
    };
    list.addEventListener('change', updateChecks);
    updateChecks();
  }
})();
