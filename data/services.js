/* つうしんコンパス - サービスマスター
 * 診断・比較・詳細ページで同じ情報を使うための唯一のデータ置き場。
 * 料金・キャンペーン・成果報酬は推測で入力しない。
 * 最終確認日: 2026-09-20
 */
window.TC_SERVICE_CATALOG = {
  updatedAt: "2026-09-20",

  smartphone: [
    {
      id: "docomo-max",
      name: "ドコモ MAX",
      category: "大手キャリア",
      serviceType: "carrier",
      carrier: "NTTドコモ",
      network: "ドコモ",
      summary: "データを多く使う人向けのドコモの大容量プラン。利用量に応じて3段階で料金が変わります。",
      monthlyPrice: null,
      priceLabel: "5,698円〜8,448円/月",
      dataLabel: "〜1GB / 〜3GB / 3GB超〜無制限",
      callLabel: "22円/30秒（通話オプションあり）",
      supportLabel: "店舗・オンライン",
      discountLabel: "家族・ドコモ光/home 5G・dカード等の割引あり",
      storeSupport: true,
      esim: null,
      familyDiscount: true,
      setDiscount: true,
      paymentMethods: [],
      plans: [
        { name: "〜1GB", price: "5,698円/月", data: "〜1GB", calls: "22円/30秒", note: "割引前" },
        { name: "1GB超〜3GB", price: "6,798円/月", data: "〜3GB", calls: "22円/30秒", note: "割引前" },
        { name: "3GB超〜無制限", price: "8,448円/月", data: "無制限", calls: "22円/30秒", note: "大量通信時など制限の場合あり" }
      ],
      highlights: [
        "データ利用量が多い月でも上限料金が決まっている",
        "ドコモ光・home 5Gとのセット割対象",
        "家族回線数などに応じた割引がある"
      ],
      suitableFor: [
        "ドコモの店舗サポートやセット割を重視したい人",
        "データ使用量が多い人",
        "家族でドコモをまとめて使っている人"
      ],
      notSuitableFor: [
        "割引条件なしで月額をできるだけ抑えたい人",
        "毎月のデータ使用量が少なくオンライン手続きだけで問題ない人"
      ],
      cautions: [
        "表示料金は割引前。割引後の料金は家族回線数、カード、固定回線などの条件で変わります。",
        "無制限でもネットワーク混雑時・大量通信時などに通信制限がかかる場合があります。"
      ],
      fit: {
        cost: 0, balance: 2, quality: 5,
        "heavy-data": 4, "high-data": 2, "support-needed": 3, "family-large": 3
      },
      matchReasons: {
        quality: "通信品質や店舗サポートを重視する回答と相性があります。",
        "heavy-data": "データ使用量が多い人向けの無制限帯があります。",
        "support-needed": "店舗で相談したい人も選びやすいサービスです。",
        "family-large": "家族回線数に応じた割引を確認できます。"
      },
      officialUrl: "https://www.docomo.ne.jp/charge/docomo_max/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "ドコモ MAX 公式料金ページ", url: "https://www.docomo.ne.jp/charge/docomo_max/" },
        { label: "ドコモ MAX ご注意事項", url: "https://www.docomo.ne.jp/charge/docomo_max/notice.html" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "docomo-mini",
      name: "ドコモ mini",
      category: "大手キャリア",
      serviceType: "carrier",
      carrier: "NTTドコモ",
      network: "ドコモ",
      summary: "4GBまたは10GBから選ぶドコモの小容量プラン。店舗サポートやセット割を残しつつ容量を抑えたい人向けです。",
      monthlyPrice: null,
      priceLabel: "4GB 2,750円 / 10GB 3,850円",
      dataLabel: "4GB / 10GB",
      callLabel: "通話料・オプションは公式条件を確認",
      supportLabel: "店舗・オンライン",
      discountLabel: "ドコモ光/home 5G・dカード等の割引あり",
      storeSupport: true,
      esim: null,
      familyDiscount: null,
      setDiscount: true,
      plans: [
        { name: "4GB", price: "2,750円/月", data: "4GB", calls: "別途", note: "基本料金" },
        { name: "10GB", price: "3,850円/月", data: "10GB", calls: "別途", note: "基本料金" }
      ],
      highlights: [
        "4GBと10GBのシンプルな2段階",
        "ドコモ光・home 5Gとのセット割対象",
        "店舗で相談しながら契約しやすい"
      ],
      suitableFor: [
        "毎月のデータ使用量が10GB以内に収まる人",
        "店舗サポートを残したい人",
        "ドコモ光やhome 5Gを使っている人"
      ],
      notSuitableFor: [
        "毎月20GB以上使う人",
        "オンライン専用プランでも問題なく、さらに安い料金を優先したい人"
      ],
      cautions: [
        "4GB・10GBを超える使い方には向きにくいため、直近数カ月の使用量を確認してください。",
        "割引後の表示例は支払い方法やセット契約などの条件があります。"
      ],
      fit: {
        cost: 2, balance: 3, quality: 4,
        "light-data": 4, "mid-data": 2, "support-needed": 3, "family-large": 1
      },
      matchReasons: {
        balance: "小容量と店舗サポートのバランスを取りたい回答と相性があります。",
        "light-data": "データ使用量が少ない人向けに4GBプランがあります。",
        "support-needed": "ドコモの店舗で相談しやすい選択肢です。"
      },
      officialUrl: "https://www.docomo.ne.jp/charge/docomo_mini/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "ドコモ mini 公式料金ページ", url: "https://www.docomo.ne.jp/charge/docomo_mini/" },
        { label: "ドコモ mini ご注意事項", url: "https://www.docomo.ne.jp/charge/docomo_mini/notice.html" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "ahamo",
      name: "ahamo",
      category: "オンライン専用",
      serviceType: "online",
      carrier: "NTTドコモ",
      network: "ドコモ",
      summary: "30GBと5分以内の国内通話無料がセットになったオンライン中心のプラン。大盛りで110GBにもできます。",
      monthlyPrice: 2970,
      priceLabel: "30GB 2,970円 / 110GB 4,950円",
      dataLabel: "30GB / 110GB",
      callLabel: "5分以内の国内通話無料",
      supportLabel: "オンライン中心",
      discountLabel: "複雑なセット割なし",
      storeSupport: false,
      esim: null,
      familyDiscount: false,
      setDiscount: false,
      plans: [
        { name: "ahamo", price: "2,970円/月", data: "30GB", calls: "5分以内の国内通話無料", note: "テザリング可" },
        { name: "ahamo大盛り", price: "4,950円/月", data: "110GB", calls: "5分以内の国内通話無料", note: "30GB＋大盛り80GB" }
      ],
      highlights: [
        "30GBで月額2,970円",
        "5分以内の国内通話無料が基本料金に含まれる",
        "110GBの大盛りオプションを選べる"
      ],
      suitableFor: [
        "20〜30GB前後を使う人",
        "短い通話をよく使う人",
        "オンライン手続きを自分で進められる人"
      ],
      notSuitableFor: [
        "店舗で最初から最後まで手続きを任せたい人",
        "毎月3GB前後しか使わず最安料金を優先したい人"
      ],
      cautions: [
        "申込み・各種手続きはオンライン中心です。",
        "5分を超える国内通話は22円/30秒。無料対象外の通話もあります。"
      ],
      fit: {
        cost: 3, balance: 5, quality: 4,
        "mid-data": 2, "high-data": 4, "heavy-data": 2,
        "call-often": 2, "support-not-needed": 3
      },
      matchReasons: {
        balance: "30GB・5分通話込みで料金と使いやすさのバランスを取りやすいです。",
        "high-data": "30GBを日常的に使う回答と相性があります。",
        "call-often": "短い通話なら5分以内の国内通話無料を活かせます。",
        "support-not-needed": "オンライン手続きで問題ない人に向きます。"
      },
      officialUrl: "https://ahamo.com/plan/index.html",
      affiliateUrl: "",
      sourceUrls: [
        { label: "ahamo 料金・データ量", url: "https://ahamo.com/plan/index.html" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "au-value-link",
      name: "auバリューリンクプラン",
      category: "大手キャリア",
      serviceType: "carrier",
      carrier: "KDDI",
      network: "au",
      summary: "データ使い放題を軸に、auの各種付帯サービスが含まれる大容量プランです。",
      monthlyPrice: 8008,
      priceLabel: "8,008円/月（割引前）",
      dataLabel: "使い放題（200GB超で制限条件あり）",
      callLabel: "22円/30秒",
      supportLabel: "店舗・オンライン",
      discountLabel: "家族・auスマートバリュー・カード割あり",
      storeSupport: true,
      esim: null,
      familyDiscount: true,
      setDiscount: true,
      plans: [
        { name: "auバリューリンクプラン", price: "8,008円/月", data: "使い放題", calls: "22円/30秒", note: "テザリング等は合計60GBまで" }
      ],
      highlights: [
        "データ使い放題",
        "家族割プラス・auスマートバリューなどの割引対象",
        "au Starlink Directなどの付帯サービスを含む"
      ],
      suitableFor: [
        "データを多く使いauの店舗サポートも重視したい人",
        "家族でauを利用している人",
        "auひかりなど対象の固定回線を使っている人"
      ],
      notSuitableFor: [
        "割引条件なしで月額を抑えたい人",
        "毎月のデータ利用が少ない人"
      ],
      cautions: [
        "200GB/月超では通常利用に影響のない範囲で最大5Mbpsに制限されます。",
        "テザリングなどは合計60GB/月までです。",
        "割引後料金には家族人数・対象固定回線・カード支払いなどの条件があります。"
      ],
      fit: {
        cost: 0, balance: 2, quality: 5,
        "heavy-data": 4, "support-needed": 3, "family-large": 3
      },
      matchReasons: {
        quality: "店舗サポートや大手キャリアのサービスを重視する回答と相性があります。",
        "heavy-data": "大容量利用を前提にした使い放題プランです。",
        "support-needed": "対面サポートを重視する人も検討しやすいです。",
        "family-large": "家族・固定回線との割引条件を確認できます。"
      },
      officialUrl: "https://www.au.com/mobile/charge/smartphone/plan/auvaluelink/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "auバリューリンクプラン 公式料金ページ", url: "https://www.au.com/mobile/charge/smartphone/plan/auvaluelink/" },
        { label: "au 受付中料金プラン", url: "https://www.au.com/mobile/information/charge/plan/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "uq-mobile",
      name: "UQ mobile",
      category: "サブブランド",
      serviceType: "subbrand",
      carrier: "KDDI",
      network: "au",
      summary: "30GBまでの段階型と、35GB＋10分通話込みから選べるau系サブブランド。データくりこしにも対応します。",
      monthlyPrice: null,
      priceLabel: "3,828円〜4,048円/月（基本使用料）",
      dataLabel: "30GB / 35GB",
      callLabel: "22円/30秒 / コミコミは10分以内無料",
      supportLabel: "店舗・オンライン",
      discountLabel: "自宅セット割・家族セット割等あり",
      storeSupport: true,
      esim: true,
      familyDiscount: true,
      setDiscount: true,
      plans: [
        { name: "トクトクプラン2", price: "4,048円/月（基本使用料）", data: "30GB", calls: "22円/30秒", note: "5GB以下利用時の割引あり。各種セット割あり" },
        { name: "コミコミプランバリュー", price: "3,828円/月", data: "35GB", calls: "10分以内の国内通話無料", note: "Pontaパス込み" }
      ],
      highlights: [
        "30GBまたは35GBから選べる",
        "コミコミプランバリューは10分以内の国内通話込み",
        "余った基本データ容量を翌月へくりこせる"
      ],
      suitableFor: [
        "20〜35GB程度を使う人",
        "大手キャリアより料金を抑えつつ店舗相談も残したい人",
        "au系の固定回線や家族割を活用したい人"
      ],
      notSuitableFor: [
        "毎月ほぼデータを使わず最安を優先したい人",
        "完全なデータ使い放題を求める人"
      ],
      cautions: [
        "トクトクプラン2の割引後料金は自宅セット割・カード支払いなど条件で変わります。",
        "コミコミプランバリューの10分無料には対象外通話があります。"
      ],
      fit: {
        cost: 3, balance: 5, quality: 4,
        "mid-data": 3, "high-data": 5, "call-often": 2,
        "support-needed": 2, "family-large": 2
      },
      matchReasons: {
        balance: "料金とサポートの両方をほどよく重視する人と相性があります。",
        "high-data": "30〜35GBの中容量〜大容量帯を選べます。",
        "call-often": "コミコミプランなら10分以内の国内通話が基本料金に含まれます。",
        "support-needed": "店舗相談も残したい人の候補になります。"
      },
      officialUrl: "https://www.uqwimax.jp/mobile/plan/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "UQ mobile 料金プラン", url: "https://www.uqwimax.jp/mobile/plan/" },
        { label: "コミコミプランバリュー", url: "https://www.uqwimax.jp/mobile/plan/komikomi-pv/" },
        { label: "トクトクプラン2", url: "https://www.uqwimax.jp/mobile/plan/tokutoku2/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "povo2",
      name: "povo2.0",
      category: "オンライン専用",
      serviceType: "online",
      carrier: "KDDI",
      network: "au",
      summary: "基本料0円をベースに、必要なデータや通話をトッピングで追加するオンライン専用サービスです。",
      monthlyPrice: 0,
      priceLabel: "基本料0円＋トッピング",
      dataLabel: "必要な容量・期間を都度購入",
      callLabel: "22円/30秒 / 5分550円 / かけ放題1,650円",
      supportLabel: "オンライン・アプリ中心",
      discountLabel: "セット割前提ではない",
      storeSupport: false,
      esim: null,
      familyDiscount: false,
      setDiscount: false,
      plans: [
        { name: "ベースプラン", price: "0円", data: "0GB時 最大128kbps", calls: "22円/30秒", note: "長期間トッピング未購入時の利用停止条件あり" },
        { name: "データ追加3GB", price: "990円/回", data: "3GB / 30日間", calls: "別途", note: "トッピング" },
        { name: "データ追加30GB", price: "2,780円/回", data: "30GB / 30日間", calls: "別途", note: "トッピング" },
        { name: "5分以内通話かけ放題", price: "550円/月", data: "―", calls: "5分以内の国内通話", note: "一部対象外" },
        { name: "通話かけ放題", price: "1,650円/月", data: "―", calls: "国内通話かけ放題", note: "一部対象外" }
      ],
      highlights: [
        "基本料0円から必要な分だけ追加できる",
        "データ容量と有効期間を使い方に合わせて選べる",
        "通話オプションも必要に応じて追加できる"
      ],
      suitableFor: [
        "月ごとにデータ使用量が大きく変わる人",
        "サブ回線として使いたい人",
        "アプリで自分でトッピングを管理できる人"
      ],
      notSuitableFor: [
        "毎月決まった料金・容量で何も考えず使いたい人",
        "店舗で契約や設定を手伝ってほしい人"
      ],
      cautions: [
        "180日間、有料トッピング購入等がない場合は利用停止・契約解除となることがあります。",
        "0円0GB時は送受信最大128kbpsです。",
        "トッピングにはそれぞれ有効期間があります。"
      ],
      fit: {
        cost: 5, balance: 3, quality: 2,
        "light-data": 3, "mid-data": 2, "high-data": 2,
        "support-not-needed": 4, "single-user": 2
      },
      matchReasons: {
        cost: "基本料0円から必要な分だけ買う仕組みで、使い方を細かく調整できます。",
        "light-data": "データ使用量が少ない月は小容量トッピングを選べます。",
        "support-not-needed": "アプリで自分で契約管理できる人に向きます。",
        "single-user": "自分の利用量に合わせて一回線を柔軟に管理しやすいです。"
      },
      officialUrl: "https://povo.jp/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "povo2.0 サービス詳細", url: "https://povo.jp/spec/detail/" },
        { label: "povo2.0 トッピング一覧", url: "https://povo.jp/explanation/" },
        { label: "30GB（30日間）", url: "https://povo.jp/topping-list/detail/30G_30d/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "softbank-teigaku-museigen",
      name: "SoftBank テイガク無制限",
      category: "大手キャリア",
      serviceType: "carrier",
      carrier: "ソフトバンク",
      network: "SoftBank",
      summary: "データ容量を気にせず使いたい人向けのSoftBankの定額無制限プランです。",
      monthlyPrice: 8008,
      priceLabel: "8,008円/月（割引前）",
      dataLabel: "無制限",
      callLabel: "22円/30秒",
      supportLabel: "店舗・オンライン",
      discountLabel: "家族・SoftBank 光/Air・PayPayカード割あり",
      storeSupport: true,
      esim: null,
      familyDiscount: true,
      setDiscount: true,
      plans: [
        { name: "テイガク無制限", price: "8,008円/月", data: "無制限", calls: "22円/30秒", note: "直近30日300GB超で最大4.5Mbpsの制御条件あり" }
      ],
      highlights: [
        "データ無制限の定額型",
        "家族・SoftBank 光/Airとのセット割対象",
        "5分・24時間の通話定額オプションを追加できる"
      ],
      suitableFor: [
        "データを大量に使う人",
        "SoftBankの店舗サポートを重視する人",
        "家族や固定回線をSoftBank系でまとめている人"
      ],
      notSuitableFor: [
        "毎月のデータ使用量が少ない人",
        "割引条件なしで月額を抑えたい人"
      ],
      cautions: [
        "直近30日間で300GB超の場合、通常利用に影響のない範囲で最大4.5Mbpsに制御されます。",
        "割引後料金には家族回線数・SoftBank 光/Air・カード支払いなどの条件があります。"
      ],
      fit: {
        cost: 0, balance: 2, quality: 5,
        "heavy-data": 4, "support-needed": 3, "family-large": 3
      },
      matchReasons: {
        quality: "大手キャリアのサポートと大容量通信を重視する人に向きます。",
        "heavy-data": "データ無制限で大容量利用を前提にできます。",
        "support-needed": "店舗で相談したい人も検討しやすいです。",
        "family-large": "家族・固定回線とのセット割があります。"
      },
      officialUrl: "https://www.softbank.jp/mobile/price_plan/data/teigaku-museigen/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "テイガク無制限 公式料金ページ", url: "https://www.softbank.jp/mobile/price_plan/data/teigaku-museigen/" },
        { label: "SoftBank 最新料金プラン一覧", url: "https://www.softbank.jp/mobile/price_plan/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "ymobile",
      name: "Y!mobile",
      category: "サブブランド",
      serviceType: "subbrand",
      carrier: "ソフトバンク",
      network: "SoftBank",
      summary: "5GB・30GB・35GBから選べるSoftBank系サブブランド。Lは10分以内の国内通話が基本料金に含まれます。",
      monthlyPrice: null,
      priceLabel: "3,278円〜5,478円/月",
      dataLabel: "5GB / 30GB / 35GB",
      callLabel: "Lは10分以内無料 / S・Mは従量",
      supportLabel: "店舗・オンライン",
      discountLabel: "おうち割 光セット(A)・家族割等あり",
      storeSupport: true,
      esim: true,
      familyDiscount: true,
      setDiscount: true,
      plans: [
        { name: "シンプル3 S", price: "3,278円/月", data: "5GB", calls: "22円/30秒", note: "契約期間なし" },
        { name: "シンプル3 M", price: "4,378円/月", data: "30GB", calls: "22円/30秒", note: "契約期間なし" },
        { name: "シンプル3 L", price: "5,478円/月", data: "35GB", calls: "10分以内の国内通話無料", note: "一部対象外通話あり" }
      ],
      highlights: [
        "5GB・30GB・35GBの3プラン",
        "Lは10分以内の国内通話無料",
        "SoftBank 光/Airとのおうち割対象"
      ],
      suitableFor: [
        "料金を抑えつつ店舗サポートも利用したい人",
        "家族で複数回線を使う人",
        "SoftBank 光やAirを使っている人"
      ],
      notSuitableFor: [
        "完全オンラインで最安価格を最優先したい人",
        "データ完全無制限を求める人"
      ],
      cautions: [
        "おうち割と家族割は併用できないなど、割引には条件があります。",
        "シンプル3 S/Mの国内通話は基本的に22円/30秒です。"
      ],
      fit: {
        cost: 3, balance: 5, quality: 4,
        "light-data": 2, "high-data": 4, "call-often": 2,
        "support-needed": 3, "family-large": 3
      },
      matchReasons: {
        balance: "料金を抑えつつ店舗相談も残したい人に向きます。",
        "high-data": "30GB・35GBの中容量〜大容量プランがあります。",
        "support-needed": "店舗で相談できる選択肢を残せます。",
        "family-large": "家族割や固定回線とのセット割を検討できます。"
      },
      officialUrl: "https://www.ymobile.jp/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "Y!mobile 公式サイト", url: "https://www.ymobile.jp/" },
        { label: "シンプル3 重要説明事項", url: "https://www.ymobile.jp/jusetsu/jusetsu04/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "linemo",
      name: "LINEMO",
      category: "オンライン専用",
      serviceType: "online",
      carrier: "ソフトバンク",
      network: "SoftBank",
      summary: "3〜10GBの段階型と30GB＋5分通話込みの2プランから選べるオンライン専用サービスです。",
      monthlyPrice: null,
      priceLabel: "990円〜2,970円/月",
      dataLabel: "3GB / 10GB / 30GB",
      callLabel: "Vは5分以内の国内通話無料",
      supportLabel: "オンライン中心",
      discountLabel: "複雑なセット割なし",
      storeSupport: false,
      esim: null,
      familyDiscount: false,
      setDiscount: false,
      plans: [
        { name: "LINEMOベストプラン 〜3GB", price: "990円/月", data: "〜3GB", calls: "22円/30秒", note: "LINEギガフリー対象あり" },
        { name: "LINEMOベストプラン 3GB超〜10GB", price: "2,090円/月", data: "〜10GB", calls: "22円/30秒", note: "LINEギガフリー対象あり" },
        { name: "LINEMOベストプランV", price: "2,970円/月", data: "30GB", calls: "5分以内の国内通話無料", note: "一部対象外通話あり" }
      ],
      highlights: [
        "3GBなら990円、10GBまで2,090円",
        "30GBプランは5分以内の国内通話込み",
        "LINEギガフリーの対象サービスがある"
      ],
      suitableFor: [
        "3〜30GBの範囲で料金を抑えたい人",
        "LINEをよく使う人",
        "オンライン手続きで問題ない人"
      ],
      notSuitableFor: [
        "店舗サポートを必要とする人",
        "30GBを大きく超えてデータを使う人"
      ],
      cautions: [
        "オンライン専用サービスです。",
        "LINEギガフリーにも対象外となる機能があります。",
        "ベストプランVの5分無料にも対象外通話があります。"
      ],
      fit: {
        cost: 4, balance: 5, quality: 3,
        "light-data": 4, "mid-data": 3, "high-data": 4,
        "call-often": 2, "support-not-needed": 4
      },
      matchReasons: {
        cost: "3GBまでなら低価格帯で利用できます。",
        balance: "小容量から30GBまで選びやすく、料金と容量のバランスを取りやすいです。",
        "light-data": "3GB・10GBの段階型プランがあります。",
        "high-data": "30GBプランを選べます。",
        "support-not-needed": "オンラインで自分で手続きできる人に向きます。"
      },
      officialUrl: "https://www.linemo.jp/plan/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "LINEMO 料金プラン", url: "https://www.linemo.jp/plan/" },
        { label: "LINEMOベストプラン", url: "https://www.linemo.jp/lp/001/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "rakuten-mobile",
      name: "楽天モバイル Rakuten最強プラン",
      category: "キャリア",
      serviceType: "carrier",
      carrier: "楽天モバイル",
      network: "楽天",
      summary: "使ったデータ量に応じて3段階で料金が決まり、20GB超はギガ無制限になるシンプルな料金プランです。",
      monthlyPrice: null,
      priceLabel: "1,078円〜3,278円/月",
      dataLabel: "〜3GB / 〜20GB / 20GB超〜無制限",
      callLabel: "Rakuten Link利用の国内通話無料（対象外あり）",
      supportLabel: "店舗・オンライン",
      discountLabel: "家族向け割引などあり",
      storeSupport: true,
      esim: null,
      familyDiscount: true,
      setDiscount: null,
      plans: [
        { name: "〜3GB", price: "1,078円/月", data: "〜3GB", calls: "Rakuten Link利用時 国内通話無料", note: "一部対象外番号あり" },
        { name: "3GB超〜20GB", price: "2,178円/月", data: "〜20GB", calls: "Rakuten Link利用時 国内通話無料", note: "一部対象外番号あり" },
        { name: "20GB超〜無制限", price: "3,278円/月", data: "ギガ無制限", calls: "Rakuten Link利用時 国内通話無料", note: "公平なサービス提供のため速度制御の場合あり" }
      ],
      highlights: [
        "データ使用量に応じて自動的に料金が変わる",
        "20GB超は3,278円でギガ無制限",
        "Rakuten Link利用時の国内通話が無料"
      ],
      suitableFor: [
        "データ使用量が月によって変わる人",
        "20GB以上を低めの月額で使いたい人",
        "Rakuten Linkを使って通話料も抑えたい人"
      ],
      notSuitableFor: [
        "利用場所で楽天回線のエリア・品質が自分に合うか不安な人",
        "標準電話アプリだけで長時間通話したい人"
      ],
      cautions: [
        "Rakuten Link無料通話には0570など対象外番号があります。",
        "OS標準の電話アプリ利用時は22円/30秒です。",
        "利用場所によって通信状況が異なるため、生活圏のエリア確認が重要です。"
      ],
      fit: {
        cost: 5, balance: 4, quality: 2,
        "light-data": 3, "high-data": 4, "heavy-data": 5,
        "call-often": 4, "call-long": 3
      },
      matchReasons: {
        cost: "3GB・20GB・無制限の3段階で利用量に合わせて料金が変わります。",
        "heavy-data": "20GB超はギガ無制限の料金帯になります。",
        "call-often": "Rakuten Link利用なら国内通話無料を活かせます。",
        "call-long": "Rakuten Linkの無料通話対象なら長電話の通話料を抑えられます。"
      },
      officialUrl: "https://network.mobile.rakuten.co.jp/fee/saikyo-plan/detail/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "Rakuten最強プラン詳細", url: "https://network.mobile.rakuten.co.jp/fee/saikyo-plan/detail/" },
        { label: "Rakuten Link", url: "https://network.mobile.rakuten.co.jp/service/rakuten-link/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    }
  ],

  wifi: [
    {
      id: "docomo-hikari",
      name: "ドコモ光 1ギガ",
      category: "hikari",
      serviceType: "光回線",
      carrier: "NTTドコモ",
      network: "NTT系光回線",
      summary: "プロバイダ料金一体型で、ドコモのスマホとのセット割を利用できる光回線です。",
      monthlyPrice: null,
      priceLabel: "戸建5,720円 / マンション4,400円〜",
      dataLabel: "固定回線・実質データ容量を気にしにくい",
      supportLabel: "店舗・オンライン",
      discountLabel: "ドコモ光セット割あり",
      areaLabel: "提供エリア・建物設備の確認が必要",
      constructionLabel: "新規は工事が必要な場合あり",
      speedLabel: "最大1Gbps（ベストエフォート）",
      contractLabel: "2年定期契約プランあり",
      storeSupport: true,
      familyDiscount: null,
      setDiscount: true,
      plans: [
        { name: "1ギガ タイプA 戸建", price: "5,720円/月", data: "固定回線", calls: "―", note: "2年定期契約・プロバイダ料込み" },
        { name: "1ギガ タイプA マンション", price: "4,400円/月", data: "固定回線", calls: "―", note: "2年定期契約・プロバイダ料込み" }
      ],
      highlights: [
        "プロバイダ料金一体型",
        "ドコモスマホとのセット割対象",
        "戸建・マンション向けプランがある"
      ],
      suitableFor: [
        "ドコモのスマホを家族で使っている人",
        "自宅で動画・在宅勤務・ゲームなど安定した固定回線を使いたい人"
      ],
      notSuitableFor: [
        "工事を避けたい人",
        "短期利用や頻繁な引っ越しを予定している人"
      ],
      cautions: [
        "実際の通信速度は利用環境や混雑状況などで変わります。",
        "提供エリア・建物設備・プロバイダタイプによって料金や利用可否が異なります。",
        "定期契約プランは更新期間外の解約等で解約金が発生する場合があります。"
      ],
      fit: { H: 6, R: 0, M: 0 },
      matchReasons: {
        H: "固定回線の速度・安定性を重視する回答と相性があります。"
      },
      officialUrl: "https://www.docomo.ne.jp/internet/hikari/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "ドコモ光 料金例（OCN インターネット）", url: "https://www.docomo.ne.jp/internet/hikari/provider_list/ocn/" },
        { label: "ドコモ光 1ギガ タイプC", url: "https://www.docomo.ne.jp/internet/hikari/charge/type_c/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "au-hikari",
      name: "auひかり ホーム1ギガ",
      category: "hikari",
      serviceType: "光回線",
      carrier: "KDDI",
      network: "auひかり",
      summary: "KDDIの光回線。au・UQ mobileとのセット条件を確認しながら選びたい人向けです。",
      monthlyPrice: null,
      priceLabel: "ネットのみ 5,610円/月（1年目・ずっとギガ得）",
      dataLabel: "固定回線・実質データ容量を気にしにくい",
      supportLabel: "オンライン・電話等",
      discountLabel: "auスマートバリュー対象",
      areaLabel: "提供エリアに制限あり",
      constructionLabel: "光回線工事が必要",
      speedLabel: "ホーム1ギガ",
      contractLabel: "3年/2年/期間なしの料金プランあり",
      storeSupport: null,
      familyDiscount: null,
      setDiscount: true,
      plans: [
        { name: "ずっとギガ得プラン ネットのみ", price: "5,610円/月（1年目）", data: "固定回線", calls: "―", note: "3年単位・プロバイダ/機器レンタル料込み（無線LAN除く）" },
        { name: "ギガ得プラン ネットのみ", price: "5,720円/月", data: "固定回線", calls: "―", note: "2年単位" }
      ],
      highlights: [
        "回線料・プロバイダ料・機器レンタル料が基本料金に含まれる",
        "auスマートバリュー対象",
        "1ギガから10ギガへの速度変更も対象エリアで可能"
      ],
      suitableFor: [
        "au・UQ mobileのセット条件を活用したい人",
        "戸建で安定した固定回線を使いたい人"
      ],
      notSuitableFor: [
        "提供エリア外の人",
        "工事を避けたい人"
      ],
      cautions: [
        "ホーム1ギガは一部地域で提供対象外です。",
        "工事・初期費用が発生し、建物や地域により利用できない場合があります。",
        "契約期間ありプランは更新期間外の解約等で解除料が発生する場合があります。"
      ],
      fit: { H: 6, R: 0, M: 0 },
      matchReasons: {
        H: "自宅で長く安定した固定回線を使いたい回答と相性があります。"
      },
      officialUrl: "https://www.au.com/internet/auhikari_1g/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "auひかり ホーム1ギガ 料金", url: "https://www.au.com/internet/auhikari_1g/charge/" },
        { label: "ずっとギガ得プラン", url: "https://www.au.com/internet/auhikari_1g/charge/zuttogigatoku/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "softbank-hikari",
      name: "SoftBank 光 1ギガ",
      category: "hikari",
      serviceType: "光回線",
      carrier: "ソフトバンク",
      network: "NTT系光回線",
      summary: "SoftBank・Y!mobileとのおうち割を利用できる光回線。戸建・集合住宅向けの1ギガプランがあります。",
      monthlyPrice: null,
      priceLabel: "戸建5,720円 / 集合4,180円（2年自動更新）",
      dataLabel: "固定回線・実質データ容量を気にしにくい",
      supportLabel: "Web・電話・店頭",
      discountLabel: "SoftBank/Y!mobileのおうち割対象",
      areaLabel: "NTT東西の提供エリア・建物設備を確認",
      constructionLabel: "新規は工事が必要な場合あり",
      speedLabel: "最大1Gbps",
      contractLabel: "2年自動更新プラン等",
      storeSupport: true,
      familyDiscount: null,
      setDiscount: true,
      plans: [
        { name: "1ギガ 戸建 2年自動更新", price: "5,720円/月", data: "固定回線", calls: "―", note: "2026年12月以降の料金改定予定あり" },
        { name: "1ギガ 集合 2年自動更新", price: "4,180円/月", data: "固定回線", calls: "―", note: "2026年12月以降の料金改定予定あり" }
      ],
      highlights: [
        "SoftBank・Y!mobileの対象プランでおうち割を利用できる",
        "戸建・集合住宅向けプランがある",
        "1ギガと10ギガから選べる"
      ],
      suitableFor: [
        "SoftBankまたはY!mobileのスマホを使っている人",
        "固定回線の安定性を重視する人"
      ],
      notSuitableFor: [
        "工事を避けたい人",
        "短期利用を予定している人"
      ],
      cautions: [
        "2026年12月1日から対象プランの月額料金改定が予定されています。既存の自動更新プランは契約満了月の翌月利用分から適用される案内があります。",
        "新規工事の有無・工事費は住居設備などで異なります。",
        "おうち割の適用には指定オプションなど別条件があります。"
      ],
      fit: { H: 6, R: 0, M: 0 },
      matchReasons: {
        H: "自宅で安定した固定回線を使いたい回答と相性があります。"
      },
      officialUrl: "https://www.softbank.jp/internet/sbhikari/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "SoftBank 光 料金", url: "https://www.softbank.jp/internet/sbhikari/price/" },
        { label: "2026年料金改定のお知らせ", url: "https://www.softbank.jp/internet/special/information2026/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "nuro-hikari",
      name: "NURO 光",
      category: "hikari",
      serviceType: "光回線",
      carrier: "ソニーネットワークコミュニケーションズ",
      network: "NURO",
      summary: "2ギガ・10ギガを展開する光回線。速度を重視する人の比較候補ですが、提供エリアと建物条件の確認が必要です。",
      monthlyPrice: null,
      priceLabel: "2ギガ 4,235円〜5,720円/月",
      dataLabel: "固定回線",
      supportLabel: "オンライン・電話等",
      discountLabel: "プラン・特典は公式条件を確認",
      areaLabel: "提供エリア・建物条件の確認が必要",
      constructionLabel: "開通工事あり",
      speedLabel: "2ギガ / 10ギガ",
      contractLabel: "プランにより異なる",
      storeSupport: null,
      familyDiscount: null,
      setDiscount: null,
      plans: [
        { name: "NURO 光 One 2ギガ", price: "5,720円/月", data: "固定回線", calls: "―", note: "2026年9月1日改定後" },
        { name: "NURO 光 One 10ギガ", price: "6,600円/月", data: "固定回線", calls: "―", note: "2026年9月1日改定後" },
        { name: "NURO 光 2ギガ（マンション）", price: "4,235円/月", data: "固定回線", calls: "―", note: "タイプS/L・2026年9月1日改定後" },
        { name: "NURO 光 10ギガ（マンション）", price: "4,840円/月", data: "固定回線", calls: "―", note: "タイプS/L" }
      ],
      highlights: [
        "2ギガ・10ギガの高速プランを用意",
        "マンション向けプランもある",
        "速度重視の利用者が比較しやすい"
      ],
      suitableFor: [
        "オンラインゲームや大容量通信で速度を重視する人",
        "提供エリア内でNUROの設備条件を満たす住居の人"
      ],
      notSuitableFor: [
        "提供エリア外の人",
        "開通工事を待てない人"
      ],
      cautions: [
        "2026年9月1日に一部プランの月額基本料金が改定されています。",
        "提供エリアや建物設備によって申し込めない場合があります。",
        "表記速度は実際の利用速度を保証するものではありません。"
      ],
      fit: { H: 7, R: 0, M: 0 },
      matchReasons: {
        H: "ゲーム・大容量通信など速度と固定回線の安定性を重視する回答と相性があります。"
      },
      officialUrl: "https://www.nuro.jp/hikari/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "NURO 光 2026年9月料金改定", url: "https://www.nuro.jp/news_release/20260615/" },
        { label: "NURO 光 マンション料金", url: "https://www.nuro.jp/hikari/mansion/price/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "docomo-home5g",
      name: "docomo home 5G",
      category: "home-router",
      serviceType: "ホームルーター",
      carrier: "NTTドコモ",
      network: "ドコモ 5G/4G",
      summary: "工事なしで自宅Wi-Fiを始められるドコモのホームルーター。登録した設置場所住所で利用します。",
      monthlyPrice: 5280,
      priceLabel: "5,280円/月＋端末代",
      dataLabel: "無制限（混雑・大量通信時の制御条件あり）",
      supportLabel: "店舗・オンライン",
      discountLabel: "home 5G セット割あり",
      areaLabel: "ドコモ5G/4Gエリア・設置場所確認",
      constructionLabel: "工事不要",
      speedLabel: "5G/4G",
      contractLabel: "定期契約・解約金なし",
      storeSupport: true,
      familyDiscount: null,
      setDiscount: true,
      plans: [
        { name: "home 5G プラン", price: "5,280円/月", data: "無制限", calls: "―", note: "専用端末代・各種料金は別途" }
      ],
      highlights: [
        "回線工事不要",
        "定期契約・解約金なし",
        "対象ドコモスマホとのセット割あり"
      ],
      suitableFor: [
        "光回線の工事をしたくない人",
        "ドコモのスマホとセットで使いたい人",
        "引っ越し時の固定回線工事を避けたい人"
      ],
      notSuitableFor: [
        "オンラインゲームなど遅延を最優先する人",
        "登録した設置場所以外へ持ち運んで使いたい人"
      ],
      cautions: [
        "登録した設置場所住所での利用が前提です。",
        "ネットワーク混雑状況や直近の大量通信などにより通信が遅くなる場合があります。",
        "月額料金とは別に対応端末代金がかかります。"
      ],
      fit: { H: 0, R: 7, M: 0 },
      matchReasons: {
        R: "工事を避けながら自宅用Wi-Fiを使いたい回答と相性があります。"
      },
      officialUrl: "https://www.docomo.ne.jp/home_5g/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "home 5G 公式ページ", url: "https://www.docomo.ne.jp/home_5g/" },
        { label: "home 5G プラン", url: "https://www.docomo.ne.jp/home_5g/charge/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "softbank-air",
      name: "SoftBank Air",
      category: "home-router",
      serviceType: "ホームルーター",
      carrier: "ソフトバンク",
      network: "SoftBank",
      summary: "回線工事なしで使えるSoftBankのホームルーター。SoftBank・Y!mobileのおうち割も確認できます。",
      monthlyPrice: 5368,
      priceLabel: "5,368円/月＋端末条件",
      dataLabel: "ホームルーター",
      supportLabel: "Web・電話・店頭",
      discountLabel: "SoftBank/Y!mobileのおうち割対象",
      areaLabel: "提供エリア・住所確認が必要",
      constructionLabel: "工事不要",
      speedLabel: "4G/5G（対応エリアによる）",
      contractLabel: "端末購入・レンタル条件を確認",
      storeSupport: true,
      familyDiscount: null,
      setDiscount: true,
      plans: [
        { name: "Air 4G/5G共通プラン", price: "5,368円/月", data: "ホームルーター", calls: "―", note: "専用端末料金・割引条件は別途" }
      ],
      highlights: [
        "回線工事不要",
        "SoftBank・Y!mobileとのおうち割対象",
        "Web・電話・店頭で相談できる"
      ],
      suitableFor: [
        "自宅の光回線工事を避けたい人",
        "SoftBankまたはY!mobileのスマホを使っている人"
      ],
      notSuitableFor: [
        "オンラインゲーム等で固定回線の低遅延を最優先する人",
        "提供エリアや建物内の電波状況が合わない人"
      ],
      cautions: [
        "2026年12月1日から基本料金の+330円改定が案内されています。",
        "月額基本料金のほか専用端末の購入・レンタル条件を確認する必要があります。",
        "利用先住所が提供エリアか事前確認が必要です。"
      ],
      fit: { H: 0, R: 7, M: 0 },
      matchReasons: {
        R: "工事不要の自宅Wi-Fiを重視する回答と相性があります。"
      },
      officialUrl: "https://www.softbank.jp/internet/air/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "SoftBank Air 料金", url: "https://www.softbank.jp/internet/air/price/" },
        { label: "SoftBank Air 料金シミュレーション", url: "https://www.softbank.jp/internet/air/simulator/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    },

    {
      id: "rakuten-turbo",
      name: "Rakuten Turbo",
      category: "home-router",
      serviceType: "ホームルーター",
      carrier: "楽天モバイル",
      network: "楽天",
      summary: "工事なしで使う楽天モバイルのホームルーター。専用端末Rakuten Turbo 5Gとの同時契約が必要です。",
      monthlyPrice: 4840,
      priceLabel: "4,840円/月＋端末代",
      dataLabel: "ホームルーター",
      supportLabel: "Web・ショップ",
      discountLabel: "楽天のキャンペーン・ポイント条件は都度確認",
      areaLabel: "提供エリア・住所確認が必要",
      constructionLabel: "工事不要",
      speedLabel: "5G/4G（エリアによる）",
      contractLabel: "端末購入が必要",
      storeSupport: true,
      familyDiscount: null,
      setDiscount: null,
      plans: [
        { name: "Rakuten Turbo", price: "4,840円/月", data: "ホームルーター", calls: "―", note: "Rakuten Turbo 5G端末41,580円・契約事務手数料3,300円" }
      ],
      highlights: [
        "回線工事不要",
        "月額プラン料金4,840円",
        "楽天ポイントを支払いに使える"
      ],
      suitableFor: [
        "工事不要で自宅Wi-Fiを始めたい人",
        "楽天のサービスをよく使う人"
      ],
      notSuitableFor: [
        "端末購入を避けたい人",
        "固定回線の安定性・低遅延を最優先する人"
      ],
      cautions: [
        "Rakuten Turbo 5G端末との同時契約が必要です。",
        "月額料金のほか端末代・契約事務手数料等を確認してください。",
        "キャンペーン条件は時期によって変わるため通常料金と分けて確認してください。"
      ],
      fit: { H: 0, R: 6, M: 0 },
      matchReasons: {
        R: "工事なしで自宅用Wi-Fiを始めたい回答と相性があります。"
      },
      officialUrl: "https://network.mobile.rakuten.co.jp/internet/turbo/",
      affiliateUrl: "",
      sourceUrls: [
        { label: "Rakuten Turbo 料金プラン", url: "https://network.mobile.rakuten.co.jp/internet/turbo/fee/" },
        { label: "Rakuten Turbo 重要事項説明", url: "https://network.mobile.rakuten.co.jp/terms/rakuten_turbo_important_explanation_20260730/" }
      ],
      checkedAt: "2026-09-20",
      priceCheckedAt: "2026-09-20",
      updatedAt: "2026-09-20"
    }
  ]
};

/*
運用ルール:
- affiliateUrl は案件が確定するまで空文字のまま。
- 料金・キャンペーンは推測で埋めない。
- checkedAt / priceCheckedAt と sourceUrls を同時に更新する。
- キャンペーン価格と通常価格を混ぜない。
- 「非対応」と「未確認」を混同しない。
*/