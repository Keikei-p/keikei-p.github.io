/* サービス一覧の軽量検索 */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("service-search");
  const status = document.getElementById("service-search-status");
  if (!input || !status) return;

  function apply() {
    const q = input.value.trim().toLocaleLowerCase("ja");
    const cards = Array.from(document.querySelectorAll(".catalog-card"));
    let visible = 0;
    cards.forEach((card) => {
      const text = (card.textContent || "").toLocaleLowerCase("ja");
      const show = !q || text.includes(q);
      card.hidden = !show;
      if (show) visible += 1;
    });
    status.textContent = q
      ? visible + "件見つかりました"
      : cards.length + "件掲載中";
  }

  input.addEventListener("input", apply);
  document.addEventListener("tc:affiliate-ready", () => requestAnimationFrame(apply));
  requestAnimationFrame(apply);
});