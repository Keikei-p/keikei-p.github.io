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
サービス登録の基本形

{
  id: "service-id",
  name: "サービス名",
  category: "sim",
  carrier: "",
  network: "",
  summary: "",

  dataOptions: [],
  monthlyPrice: null,
  callOptions: [],
  storeSupport: null,
  esim: null,
  familyDiscount: null,
  setDiscount: null,
  paymentMethods: [],

  suitableFor: [],
  notSuitableFor: [],
  cautions: [],

  // 診断との相性。数字が大きいほど候補に出やすい。
  // smartphone: cost / balance / quality と質問タグ
  // wifi: H(光回線) / R(ホームルーター) / M(モバイルWi-Fi)
  fit: {
    cost: 0,
    balance: 0,
    quality: 0
  },

  // 診断結果に表示する「なぜ候補なのか」
  matchReasons: {
    cost: "",
    balance: "",
    quality: ""
  },

  officialUrl: "",
  affiliateUrl: "",
  sourceUrls: [],
  checkedAt: "",
  updatedAt: ""
}

重要:
- affiliateUrl は案件が確定するまで空文字のまま。
- monthlyPrice やキャンペーン内容は公式確認前に入力しない。
- sourceUrls と checkedAt をセットで残す。
*/