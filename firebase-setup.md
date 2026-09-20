# Firebase / アフィリエイト管理

現在の公開サイトは、Firebase未設定でも `data/affiliates.js` を使って動作します。

Firebaseを有効にすると、管理画面 `admin.html` から広告を編集し、公開サイトのリンクへ反映できます。

## 使用するコレクション

### affiliate_ads
管理者専用。以下を含む完全データです。

- service_id
- service_name
- category
- provider
- affiliate_url
- official_url
- display_name
- description
- price
- campaign
- reward
- asp_name
- is_active
- priority
- updated_at

### affiliate_public
公開サイト読み取り用。rewardは含めません。

管理画面で **is_active=true かつ affiliate_url がある広告だけ** 自動同期します。
OFFにすると公開コレクションから削除されます。

## 管理者認証

Firestore RulesはFirebase AuthenticationユーザーのIDトークンに

`admin: true`

というカスタムクレームがあることを要求します。

クライアント画面からadmin権限を付与する機能は作りません。
Firebase Admin SDKなど、信頼できる管理環境から付与してください。

## 初期設定

1. FirebaseプロジェクトとWeb Appを作成
2. AuthenticationでEmail/Passwordを有効化
3. Firestoreを作成
4. `firestore.rules` を確認してデプロイ
5. `firebase-config.js` にWeb App configを設定
6. 管理者ユーザーへ `admin: true` カスタムクレームを付与
7. `admin.html` からログイン

## 公開サイト側

通常ページは以下の順で読み込みます。

1. data/services.js
2. service-utils.js
3. data/affiliates.js
4. affiliate-manager.js
5. firebase-config.js
6. affiliate-firestore.js
7. 各ページ固有JS

Firestore未設定なら静的広告マスターを使用します。
Firestore設定済みなら `affiliate_public` を取得後に広告マスターを上書きします。

## priority

同じservice_idで複数ASPが有効な場合、priorityが大きい広告を優先します。

例:

- A8.net: 100
- アクセストレード: 90
- バリューコマース: 80

priority変更だけで表示先を切り替えられます。
