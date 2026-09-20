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

  const fields = {
    id: document.getElementById('ad-id'),
    service_id: document.getElementById('service-id'),
    service_name: document.getElementById('service-name'),
    category: document.getElementById('category'),
    provider: document.getElementById('provider'),
    affiliate_url: document.getElementById('affiliate-url'),
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
  let unsubscribe = null;

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function isAdminToken(tokenResult) {
    return tokenResult && tokenResult.claims && tokenResult.claims.admin === true;
  }

  function readForm() {
    return {
      service_id: fields.service_id.value.trim(),
      service_name: fields.service_name.value.trim(),
      category: fields.category.value,
      provider: fields.provider.value.trim(),
      affiliate_url: fields.affiliate_url.value.trim(),
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

  async function syncPublic(docId, data) {
    const publicRef = dbModule.doc(db, 'affiliate_public', docId);

    if (data.is_active && data.affiliate_url) {
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
    const activeCount = ads.filter(item => item.data.is_active && item.data.affiliate_url).length;
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
      asp.textContent = data.asp_name || 'ASP未設定';

      const priority = document.createElement('div');
      priority.innerHTML = '<small>priority</small><strong>' + Number(data.priority || 0) + '</strong>';

      const state = document.createElement('span');
      const isOn = data.is_active === true && Boolean(data.affiliate_url);
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

  function startAdsListener() {
    if (unsubscribe) unsubscribe();

    const q = dbModule.query(
      dbModule.collection(db, 'affiliate_ads'),
      dbModule.orderBy('service_id'),
      dbModule.orderBy('priority', 'desc')
    );

    unsubscribe = dbModule.onSnapshot(q, snapshot => {
      ads = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
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
      loginPanel.hidden = false;
      appPanel.hidden = true;
      logoutButton.hidden = true;
      return;
    }

    const tokenResult = await user.getIdTokenResult(true);
    if (!isAdminToken(tokenResult)) {
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
  });
}
