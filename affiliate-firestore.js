/* 公開サイト用: Firestoreの公開広告データが設定済みなら静的マスターを上書きする */
(function () {
  'use strict';

  var config = window.TC_FIREBASE_CONFIG;
  var manager = window.TCAffiliateManager;

  if (!config || !config.projectId || !manager) return;

  Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
  ]).then(function (modules) {
    var appModule = modules[0];
    var dbModule = modules[1];
    var app = appModule.initializeApp(config);
    var db = dbModule.getFirestore(app);

    return dbModule.getDocs(dbModule.collection(db, 'affiliate_public')).then(function (snapshot) {
      var remoteAds = [];
      snapshot.forEach(function (doc) {
        var data = doc.data() || {};
        remoteAds.push(Object.assign({ id: doc.id }, data));
      });

      manager.replaceAll(remoteAds, 'firestore');
    });
  }).catch(function (error) {
    console.warn('Affiliate Firestore fallback:', error);
  });
})();
