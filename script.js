// A8リンクマネージャーを全公開ページで共通利用する
(function () {
  if (document.querySelector('script[data-a8-link-manager]')) return;
  var script = document.createElement('script');
  script.src = 'https://statics.8me.jp/a8link/a8linkmgr.js';
  script.async = true;
  script.setAttribute('data-a8-link-manager', 'true');
  function applyA8Links() {
    if (typeof window.a8linkmgr === 'function') {
      window.a8linkmgr({ config_id: 'xscDAEb8nIg719oYTD8a' });
    }
  }

  script.onload = function () {
    applyA8Links();
    document.addEventListener('tc:affiliate-ready', function () {
      window.setTimeout(applyA8Links, 0);
    });
  };
  document.head.appendChild(script);
})();

// つうしんコンパス - 共通スクリプト
// モバイルメニューと共通フッターを担当する軽量な処理

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    [
      ["サービス一覧", "services.html"],
      ["ガイド", "guides.html"]
    ].forEach(([label, href]) => {
      if (!nav.querySelector('a[href="' + href + '"]')) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        nav.appendChild(link);
      }
    });

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const page = href.split("#")[0];
      if (page && page === currentPath) {
        link.classList.add("is-current");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  // 全ページ共通のフッターナビ。既存リンクは重複させず不足分だけ追加する。
  const footerContainer = document.querySelector(".site-footer .container");
  if (footerContainer) {
    let policyNav = footerContainer.querySelector(".footer-policy-nav") || footerContainer.querySelector("nav");
    if (!policyNav) {
      policyNav = document.createElement("nav");
      policyNav.setAttribute("aria-label", "サイト情報");
      footerContainer.appendChild(policyNav);
    }
    policyNav.classList.add("footer-policy-nav");

    [
      ["サービス一覧", "services.html"],
      ["ガイド", "guides.html"],
      ["運営者情報", "operator.html"],
      ["広告掲載ポリシー", "advertising-policy.html"],
      ["アフィリエイトについて", "affiliate.html"],
      ["情報更新方針", "update-policy.html"],
      ["プライバシー", "privacy.html"],
      ["利用規約", "terms.html"],
      ["お問い合わせ", "contact.html"]
    ].forEach(([label, href]) => {
      if (!policyNav.querySelector('a[href="' + href + '"]')) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        policyNav.appendChild(link);
      }
    });
  }
});
