const config = window.TC_FIREBASE_CONFIG;
const missing = document.getElementById('firebase-missing');
const loginPanel = document.getElementById('login-panel');
const appPanel = document.getElementById('admin-app');
const logoutButton = document.getElementById('admin-logout');

if (!config || !config.projectId) {
  missing.hidden = false;
} else {
  const [
    appModule,
    authModule,
    dbModule
  ] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
  ]);

  const firebaseApp = appModule.initializeApp(config);
  const auth = authModule.getAuth(firebaseApp);
  const db = dbModule.getFirestore(firebaseApp);

  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const list = document.getElementById('ad-list');
  const stats = document.getElementById('admin-stats');
  const form = document.getElementById('ad-form');
  const formStatus = document.getElementById('form-status');
  const deleteButton = document.getElementById('delete-ad');
  const editorTitle = document.getElementById('editor-title');
  const contactList = document.getElementById('contact-list');
  const contactStats = document.getElementById('contact-stats');

  const fields = {
    id: document.getElementById('ad-id'),
    service_id: document.getElementById('service-id'),
    service_name: document.getElementById('service-name'),
    category: document.getElementById('category'),
    provider: document.getElementById('provider'),
    affiliate_url: document.getElementById('affiliate-url'),
    affiliate_code: document.getElementById('affiliate-code'),
    official_url: document.getElementById('official-url'),
    display_name: document.getElementById('display-name'),
    description: document.getElementById('description'),
    price: document.getElementById('price'),
    campaign: document.getElementById('campaign'),
    reward: document.getElementById('reward'),
    asp_name: document.getElementById('asp-name'),
    is_active: document.getElementById('is-active'),
    priority: document.getElementById('priority'),
    updated_at: document.getElementById('updated-at')
  };

  let ads = [];
  let contacts = [];
  let unsubscribe = null;
  let unsubscribeContacts = null;

  const serviceCatalog = window.TC_SERVICE_CATALOG || {};
  const serviceEntries = []
    .concat((Array.isArray(serviceCatalog.smartphone) ? serviceCatalog.smartphone : []).map(service => ({ kind: 'smartphone', service })))
    .concat((Array.isArray(serviceCatalog.wifi) ? serviceCatalog.wifi : []).map(service => ({ kind: 'wifi', service })));

  function adminCategory(entry) {
    if (!entry) return 'smartphone';
    const service = entry.service || {};
    if (entry.kind === 'wifi') {
      if (service.category === 'hikari' || String(service.serviceType || '').includes('光')) return 'fiber';
      if (service.category === 'home-router' || String(service.serviceType || '').includes('ホーム')) return 'home_wifi';
      return 'mobile_wifi';
    }
    if (['online', 'subbrand', 'mvno'].includes(String(service.serviceType || '').toLowerCase())) {
      return 'cheap_sim';
    }
    return 'smartphone';
  }

  function populateServiceOptions() {
    const datalist = document.getElementById('service-options');
    if (!datalist) return;
    datalist.innerHTML = '';
    serviceEntries.forEach(entry => {
      const option = document.createElement('option');
      option.value = entry.service.id;
      option.label = entry.service.name;
      datalist.appendChild(option);
    });
  }

  function syncServiceFields() {
    const id = fields.service_id.value.trim();
    const entry = serviceEntries.find(item => item.service && item.service.id === id);
    if (!entry) return;

    const service = entry.service;
    fields.service_name.value = service.name || '';
    fields.provider.value = service.carrier || service.network || '';
    fields.category.value = adminCategory(entry);
    fields.official_url.value = service.officialUrl || '';
    if (!fields.display_name.value.trim()) {
      fields.display_name.value = service.name || '';
    }
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function readForm() {
    return {
      service_id: fields.service_id.value.trim(),
      service_name: fields.service_name.value.trim(),
      category: fields.category.value,
      provider: fields.provider.value.trim(),
      affiliate_url: fields.affiliate_url.value.trim(),
      affiliate_code: fields.affiliate_code.value.trim(),
      render_mode: fields.affiliate_code.value.trim() ? 'code' : 'url',
      official_url: fields.official_url.value.trim(),
      display_name: fields.display_name.value.trim(),
      description: fields.description.value.trim(),
      price: fields.price.value.trim(),
      campaign: fields.campaign.value.trim(),
      reward: fields.reward.value.trim(),
      asp_name: fields.asp_name.value,
      is_active: fields.is_active.checked,
      priority: Number(fields.priority.value || 0),
      updated_at: fields.updated_at.value || today()
    };
  }

  function publicRecord(data) {
    return {
      service_id: data.service_id,
      service_name: data.service_name,
      category: data.category,
      provider: data.provider,
      affiliate_url: data.affiliate_url,
      affiliate_code: data.affiliate_code || '',
      render_mode: data.render_mode || (data.affiliate_code ? 'code' : 'url'),
      official_url: data.official_url,
      display_name: data.display_name,
      description: data.description,
      price: data.price,
      campaign: data.campaign,
      asp_name: data.asp_name,
      is_active: data.is_active,
      priority: data.priority,
      updated_at: data.updated_at
    };
  }

  function hasAffiliateTarget(data) {
    return Boolean(data && (String(data.affiliate_code || '').trim() || String(data.affiliate_url || '').trim()));
  }

  function validateAffiliateCode(code) {
    const raw = String(code || '').trim();
    if (!raw) return { ok: true };

    if (/\\</.test(raw) || /\[[^\]]*https?:\/\//i.test(raw)) {
      return { ok: false, message: '広告コードがMarkdown形式に変換されています。ASPの「広告コードをコピー」から元のHTMLを貼り直してください。' };
    }

    const template = document.createElement('template');
    template.innerHTML = raw;

    const allowedTags = new Set(['A', 'IMG']);
    const allowedAttrs = {
      A: new Set(['href', 'rel', 'target', 'title', 'referrerpolicy']),
      IMG: new Set(['src', 'alt', 'width', 'height', 'border', 'loading', 'referrerpolicy'])
    };

    const elements = Array.from(template.content.querySelectorAll('*'));
    if (!elements.length || !template.content.querySelector('a[href]')) {
      return { ok: false, message: '広告コード内に有効なリンクが見つかりません。ASPが発行した広告コードをそのまま貼ってください。' };
    }

    for (const element of elements) {
      if (!allowedTags.has(element.tagName)) {
        return { ok: false, message: '安全のため、広告コードはリンクと画像だけを許可しています。script等を含むコードは登録できません。' };
      }

      for (const attr of Array.from(element.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || !allowedAttrs[element.tagName].has(name)) {
          return { ok: false, message: '広告コードに許可していない属性が含まれています: ' + attr.name };
        }
        if ((name === 'href' || name === 'src') && !/^https?:\/\//i.test(attr.value)) {
          return { ok: false, message: '広告コードのURLは http/https のみ登録できます。' };
        }
      }
    }

    return { ok: true };
  }

  async function syncPublic(docId, data) {
    const publicRef = dbModule.doc(db, 'affiliate_public', docId);

    if (data.is_active && hasAffiliateTarget(data)) {
      await dbModule.setDoc(publicRef, publicRecord(data));
    } else {
      await dbModule.deleteDoc(publicRef).catch(() => {});
    }
  }

  function resetForm() {
    form.reset();
    fields.id.value = '';
    fields.priority.value = '100';
    fields.updated_at.value = today();
    fields.is_active.checked = false;
    editorTitle.textContent = '広告を追加';
    deleteButton.hidden = true;
    formStatus.textContent = '';
  }

  function fillForm(id, data) {
    fields.id.value = id;
    Object.entries(data).forEach(([key, value]) => {
      if (!fields[key]) return;
      if (key === 'is_active') {
        fields[key].checked = value === true;
      } else {
        fields[key].value = value == null ? '' : String(value);
      }
    });
    editorTitle.textContent = '広告を編集';
    deleteButton.hidden = false;
    document.getElementById('editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function render() {
    const activeCount = ads.filter(item => item.data.is_active && hasAffiliateTarget(item.data)).length;
    const services = new Set(ads.map(item => item.data.service_id).filter(Boolean));

    stats.innerHTML =
      '<span class="admin-stat">登録 ' + ads.length + '件</span>' +
      '<span class="admin-stat">有効 ' + activeCount + '件</span>' +
      '<span class="admin-stat">サービス ' + services.size + '件</span>';

    list.innerHTML = '';

    if (!ads.length) {
      list.innerHTML = '<div class="admin-card">広告データはまだありません。</div>';
      return;
    }

    ads.forEach(item => {
      const data = item.data;
      const row = document.createElement('article');
      row.className = 'admin-row';

      const title = document.createElement('div');
      title.className = 'admin-row-title';
      const strong = document.createElement('strong');
      strong.textContent = data.display_name || data.service_name || data.service_id || '名称未設定';
      const meta = document.createElement('span');
      meta.textContent = (data.service_id || '') + ' / ' + (data.provider || '');
      title.append(strong, meta);

      const asp = document.createElement('div');
      const format = data.affiliate_code ? 'コード' : (data.affiliate_url ? 'URL' : '未設定');
      asp.textContent = (data.asp_name || 'ASP未設定') + ' / ' + format;

      const priority = document.createElement('div');
      priority.innerHTML = '<small>priority</small><strong>' + Number(data.priority || 0) + '</strong>';

      const state = document.createElement('span');
      const isOn = data.is_active === true && hasAffiliateTarget(data);
      state.className = 'admin-state ' + (isOn ? 'is-on' : 'is-off');
      state.textContent = isOn ? 'ON' : 'OFF';

      const actions = document.createElement('div');
      actions.className = 'admin-row-actions';

      const edit = document.createElement('button');
      edit.type = 'button';
      edit.textContent = '編集';
      edit.addEventListener('click', () => fillForm(item.id, data));

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.textContent = data.is_active ? 'OFFにする' : 'ONにする';
      toggle.addEventListener('click', async () => {
        const next = Object.assign({}, data, {
          is_active: !data.is_active,
          updated_at: today()
        });
        await dbModule.setDoc(dbModule.doc(db, 'affiliate_ads', item.id), next, { merge: true });
        await syncPublic(item.id, next);
      });

      actions.append(edit, toggle);
      row.append(title, asp, priority, state, actions);
      list.appendChild(row);
    });
  }

  function contactTime(value) {
    if (!value) return '送信直後';
    try {
      const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (_) {
      return '日時不明';
    }
  }

  function renderContacts() {
    if (!contactList || !contactStats) return;

    const unread = contacts.filter(item => item.data.status === 'new').length;
    contactStats.innerHTML =
      '<span class="admin-stat">受信 ' + contacts.length + '件</span>' +
      '<span class="admin-stat">未確認 ' + unread + '件</span>';

    contactList.innerHTML = '';

    if (!contacts.length) {
      contactList.innerHTML = '<div class="admin-card">お問い合わせはまだありません。</div>';
      return;
    }

    contacts.forEach(item => {
      const data = item.data || {};
      const card = document.createElement('article');
      card.className = 'admin-contact-card' + (data.status === 'new' ? ' is-new' : '');

      const head = document.createElement('div');
      head.className = 'admin-contact-head';

      const title = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = data.type || 'お問い合わせ';
      const meta = document.createElement('span');
      meta.textContent = contactTime(data.created_at) + ' / ' + (data.name || '名前なし');
      title.append(strong, meta);

      const state = document.createElement('span');
      state.className = 'admin-state ' + (data.status === 'new' ? 'is-on' : 'is-off');
      state.textContent = data.status === 'new' ? '未確認' : '確認済み';
      head.append(title, state);

      const body = document.createElement('div');
      body.className = 'admin-contact-body';

      if (data.reply_email) {
        const reply = document.createElement('p');
        const label = document.createElement('strong');
        label.textContent = '返信先: ';
        const link = document.createElement('a');
        link.href = 'mailto:' + data.reply_email;
        link.textContent = data.reply_email;
        reply.append(label, link);
        body.appendChild(reply);
      }

      if (data.page) {
        const page = document.createElement('p');
        page.textContent = '該当ページ・サービス: ' + data.page;
        body.appendChild(page);
      }

      const message = document.createElement('p');
      message.className = 'admin-contact-message';
      message.textContent = data.message || '';
      body.appendChild(message);

      const actions = document.createElement('div');
      actions.className = 'admin-row-actions';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.textContent = data.status === 'new' ? '確認済みにする' : '未確認に戻す';
      toggle.addEventListener('click', async () => {
        await dbModule.updateDoc(dbModule.doc(db, 'contacts', item.id), {
          status: data.status === 'new' ? 'read' : 'new'
        });
      });

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '削除';
      remove.addEventListener('click', async () => {
        if (!window.confirm('このお問い合わせを削除しますか？')) return;
        await dbModule.deleteDoc(dbModule.doc(db, 'contacts', item.id));
      });

      actions.append(toggle, remove);
      card.append(head, body, actions);
      contactList.appendChild(card);
    });
  }

  function startContactsListener() {
    if (!contactList) return;
    if (unsubscribeContacts) unsubscribeContacts();

    unsubscribeContacts = dbModule.onSnapshot(
      dbModule.collection(db, 'contacts'),
      snapshot => {
        contacts = snapshot.docs
          .map(doc => ({ id: doc.id, data: doc.data() }))
          .sort((a, b) => {
            const at = a.data.created_at && typeof a.data.created_at.toMillis === 'function'
              ? a.data.created_at.toMillis()
              : 0;
            const bt = b.data.created_at && typeof b.data.created_at.toMillis === 'function'
              ? b.data.created_at.toMillis()
              : 0;
            return bt - at;
          });
        renderContacts();
      },
      error => {
        contactList.innerHTML = '<div class="admin-card admin-error">お問い合わせを取得できません: ' +
          String(error.message || error) +
          '</div>';
      }
    );
  }

  function startAdsListener() {
    if (unsubscribe) unsubscribe();

    const q = dbModule.collection(db, 'affiliate_ads');

    unsubscribe = dbModule.onSnapshot(q, snapshot => {
      ads = snapshot.docs
        .map(doc => ({ id: doc.id, data: doc.data() }))
        .sort((a, b) => {
          const serviceCompare = String(a.data.service_id || '').localeCompare(
            String(b.data.service_id || ''),
            'ja'
          );
          return serviceCompare || Number(b.data.priority || 0) - Number(a.data.priority || 0);
        });
      render();
    }, error => {
      list.innerHTML = '<div class="admin-card admin-error">広告一覧を取得できません: ' +
        String(error.message || error) +
      '</div>';
    });
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    loginError.textContent = '';

    try {
      await authModule.signInWithEmailAndPassword(
        auth,
        document.getElementById('login-email').value,
        document.getElementById('login-password').value
      );
    } catch (error) {
      loginError.textContent = 'ログインできませんでした。メールアドレス・パスワードをご確認ください。';
    }
  });

  populateServiceOptions();
  fields.service_id.addEventListener('change', syncServiceFields);
  fields.service_id.addEventListener('blur', syncServiceFields);

  logoutButton.addEventListener('click', () => authModule.signOut(auth));
  document.getElementById('new-ad').addEventListener('click', () => {
    resetForm();
    document.getElementById('editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('editor-reset').addEventListener('click', resetForm);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    formStatus.textContent = '保存しています…';

    try {
      const data = readForm();
      const codeCheck = validateAffiliateCode(data.affiliate_code);
      if (!codeCheck.ok) {
        throw new Error(codeCheck.message);
      }
      if (data.is_active && !hasAffiliateTarget(data)) {
        throw new Error('広告をONにする場合は、affiliate_url または広告コードのどちらかを入力してください。');
      }
      const existingId = fields.id.value.trim();
      const privateRef = existingId
        ? dbModule.doc(db, 'affiliate_ads', existingId)
        : dbModule.doc(dbModule.collection(db, 'affiliate_ads'));

      await dbModule.setDoc(privateRef, data, { merge: true });
      await syncPublic(privateRef.id, data);

      fields.id.value = privateRef.id;
      deleteButton.hidden = false;
      editorTitle.textContent = '広告を編集';
      formStatus.textContent = '保存しました。';
    } catch (error) {
      formStatus.textContent = '保存できませんでした: ' + String(error.message || error);
    }
  });

  deleteButton.addEventListener('click', async () => {
    const id = fields.id.value.trim();
    if (!id) return;

    if (!window.confirm('この広告を削除しますか？')) return;

    formStatus.textContent = '削除しています…';
    try {
      await Promise.all([
        dbModule.deleteDoc(dbModule.doc(db, 'affiliate_ads', id)),
        dbModule.deleteDoc(dbModule.doc(db, 'affiliate_public', id)).catch(() => {})
      ]);
      resetForm();
      formStatus.textContent = '削除しました。';
    } catch (error) {
      formStatus.textContent = '削除できませんでした: ' + String(error.message || error);
    }
  });

  authModule.onAuthStateChanged(auth, async user => {
    loginError.textContent = '';

    if (!user) {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (unsubscribeContacts) {
        unsubscribeContacts();
        unsubscribeContacts = null;
      }
      loginPanel.hidden = false;
      appPanel.hidden = true;
      logoutButton.hidden = true;
      return;
    }

    const adminDoc = await dbModule.getDoc(dbModule.doc(db, 'admins', user.uid));
    if (!adminDoc.exists()) {
      loginPanel.hidden = false;
      appPanel.hidden = true;
      logoutButton.hidden = false;
      loginError.textContent = 'このアカウントには管理者権限がありません。';
      return;
    }

    loginPanel.hidden = true;
    appPanel.hidden = false;
    logoutButton.hidden = false;
    resetForm();
    startAdsListener();
    startContactsListener();
  });
}
