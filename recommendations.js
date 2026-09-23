/* 診断結果からサービス候補を最大3件表示する共通処理 */
(function () {
  'use strict';

  var u = window.TCServiceUtils;
  var lastDetail = null;
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

  function resolveLink(service) {
    if (window.TCAffiliateManager) {
      return window.TCAffiliateManager.resolve(service);
    }

    return {
      url: service.officialUrl || '',
      is_affiliate: false,
      asp_name: '',
      ad_id: '',
      source: 'official'
    };
  }

  function renderEmpty(root, detail) {
    var isMobileWifi = detail && detail.kind === 'wifi' && detail.profile === 'M';
    var title = isMobileWifi
      ? 'モバイルWi-Fiは条件を確認して選びましょう'
      : 'この条件では候補を絞りきれませんでした';
    var message = isMobileWifi
      ? 'モバイルWi-Fiはデータ容量・エリア・速度制御・端末条件の差が大きいため、まず選び方を確認してから最新プランを比較してください。'
      : '条件を少し変えて診断し直すか、サービス一覧から特徴と注意点を比較できます。';
    var href = isMobileWifi ? 'mobile-wifi.html' : 'services.html';
    var label = isMobileWifi ? 'モバイルWi-Fiの選び方を見る' : 'サービス一覧を見る';

    root.classList.remove('has-items');
    root.innerHTML =
      '<div class="recommend-empty">' +
        '<strong>' + title + '</strong>' +
        '<p>' + message + '</p>' +
        '<p><a class="btn btn-ghost" href="' + href + '">' + label + '</a></p>' +
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
      .filter(function (service) {
        return service && service.id && service.name;
      })
      .map(function (service) {
        return {
          service: service,
          score: getScore(service, profile, tags)
        };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score ||
          safeText(a.service.name).localeCompare(safeText(b.service.name), 'ja');
      })
      .slice(0, 3);

    if (!ranked.length) {
      renderEmpty(root, detail);
      return;
    }

    root.classList.add('has-items');
    root.innerHTML = '';

    ranked.forEach(function (entry) {
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
      detailLink.href = 'service-' + encodeURIComponent(service.id) + '.html';
      detailLink.textContent = '理由と注意点を見る';
      actions.appendChild(detailLink);

      var resolved = resolveLink(service);
      var manager = window.TCAffiliateManager;
      var codePlacement = resolved.affiliate_code && manager && manager.createCodePlacement
        ? manager.createCodePlacement(resolved, { compact: true, track: 'diagnosis-official-click' })
        : null;

      if (codePlacement) {
        actions.appendChild(codePlacement);
      } else {
        var targetUrl = resolved.url || resolved.official_url || '';
        if (targetUrl) {
          var external = document.createElement('a');
          var isAffiliateLink = Boolean(resolved.url && resolved.is_affiliate);
          external.className = 'btn btn-primary';
          external.href = targetUrl;
          external.target = '_blank';
          external.rel = isAffiliateLink
            ? 'sponsored noopener noreferrer'
            : 'noopener noreferrer';
          external.textContent = '詳細はこちら';
          external.setAttribute('data-track', 'diagnosis-official-click');
          external.setAttribute('data-service-id', service.id);
          external.setAttribute('data-link-source', isAffiliateLink ? 'affiliate' : 'official');
          if (isAffiliateLink && resolved.asp_name) external.setAttribute('data-asp-name', resolved.asp_name);
          if (isAffiliateLink && resolved.ad_id) external.setAttribute('data-ad-id', resolved.ad_id);
          actions.appendChild(external);
        }
      }

      card.appendChild(actions);
      root.appendChild(card);
    });

    if (detail && detail.kind === 'wifi') {
      var sponsored = document.createElement('aside');
      sponsored.className = 'recommend-sponsored';
      sponsored.setAttribute('aria-label', 'PR');
      sponsored.innerHTML =
        '<span class="recommend-sponsored-label">PR</span>' +
        '<a href="https://px.a8.net/svt/ejp?a8mat=4BCHZQ+WQVTM+548I+609HT" rel="nofollow sponsored noopener noreferrer" target="_blank">' +
          '<img border="0" width="300" height="250" alt="おすすめインターネットサービスのPR" src="https://www25.a8.net/svt/bgt?aid=260923670055&wid=002&eno=01&mid=s00000023877001009000&mc=1" loading="lazy">' +
        '</a>' +
        '<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4BCHZQ+WQVTM+548I+609HT" alt="">' +
        '<p>見直し候補とあわせて確認できる提携サービスです。料金・提供条件・キャンペーンはリンク先で最新情報をご確認ください。</p>';
      root.appendChild(sponsored);
    }
  }

  document.addEventListener('tc:diagnosis-result', function (event) {
    lastDetail = event.detail || {};
    render(lastDetail);
  });

  document.addEventListener('tc:affiliate-ready', function () {
    if (lastDetail) render(lastDetail);
  });
})();