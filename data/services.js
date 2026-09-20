/* つうしんコンパス - サービスマスター
 * 診断・比較・詳細ページで同じ情報を使うための唯一のデータ置き場。
 * 料金・キャンペーン・成果報酬は推測で入力しない。
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

  // 分類
  category: "sim",
  serviceType: "sim",
  carrier: "",
  network: "",
  summary: "",

  // 一覧・詳細で最初に見せる情報
  monthlyPrice: null,
  priceLabel: "",
  dataLabel: "",
  callLabel: "",
  supportLabel: "",
  discountLabel: "",
  areaLabel: "",
  constructionLabel: "",
  speedLabel: "",
  contractLabel: "",

  // 詳細データ
  dataOptions: [],
  callOptions: [],
  plans: [
    {
      name: "プラン名",
      price: "",
      data: "",
      calls: "",
      note: ""
    }
  ],
  storeSupport: null,
  esim: null,
  familyDiscount: null,
  setDiscount: null,
  paymentMethods: [],

  // 利用者の判断材料
  highlights: [],
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

  // 外部リンク
  officialUrl: "",
  affiliateUrl: "",

  // 公式確認の記録。文字列URLでも { label, url } でも可。
  sourceUrls: [
    { label: "料金ページ", url: "" },
    { label: "重要事項・提供条件", url: "" }
  ],
  checkedAt: "",
  priceCheckedAt: "",
  updatedAt: ""
}

重要:
- affiliateUrl は案件が確定するまで空文字のまま。
- priceLabel / plans / キャンペーン内容は公式確認前に入力しない。
- 「不明」と「非対応」を混同しない。未確認は null または空欄。
- sourceUrls と checkedAt をセットで残す。
- キャンペーンは恒常料金と混ぜず、導入時に別項目で管理する。
*/