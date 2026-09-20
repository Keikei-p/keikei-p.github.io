/* data/services.js の1件をサービス詳細ページとして表示する */
(function () {
  'use strict';

  var root = document.getElementById('service-detail');
  if (!root) return;

  var id = new URLSearchParams(window.location.search).get('id');
  var catalog = window.TC_SERVICE_CATALOG || {};
  var all = []
    .concat(Array.isArray(catalog.smartphone) ? catalog.smartphone : [])
    .concat(Array.isArray(catalog.wifi) ? catalog.wifi : []);

  var service = all.find(function (item) {
    return item && item.id === id;
  });

  function addList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<section class="service-block"><h2>' + title + '</h2><ul>' +
      items.map(function (item) {
        var li = document.createElement('li');
        li.textContent = String(item);
        return li.outerHTML;
      }).join('') +
      '</ul></section>';
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

  var externalUrl = service.affiliateUrl || service.officialUrl;
  var actions =
    '<div class="service-actions">' +
      (externalUrl
        ? '<a class="btn btn-primary" href="' + externalUrl + '" target="_blank" rel="sponsored noopener noreferrer">公式サイトで詳細を確認する</a>'
        : '<span class="btn btn-ghost" aria-disabled="true">公式リンク準備中</span>') +
    '</div>';

  var meta = [
    ['回線・提供元', service.carrier || service.network || '確認中'],
    ['カテゴリ', service.category || '確認中'],
    ['eSIM', service.esim === true ? '対応' : service.esim === false ? '非対応または未確認' : '確認中'],
    ['店舗サポート', service.storeSupport === true ? 'あり' : service.storeSupport === false ? 'なしまたは未確認' : '確認中'],
    ['情報確認日', service.checkedAt || '未登録'],
    ['情報更新日', service.updatedAt || '未登録']
  ];

  root.innerHTML =
    '<section class="service-hero">' +
      '<span class="service-category">' + (service.category || '通信サービス') + '</span>' +
      '<h1>' + service.name + '</h1>' +
      '<p class="service-summary">' + (service.summary || 'サービス内容を確認中です。') + '</p>' +
      actions +
    '</section>' +
    '<section class="service-block"><h2>基本情報</h2><dl class="service-meta">' +
      meta.map(function (row) {
        return '<div><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>';
      }).join('') +
    '</dl></section>' +
    addList('向いている人', service.suitableFor) +
    addList('向いていない可能性がある人', service.notSuitableFor) +
    addList('契約前の注意点', service.cautions) +
    '<section class="service-block"><h2>料金・条件について</h2>' +
      '<p>料金・キャンペーン・割引条件は変更されることがあります。掲載時は公式情報を確認し、確認日と参照元を記録します。</p>' +
    '</section>';
})();
