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

アフィリエイト広告はサービスマスターへ直接書かず、Firebase管理画面または `data/affiliates.js` で管理します。

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
- Wi-Fi / 光回線系: 8サービス
- 合計: 18サービス
- アフィリエイト広告: Firebase管理画面で一元管理

現在、モバイルWi-Fiの個別サービスは未登録です。Wi-Fi診断でモバイルWi-Fi型になった場合は、誤った別カテゴリのサービスを表示せず準備中表示にします。

診断結果の3候補は優劣を示すランキングではなく、回答との相性から比較対象を絞るための候補です。


## 料金表示の方針

このサイトでは最新料金を固定表示しない。
役割は「今の使い方をできるだけ残しながら、見直し候補を絞ること」。

- 電話番号はMNPで引き継げることを案内
- 端末は対応していればそのまま使える場合があると案内
- Gmail等は継続、キャリアメールは持ち運び条件を確認と案内
- 節約額は「月1,000円差なら年12,000円」のような計算例だけを使用
- 最新料金・キャンペーン・キャッシュバックは公式サイト / 提携先で確認
- Wi-Fiは特典だけでなく、解約費・工事・端末残債を含む総額で見直す


## アフィリエイト広告の一元管理

広告URLは各HTML・診断JS・比較JSへ直接書かない。

### 現在の構成

- `data/affiliates.js`: Firebase未設定時の静的広告マスター
- `affiliate-manager.js`: service_idから有効広告を選択
- `firebase-config.js`: Firebase Web App設定
- `affiliate-firestore.js`: Firestoreの公開広告を読み込むアダプター
- `admin.html / admin.js / admin.css`: Firebase Authentication対応の管理画面
- `firestore.rules`: 管理者書き込み制御
- `firebase-setup.md`: Firebase導入手順

同じservice_idに複数ASPを登録できる。
`is_active=true` で `affiliate_url` または `affiliate_code` が設定された広告の中から、`priority` が大きいものを優先する。
A8.netなどで広告コードが発行される案件は `affiliate_code` を優先し、発行コードを改変せず表示する。
URL型広告は従来どおりCTAボタンへ反映する。
有効な広告がない場合、または広告コードが安全性チェックを通らない場合は、サービスマスターの公式URLへ自動フォールバックする。

### 対応ASP

- A8.net
- アクセストレード
- バリューコマース

### 記事や新規CTAから使う方法

記事側にASP URLを書かず、service_idだけ指定する。

```html
<a
  class="btn btn-primary"
  data-affiliate-service="au-hikari"
  data-official-url="https://www.au.com/internet/auhikari_1g/"
>
  最新の料金・特典を確認する
</a>
```

`affiliate-manager.js` が自動的に現在有効な広告へ切り替える。
URL型広告ならリンク先を差し替え、広告コード型ならASP発行コードをその位置へ表示する。
広告がなければ `data-official-url` へ戻る。

### Firebase導入後

管理者は `admin.html` だけを操作する。
基本運用は「サービスを選ぶ → ASPを選ぶ → 広告URLまたは広告コードを貼る → ON → 保存」。
サービスを選ぶと、サービス名・提供元・カテゴリ・公式URLは自動入力される。
管理画面の保存時に

- `affiliate_ads`: rewardを含む管理者専用データ
- `affiliate_public`: 公開サイト用のサニタイズ済みデータ

へ同期する。

一般ユーザーは `affiliate_ads` を読めない。
`affiliate_public` は有効広告だけ公開する。

### 将来の計測

CTAには以下の属性が付くため、後からクリック計測へ接続できる。

- `data-track`
- `data-service-id`
- `data-link-source`
- `data-asp-name`
- `data-ad-id`

これを利用してCTR、ASP別クリック、CVR連携へ拡張する。


## ディスプレイ広告

アフィリエイト案件だけに依存せず、AdSense等のディスプレイ広告も併用できる構成。

- `display-ads-config.js`: 広告配信のON/OFF、publisher ID、広告ユニットIDを一元管理
- `display-ads.js`: 広告スクリプトの読み込みと広告枠描画を共通化
- 審査前は `enabled: false` のため広告は表示されない
- 比較ページ、初心者ガイド、トップページの本文途中に広告枠を用意
- サービス詳細では、有効なアフィリエイト広告がない場合だけディスプレイ広告枠を表示
- 診断の質問中、回答ボタン周辺、アフィリエイトCTA直近には広告を置かない

AdSense承認後は `display-ads-config.js` に `ca-pub-...` と広告ユニットIDを設定して有効化する。
`ads.txt` はAdSense側で正式なpublisher IDが確定してから追加する。


## お問い合わせ運用

- `contact.html`: 公開用お問い合わせフォーム
- `contact.js`: Firebase Firestoreの `contacts` コレクションへ直接保存
- 公開フォームからは作成のみ許可し、問い合わせ内容の読取・更新・削除は管理者だけ
- 管理画面 `admin.html` で問い合わせ一覧、未確認/確認済み、返信先、削除を管理
- 運営者の受信用メールアドレスは公開コードに保存しない
- 返信先メールアドレスは利用者が任意入力した場合のみ保存
- honeypotと文字数制限、Firestore Security Rulesで最低限のスパム・不正入力対策を行う
- 将来メール通知を追加する場合、受信用アドレスはCloud Functions等のサーバー側非公開設定で管理する

公開フォームを有効にするには、更新済みの `firestore.rules` をFirebase Consoleへデプロイする。


## Firebase Hosting 公開

Firebaseプロジェクト `tushincompas` の無料Hostingを利用する。

公開先:
- `https://tushincompas.web.app`
- `https://tushincompas.firebaseapp.com`

Hosting設定:
- `firebase.json`: リポジトリ直下のHTML/CSS/JSを公開
- `.firebaserc`: `tushincompas` を既定プロジェクトとして指定
- README、Firestoreルール、Firebase設定手順など運用ファイルはHosting対象外

### Cloud Shellから初回公開

```bash
git clone https://github.com/Keikei-p/thushin-compas.git
cd thushin-compas
firebase deploy --only hosting --project tushincompas
```

### 2回目以降

```bash
cd thushin-compas
git pull
firebase deploy --only hosting --project tushincompas
```

公開後は `https://tushincompas.web.app` を確認する。
