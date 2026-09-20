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

    return '<section class="service-block ' + (className || '') + '">' +
      '<h2>' + esc(title) + '</h2>' +
      '<ul class="service-list">' +
        items.map(function (item) {
          return '<li>' + esc(item) + '</li>';
        }).join('') +
      '</ul>' +
    '</section>';
  }

  function renderSources(currentService) {
    var sources = u.sourceItems(currentService);

    if (!sources.length) {
      return '<section class="service-block service-sources">' +
        '<h2>情報の確認について</h2>' +
        '<p>公式情報の参照先は登録準備中です。サービスの特徴や条件を掲載するときは、確認日と参照元を記録します。</p>' +
      '</section>';
    }

    return '<section class="service-block service-sources">' +
      '<h2>確認した公式情報</h2>' +
      '<ul class="service-source-list">' +
        sources.map(function (source) {
          return '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' +
            esc(source.label) +
          '</a></li>';
        }).join('') +
      '</ul>' +
      '<p class="service-source-date">情報確認日：' +
        esc(currentService.checkedAt || '未登録') +
      '</p>' +
    '</section>';
  }

  function resolveLink(currentService) {
    if (window.TCAffiliateManager) {
      return window.TCAffiliateManager.resolve(currentService);
    }

    return {
      url: currentService.officialUrl || '',
      is_affiliate: false,
      asp_name: '',
      ad_id: '',
      campaign: '',
      source: 'official'
    };
  }

  function render() {
    if (!id || !service) {
      root.innerHTML =
        '<section class="service-hero service-empty">' +
          '<span class="service-category">準備中</span>' +
          '<h1>サービス情報がまだ登録されていません</h1>' +
          '<p class="service-summary">サービス情報を登録すると、このページに詳細が自動表示されます。</p>' +
          '<div class="service-actions"><a class="btn btn-primary" href="index.html">トップページへ戻る</a></div>' +
        '</section>';
      return;
    }

    document.title = service.name + ' | つうしんコンパス';

    var resolved = resolveLink(service);
    var affiliateManager = window.TCAffiliateManager;
    var useAffiliateCode = Boolean(
      resolved.affiliate_code &&
      affiliateManager &&
      affiliateManager.isSafeAffiliateCode &&
      affiliateManager.isSafeAffiliateCode(resolved.affiliate_code)
    );
    var isAffiliateLink = Boolean(resolved.url && resolved.is_affiliate);
    var isAffiliatePresentation = useAffiliateCode || isAffiliateLink;
    var targetUrl = useAffiliateCode ? '' : (resolved.url || resolved.official_url || '');
    var facts = u.quickFacts(service);
    var fresh = u.freshness(service, 365);

    var linkAttrs = '';
    if (isAffiliateLink) {
      linkAttrs += ' rel="sponsored noopener noreferrer"';
    } else {
      linkAttrs += ' rel="noopener noreferrer"';
    }
    linkAttrs += ' data-track="service-official-click"';
    linkAttrs += ' data-service-id="' + esc(service.id) + '"';
    linkAttrs += ' data-link-source="' + esc(resolved.source || 'official') + '"';
    if (resolved.asp_name) {
      linkAttrs += ' data-asp-name="' + esc(resolved.asp_name) + '"';
    }
    if (resolved.ad_id) {
      linkAttrs += ' data-ad-id="' + esc(resolved.ad_id) + '"';
    }

    var actions =
      '<div class="service-actions">' +
        (useAffiliateCode
          ? '<div id="service-affiliate-code-slot"></div>'
          : (targetUrl
            ? '<a class="btn btn-primary" href="' + esc(targetUrl) + '" target="_blank"' + linkAttrs + '>最新の料金・特典を確認する</a>'
            : '<span class="btn btn-ghost" aria-disabled="true">公式リンク準備中</span>')) +
      '</div>' +
      (isAffiliatePresentation
        ? '<p class="service-ad-note">この表示にはアフィリエイト広告を含みます。診断候補は広告報酬ではなく、回答内容との相性をもとに表示しています。</p>'
        : '');

    var quickFacts =
      '<div class="service-quick-grid">' +
        facts.slice(0, 6).map(function (fact) {
          return '<div class="service-quick">' +
            '<span>' + esc(fact.label) + '</span>' +
            '<strong>' + esc(fact.value) + '</strong>' +
          '</div>';
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

    var campaignBlock = isAffiliatePresentation && resolved.campaign
      ? '<section class="service-block service-positive">' +
          '<h2>提携先で確認できる特典情報</h2>' +
          '<p>' + esc(resolved.campaign) + '</p>' +
          '<p class="service-source-date">特典の適用条件・期限はリンク先で必ずご確認ください。</p>' +
        '</section>'
      : '';

    root.innerHTML =
      '<section class="service-hero">' +
        '<div class="service-hero-top">' +
          '<span class="service-category">' + esc(service.category || '通信サービス') + '</span>' +
          '<span class="service-verified service-verified-' + esc(fresh.state) + '">' + esc(fresh.label) + '</span>' +
        '</div>' +
        '<h1>' + esc(service.name) + '</h1>' +
        '<p class="service-summary">' + esc(service.summary || 'サービス内容を確認中です。') + '</p>' +
        quickFacts +
        actions +
      '</section>' +
      campaignBlock +
      highlights +
      '<section class="service-block"><h2>基本情報</h2><dl class="service-meta">' +
        meta.map(function (row) {
          return '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
        }).join('') +
      '</dl></section>' +
      addList('向いている人', service.suitableFor, 'service-positive') +
      addList('向いていない可能性がある人', service.notSuitableFor, 'service-neutral') +
      addList('契約前の注意点', service.cautions, 'service-caution') +
      '<section class="service-block service-final-check">' +
        '<h2>料金・特典はここでは固定しません</h2>' +
        '<p>通信サービスの料金やキャンペーンは変わりやすいため、このサイトでは細かな金額を固定表示しません。候補を絞ったあと、公式サイトや提携先で最新の料金・特典・適用条件を確認してください。</p>' +
      '</section>' +
      renderSources(service);

    if (useAffiliateCode) {
      var slot = document.getElementById('service-affiliate-code-slot');
      var placement = affiliateManager.createCodePlacement(resolved, {
        compact: false,
        track: 'service-official-click'
      });
      if (slot && placement) {
        slot.replaceWith(placement);
      } else if (slot && resolved.official_url) {
        var fallbackLink = document.createElement('a');
        fallbackLink.className = 'btn btn-primary';
        fallbackLink.href = resolved.official_url;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        fallbackLink.textContent = '最新の料金・特典を確認する';
        fallbackLink.setAttribute('data-track', 'service-official-click');
        fallbackLink.setAttribute('data-service-id', service.id);
        fallbackLink.setAttribute('data-link-source', 'official');
        slot.replaceWith(fallbackLink);
      }
    }
  }

  render();

  document.addEventListener('tc:affiliate-ready', function () {
    render();
  });
})();