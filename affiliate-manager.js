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

  function canonicalServiceId(value) {
    var raw = text(value);
    var key = raw.toLowerCase().replace(/[\s_]/g, '-');
    var aliases = {
      'biglobe': 'biglobe-hikari',
      'biglobe-hikari': 'biglobe-hikari',
      'biglobe光': 'biglobe-hikari',
      'ビッグローブ': 'biglobe-hikari',
      'ビッグローブ光': 'biglobe-hikari'
    };
    return aliases[key] || raw;
  }

  function normalizeAd(ad) {
    if (!ad || !text(ad.service_id)) return null;

    var affiliateCode = text(ad.affiliate_code);
    var affiliateUrl = text(ad.affiliate_url);

    return {
      id: text(ad.id) || [text(ad.service_id), text(ad.asp_name), String(normalizePriority(ad.priority))].join('-'),
      service_id: canonicalServiceId(ad.service_id),
      service_name: text(ad.service_name),
      category: text(ad.category),
      provider: text(ad.provider),
      affiliate_url: affiliateUrl,
      affiliate_code: affiliateCode,
      render_mode: affiliateCode ? 'code' : 'url',
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

  function hasAffiliateTarget(ad) {
    return Boolean(ad && (text(ad.affiliate_code) || text(ad.affiliate_url)));
  }

  function normalizedAds() {
    return ads.map(normalizeAd).filter(Boolean);
  }

  function findService(serviceId) {
    serviceId = canonicalServiceId(serviceId);
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
        if (opts.activeOnly && (!ad.is_active || !hasAffiliateTarget(ad))) return false;
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
      ? canonicalServiceId(serviceOrId)
      : canonicalServiceId((service && service.id) || '');

    var ad = serviceId ? getPreferredAd(serviceId) : null;
    var officialUrl = (ad && ad.official_url) ||
      text(fallbackOfficialUrl) ||
      text(service && service.officialUrl);
    var codeMode = Boolean(ad && text(ad.affiliate_code));

    return {
      service_id: serviceId,
      url: ad && !codeMode ? ad.affiliate_url : (!ad ? officialUrl : ''),
      official_url: officialUrl,
      affiliate_code: ad ? ad.affiliate_code : '',
      render_mode: ad ? (codeMode ? 'code' : 'url') : 'official',
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

  function isSafeAffiliateCode(code) {
    var raw = text(code);
    if (!raw) return false;
    if (/\\</.test(raw) || /\[[^\]]*https?:\/\//i.test(raw)) return false;

    var template = document.createElement('template');
    template.innerHTML = raw;

    var elements = Array.prototype.slice.call(template.content.querySelectorAll('*'));
    if (!elements.length || !template.content.querySelector('a[href]')) return false;

    var allowed = {
      A: ['href', 'rel', 'target', 'title', 'referrerpolicy'],
      IMG: ['src', 'alt', 'width', 'height', 'border', 'loading', 'referrerpolicy']
    };

    return elements.every(function (element) {
      var tag = element.tagName;
      if (!allowed[tag]) return false;

      return Array.prototype.slice.call(element.attributes).every(function (attr) {
        var name = attr.name.toLowerCase();
        if (name.indexOf('on') === 0 || allowed[tag].indexOf(name) === -1) return false;
        if ((name === 'href' || name === 'src') && !/^https?:\/\//i.test(attr.value)) return false;
        return true;
      });
    });
  }

  function isButtonCompatibleCode(code) {
    var raw = text(code);
    if (!raw || !isSafeAffiliateCode(raw)) return false;

    var template = document.createElement('template');
    template.innerHTML = raw;

    var anchor = template.content.querySelector('a[href]');
    if (!anchor || !text(anchor.textContent)) return false;

    var visibleImages = Array.prototype.slice.call(template.content.querySelectorAll('img')).filter(function (img) {
      var width = Number(img.getAttribute('width') || img.width || 0);
      var height = Number(img.getAttribute('height') || img.height || 0);
      return width > 1 || height > 1;
    });

    return visibleImages.length === 0;
  }

  function createCodePlacement(resolved, options) {
    if (!resolved || !resolved.affiliate_code || !isSafeAffiliateCode(resolved.affiliate_code)) {
      return null;
    }

    var opts = options || {};
    var buttonCompatible = isButtonCompatibleCode(resolved.affiliate_code);
    var wrapper = document.createElement('div');
    wrapper.className = 'affiliate-code-placement' +
      (opts.compact ? ' is-compact' : '') +
      (buttonCompatible ? ' is-button-compatible' : '');
    wrapper.setAttribute('data-track', opts.track || 'affiliate-code-click');
    wrapper.setAttribute('data-service-id', resolved.service_id || '');
    wrapper.setAttribute('data-link-source', 'affiliate-code');
    if (resolved.asp_name) wrapper.setAttribute('data-asp-name', resolved.asp_name);
    if (resolved.ad_id) wrapper.setAttribute('data-ad-id', resolved.ad_id);

    // ASP発行コード自体は改変しない。上で安全性を確認してから、そのまま挿入する。
    wrapper.innerHTML = resolved.affiliate_code;
    return wrapper;
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

  function removeGeneratedPlacement(link) {
    var sibling = link.nextElementSibling;
    if (sibling && sibling.classList && sibling.classList.contains('affiliate-code-generated')) {
      sibling.remove();
    }
  }

  function applyToDom(root) {
    var scope = root || document;
    var links = scope.querySelectorAll ? scope.querySelectorAll('[data-affiliate-service]') : [];

    links.forEach(function (link) {
      var serviceId = link.getAttribute('data-affiliate-service') || '';
      var fallback = link.getAttribute('data-official-url') || '';
      var resolved = resolve(serviceId, fallback);

      removeGeneratedPlacement(link);

      if (resolved.affiliate_code) {
        var placement = createCodePlacement(resolved, {
          compact: link.hasAttribute('data-affiliate-compact'),
          track: link.getAttribute('data-track') || 'affiliate-code-click'
        });

        if (placement) {
          placement.classList.add('affiliate-code-generated');
          link.hidden = true;
          link.removeAttribute('href');
          link.insertAdjacentElement('afterend', placement);
          return;
        }
      }

      link.hidden = false;
      var targetUrl = resolved.url || resolved.official_url;

      if (!targetUrl) {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        return;
      }

      link.href = targetUrl;
      link.target = '_blank';
      link.rel = resolved.url && resolved.is_affiliate
        ? 'sponsored noopener noreferrer'
        : 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      link.setAttribute('data-link-source', resolved.url && resolved.is_affiliate ? 'affiliate' : 'official');

      if (!link.getAttribute('data-track')) {
        link.setAttribute('data-track', 'affiliate-cta-click');
      }

      if (resolved.url && resolved.asp_name) {
        link.setAttribute('data-asp-name', resolved.asp_name);
      } else {
        link.removeAttribute('data-asp-name');
      }

      if (resolved.url && resolved.ad_id) {
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
    createCodePlacement: createCodePlacement,
    isSafeAffiliateCode: isSafeAffiliateCode,
    isButtonCompatibleCode: isButtonCompatibleCode,
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
