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
  updated_at: "2026-09-20",
  ads: [
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
