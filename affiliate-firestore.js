/* 公開サイト用: Firestoreの公開広告データが設定済みなら静的マスターを上書きする */
(function () {
  'use strict';

  var config = window.TC_FIREBASE_CONFIG;
  var manager = window.TCAffiliateManager;

  if (!config || !config.projectId || !manager) return;

  function loadRemoteAds() {
    Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
    ]).then(function (modules) {
    var appModule = modules[0];
    var dbModule = modules[1];
    var app = appModule.initializeApp(config);
    var db = dbModule.getFirestore(app);

    var publicQuery = dbModule.query(
      dbModule.collection(db, 'affiliate_public'),
      dbModule.where('is_active', '==', true)
    );

    return dbModule.getDocs(publicQuery).then(function (snapshot) {
      var remoteAds = [];
      snapshot.forEach(function (doc) {
        var data = doc.data() || {};
        remoteAds.push(Object.assign({ id: doc.id }, data));
      });

      // GitHubで明示的に登録した有効広告は、Firestore取得後も保持する。
      // 同じ広告IDがFirestore側にある場合は管理画面の設定を優先する。
      var staticAds = (window.TC_AFFILIATE_MASTER && window.TC_AFFILIATE_MASTER.ads) || [];
      var remoteIds = new Set(remoteAds.map(function (ad) { return ad.id; }));
      staticAds.forEach(function (ad) {
        if (ad && ad.is_active === true && ad.keep_on_remote === true && !remoteIds.has(ad.id)) {
          remoteAds.push(ad);
        }
      });
      manager.replaceAll(remoteAds, 'firestore');
    });
    }).catch(function (error) {
      console.warn('Affiliate Firestore fallback:', error);
    });
  }

  // アフィリエイト先の正確さを優先し、公開広告データは即時取得する。
  // import自体は非同期なのでHTML描画を同期ブロックしない。
  loadRemoteAds();
})();
