/* つうしんコンパス - ディスプレイ広告共通管理 */
(function () {
  'use strict';

  var config = window.TC_DISPLAY_ADS || {};
  var scriptPromise = null;

  function isReady() {
    return config.enabled === true &&
      config.provider === 'adsense' &&
      /^ca-pub-\d+$/.test(String(config.client || ''));
  }

  function loadScript() {
    if (!isReady()) return Promise.resolve(false);
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-tc-adsense]');
      if (existing) {
        resolve(true);
        return;
      }

      var script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.tcAdsense = '1';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
        encodeURIComponent(config.client);
      script.onload = function () { resolve(true); };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return scriptPromise;
  }

  function renderSlot(root) {
    if (!root || root.dataset.adRendered === '1') return;

    var slotName = root.getAttribute('data-display-ad') || '';
    var slotId = config.slots && config.slots[slotName];

    if (!isReady() || !slotId) {
      root.hidden = true;
      return;
    }

    root.hidden = false;
    root.dataset.adRendered = '1';
    root.innerHTML = '';

    var label = document.createElement('div');
    label.className = 'display-ad-label';
    label.textContent = '広告';

    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', config.client);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');

    root.append(label, ins);

    loadScript().then(function (loaded) {
      if (!loaded) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('Display ad render failed:', error);
      }
    }).catch(function (error) {
      root.hidden = true;
      console.warn('AdSense script load failed:', error);
    });
  }

  function render(scope) {
    var base = scope || document;
    var slots = base.querySelectorAll ? base.querySelectorAll('[data-display-ad]') : [];
    Array.prototype.forEach.call(slots, renderSlot);
  }

  window.TCDisplayAds = {
    render: render,
    isReady: isReady
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { render(document); });
  } else {
    render(document);
  }
})();
