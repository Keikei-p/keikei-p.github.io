// つうしんコンパス - 共通スクリプト
// モバイルメニューと共通フッターを担当する軽量な処理

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    if (!nav.querySelector('a[href="guide.html"]')) {
      const guideLink = document.createElement("a");
      guideLink.href = "guide.html";
      guideLink.textContent = "初心者ガイド";
      nav.appendChild(guideLink);
    }

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

  // 全ページ共通の信頼性リンク。
  // 各HTMLに同じリンクを何度も書かず、ここで一元管理する。
  const footerContainer = document.querySelector(".site-footer .container");
  if (footerContainer && !footerContainer.querySelector(".footer-policy-nav")) {
    const policyNav = document.createElement("nav");
    policyNav.className = "footer-policy-nav";
    policyNav.setAttribute("aria-label", "サイト情報");

    [
      ["運営者情報", "operator.html"],
      ["広告掲載ポリシー", "advertising-policy.html"],
      ["アフィリエイトについて", "affiliate.html"],
      ["情報更新方針", "update-policy.html"],
      ["プライバシーポリシー", "privacy.html"],
      ["利用規約", "terms.html"],
      ["お問い合わせ", "contact.html"]
    ].forEach(([label, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      policyNav.appendChild(link);
    });

    footerContainer.appendChild(policyNav);
  }
});
