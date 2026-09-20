/* つうしんコンパス - お問い合わせメール作成 */
(function () {
  'use strict';

  var config = window.TC_CONTACT || {};
  var email = String(config.email || '').trim();
  var form = document.getElementById('contact-form');
  var unavailable = document.getElementById('contact-unavailable');

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (!form || !unavailable) return;

  if (!validEmail(email)) {
    unavailable.hidden = false;
    unavailable.textContent = 'お問い合わせ先メールアドレスの設定後、このフォームから連絡できるようになります。';
    form.hidden = true;
    return;
  }

  unavailable.hidden = true;
  form.hidden = false;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = document.getElementById('contact-name').value.trim();
    var type = document.getElementById('contact-type').value.trim();
    var page = document.getElementById('contact-page').value.trim();
    var message = document.getElementById('contact-message').value.trim();

    var subject = '【つうしんコンパス】' + type;
    var body = [
      'お名前・ハンドルネーム：' + name,
      'お問い合わせ種別：' + type,
      '該当ページ・サービス名：' + (page || '未記入'),
      '',
      'お問い合わせ内容：',
      message
    ].join('\n');

    window.location.href =
      'mailto:' + encodeURIComponent(email) +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
