/* data/services.js の内容を比較ページのサービス一覧へ表示する */
(function () {
  'use strict';

  var roots = document.querySelectorAll('[data-catalog-kind]');
  if (!roots.length) return;

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

  function fact(label, value) {
    if (value == null || value === '') return '';
    return '<div class="catalog-fact"><dt>' + label + '</dt><dd>' + value + '</dd></div>';
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

        var title = document.createElement('h3');
        title.textContent = service.name;
        top.appendChild(title);

        var badge = document.createElement('span');
        badge.className = 'catalog-badge';
        badge.textContent = textValue(service.category, '通信サービス');
        top.appendChild(badge);

        card.appendChild(top);

        var summary = document.createElement('p');
        summary.className = 'catalog-summary';
        summary.textContent = service.summary || '特徴・条件を確認中です。';
        card.appendChild(summary);

        var dl = document.createElement('dl');
        dl.className = 'catalog-facts';
        dl.innerHTML =
          fact('提供元', service.carrier || service.network) +
          fact('料金', service.monthlyPrice == null ? '公式情報確認後に掲載' : service.monthlyPrice) +
          fact('確認日', service.checkedAt || '未登録');
        card.appendChild(dl);

        var actions = document.createElement('div');
        actions.className = 'catalog-actions';

        var detail = document.createElement('a');
        detail.className = 'btn btn-ghost';
        detail.href = 'service.html?id=' + encodeURIComponent(service.id);
        detail.textContent = '詳しく見る';
        actions.appendChild(detail);

        var external = service.affiliateUrl || service.officialUrl;
        if (external) {
          var official = document.createElement('a');
          official.className = 'btn btn-primary';
          official.href = external;
          official.target = '_blank';
          official.rel = 'sponsored noopener noreferrer';
          official.textContent = '公式サイトで確認する';
          actions.appendChild(official);
        }

        card.appendChild(actions);
        root.appendChild(card);
      });
  });
})();
