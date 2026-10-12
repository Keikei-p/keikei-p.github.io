// 共通アクセス計測（公開ページのみ）
// Google Analytics 4 の測定IDは firebase-config.js 内の measurementId と合わせる。
// 管理画面はこのスクリプトを読み込まない。個人情報・入力回答・リンクURLは送信しない。
(function () {
  "use strict";
  var TC_GA4_MEASUREMENT_ID = "G-LB1MTZ0HVP";
  if (!TC_GA4_MEASUREMENT_ID || window.__tcGa4Initialized) return;
  window.__tcGa4Initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", TC_GA4_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false
  });

  var gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(TC_GA4_MEASUREMENT_ID);
  document.head.appendChild(gaScript);

  document.addEventListener("click", function (event) {
    var element = event.target;
    if (!element || !element.closest) return;
    var link = element.closest("a[href]");
    if (!link) return;

    var codePlacement = link.closest(".affiliate-code-placement");
    var source = link.getAttribute("data-link-source") || "";
    var isAffiliate = source === "affiliate" || source === "affiliate-code" || Boolean(codePlacement);
    var serviceId = link.getAttribute("data-service-id") ||
      (codePlacement && codePlacement.getAttribute("data-service-id")) || "";
    var aspName = link.getAttribute("data-asp-name") ||
      (codePlacement && codePlacement.getAttribute("data-asp-name")) || "";

    if (isAffiliate) {
      window.gtag("event", "affiliate_click", {
        service_id: serviceId.slice(0, 80),
        asp_name: aspName.slice(0, 80)
      });
      return;
    }

    var target;
    try { target = new URL(link.href, window.location.href); } catch (_) { return; }
    if (target.origin !== window.location.origin) return;
    if (target.pathname.endsWith("/smartphone.html") || target.pathname.endsWith("/wifi.html")) {
      window.gtag("event", "diagnosis_entry", {
        destination: target.pathname.split("/").pop()
      });
    }
  });
})();

// つうしんコンパス - 共通スクリプト
// モバイルメニューと共通フッターを担当する軽量な処理

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    [
      ["サービス一覧", "services.html"],
      ["ガイド", "guides.html"],
      ["今日の記事", "daily-news.html"]
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
      ["今日の記事", "daily-news.html"],
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
