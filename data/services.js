/* つうしんコンパス - サービスマスター
 * 料金・キャンペーン・成果報酬は推測で入力しない。
 * 公式情報を確認できたサービスから追加する。
 */
window.TC_SERVICE_CATALOG = {
  updatedAt: "",
  smartphone: [],
  wifi: []
};

/*
追加時の基本形（例。数値は実データではありません）

{
  id: "service-id",
  name: "サービス名",
  category: "sim",
  carrier: "",
  network: "",
  dataOptions: [],
  monthlyPrice: null,
  callOptions: [],
  storeSupport: false,
  esim: false,
  familyDiscount: false,
  setDiscount: false,
  paymentMethods: [],
  suitableFor: [],
  notSuitableFor: [],
  cautions: [],
  officialUrl: "",
  affiliateUrl: "",
  sourceUrls: [],
  checkedAt: "",
  updatedAt: ""
}

affiliateUrl は案件が確定するまで空文字のままにする。
*/
