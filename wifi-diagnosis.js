/* Wi-Fi診断: 7問の回答をスコア化し、3タイプのどれが合いそうかを表示する */
(function () {
  'use strict';

  // タイプの並び: 0 = 光回線, 1 = ホームルーター, 2 = モバイルWi-Fi
  var TIE_ORDER = [1, 0, 2];      // 同点のときの優先順(ホームルーター → 光回線 → モバイル)
  var NEEDLE_ANGLE = [-55, 0, 55]; // 結果画面でコンパスの針が向く角度
  var KEYS = ['H', 'R', 'M'];

  var TYPES = [
    {
      name: '光回線 + Wi-Fiルーター',
      tagline: '速度と安定性を大切にしたい人向け',
      desc: '自宅に光ファイバーを引いて使う、固定回線のWi-Fiです。通信が安定しやすく、家族での同時利用やオンラインゲーム、Web会議にも向いています。',
      good: [
        '通信速度が安定しやすい',
        '多くのプランで、データ量を気にせず使いやすい',
        '何人か同時につないでも速度が落ちにくい'
      ],
      caution: [
        '開通までに工事が必要になる場合があります',
        '集合住宅は、建物の設備によって選べるプランが変わります',
        '引っ越しのときは移転の手続きが必要です'
      ],
      next: { href: 'hikari.html', label: '光回線について調べる' }
    },
    {
      name: 'ホームルーター(置くだけWi-Fi)',
      tagline: '工事なしで、手軽に自宅Wi-Fiを始めたい人向け',
      desc: 'コンセントにつなぐだけで使える、据え置き型のWi-Fiです。工事がいらない反面、モバイル回線を使うため、住んでいる場所の電波状況によって速度が変わります。',
      good: [
        '工事なしで、届いたらすぐ使い始められる',
        '家の中のスマホやパソコンをまとめてつなげる',
        '引っ越し先でも使える(登録住所の変更が必要な場合があります)'
      ],
      caution: [
        '混み合う時間帯は速度が落ちることがあります',
        '電波状況によって使い心地が変わります',
        'プランによっては、大量の通信で速度制限がかかることがあります'
      ],
      next: { href: 'smartphone.html', label: 'スマホ料金診断で通信費をまとめて見直す' }
    },
    {
      name: 'モバイルWi-Fi(持ち運び型)',
      tagline: '外出先でも使いたい、少人数の利用向け',
      desc: 'バッテリーを内蔵した、持ち歩けるWi-Fiです。ノートパソコンやタブレットを外でも使いたい人や、利用する人数が少ない人に向いています。',
      good: [
        '外出先や出張先でも、そのまま使える',
        '工事不要で、契約後に使い始めやすい',
        '1人〜少人数の利用なら十分なこともある'
      ],
      caution: [
        'データ容量に上限があるプランが多いです',
        '充電が必要で、長時間使うとバッテリーが減ります',
        '家族みんなで動画をよく見る使い方には向きにくいです'
      ],
      next: { href: 'sim.html', label: '格安SIMもあわせてチェックする' }
    }
  ];

  /*
   * p: [光回線, ホームルーター, モバイル] に入る点数
   * w: 点数が2以上のタイプについて、結果画面に出す理由(キーは H / R / M)
   */
  var QUESTIONS = [
    {
      text: 'Wi-Fiをおもに使う場所はどこですか?',
      options: [
        { label: '自宅がメイン', p: [2, 2, 0], w: {
          H: '自宅でじっくり使うなら、固定回線の安定感が活きます。',
          R: '自宅で使うなら、コンセントにつなぐだけのホームルーターも選べます。' } },
        { label: '自宅と外出先の両方', p: [1, 1, 2], w: {
          M: '外出先でも使うなら、持ち運べるモバイルWi-Fiが便利です。' } },
        { label: '外出先や出張が多い', p: [0, 0, 4], w: {
          M: '外で使う機会が多いので、持ち運べるタイプが合います。' } }
      ]
    },
    {
      text: 'お住まいのタイプは?',
      options: [
        { label: '戸建て', p: [3, 1, 0], w: {
          H: '戸建てなら光回線の工事を進めやすく、家中に電波を届けやすいです。' } },
        { label: '集合住宅(マンション・アパート)', p: [2, 2, 0], w: {
          H: '集合住宅でも、条件が合えば光回線を快適に使えます。',
          R: '集合住宅で工事を避けたいときは、ホームルーターが手軽です。' } },
        { label: '工事が難しい / 近く引っ越す予定がある', p: [0, 3, 2], w: {
          R: '工事がいらず、引っ越し先にも持って行けます。',
          M: '工事不要で、引っ越し先にもそのまま持って行けます。' } }
      ]
    },
    {
      text: 'Wi-Fiを使う人数は?',
      hint: '家族など、同じWi-Fiにつなぐ人を数えてください。',
      options: [
        { label: '1人', p: [1, 1, 2], w: {
          M: '1人での利用なら、モバイルWi-Fiでも足りるケースが多いです。' } },
        { label: '2人', p: [2, 2, 1], w: {
          H: '2人で同時に使っても、固定回線なら安定しやすいです。',
          R: '2人ほどなら、ホームルーターでも使いやすい人数です。' } },
        { label: '3〜4人', p: [3, 2, 0], w: {
          H: '同時に使う人が増えるので、固定回線の安定感が安心です。',
          R: '使い方が軽めなら、3〜4人でもホームルーターで足りることがあります。' } },
        { label: '5人以上', p: [4, 1, 0], w: {
          H: '接続する機器が多いので、通信が安定する固定回線が向いています。' } }
      ]
    },
    {
      text: 'よく使う用途はどれですか?',
      hint: '当てはまるものが複数あるときは、いちばん多いものを選んでください。',
      options: [
        { label: 'SNS・Webサイトの閲覧', p: [0, 2, 2], w: {
          R: '軽めの使い方なら、ホームルーターでも快適に使えます。',
          M: 'SNSやWebが中心なら、モバイルWi-Fiでも十分なことが多いです。' } },
        { label: '動画(YouTube・配信サービス)', p: [2, 2, 0], w: {
          H: '動画を長く見るなら、データ量を気にしにくい固定回線が安心です。',
          R: '動画視聴なら、ホームルーターでも楽しめます。' } },
        { label: 'オンラインゲーム・大きなファイルのダウンロード', p: [4, 0, 0], w: {
          H: 'ゲームや大容量の通信は、遅れが少なく安定する固定回線が向いています。' } },
        { label: '在宅ワーク・Web会議', p: [3, 1, 0], w: {
          H: 'Web会議は途切れにくい通信が大切なので、固定回線が向いています。' } }
      ]
    },
    {
      text: '1か月に使うデータ量はどのくらいですか?',
      options: [
        { label: '少なめ(SNS・メールが中心)', p: [0, 1, 3], w: {
          M: '使うデータ量が少なめなら、モバイルWi-Fiで無理なく収まりそうです。' } },
        { label: 'ふつう(動画もときどき見る)', p: [1, 2, 1], w: {
          R: 'ふつうの使い方なら、ホームルーターがちょうどよいバランスです。' } },
        { label: '多い(動画やゲームをよく使う)', p: [3, 1, 0], w: {
          H: 'データ量が多い使い方には、容量を気にしにくい固定回線が向いています。' } },
        { label: 'よくわからない', p: [1, 2, 1], w: {
          R: '使用量が読めないときは、手軽に始められるホームルーターが無難です。' } }
      ]
    },
    {
      text: '工事や契約期間について、どう考えていますか?',
      options: [
        { label: '工事してもよい。長く使いたい', p: [3, 1, 0], w: {
          H: '工事を受け入れられるなら、長く使うほど固定回線のよさが出ます。' } },
        { label: '工事は避けたい', p: [0, 3, 2], w: {
          R: '工事なしで、届いたらすぐ使えます。',
          M: '工事なしで、電源を入れればすぐ使えます。' } },
        { label: 'すぐ使いたい / 短い期間だけ使いたい', p: [0, 2, 3], w: {
          R: '工事がなく、早く使い始めやすいです。',
          M: '短期間や急ぎの利用でも始めやすいです。' } }
      ]
    },
    {
      text: 'いちばん大事にしたいことは?',
      options: [
        { label: '月々の安さ', p: [1, 2, 2], w: {
          R: '費用を抑えて自宅で使う方法として、ホームルーターが候補になります。',
          M: '料金を抑えたいとき、データ量が少ない人にはモバイルWi-Fiも候補です。' } },
        { label: '料金と性能のバランス', p: [2, 2, 1], w: {
          H: '料金と性能のバランスを見ても、固定回線は有力な選択肢です。',
          R: '料金と手軽さのバランスがよいのがホームルーターです。' } },
        { label: '速さ・安定性', p: [4, 1, 0], w: {
          H: '速度と安定性を最優先するなら、固定回線がいちばん向いています。' } },
        { label: '手軽さ(届いてすぐ使える)', p: [0, 3, 2], w: {
          R: 'コンセントにつなぐだけで使えて、手軽さが魅力です。',
          M: '電源を入れるだけで使えて、手軽です。' } }
      ]
    }
  ];

  var TOTAL = QUESTIONS.length;
  var state = { step: 0, answers: [] };

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    intro: $('intro'), quiz: $('quiz'), result: $('result'),
    start: $('start-btn'), back: $('back-btn'),
    qNum: $('q-num'), qText: $('q-text'), qHint: $('q-hint'),
    choices: $('choices'), progress: $('progress'), progressBar: $('progress-bar'),
    introCompass: $('intro-compass'), quizCompass: $('quiz-compass'),
    resultBody: $('result-body')
  };

  /* ---------- コンパス(SVG) ---------- */

  function compassSVG(labeled) {
    var i, a, ticks = '', marks = '';
    for (i = 0; i < 24; i++) {
      var major = i % 6 === 0;
      ticks += '<line class="tick' + (major ? ' tick-major' : '') + '" x1="100" y1="' + (major ? 8 : 11) +
        '" x2="100" y2="18" transform="rotate(' + (i * 15) + ' 100 100)"/>';
    }
    if (labeled) {
      var glyphs = ['光', '置', '持'];
      for (i = 0; i < 3; i++) {
        a = NEEDLE_ANGLE[i] * Math.PI / 180;
        marks += '<text class="mark" data-type="' + i + '" x="' + (100 + 74 * Math.sin(a)).toFixed(1) +
          '" y="' + (100 - 74 * Math.cos(a)).toFixed(1) + '">' + glyphs[i] + '</text>';
      }
    }
    return '<svg viewBox="0 0 200 200" role="presentation" focusable="false">' +
      '<circle class="ring" cx="100" cy="100" r="94"/>' + ticks + marks +
      '<g class="needle">' +
        '<polygon class="needle-head" points="100,36 108,100 92,100"/>' +
        '<polygon class="needle-tail" points="100,150 108,100 92,100"/>' +
      '</g>' +
      '<circle class="hub" cx="100" cy="100" r="7"/>' +
    '</svg>';
  }

  function setNeedle(root, deg) {
    var n = root.querySelector('.needle');
    if (n) { n.style.transform = 'rotate(' + deg + 'deg)'; }
  }

  /* ---------- 画面の切り替え ---------- */

  function show(section) {
    el.intro.hidden = section !== 'intro';
    el.quiz.hidden = section !== 'quiz';
    el.result.hidden = section !== 'result';
  }

  function start() {
    state.step = 0;
    state.answers = [];
    show('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var q = QUESTIONS[state.step];
    el.qNum.textContent = '質問 ' + (state.step + 1) + ' / ' + TOTAL;
    el.qText.textContent = q.text;
    el.qHint.textContent = q.hint || '';
    el.qHint.hidden = !q.hint;
    el.progressBar.style.width = (state.step / TOTAL * 100) + '%';
    el.progress.setAttribute('aria-valuenow', String(state.step));
    setNeedle(el.quizCompass, -120 + 240 * state.step / TOTAL);

    el.choices.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.textContent = opt.label;
      b.setAttribute('data-i', String(i));
      if (state.answers[state.step] === i) {
        b.classList.add('is-selected');
        b.setAttribute('aria-pressed', 'true');
      }
      li.appendChild(b);
      el.choices.appendChild(li);
    });
    el.qText.focus();
  }

  function choose(i) {
    state.answers[state.step] = i;
    if (state.step < TOTAL - 1) {
      state.step += 1;
      renderQuestion();
    } else {
      showResult();
    }
  }

  function goBack() {
    if (state.step === 0) {
      show('intro');
      el.start.focus();
    } else {
      state.step -= 1;
      renderQuestion();
    }
  }

  /* ---------- 集計と結果 ---------- */

  function calcScores() {
    var s = [0, 0, 0];
    state.answers.forEach(function (ai, qi) {
      var p = QUESTIONS[qi].options[ai].p;
      for (var k = 0; k < 3; k++) { s[k] += p[k]; }
    });
    return s;
  }

  function listHTML(items, cls) {
    return '<ul class="list ' + cls + '">' +
      items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
  }

  function collectReasons(k) {
    var found = [];
    state.answers.forEach(function (ai, qi) {
      var opt = QUESTIONS[qi].options[ai];
      if (opt.w && opt.w[KEYS[k]]) { found.push({ pts: opt.p[k], text: opt.w[KEYS[k]] }); }
    });
    found.sort(function (a, b) { return b.pts - a.pts; });
    var texts = found.slice(0, 3).map(function (f) { return f.text; });
    if (!texts.length) { texts.push('回答の傾向から、バランスよく当てはまるタイプです。'); }
    return texts;
  }

  function scoreLabel(ratio, isTop) {
    if (isTop) { return 'いちばん合う'; }
    return ratio >= 0.75 ? 'こちらも候補' : '今回は優先度低め';
  }

  function showResult() {
    var scores = calcScores();
    var order = [0, 1, 2].sort(function (a, b) {
      return scores[b] - scores[a] || TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b);
    });
    var top = order[0];
    var t = TYPES[top];
    var topScore = scores[top] || 1;

    var bars = order.map(function (k, idx) {
      var ratio = scores[k] / topScore;
      return '<li class="score-row' + (idx === 0 ? ' is-top' : '') + '">' +
        '<div class="score-head"><span class="score-name">' + TYPES[k].name + '</span>' +
        '<span class="score-label">' + scoreLabel(ratio, idx === 0) + '</span></div>' +
        '<div class="meter" aria-hidden="true"><span style="width:' + Math.max(6, Math.round(ratio * 100)) + '%"></span></div>' +
        '</li>';
    }).join('');

    el.resultBody.innerHTML =
      '<div class="compass compass-xl" id="result-compass" aria-hidden="true">' + compassSVG(true) + '</div>' +
      '<p class="result-kicker">あなたに合いそうなのは</p>' +
      '<h2 id="result-title" tabindex="-1">' + t.name + '</h2>' +
      '<p class="tagline">' + t.tagline + '</p>' +
      '<p class="result-desc">' + t.desc + '</p>' +
      '<div class="block"><h3>このタイプが合いそうな理由</h3>' + listHTML(collectReasons(top), 'list-ok') + '</div>' +
      '<div class="block"><h3>このタイプの良いところ</h3>' + listHTML(t.good, 'list-ok') + '</div>' +
      '<div class="block block-note"><h3>契約前に確認したいこと</h3>' + listHTML(t.caution, 'list-note') + '</div>' +
      '<div class="block"><h3>3タイプの比べ方</h3><ul class="scores">' + bars + '</ul></div>' +
      '<div class="actions">' +
        '<a class="btn-primary" href="' + t.next.href + '">' + t.next.label + '</a>' +
        '<button type="button" class="btn-ghost" id="retry-btn">もう一度診断する</button>' +
      '</div>';

    show('result');

    var compass = $('result-compass');
    var win = compass.querySelector('.mark[data-type="' + top + '"]');
    if (win) { win.classList.add('mark-win'); }
    // 針を中央から勝ったタイプの方向へ動かす
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { setNeedle(compass, NEEDLE_ANGLE[top]); });
    });

    $('retry-btn').addEventListener('click', function () {
      show('intro');
      el.start.focus();
    });
    $('result-title').focus();
  }

  /* ---------- 初期化 ---------- */

  el.introCompass.innerHTML = compassSVG(false);
  el.quizCompass.innerHTML = compassSVG(false);
  setNeedle(el.introCompass, 20);

  el.start.addEventListener('click', start);
  el.back.addEventListener('click', goBack);
  el.choices.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.choice') : null;
    if (btn) { choose(parseInt(btn.getAttribute('data-i'), 10)); }
  });
})();
