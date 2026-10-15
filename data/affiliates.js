/* つうしんコンパス - アフィリエイト広告マスター
 *
 * 重要:
 * - サイト内のページへASP URLを直接書かない。
 * - 同じ service_id に複数ASPの広告を登録できる。
 * - is_active=true で affiliate_url または affiliate_code がある広告が広告候補になる。
 * - affiliate_code がある場合は、発行元の広告コードを改変せず優先表示する。
 * - priority は数値が大きいほど優先。
 * - 有効広告がない場合は official_url / サービスマスターの公式URLへフォールバック。
 *
 * ASP審査中のため、下記は構造確認用の仮レコードです。
 * affiliate_url は空、is_active は false のままです。
 *
 * 注意:
 * この静的ファイルはブラウザから見えるため、実際のrewardなど
 * 外部へ公開したくない内部情報はFirebase導入後にaffiliate_adsで管理してください。
 */
window.TC_AFFILIATE_MASTER = {
  updated_at: "2026-10-15",
  ads: [
    {
      id: "nuro-hikari-accesstrade-0100mle700ozoe",
      service_id: "nuro-hikari",
      service_name: "NURO 光",
      category: "fiber",
      provider: "ソニーネットワークコミュニケーションズ",
      affiliate_url: "",
      affiliate_code: "<a href=\"https://h.accesstrade.net/sp/cc?rk=0100mle700ozoe\" rel=\"nofollow\" referrerpolicy=\"no-referrer-when-downgrade\"><img src=\"https://h.accesstrade.net/sp/rr?rk=0100mle700ozoe\" alt=\"NURO光\" border=\"0\" width=\"728\" height=\"90\"></a>",
      render_mode: "code",
      official_url: "https://www.nuro.jp/hikari/",
      display_name: "NURO 光",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "アクセストレード",
      is_active: true,
      priority: 1000,
      keep_on_remote: true,
      updated_at: "2026-10-15"
    },
    {
      id: "daredemo-smartphone-accesstrade-0100pk3d00ozoe",
      service_id: "daredemo-smartphone",
      service_name: "誰でもスマホ",
      category: "cheap_sim",
      provider: "株式会社アーラリンク",
      affiliate_url: "",
      affiliate_code: "<a href=\"https://h.accesstrade.net/sp/cc?rk=0100pk3d00ozoe\" rel=\"nofollow\" referrerpolicy=\"no-referrer-when-downgrade\"><img src=\"https://h.accesstrade.net/sp/rr?rk=0100pk3d00ozoe\" alt=\"誰でもスマホ\" border=\"0\" width=\"300\" height=\"250\"></a>",
      render_mode: "code",
      official_url: "https://www.a-sas.ne.jp/",
      display_name: "誰でもスマホ",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "アクセストレード",
      is_active: true,
      priority: 1000,
      keep_on_remote: true,
      updated_at: "2026-10-13"
    },
    {
      id: "mineo-accesstrade-0100ii8b00ozoe",
      service_id: "mineo",
      service_name: "mineo（マイネオ）",
      category: "cheap_sim",
      provider: "株式会社オプテージ",
      affiliate_url: "",
      affiliate_code: "<a href=\"https://h.accesstrade.net/sp/cc?rk=0100ii8b00ozoe\" rel=\"nofollow\" referrerpolicy=\"no-referrer-when-downgrade\"><img src=\"https://h.accesstrade.net/sp/rr?rk=0100ii8b00ozoe\" alt=\"mineo（マイネオ）\" border=\"0\" width=\"320\" height=\"50\"></a>",
      render_mode: "code",
      official_url: "https://mineo.jp/price/",
      display_name: "mineo（マイネオ）",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "アクセストレード",
      is_active: true,
      priority: 1000,
      keep_on_remote: true,
      updated_at: "2026-10-13"
    },
    {
      id: "nuro-mobile-accesstrade-0100kfj900ozoe",
      service_id: "nuro-mobile",
      service_name: "NUROモバイル",
      category: "MVNO",
      provider: "NUROモバイル",
      affiliate_url: "",
      affiliate_code: "<a href=\"https://h.accesstrade.net/sp/cc?rk=0100kfj900ozoe\" rel=\"nofollow\" referrerpolicy=\"no-referrer-when-downgrade\"><img src=\"https://h.accesstrade.net/sp/rr?rk=0100kfj900ozoe\" alt=\"【キャッシュバック特典】NURO Mobile\" border=\"0\" width=\"468\" height=\"60\"></a>",
      render_mode: "code",
      official_url: "https://mobile.nuro.jp/plan/",
      display_name: "NUROモバイル",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "アクセストレード",
      is_active: true,
      priority: 1000,
      keep_on_remote: true,
      updated_at: "2026-10-13"
    },
    {
      id: "au-hikari-a8",
      service_id: "au-hikari",
      service_name: "auひかり ホーム1ギガ",
      category: "fiber",
      provider: "KDDI",
      affiliate_url: "",
      affiliate_code: "",
      render_mode: "url",
      official_url: "https://www.au.com/internet/auhikari_1g/",
      display_name: "auひかり",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "A8.net",
      is_active: false,
      priority: 100,
      updated_at: "2026-09-20"
    },
    {
      id: "au-hikari-accesstrade",
      service_id: "au-hikari",
      service_name: "auひかり ホーム1ギガ",
      category: "fiber",
      provider: "KDDI",
      affiliate_url: "",
      affiliate_code: "",
      render_mode: "url",
      official_url: "https://www.au.com/internet/auhikari_1g/",
      display_name: "auひかり",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "アクセストレード",
      is_active: false,
      priority: 90,
      updated_at: "2026-09-20"
    },
    {
      id: "au-hikari-valuecommerce",
      service_id: "au-hikari",
      service_name: "auひかり ホーム1ギガ",
      category: "fiber",
      provider: "KDDI",
      affiliate_url: "",
      affiliate_code: "",
      render_mode: "url",
      official_url: "https://www.au.com/internet/auhikari_1g/",
      display_name: "auひかり",
      description: "",
      price: "",
      campaign: "",
      reward: "",
      asp_name: "バリューコマース",
      is_active: false,
      priority: 80,
      updated_at: "2026-09-20"
    }
  ]
};
