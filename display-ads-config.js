/* つうしんコンパス - ディスプレイ広告設定
 *
 * AdSense審査前は enabled=false のままにする。
 * 承認後に client と広告ユニットIDを設定すると、指定位置へ広告を表示する。
 */
window.TC_DISPLAY_ADS = {
  enabled: false,
  provider: "adsense",
  client: "ca-pub-5933995419737242",
  slots: {
    content: "",
    serviceFallback: ""
  }
};
