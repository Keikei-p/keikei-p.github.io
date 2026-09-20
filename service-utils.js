/* つうしんコンパス - サービス表示共通ユーティリティ */
(function () {
  'use strict';

  function text(value, fallback) {
    return value == null || value === '' ? (fallback || '') : String(value);
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function yesNoUnknown(value, yesLabel, noLabel) {
    if (value === true) return yesLabel || '対応';
    if (value === false) return noLabel || '非対応';
    return '確認中';
  }

  function priceLabel(service) {
    if (!service) return '確認中';
    if (service.priceLabel) return String(service.priceLabel);
    if (service.monthlyPrice != null && service.monthlyPrice !== '') {
      return String(service.monthlyPrice);
    }
    return '公式情報確認後に掲載';
  }

  function dataLabel(service) {
    if (!service) return '';
    if (service.dataLabel) return String(service.dataLabel);
    if (Array.isArray(service.dataOptions) && service.dataOptions.length) {
      return service.dataOptions.map(function (item) {
        return typeof item === 'string' ? item : (item && (item.label || item.name)) || '';
      }).filter(Boolean).join(' / ');
    }
    return '';
  }

  function callLabel(service) {
    if (!service) return '';
    if (service.callLabel) return String(service.callLabel);
    if (Array.isArray(service.callOptions) && service.callOptions.length) {
      return service.callOptions.map(function (item) {
        return typeof item === 'string' ? item : (item && (item.label || item.name)) || '';
      }).filter(Boolean).slice(0, 2).join(' / ');
    }
    return '';
  }

  function supportLabel(service) {
    if (!service) return '';
    if (service.supportLabel) return String(service.supportLabel);
    return yesNoUnknown(service.storeSupport, '店舗サポートあり', 'オンライン中心');
  }

  function discountLabel(service) {
    if (!service) return '';
    if (service.discountLabel) return String(service.discountLabel);

    var labels = [];
    if (service.familyDiscount === true) labels.push('家族割あり');
    if (service.setDiscount === true) labels.push('セット割あり');
    if (labels.length) return labels.join(' / ');

    if (service.familyDiscount === false && service.setDiscount === false) {
      return '主なセット割なし';
    }
    return '';
  }

  function quickFacts(service) {
    var facts = [];
    var data = dataLabel(service);
    var calls = callLabel(service);
    var support = supportLabel(service);
    var discounts = discountLabel(service);

    if (data) facts.push({ label: 'データ・容量', value: data });
    if (calls) facts.push({ label: '通話', value: calls });
    if (service && service.esim != null) {
      facts.push({ label: 'eSIM', value: yesNoUnknown(service.esim, '対応', '非対応') });
    }
    if (support) facts.push({ label: 'サポート', value: support });
    if (discounts) facts.push({ label: '割引', value: discounts });
    if (service && service.areaLabel) facts.push({ label: 'エリア', value: String(service.areaLabel) });
    if (service && service.constructionLabel) facts.push({ label: '工事', value: String(service.constructionLabel) });
    if (service && service.speedLabel) facts.push({ label: '通信', value: String(service.speedLabel) });
    if (service && service.contractLabel) facts.push({ label: '契約', value: String(service.contractLabel) });

    return facts;
  }

  function sourceItems(service) {
    var raw = service && Array.isArray(service.sourceUrls) ? service.sourceUrls : [];
    return raw.map(function (item, index) {
      if (typeof item === 'string') {
        return { label: '公式情報 ' + (index + 1), url: item };
      }
      if (item && item.url) {
        return {
          label: item.label || ('公式情報 ' + (index + 1)),
          url: item.url
        };
      }
      return null;
    }).filter(Boolean);
  }

  function freshness(service, maxDays) {
    var raw = service && service.checkedAt;
    if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(String(raw))) {
      return { state: 'unknown', label: '情報確認日 未登録' };
    }

    var checked = new Date(String(raw) + 'T00:00:00');
    if (Number.isNaN(checked.getTime())) {
      return { state: 'unknown', label: '情報確認日 未登録' };
    }

    var days = Math.floor((Date.now() - checked.getTime()) / 86400000);
    var limit = Number(maxDays || 90);

    if (days < 0) return { state: 'unknown', label: '確認日 ' + raw };
    if (days > limit) return { state: 'stale', label: '要再確認：' + raw + ' 時点' };
    return { state: 'fresh', label: '確認済み：' + raw };
  }

  function externalUrl(service) {
    if (!service) return '';
    if (window.TCAffiliateManager) {
      var resolved = window.TCAffiliateManager.resolve(service);
      return resolved.url || resolved.official_url || '';
    }
    return service.officialUrl || '';
  }

  window.TCServiceUtils = {
    text: text,
    escapeHtml: escapeHtml,
    yesNoUnknown: yesNoUnknown,
    priceLabel: priceLabel,
    dataLabel: dataLabel,
    callLabel: callLabel,
    supportLabel: supportLabel,
    discountLabel: discountLabel,
    quickFacts: quickFacts,
    sourceItems: sourceItems,
    freshness: freshness,
    externalUrl: externalUrl
  };
})();