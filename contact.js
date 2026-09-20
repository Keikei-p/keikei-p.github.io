/* つうしんコンパス - 非公開お問い合わせフォーム */
const config = window.TC_FIREBASE_CONFIG;
const form = document.getElementById('contact-form');
const unavailable = document.getElementById('contact-unavailable');
const submitButton = document.getElementById('contact-submit');
const status = document.getElementById('contact-status');

function showUnavailable(message) {
  if (unavailable) {
    unavailable.hidden = false;
    unavailable.textContent = message;
  }
  if (form) form.hidden = true;
}

if (!form || !config || !config.projectId) {
  showUnavailable('お問い合わせフォームを利用できません。時間をおいて再度お試しください。');
} else {
  try {
    const [appModule, dbModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
    ]);

    const firebaseApp = appModule.initializeApp(config);
    const db = dbModule.getFirestore(firebaseApp);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      status.textContent = '';

      const name = document.getElementById('contact-name').value.trim();
      const replyEmail = document.getElementById('contact-reply-email').value.trim();
      const type = document.getElementById('contact-type').value.trim();
      const page = document.getElementById('contact-page').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const website = document.getElementById('contact-website').value.trim();

      // Bot用の隠し項目。人間は入力しない。
      if (website) {
        form.reset();
        status.textContent = '送信しました。';
        return;
      }

      if (!name || !message) {
        status.textContent = 'お名前とお問い合わせ内容を入力してください。';
        return;
      }

      if (replyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyEmail)) {
        status.textContent = '返信先メールアドレスの形式をご確認ください。';
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = '送信中…';

      try {
        await dbModule.addDoc(dbModule.collection(db, 'contacts'), {
          name: name.slice(0, 100),
          reply_email: replyEmail.slice(0, 200),
          type: type.slice(0, 50),
          page: page.slice(0, 200),
          message: message.slice(0, 3000),
          source_path: String(window.location.pathname || '/').slice(0, 200),
          status: 'new',
          created_at: dbModule.serverTimestamp()
        });

        form.reset();
        status.textContent = 'お問い合わせを送信しました。';
      } catch (error) {
        console.error('Contact submit failed:', error);
        status.textContent = '送信できませんでした。時間をおいて再度お試しください。';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = '送信する';
      }
    });
  } catch (error) {
    console.error('Contact form setup failed:', error);
    showUnavailable('お問い合わせフォームを利用できません。時間をおいて再度お試しください。');
  }
}
