# つうしんコンパス

日本国内のスマートフォン・SIM・Wi-Fi・光回線を扱う、診断・比較型の通信情報サイトです。

## 目的

ユーザーが自分の利用状況を入力し、合いやすい通信サービスの候補と理由・注意点を理解したうえで、公式サイトを確認できる流れを作ります。

## 現在の構成

- index.html: トップページ
- smartphone.html / smartphone-diagnosis.js: スマホ料金診断
- wifi.html / wifi-diagnosis.js: Wi-Fi診断
- sim.html: SIM比較
- hikari.html: 光回線比較
- compare.js / compare.css: 比較ページ共通機能
- data/services.js: 今後のサービス情報を一元管理するマスター
- recommendations.js / recommendations.css: 診断結果に最大3件のサービス候補を表示
- service.html / service-detail.js / service.css: サービス詳細ページの共通テンプレート
- operator.html: 運営者情報
- privacy.html: プライバシーポリシー
- terms.html: 利用規約
- contact.html: お問い合わせ
- advertising-policy.html: 広告掲載ポリシー
- affiliate.html: アフィリエイトについて
- update-policy.html: 情報更新方針
- guide.html / guide.css: 初心者向け通信ガイド
- 404.html: 存在しないURLへアクセスしたときの案内ページ
- home.css / journey.css: トップページと悩み別導線
- catalog.js / catalog.css: 比較ページの実サービス一覧
- service-utils.js: 料金・容量・通話・サポートなどの共通表示処理
- data/README.md: サービス情報の登録・確認ルール

## 情報登録ルール

料金・キャンペーン・アフィリエイト報酬は推測で入力しません。
公式情報を確認できたものから data/services.js に追加します。

affiliateUrl は案件が確定するまで空欄にします。

## 公開前に必ず行うこと

- 運営者情報を正式な内容へ更新
- お問い合わせ手段を設定
- アクセス解析を導入する場合はプライバシーポリシーへ追記
- 独自ドメインまたは公開URL確定後に canonical / sitemap.xml / OGP を設定
- アフィリエイト案件確定後に広告表記とリンクを設定
- 料金・条件の公式確認日を登録
- スマホ・PC・タブレットで表示確認

## 開発方針

既存構造を壊さずMVPから小さく改善します。
診断ロジックとサービスデータを分け、将来的に通信以外の比較ジャンルにも応用しやすい構成を目指します。

診断結果は CustomEvent `tc:diagnosis-result` を通して共通の候補表示へ渡します。サービスデータが0件でも診断ページは壊れず、準備中表示になります。

トップページは「悩みから選ぶ → 診断 → 比較 → 詳細 → 公式確認」の順に進める構造です。初心者ガイドは大量の記事を作る前の基礎ページとして、MNP・SIM/eSIM・Wi-Fiの種類・データ使用量を整理します。


## サービス情報の鮮度

サービス情報は `checkedAt` を `YYYY-MM-DD` 形式で管理します。
確認から90日を超えた情報は、比較一覧や詳細ページで再確認が必要な状態として表示できる設計です。


## 登録済みサービス（2026-09-20確認）

公式情報を確認したサービスを `data/services.js` に登録しています。

- スマホ系: 10サービス
- Wi-Fi / 光回線系: 7サービス
- 合計: 17サービス
- アフィリエイトURL: 未登録（案件確定後に追加）

現在、モバイルWi-Fiの個別サービスは未登録です。Wi-Fi診断でモバイルWi-Fi型になった場合は、誤った別カテゴリのサービスを表示せず準備中表示にします。

診断結果の3候補は優劣を示すランキングではなく、回答との相性から比較対象を絞るための候補です。
