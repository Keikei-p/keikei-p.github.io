// つうしんコンパス - スマホ料金診断
// 質問に答えるたびにスコアを集計し、最後に傾向タイプを表示する

(() => {
  const QUESTIONS = [
    {
      id: "carrier",
      title: "現在利用しているキャリアを教えてください",
      options: [
        { label: "docomo" },
        { label: "au" },
        { label: "SoftBank" },
        { label: "楽天モバイル" },
        { label: "格安SIM" },
        { label: "その他" },
      ],
    },
    {
      id: "data",
      title: "毎月のデータ使用量はどのくらいですか",
      options: [
        { label: "〜3GB", tag: "light-data" },
        { label: "3〜10GB", tag: "mid-data" },
        { label: "10〜30GB", tag: "high-data" },
        { label: "30GB以上", tag: "heavy-data" },
      ],
    },
    {
      id: "price",
      title: "毎月のスマホ料金はどのくらいですか",
      options: [
        { label: "〜3,000円", tag: "price-low" },
        { label: "3,000〜5,000円", tag: "price-mid" },
        { label: "5,000〜8,000円", tag: "price-high" },
        { label: "8,000円以上", tag: "price-very-high" },
      ],
    },
    {
      id: "call",
      title: "通話はどのくらいしますか",
      options: [
        { label: "ほとんどしない", score: { cost: 1 } },
        { label: "たまにする", score: { balance: 1 } },
        { label: "よくする", score: { balance: 1, quality: 1 }, tag: "call-often" },
        { label: "長電話が多い", score: { quality: 2 }, tag: "call-long" },
      ],
    },
    {
      id: "support",
      title: "店舗でのサポートは必要ですか",
      options: [
        { label: "必要", score: { quality: 2, balance: 1 }, tag: "support-needed" },
        { label: "なくてもOK", score: { cost: 2 } },
      ],
    },
    {
      id: "priority",
      title: "通信品質への希望を教えてください",
      options: [
        { label: "とにかく安くしたい", score: { cost: 3 } },
        { label: "料金と品質のバランス重視", score: { balance: 3 } },
        { label: "料金より通信品質重視", score: { quality: 3 } },
      ],
    },
    {
      id: "family",
      title: "ご家族の人数を教えてください",
      options: [
        { label: "1人", score: { cost: 1 } },
        { label: "2人", score: { balance: 1 } },
        { label: "3人以上", score: { balance: 1, quality: 1 }, tag: "family-large" },
      ],
    },
  ];

  const TYPES = {
    cost: {
      name: "とにかく節約重視タイプ",
      desc:
        "月々の負担をできるだけ小さくしたい方に近い傾向です。必要な機能を絞り込んで、料金の安さを優先する選び方が合いそうです。",
    },
    balance: {
      name: "料金と品質のバランス重視タイプ",
      desc:
        "安さだけでなく、通信の安定感やサポートも程よく欲しい方に近い傾向です。極端に安いプランよりも、バランスの取れた選択肢が合いそうです。",
    },
    quality: {
      name: "通信品質・サポート重視タイプ",
      desc:
        "料金よりも通信の安定感やサポート体制を大事にしたい方に近い傾向です。多少料金が高くても、安心して使えることを優先する選び方が合いそうです。",
    },
  };

  const TAG_MESSAGES = {
    "heavy-data": "データ使用量が多いので、容量を気にせず使えるプランかどうかを確認しておくと安心です。",
    "high-data": "データ使用量がやや多めなので、月々の容量に余裕があるプランが候補になりやすいです。",
    "light-data": "データ使用量が少なめなので、小容量プランでも十分まかなえる可能性があります。",
    "call-long": "通話時間が長い場合、通話込みプランや通話定額の有無を確認するのがおすすめです。",
    "call-often": "通話の頻度が高い場合、通話料金の仕組みも合わせてチェックしておくと安心です。",
    "support-needed": "店舗サポートを重視する場合、対面で相談できる窓口があるかどうかが選ぶ基準になります。",
    "family-large": "家族の人数が多い場合、家族でまとめて契約すると割引が使えることがあります。",
    "price-very-high": "今の料金がやや高めなので、見直すだけで負担が軽くなる余地があるかもしれません。",
  };

  const els = {
    quiz: document.getElementById("quiz"),
    result: document.getElementById("result"),
    qCurrent: document.getElementById("q-current"),
    qTotal: document.getElementById("q-total"),
    progressFill: document.getElementById("progress-fill"),
    questionTitle: document.getElementById("question-title"),
    optionList: document.getElementById("option-list"),
    backBtn: document.getElementById("back-btn"),
    resultType: document.getElementById("result-type"),
    resultDesc: document.getElementById("result-desc"),
    resultTags: document.getElementById("result-tags"),
    retryBtn: document.getElementById("retry-btn"),
  };

  // このページに診断UIが無ければ何もしない(念のため)
  if (!els.quiz || !els.optionList) return;

  let currentIndex = 0;
  let answers = []; // { tag, score } の履歴。戻るボタンで巻き戻す

  els.qTotal.textContent = QUESTIONS.length;

  function renderQuestion() {
    const question = QUESTIONS[currentIndex];

    els.qCurrent.textContent = currentIndex + 1;
    const progressPercent = (currentIndex / QUESTIONS.length) * 100;
    els.progressFill.style.width = `${progressPercent}%`;

    els.questionTitle.textContent = question.title;

    els.optionList.innerHTML = "";
    question.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = option.label;
      btn.addEventListener("click", () => selectOption(option));
      els.optionList.appendChild(btn);
    });

    els.backBtn.hidden = currentIndex === 0;
  }

  function selectOption(option) {
    answers.push({ tag: option.tag, score: option.score || {} });

    // 選んだボタンを少しだけ強調してから次へ進む
    const buttons = els.optionList.querySelectorAll(".option-btn");
    buttons.forEach((b) => {
      b.disabled = true;
      if (b.textContent === option.label) {
        b.classList.add("is-selected");
      }
    });

    window.setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        currentIndex += 1;
        renderQuestion();
      } else {
        showResult();
      }
    }, 220);
  }

  function goBack() {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    answers.pop();
    renderQuestion();
  }

  function calculateType() {
    const totals = { cost: 0, balance: 0, quality: 0 };
    answers.forEach((a) => {
      Object.entries(a.score).forEach(([key, value]) => {
        totals[key] += value;
      });
    });

    // 同点の場合は balance を優先してバランス寄りの結果にする
    let best = "balance";
    let bestScore = totals.balance;
    if (totals.cost > bestScore) {
      best = "cost";
      bestScore = totals.cost;
    }
    if (totals.quality > bestScore) {
      best = "quality";
      bestScore = totals.quality;
    }
    return best;
  }

  function showResult() {
    els.progressFill.style.width = "100%";
    els.qCurrent.textContent = QUESTIONS.length;

    const typeKey = calculateType();
    const type = TYPES[typeKey];

    els.resultType.textContent = type.name;
    els.resultDesc.textContent = type.desc;

    els.resultTags.innerHTML = "";
    const seenTags = new Set();
    answers.forEach((a) => {
      if (a.tag && TAG_MESSAGES[a.tag] && !seenTags.has(a.tag)) {
        seenTags.add(a.tag);
        const li = document.createElement("li");
        li.textContent = TAG_MESSAGES[a.tag];
        els.resultTags.appendChild(li);
      }
    });

    if (els.resultTags.children.length === 0) {
      const li = document.createElement("li");
      li.textContent = "回答内容から、特に大きな注意点は見つかりませんでした。";
      els.resultTags.appendChild(li);
    }

    els.quiz.hidden = true;
    els.result.hidden = false;
    els.result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function restart() {
    currentIndex = 0;
    answers = [];
    els.result.hidden = true;
    els.quiz.hidden = false;
    renderQuestion();
    els.quiz.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  els.backBtn.addEventListener("click", goBack);
  els.retryBtn.addEventListener("click", restart);

  renderQuestion();
})();
