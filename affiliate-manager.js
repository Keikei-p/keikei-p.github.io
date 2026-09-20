/* つうしんコンパス - アフィリエイト広告共通取得ロジック */
(function () {
  'use strict';

  var master = window.TC_AFFILIATE_MASTER || { ads: [] };
  var ads = Array.isArray(master.ads) ? master.ads.slice() : [];
  var source = 'static';

  function text(value) {
    return value == null ? '' : String(value).trim();
  }

  function normalizePriority(value) {
    var n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function normalizeAd(ad) {
    if (!ad || !text(ad.service_id)) return null;
    return {
      id: text(ad.id) || [text(ad.service_id), text(ad.asp_name), String(normalizePriority(ad.priority))].join('-'),
      service_id: text(ad.service_id),
      service_name: text(ad.service_name),
      category: text(ad.category),
      provider: text(ad.provider),
      affiliate_url: text(ad.affiliate_url),
      official_url: text(ad.official_url),
      display_name: text(ad.display_name),
      description: text(ad.description),
      price: text(ad.price),
      campaign: text(ad.campaign),
      reward: text(ad.reward),
      asp_name: text(ad.asp_name),
      is_active: ad.is_active === true,
      priority: normalizePriority(ad.priority),
      updated_at: text(ad.updated_at)
    };
  }

  function normalizedAds() {
    return ads.map(normalizeAd).filter(Boolean);
  }

  function findService(serviceId) {
    var catalog = window.TC_SERVICE_CATALOG || {};
    var all = []
      .concat(Array.isArray(catalog.smartphone) ? catalog.smartphone : [])
      .concat(Array.isArray(catalog.wifi) ? catalog.wifi : []);

    return all.find(function (service) {
      return service && service.id === serviceId;
    }) || null;
  }

  function getAds(serviceId, options) {
    var opts = options || {};
    return normalizedAds()
      .filter(function (ad) {
        if (ad.service_id !== serviceId) return false;
        if (opts.activeOnly && (!ad.is_active || !ad.affiliate_url)) return false;
        return true;
      })
      .sort(function (a, b) {
        return b.priority - a.priority ||
          String(b.updated_at).localeCompare(String(a.updated_at)) ||
          a.asp_name.localeCompare(b.asp_name, 'ja');
      });
  }

  function getPreferredAd(serviceId) {
    var active = getAds(serviceId, { activeOnly: true });
    return active.length ? active[0] : null;
  }

  function resolve(serviceOrId, fallbackOfficialUrl) {
    var service = typeof serviceOrId === 'string'
      ? findService(serviceOrId)
      : (serviceOrId || null);

    var serviceId = typeof serviceOrId === 'string'
      ? serviceOrId
      : (service && service.id) || '';

    var ad = serviceId ? getPreferredAd(serviceId) : null;
    var officialUrl = (ad && ad.official_url) ||
      text(fallbackOfficialUrl) ||
      text(service && service.officialUrl);

    return {
      service_id: serviceId,
      url: ad ? ad.affiliate_url : officialUrl,
      official_url: officialUrl,
      is_affiliate: Boolean(ad),
      asp_name: ad ? ad.asp_name : '',
      ad_id: ad ? ad.id : '',
      display_name: (ad && ad.display_name) || text(service && service.name),
      description: (ad && ad.description) || text(service && service.summary),
      price: ad ? ad.price : '',
      campaign: ad ? ad.campaign : '',
      source: ad ? 'affiliate' : 'official'
    };
  }

  function replaceAll(nextAds, nextSource) {
    ads = Array.isArray(nextAds) ? nextAds.slice() : [];
    source = nextSource || 'runtime';

    document.dispatchEvent(new CustomEvent('tc:affiliate-ready', {
      detail: {
        source: source,
        count: ads.length
      }
    }));

    applyToDom();
  }

  function applyToDom(root) {
    var scope = root || document;
    var links = scope.querySelectorAll ? scope.querySelectorAll('[data-affiliate-service]') : [];

    links.forEach(function (link) {
      var serviceId = link.getAttribute('data-affiliate-service') || '';
      var fallback = link.getAttribute('data-official-url') || '';
      var resolved = resolve(serviceId, fallback);

      if (!resolved.url) {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        return;
      }

      link.href = resolved.url;
      link.target = '_blank';
      link.rel = resolved.is_affiliate
        ? 'sponsored noopener noreferrer'
        : 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      link.setAttribute('data-link-source', resolved.source);

      if (resolved.asp_name) {
        link.setAttribute('data-asp-name', resolved.asp_name);
      } else {
        link.removeAttribute('data-asp-name');
      }

      if (resolved.ad_id) {
        link.setAttribute('data-ad-id', resolved.ad_id);
      } else {
        link.removeAttribute('data-ad-id');
      }
    });
  }

  window.TCAffiliateManager = {
    getAds: getAds,
    getPreferredAd: getPreferredAd,
    resolve: resolve,
    replaceAll: replaceAll,
    applyToDom: applyToDom,
    getSource: function () { return source; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyToDom();
    });
  } else {
    applyToDom();
  }
})();
