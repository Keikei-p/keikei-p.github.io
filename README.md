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
- operator.html: 運営者情報
- privacy.html: プライバシーポリシー
- terms.html: 利用規約
- contact.html: お問い合わせ
- advertising-policy.html: 広告掲載ポリシー
- affiliate.html: アフィリエイトについて
- update-policy.html: 情報更新方針

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
