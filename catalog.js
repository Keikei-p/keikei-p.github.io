/* data/services.js の内容を比較ページのサービス一覧へ表示する */
(function () {
  'use strict';

  var roots = document.querySelectorAll('[data-catalog-kind]');
  var u = window.TCServiceUtils;
  if (!roots.length || !u) return;

  function textValue(value, fallback) {
    return value == null || value === '' ? fallback : String(value);
  }

  function matchesCategory(service, raw) {
    if (!raw) return true;
    var allowed = raw.split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    if (!allowed.length) return true;

    var values = []
      .concat(service.category || [])
      .concat(service.serviceType || [])
      .map(function (x) { return String(x).toLowerCase(); });

    return values.some(function (value) { return allowed.indexOf(value) >= 0; });
  }

  roots.forEach(function (root) {
    var kind = root.getAttribute('data-catalog-kind');
    var categories = root.getAttribute('data-catalog-category') || '';
    var catalog = window.TC_SERVICE_CATALOG || {};
    var items = Array.isArray(catalog[kind]) ? catalog[kind].filter(function (service) {
      return service && service.id && service.name && matchesCategory(service, categories);
    }) : [];

    var status = root.parentElement && root.parentElement.querySelector('[data-catalog-status]');
    if (status) {
      status.textContent = items.length ? items.length + '件掲載' : 'サービス情報準備中';
    }

    if (!items.length) {
      root.innerHTML =
        '<div class="catalog-empty">' +
          '<strong>サービス情報を準備しています</strong>' +
          '<p>各キャリア・回線の公式情報を確認できたものから、この一覧へ追加します。</p>' +
        '</div>';
      return;
    }

    root.classList.add('has-items');
    root.innerHTML = '';

    items
      .slice()
      .sort(function (a, b) {
        return textValue(a.name, '').localeCompare(textValue(b.name, ''), 'ja');
      })
      .forEach(function (service) {
        var card = document.createElement('article');
        card.className = 'catalog-card';

        var top = document.createElement('div');
        top.className = 'catalog-card-top';

        var titleWrap = document.createElement('div');
        var title = document.createElement('h3');
        title.textContent = service.name;
        titleWrap.appendChild(title);

        if (service.carrier || service.network) {
          var carrier = document.createElement('p');
          carrier.className = 'catalog-carrier';
          carrier.textContent = service.carrier || service.network;
          titleWrap.appendChild(carrier);
        }

        top.appendChild(titleWrap);

        var badge = document.createElement('span');
        badge.className = 'catalog-badge';
        badge.textContent = textValue(service.category, '通信サービス');
        top.appendChild(badge);

        card.appendChild(top);

        var summary = document.createElement('p');
        summary.className = 'catalog-summary';
        summary.textContent = service.summary || '特徴・条件を確認中です。';
        card.appendChild(summary);

        var factList = document.createElement('div');
        factList.className = 'catalog-chips';
        u.quickFacts(service).slice(0, 4).forEach(function (fact) {
          var chip = document.createElement('span');
          chip.className = 'catalog-chip';
          chip.textContent = fact.label + '：' + fact.value;
          factList.appendChild(chip);
        });
        if (factList.children.length) card.appendChild(factList);

        if (Array.isArray(service.suitableFor) && service.suitableFor.length) {
          var fit = document.createElement('p');
          fit.className = 'catalog-fit';
          fit.innerHTML = '<strong>向いている人：</strong>';
          fit.appendChild(document.createTextNode(service.suitableFor[0]));
          card.appendChild(fit);
        }

        if (Array.isArray(service.cautions) && service.cautions.length) {
          var caution = document.createElement('p');
          caution.className = 'catalog-caution';
          caution.innerHTML = '<strong>注意：</strong>';
          caution.appendChild(document.createTextNode(service.cautions[0]));
          card.appendChild(caution);
        }

        var freshness = u.freshness(service, 365);
        var checked = document.createElement('p');
        checked.className = 'catalog-checked is-' + freshness.state;
        checked.textContent = freshness.label;
        card.appendChild(checked);

        var actions = document.createElement('div');
        actions.className = 'catalog-actions';

        var detail = document.createElement('a');
        detail.className = 'btn btn-ghost';
        detail.href = 'service.html?id=' + encodeURIComponent(service.id);
        detail.textContent = '詳しく見る';
        actions.appendChild(detail);

        var external = u.externalUrl(service);
        if (external) {
          var official = document.createElement('a');
          official.className = 'btn btn-primary';
          official.href = external;
          official.target = '_blank';
          official.rel = service.affiliateUrl ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
          official.textContent = '最新の料金・特典を確認する';
          official.setAttribute('data-track', 'catalog-official-click');
          official.setAttribute('data-service-id', service.id);
          actions.appendChild(official);
        }

        card.appendChild(actions);
        root.appendChild(card);
      });
  });
})();