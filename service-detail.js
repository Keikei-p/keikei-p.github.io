/* data/services.js の1件をサービス詳細ページとして表示する */
(function () {
  'use strict';

  var root = document.getElementById('service-detail');
  var u = window.TCServiceUtils;
  if (!root || !u) return;

  var id = new URLSearchParams(window.location.search).get('id');
  var catalog = window.TC_SERVICE_CATALOG || {};
  var all = []
    .concat(Array.isArray(catalog.smartphone) ? catalog.smartphone : [])
    .concat(Array.isArray(catalog.wifi) ? catalog.wifi : []);

  var service = all.find(function (item) {
    return item && item.id === id;
  });

  function esc(value) {
    return u.escapeHtml(value);
  }

  function addList(title, items, className) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<section class="service-block ' + (className || '') + '"><h2>' + esc(title) + '</h2><ul class="service-list">' +
      items.map(function (item) {
        return '<li>' + esc(item) + '</li>';
      }).join('') +
      '</ul></section>';
  }

  function renderPlanTable(plans) {
    if (!Array.isArray(plans) || !plans.length) return '';

    return '<section class="service-block"><h2>料金プラン</h2>' +
      '<div class="service-table-scroll" tabindex="0" role="region" aria-label="料金プラン表（横にスクロールできます）">' +
      '<table class="service-plan-table"><thead><tr>' +
      '<th>プラン</th><th>料金</th><th>データ・容量</th><th>通話</th><th>補足</th>' +
      '</tr></thead><tbody>' +
      plans.map(function (plan) {
        return '<tr>' +
          '<th scope="row">' + esc(plan.name || 'プラン') + '</th>' +
          '<td>' + esc(plan.price || '確認中') + '</td>' +
          '<td>' + esc(plan.data || '確認中') + '</td>' +
          '<td>' + esc(plan.calls || '確認中') + '</td>' +
          '<td>' + esc(plan.note || '') + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div></section>';
  }

  function renderSources(service) {
    var sources = u.sourceItems(service);
    if (!sources.length) {
      return '<section class="service-block service-sources"><h2>情報の確認について</h2>' +
        '<p>公式情報の参照先は登録準備中です。料金や契約条件を掲載するときは、公式情報の確認日と参照元を記録します。</p>' +
      '</section>';
    }

    return '<section class="service-block service-sources"><h2>確認した公式情報</h2>' +
      '<ul class="service-source-list">' +
      sources.map(function (source) {
        return '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.label) + '</a></li>';
      }).join('') +
      '</ul>' +
      '<p class="service-source-date">情報確認日：' + esc(service.checkedAt || '未登録') +
      (service.priceCheckedAt ? ' ／ 料金確認日：' + esc(service.priceCheckedAt) : '') + '</p>' +
    '</section>';
  }

  if (!id || !service) {
    root.innerHTML =
      '<section class="service-hero service-empty">' +
        '<span class="service-category">準備中</span>' +
        '<h1>サービス情報がまだ登録されていません</h1>' +
        '<p class="service-summary">各キャリア・Wi-Fiの情報を登録すると、このページに詳細が自動表示されます。</p>' +
        '<div class="service-actions"><a class="btn btn-primary" href="index.html">トップページへ戻る</a></div>' +
      '</section>';
    return;
  }

  document.title = service.name + ' | つうしんコンパス';

  var externalUrl = u.externalUrl(service);
  var facts = u.quickFacts(service);
  var isAffiliate = Boolean(service.affiliateUrl);

  var actions =
    '<div class="service-actions">' +
      (externalUrl
        ? '<a class="btn btn-primary" href="' + esc(externalUrl) + '" target="_blank" rel="' + (isAffiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer') + '" data-track="service-official-click">公式サイトで詳細を確認する</a>'
        : '<span class="btn btn-ghost" aria-disabled="true">公式リンク準備中</span>') +
    '</div>' +
    (isAffiliate
      ? '<p class="service-ad-note">このリンクにはアフィリエイト広告を含みます。おすすめ理由は広告報酬ではなく、掲載情報と診断条件を基準にしています。</p>'
      : '');

  var quickFacts =
    '<div class="service-quick-grid">' +
      '<div class="service-quick service-quick-price"><span>料金目安</span><strong>' + esc(u.priceLabel(service)) + '</strong></div>' +
      facts.slice(0, 6).map(function (fact) {
        return '<div class="service-quick"><span>' + esc(fact.label) + '</span><strong>' + esc(fact.value) + '</strong></div>';
      }).join('') +
    '</div>';

  var highlights = Array.isArray(service.highlights) && service.highlights.length
    ? addList('主な特徴', service.highlights, 'service-positive')
    : '';

  var payments = Array.isArray(service.paymentMethods) && service.paymentMethods.length
    ? service.paymentMethods.join(' / ')
    : '確認中';

  var meta = [
    ['提供元・回線', service.carrier || service.network || '確認中'],
    ['カテゴリ', service.category || '確認中'],
    ['支払い方法', payments],
    ['情報確認日', service.checkedAt || '未登録'],
    ['情報更新日', service.updatedAt || '未登録']
  ];

  root.innerHTML =
    '<section class="service-hero">' +
      '<div class="service-hero-top">' +
        '<span class="service-category">' + esc(service.category || '通信サービス') + '</span>' +
        (service.checkedAt ? '<span class="service-verified">確認日 ' + esc(service.checkedAt) + '</span>' : '') +
      '</div>' +
      '<h1>' + esc(service.name) + '</h1>' +
      '<p class="service-summary">' + esc(service.summary || 'サービス内容を確認中です。') + '</p>' +
      quickFacts +
      actions +
    '</section>' +
    highlights +
    '<section class="service-block"><h2>基本情報</h2><dl class="service-meta">' +
      meta.map(function (row) {
        return '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
      }).join('') +
    '</dl></section>' +
    addList('向いている人', service.suitableFor, 'service-positive') +
    addList('向いていない可能性がある人', service.notSuitableFor, 'service-neutral') +
    renderPlanTable(service.plans) +
    addList('契約前の注意点', service.cautions, 'service-caution') +
    '<section class="service-block service-final-check"><h2>申込み前の最終確認</h2>' +
      '<p>料金・キャンペーン・割引条件・提供エリア・解約条件などは変更されることがあります。契約前には、必ず公式サイトで最新情報をご確認ください。</p>' +
    '</section>' +
    renderSources(service);
})();