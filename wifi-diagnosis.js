/* つうしんコンパス - Wi-Fi診断
 * 光回線(H) / ホームルーター(R) / モバイルWi-Fi(M) の傾向を8問で判定する。
 * スマホ回線はWi-Fiタイプの点数には影響させず、光回線候補のセット割相性にだけ使う。
 */
(function () {
  'use strict';

  var KEYS = ['H', 'R', 'M'];
  var TIE_ORDER = [1, 0, 2];

  var TYPES = [
    {
      name: '光回線 + Wi-Fiルーター',
      tagline: '速度と安定性を重視したい人向け',
      desc: '自宅へ固定回線を引いて使うタイプです。家族での同時利用、動画、オンラインゲーム、Web会議など、通信の安定性を重視する使い方に向きやすいです。',
      good: [
        '通信が安定しやすい',
        '大容量通信を使う家庭でも候補になりやすい',
        '複数台を同時接続する使い方と相性がよい'
      ],
      caution: [
        '開通工事が必要になる場合があります',
        '建物や住所によって利用できる回線が異なります',
        '引っ越し時には移転や解約の手続きが必要になる場合があります'
      ],
      next: { href: 'hikari.html', label: '光回線比較を見る' }
    },
    {
      name: 'ホームルーター',
      tagline: '工事なしと自宅利用のバランスを重視したい人向け',
      desc: '端末を自宅に置いて使うタイプです。工事を避けたい人や、固定回線ほどの準備をせず自宅用Wi-Fiを始めたい人の候補になりやすいです。',
      good: [
        '工事なしで始めやすい',
        '自宅のWi-Fi環境を比較的シンプルに作りやすい',
        '固定回線とモバイルWi-Fiの中間的な選択肢になりやすい'
      ],
      caution: [
        '利用場所や時間帯によって通信品質が変わる場合があります',
        '登録住所など利用場所に条件があるサービスがあります',
        'オンラインゲームなど遅延に敏感な用途は相性確認が必要です'
      ],
      next: { href: 'index.html#menu', label: 'ほかの比較を見る' }
    },
    {
      name: 'モバイルWi-Fi',
      tagline: '持ち運びや短期利用を重視したい人向け',
      desc: '小型端末を持ち運んで使うタイプです。外出先でも使いたい人や、固定設置より携帯性を優先したい人の候補になりやすいです。',
      good: [
        '外出先へ持ち運びやすい',
        '工事なしで始めやすい',
        '一人での利用や比較的軽い通信用途と相性がよい場合があります'
      ],
      caution: [
        'プランによってデータ容量や速度制御の条件が異なります',
        '建物内や利用エリアで通信状況が変わります',
        '家族での同時利用や大容量通信では不足する場合があります'
      ],
      next: { href: 'index.html#menu', label: 'ほかの比較を見る' }
    }
  ];

  var QUESTIONS = [
    {
      id: 'home',
      text: '主にどこでWi-Fiを使いますか？',
      options: [
        { label: '自宅だけで使う', p: [2, 3, 0], w: { H: '自宅中心なら固定回線が使いやすい候補です。', R: '自宅中心で工事を避けたい場合はホームルーターも候補です。' } },
        { label: '自宅と外出先の両方', p: [0, 1, 4], w: { M: '外へ持ち出したい使い方なので、モバイルWi-Fiと相性があります。' } },
        { label: '外出先で使うことが多い', p: [0, 0, 5], w: { M: '持ち運びを重視する使い方なので、モバイルWi-Fiが候補になりやすいです。' } }
      ]
    },
    {
      id: 'people',
      text: '同時に使う人数はどのくらいですか？',
      options: [
        { label: '1人', p: [1, 2, 2], w: { R: '一人利用ならホームルーターでも対応しやすい場合があります。', M: '一人で軽めに使うならモバイルWi-Fiも候補になります。' } },
        { label: '2人', p: [2, 2, 1], w: { H: '複数台を安定して使うなら固定回線が候補です。', R: '使い方が軽めならホームルーターも比較できます。' } },
        { label: '3〜4人', p: [4, 2, 0], w: { H: '同時利用が増えるため、固定回線の安定性が候補になりやすいです。' } },
        { label: '5人以上', p: [5, 1, 0], w: { H: '接続台数が多い家庭では固定回線が候補になりやすいです。' } }
      ]
    },
    {
      id: 'purpose',
      text: 'よく使う用途はどれですか？',
      hint: '複数当てはまる場合は、いちばん重い使い方を選んでください。',
      options: [
        { label: 'SNS・Web・メール', p: [0, 2, 3], w: { M: '比較的軽い通信が中心ならモバイルWi-Fiも検討しやすいです。' } },
        { label: '動画視聴', p: [3, 2, 0], w: { H: '動画を長時間見るなら固定回線が候補になりやすいです。', R: '動画中心でも利用状況によってはホームルーターを比較できます。' } },
        { label: 'オンラインゲーム・大容量ダウンロード', p: [5, 0, 0], w: { H: '遅延や大容量通信を重視する用途では固定回線が候補になりやすいです。' } },
        { label: '在宅勤務・Web会議', p: [4, 1, 0], w: { H: 'Web会議など安定性が必要な用途では固定回線が候補になりやすいです。' } }
      ]
    },
    {
      id: 'data',
      text: '1か月のデータ利用量はどのくらいですか？',
      options: [
        { label: '少なめ', p: [0, 1, 3], w: { M: 'データ利用が少なめならモバイルWi-Fiも比較しやすいです。' } },
        { label: 'ふつう', p: [1, 3, 1], w: { R: '一般的な使い方ならホームルーターも候補になりやすいです。' } },
        { label: 'かなり多い', p: [4, 1, 0], w: { H: '大容量通信を多く使うなら固定回線を優先して比較しやすいです。' } },
        { label: 'よくわからない', p: [1, 2, 1], w: { R: '利用量が読みにくい場合は、用途と工事可否も合わせて比較しましょう。' } }
      ]
    },
    {
      id: 'construction',
      text: '回線工事についてどう考えていますか？',
      options: [
        { label: '工事しても問題ない', p: [4, 1, 0], w: { H: '工事が可能なら固定回線を含めて比較できます。' } },
        { label: 'できれば工事したくない', p: [0, 4, 2], w: { R: '工事を避けたいのでホームルーターが候補になりやすいです。', M: '工事不要という点ではモバイルWi-Fiも候補です。' } },
        { label: '工事できない', p: [0, 5, 3], w: { R: '工事できない環境ではホームルーターを優先して比較しやすいです。' } }
      ]
    },
    {
      id: 'move',
      text: '引っ越しや短期利用の予定はありますか？',
      options: [
        { label: '当面引っ越す予定はない', p: [3, 2, 0], w: { H: '長く同じ場所で使うなら固定回線を検討しやすいです。' } },
        { label: '1年以内に引っ越す可能性がある', p: [0, 3, 2], w: { R: '引っ越しの可能性があるなら工事不要タイプも比較しやすいです。' } },
        { label: '短期間だけ使いたい', p: [0, 1, 4], w: { M: '短期利用を重視するなら持ち運べるタイプも候補です。' } }
      ]
    },
    {
      id: 'mobile-carrier',
      text: 'いま使っているスマホ回線はどれですか？',
      hint: '光回線になった場合、スマホとのセット割を確認するために使います。',
      options: [
        { label: 'ドコモ', tag: 'docomo-set', p: [0, 0, 0], w: {} },
        { label: 'au / UQ mobile', tag: 'au-uq-set', p: [0, 0, 0], w: {} },
        { label: 'SoftBank / Y!mobile', tag: 'softbank-set', p: [0, 0, 0], w: {} },
        { label: '楽天モバイル', tag: 'rakuten-mobile', p: [0, 0, 0], w: {} },
        { label: 'その他 / わからない', tag: 'carrier-other', p: [0, 0, 0], w: {} }
      ]
    },
    {
      id: 'priority',
      text: 'いちばん重視したいことは何ですか？',
      options: [
        { label: '速度・安定性', p: [5, 1, 0], w: { H: '速度と安定性を重視する回答なので固定回線が候補になりやすいです。' } },
        { label: '工事なしの手軽さ', p: [0, 5, 2], w: { R: '工事なしで自宅利用したい回答なのでホームルーターと相性があります。' } },
        { label: '持ち運びやすさ', p: [0, 0, 5], w: { M: '持ち運びを最優先する回答なのでモバイルWi-Fiと相性があります。' } },
        { label: '料金と使いやすさのバランス', p: [2, 3, 1], w: { R: '料金と手軽さのバランスを見たい場合はホームルーターも比較候補です。' } }
      ]
    }
  ];

  var els = {
    quiz: document.getElementById('quiz'),
    result: document.getElementById('result'),
    qCurrent: document.getElementById('q-current'),
    qTotal: document.getElementById('q-total'),
    progressTrack: document.getElementById('progress-track'),
    progressFill: document.getElementById('progress-fill'),
    questionTitle: document.getElementById('question-title'),
    hint: document.getElementById('q-hint'),
    optionList: document.getElementById('option-list'),
    backBtn: document.getElementById('back-btn'),
    resultCompass: document.getElementById('result-compass'),
    resultType: document.getElementById('result-type'),
    resultTagline: document.getElementById('result-tagline'),
    resultDesc: document.getElementById('result-desc'),
    resultExtra: document.getElementById('result-extra'),
    resultNext: document.getElementById('result-next'),
    retryBtn: document.getElementById('retry-btn')
  };

  if (!els.quiz || !els.optionList || !els.result) return;

  var currentIndex = 0;
  var answers = [];

  els.qTotal.textContent = QUESTIONS.length;
  els.progressTrack.setAttribute('aria-valuemax', String(QUESTIONS.length));

  function compassSVG(top) {
    var labels = ['光', '置', '持'];
    var xs = [45, 100, 155];

    return '<svg viewBox="0 0 200 200" role="presentation" focusable="false">' +
      '<circle class="ring" cx="100" cy="100" r="90"></circle>' +
      '<circle class="ring-inner" cx="100" cy="100" r="70"></circle>' +
      labels.map(function (label, index) {
        return '<text class="mark' + (index === top ? ' mark-win' : '') + '" x="' + xs[index] + '" y="43">' + label + '</text>';
      }).join('') +
      '<g class="needle" style="transform:rotate(' + (top === 0 ? -50 : top === 1 ? 0 : 50) + 'deg)">' +
        '<polygon class="needle-head" points="100,35 108,100 92,100"></polygon>' +
        '<polygon class="needle-tail" points="100,150 108,100 92,100"></polygon>' +
      '</g>' +
      '<circle class="hub" cx="100" cy="100" r="7"></circle>' +
    '</svg>';
  }

  function renderQuestion() {
    var question = QUESTIONS[currentIndex];

    els.qCurrent.textContent = currentIndex + 1;
    els.progressFill.style.width = (currentIndex / QUESTIONS.length * 100) + '%';
    els.progressTrack.setAttribute('aria-valuenow', String(currentIndex + 1));
    els.questionTitle.textContent = question.text;
    els.hint.textContent = question.hint || '';
    els.hint.hidden = !question.hint;
    els.optionList.innerHTML = '';

    question.options.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'wifi-option';
      button.textContent = option.label;
      button.addEventListener('click', function () {
        selectOption(question, option);
      });
      els.optionList.appendChild(button);
    });

    els.backBtn.hidden = currentIndex === 0;
    els.questionTitle.focus();
  }

  function selectOption(question, option) {
    answers.push({
      questionId: question.id,
      label: option.label,
      p: option.p,
      w: option.w || {},
      tag: option.tag || ''
    });

    Array.prototype.forEach.call(els.optionList.querySelectorAll('.wifi-option'), function (button) {
      button.disabled = true;
      if (button.textContent === option.label) button.classList.add('is-selected');
    });

    window.setTimeout(function () {
      if (currentIndex < QUESTIONS.length - 1) {
        currentIndex += 1;
        renderQuestion();
      } else {
        showResult();
      }
    }, 160);
  }

  function goBack() {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    answers.pop();
    renderQuestion();
  }

  function calcScores() {
    var scores = [0, 0, 0];

    answers.forEach(function (answer) {
      answer.p.forEach(function (point, index) {
        scores[index] += point;
      });
    });

    return scores;
  }

  function collectReasons(top) {
    var key = KEYS[top];
    var reasons = [];

    answers.forEach(function (answer) {
      if (answer.w && answer.w[key]) {
        reasons.push({
          point: answer.p[top],
          text: answer.w[key]
        });
      }
    });

    reasons.sort(function (a, b) { return b.point - a.point; });
    return reasons.slice(0, 3).map(function (item) { return item.text; });
  }

  function collectTags() {
    return answers.map(function (answer) {
      return answer.tag || '';
    }).filter(Boolean);
  }

  function list(items, className) {
    return '<ul class="wifi-list ' + className + '">' +
      items.map(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        return li.outerHTML;
      }).join('') +
    '</ul>';
  }

  function showResult() {
    var scores = calcScores();
    var order = [0, 1, 2].sort(function (a, b) {
      return scores[b] - scores[a] || TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b);
    });
    var top = order[0];
    var type = TYPES[top];
    var topScore = scores[top] || 1;
    var reasons = collectReasons(top);

    if (!reasons.length) {
      reasons.push('回答全体のバランスから、このタイプが比較候補になりました。');
    }

    var bars = order.map(function (index, rank) {
      var ratio = scores[index] / topScore;
      var label = rank === 0 ? 'いちばん合いやすい' : ratio >= 0.75 ? 'こちらも候補' : '今回は優先度低め';

      return '<li class="wifi-score' + (rank === 0 ? ' is-top' : '') + '">' +
        '<div class="wifi-score-head"><span class="wifi-score-name">' + TYPES[index].name + '</span><span class="wifi-score-label">' + label + '</span></div>' +
        '<div class="wifi-meter" aria-hidden="true"><span style="width:' + Math.max(6, Math.round(ratio * 100)) + '%"></span></div>' +
      '</li>';
    }).join('');

    els.progressFill.style.width = '100%';
    els.resultCompass.innerHTML = compassSVG(top);
    els.resultType.textContent = type.name;
    els.resultTagline.textContent = type.tagline;
    els.resultDesc.textContent = type.desc;

    els.resultExtra.innerHTML =
      '<section class="wifi-block"><h3>このタイプが合いそうな理由</h3>' + list(reasons, 'wifi-list-ok') + '</section>' +
      '<section class="wifi-block"><h3>良いところ</h3>' + list(type.good, 'wifi-list-ok') + '</section>' +
      '<section class="wifi-block wifi-block-note"><h3>契約前に確認したいこと</h3>' + list(type.caution, 'wifi-list-note') + '</section>' +
      '<section class="wifi-block"><h3>3タイプの比べ方</h3><ul class="wifi-scores">' + bars + '</ul></section>';

    els.resultNext.href = type.next.href;
    els.resultNext.textContent = type.next.label;
    els.quiz.hidden = true;
    els.result.hidden = false;

    document.dispatchEvent(new CustomEvent('tc:diagnosis-result', {
      detail: {
        kind: 'wifi',
        profile: KEYS[top],
        tags: collectTags(),
        answers: answers.slice()
      }
    }));

    els.resultType.focus();
    els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function restart() {
    currentIndex = 0;
    answers = [];
    els.result.hidden = true;
    els.quiz.hidden = false;

    var recommendationRoot = document.getElementById('service-recommendations');
    if (recommendationRoot) {
      recommendationRoot.classList.remove('has-items');
      recommendationRoot.innerHTML =
        '<div class="recommend-empty"><strong>候補サービスを準備しています</strong><p>診断完了後に候補が表示されます。</p></div>';
    }

    renderQuestion();
    els.quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  els.backBtn.addEventListener('click', goBack);
  els.retryBtn.addEventListener('click', restart);
  renderQuestion();
})();