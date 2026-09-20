/* 診断結果からサービス候補を最大3件表示する共通処理 */
(function () {
  'use strict';

  var u = window.TCServiceUtils;
  if (!u) return;

  function catalogFor(kind) {
    var catalog = window.TC_SERVICE_CATALOG || {};
    return Array.isArray(catalog[kind]) ? catalog[kind] : [];
  }

  function getScore(service, profile, tags) {
    var fit = service.fit || {};
    var score = Number(fit[profile] || 0);
    (tags || []).forEach(function (tag) {
      score += Number(fit[tag] || 0);
    });
    return score;
  }

  function safeText(value) {
    return value == null ? '' : String(value);
  }

  function createReasonList(service, profile, tags) {
    var reasons = [];
    var reasonMap = service.matchReasons || {};

    if (reasonMap[profile]) reasons.push(reasonMap[profile]);

    (tags || []).forEach(function (tag) {
      if (reasonMap[tag] && reasons.indexOf(reasonMap[tag]) === -1) {
        reasons.push(reasonMap[tag]);
      }
    });

    if (!reasons.length && Array.isArray(service.suitableFor)) {
      reasons = service.suitableFor.slice(0, 2);
    }

    return reasons.slice(0, 3);
  }

  function renderEmpty(root, detail) {
    var message = detail && detail.kind === 'wifi' && detail.profile === 'M'
      ? 'モバイルWi-Fiの個別サービスは現在準備中です。タイプ診断の結果を参考にしながら、公式情報を確認できたサービスから追加します。'
      : 'サービス情報を登録すると、診断結果に合う候補がここへ最大3件表示されます。';

    root.classList.remove('has-items');
    root.innerHTML =
      '<div class="recommend-empty">' +
        '<strong>候補サービスは現在準備中です</strong>' +
        '<p>' + message + '</p>' +
      '</div>';
  }

  function render(detail) {
    var root = document.getElementById('service-recommendations');
    if (!root) return;

    var kind = detail.kind;
    var profile = detail.profile;
    var tags = detail.tags || [];
    var services = catalogFor(kind);

    if (!services.length) {
      renderEmpty(root, detail);
      return;
    }

    var ranked = services
      .filter(function (service) { return service && service.id && service.name; })
      .map(function (service) {
        return { service: service, score: getScore(service, profile, tags) };
      })
      .filter(function (entry) { return entry.score > 0; })
      .sort(function (a, b) {
        return b.score - a.score || safeText(a.service.name).localeCompare(safeText(b.service.name), 'ja');
      })
      .slice(0, 3);

    if (!ranked.length) {
      renderEmpty(root, detail);
      return;
    }

    root.classList.add('has-items');
    root.innerHTML = '';

    ranked.forEach(function (entry, index) {
      var service = entry.service;
      var card = document.createElement('article');
      card.className = 'recommend-card';

      var rank = document.createElement('span');
      rank.className = 'recommend-rank';
      rank.textContent = 'あなたの候補';
      card.appendChild(rank);

      var title = document.createElement('h4');
      title.textContent = service.name;
      card.appendChild(title);

      var summary = document.createElement('p');
      summary.className = 'recommend-summary';
      summary.textContent = service.summary || 'サービスの詳細情報を確認できます。';
      card.appendChild(summary);

      var facts = document.createElement('div');
      facts.className = 'recommend-facts';
      u.quickFacts(service).slice(0, 3).forEach(function (fact) {
        var item = document.createElement('span');
        item.textContent = fact.label + '：' + fact.value;
        facts.appendChild(item);
      });
      if (facts.children.length) card.appendChild(facts);

      var reasons = createReasonList(service, profile, tags);
      if (reasons.length) {
        var reasonTitle = document.createElement('p');
        reasonTitle.className = 'recommend-reason-title';
        reasonTitle.textContent = 'この候補になった理由';
        card.appendChild(reasonTitle);

        var list = document.createElement('ul');
        list.className = 'recommend-reasons';
        reasons.forEach(function (reason) {
          var li = document.createElement('li');
          li.textContent = reason;
          list.appendChild(li);
        });
        card.appendChild(list);
      }

      if (Array.isArray(service.cautions) && service.cautions.length) {
        var caution = document.createElement('p');
        caution.className = 'recommend-caution';
        caution.innerHTML = '<strong>確認したい点：</strong>';
        caution.appendChild(document.createTextNode(service.cautions[0]));
        card.appendChild(caution);
      }

      var actions = document.createElement('div');
      actions.className = 'recommend-actions';

      var detailLink = document.createElement('a');
      detailLink.className = 'btn btn-ghost';
      detailLink.href = 'service.html?id=' + encodeURIComponent(service.id);
      detailLink.textContent = '理由と注意点を見る';
      actions.appendChild(detailLink);

      var externalUrl = u.externalUrl(service);
      if (externalUrl) {
        var officialLink = document.createElement('a');
        officialLink.className = 'btn btn-primary';
        officialLink.href = externalUrl;
        officialLink.target = '_blank';
        officialLink.rel = service.affiliateUrl ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
        officialLink.textContent = '最新の料金・特典を確認する';
        officialLink.setAttribute('data-track', 'diagnosis-official-click');
        officialLink.setAttribute('data-service-id', service.id);
        actions.appendChild(officialLink);
      }

      card.appendChild(actions);
      root.appendChild(card);
    });
  }

  document.addEventListener('tc:diagnosis-result', function (event) {
    render(event.detail || {});
  });
})();