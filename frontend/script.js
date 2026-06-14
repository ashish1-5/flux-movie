const TMDB_KEY  = '429e28badca0bf190c93d31df32dcf4b';
const TMDB_IMG  = 'https://image.tmdb.org/t/p/w500';
const API_BASE      =  'https://flux-movie.onrender.com/api';
const TMDB_BASE = `${API_BASE}/tmdb`;
const _tmdbCache = {};
const WATCHMODE_KEY = 'ixJ5KCa95HMmER3z2WVYTzbqxkPhidiskzmrzsZk';
const YT_KEY        = 'AIzaSyBnSuF6sbRQfr06ARUlGW0kkuH6mJWhBes';
const PER_PAGE      = 12;


/* channels/keywords considered "official" for trailer & free-movie search */
const OFFICIAL_KW = [
  'official','pictures','studios','films','entertainment','productions',
  'movies','cinema','youtube movies','t-series','dharma productions',
  'yash raj','eros now','zee music','tips films','netflix','prime video',
  'disney','marvel','warner','universal','paramount','lionsgate',
  '20th century','searchlight','a24','miramax','mgm','sony pictures',
  'red chillies','excel movies','reliance entertainment','pen movies',
  'jio studios','saregama','ultra bollywood','shemaroo',
];
const FULL_MOVIE_KW = [
  ...OFFICIAL_KW,
  'full movie','free movies','youtube movies','moserbaer','rajshri',
];

/* external embed servers */
const EXT_SERVERS = [
  { name:'MultiEmbed', badge:'esb-ads', label:'May have Ads',
    desc:'Popular aggregator. Use an adblocker for best experience.',
    url: id => `https://multiembed.mov/?video_id=${id}` },
  { name:'VidSrc.to',  badge:'esb-ads', label:'May have Ads',
    desc:'Reliable source with multiple internal mirrors.',
    url: id => `https://vidsrc.to/embed/movie/${id}` },
  { name:'VidLink',    badge:'esb-alt', label:'Alternative',
    desc:'Clean UI, fast loading, minimal ads.',
    url: id => `https://vidlink.pro/movie/${id}` },
  { name:'Embed.su',   badge:'esb-alt', label:'Alternative',
    desc:'Good backup if other servers are down.',
    url: id => `https://embed.su/embed/movie/${id}` },
  { name:'2Embed',     badge:'esb-ads', label:'May have Ads',
    desc:'Multiple server options inside the player.',
    url: id => `https://www.2embed.stream/embed/movie/${id}` },
  { name:'SuperEmbed', badge:'esb-alt', label:'Alternative',
    desc:'Direct stream via MultiEmbed network.',
    url: id => `https://multiembed.mov/directstream.php?video_id=${id}` },
];

/* movie pools for home page */
const HINDI_POOL = [
  'Sholay','Dilwale Dulhania Le Jayenge','Mughal-E-Azam','Lagaan','Dil Chahta Hai',
  'Rang De Basanti','Taare Zameen Par','Black','Swades','Devdas',
  '3 Idiots','Dangal','PK','Bajrangi Bhaijaan','Sultan',
  'Dhoom 3','Chennai Express','Kick','Bang Bang','Dabangg',
  'Singham','Rowdy Rathore','Ek Tha Tiger','Jab Tak Hai Jaan','Student of the Year',
  'Raazi','Andhadhun','Badhaai Ho','Uri: The Surgical Strike','Bard of Blood',
  'Gully Boy','Article 15','Kabir Singh','Super 30','Chhichhore',
  'War','Bala','Dil Bechara','Gunjan Saxena','Shakuntala Devi',
  
  'Tanhaji','Sooryavanshi','83','Shershaah','Sardar Udham',
  'Pushpa: The Rise','Drishyam 2','Gangubai Kathiawadi','Gehraiyaan','Jalsa',
  'Runway 34','Samrat Prithviraj','Vikram Vedha','Ponniyin Selvan',
  'KGF Chapter 2','RRR','Jawan','Pathaan','Animal',
  'Dunki','12th Fail','Fighter','Gadar 2','OMG 2',
  'Tiger 3','Sam Bahadur','Rocky Aur Rani Kii Prem Kahaani','Bade Miyan Chote Miyan',
  'Maidaan','Crew','Srikanth','Vedaa','Stree 2',
  'Singham Returns','Devara','Kalki 2898 AD','Sky Force','Chhaava',
  'Baby John','Emergency','Deva','Raayan','Thangalaan',
  'Indian 2','Auron Mein Kahan Dum Tha','Do Aur Do Pyaar','Yodha',
  'Adipurush','Tu Jhoothi Main Makkaar','Kisi Ka Bhai Kisi Ki Jaan',
  'Pushpa 2: The Rule','Tumbbad','Masaan','Kahaani','Queen',
  'Piku','Lunchbox','Kapoor & Sons','A Wednesday','Court',
  'Gangs of Wasseypur','Dev.D','Andaz Apna Apna','Barfi','Lootera',
];
const ENG_POOL = [
  // All-time greats
  'The Shawshank Redemption','The Godfather','The Godfather Part II','The Dark Knight',
  "Schindler's List",'12 Angry Men','Pulp Fiction','Forrest Gump','Inception',
  'Fight Club','Goodfellas','Interstellar','The Matrix','Parasite',
  'The Silence of the Lambs','Spirited Away','The Lord of the Rings: The Return of the King',
  'Whiplash','The Prestige','The Departed','No Country for Old Men',
  'Blade Runner 2049','Mad Max: Fury Road','Arrival','1917',
  'Her','Eternal Sunshine of the Spotless Mind','The Grand Budapest Hotel',
  'Oldboy','City of God','Grave of the Fireflies',
  // Marvel & DC
  'Avengers: Endgame','Avengers: Infinity War','Black Panther',
  'Spider-Man: No Way Home','Spider-Man: Into the Spider-Verse',
  'Iron Man','Captain America: The Winter Soldier','Thor: Ragnarok',
  'Guardians of the Galaxy','Doctor Strange','Black Panther: Wakanda Forever',
  'Ant-Man and the Wasp: Quantumania','The Marvels',
  // Action / Thriller
  'John Wick','John Wick: Chapter 2','John Wick: Chapter 3','John Wick: Chapter 4',
  'Top Gun: Maverick','Mission: Impossible - Fallout',
  'Mission: Impossible - Dead Reckoning Part One',
  'Fast & Furious 7','Fast X','The Batman',
  'Mad Max: Fury Road','Gladiator',
  // Sci-Fi / Fantasy
  'Dune','Dune: Part Two','Interstellar','Inception','The Matrix',
  'Blade Runner 2049','Arrival','Tenet','Everything Everywhere All at Once',
  'Avatar: The Way of Water',
  // Drama / Comedy
  'Oppenheimer','Barbie','Poor Things','Saltburn',
  'Killers of the Flower Moon','Tar','The Banshees of Inisherin',
  'Triangle of Sadness','CODA','Belfast',
  'Elvis','Bohemian Rhapsody','Rocketman',
  // Horror / Thriller
  'Get Out','A Quiet Place','A Quiet Place: Day One',
  'Hereditary','Midsommar','The Witch','It','It Chapter Two',
  'Bird Box','Knives Out','Glass Onion: A Knives Out Mystery',
  // Animation
  'Soul','Coco','Inside Out 2','Moana 2','Elemental',
  'The Lion King','Toy Story 4','Frozen II','Encanto','Turning Red',
  // Recent 2024-2025
  'Deadpool & Wolverine','Inside Out 2','Dune: Part Two',
  'Alien: Romulus','Twisters','Kingdom of the Planet of the Apes',
  'Furiosa: A Mad Max Saga','Godzilla x Kong: The New Empire',
  'The Substance','Wicked','Gladiator II','Civil War',
  'Napoleon','Indiana Jones and the Dial of Destiny',
  'Aquaman and the Lost Kingdom','Doctor Strange in the Multiverse of Madness',
  'Captain America: Brave New World','Thunderbolts','Sinners',
  'Mickey 17','A Minecraft Movie','The Accountant 2',
  'Final Destination Bloodlines','Novocaine','Wolf Man',
  'Companion','Black Bag','Wonka',
];

/* shared movie cache */
const _movieMap = {};

/* 2.  BACKEND API HELPERS */

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('fm_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // don't send body on GET/DELETE
  const fetchOpts = { ...options, headers };
  if (fetchOpts.body === undefined) delete fetchOpts.body;
  try {
    const res  = await fetch(`${API_BASE}${path}`, fetchOpts);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('apiRequest error:', path, err);
    return { ok: false, status: 0, data: { message: 'Network error' } };
  }
}

/* decode JWT for the admin inspector (server already verified it) */
function decodeToken(token) {
  try {
    const [h, b, s] = token.split('.');
    const dec = str => {
      str = str.replace(/-/g,'+').replace(/_/g,'/');
      while (str.length % 4) str += '=';
      return atob(str);
    };
    return { header: JSON.parse(dec(h)), payload: JSON.parse(dec(b)),
             signature: s, raw: { h, b, s } };
  } catch { return null; }
}

/* 3.  AUTH — session, login, signup, logout */

let currentUser  = null;
let currentToken = null;
let wishlist     = [];
let auditLog     = [];

async function loadSession() {
  const token = localStorage.getItem('fm_token');
  if (!token) return;
  try {
    const { ok, data } = await apiRequest('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (ok && data.user) {
      currentUser  = data.user;
      currentToken = token;
      // fetch wishlist separately since /auth/me doesn't return it
      try {
        const wlRes = await apiRequest('/wishlist');
        wishlist = wlRes.ok ? (wlRes.data.wishlist || []) : [];
      } catch { wishlist = []; }
    } else {
      localStorage.removeItem('fm_token');
    }
  } catch { localStorage.removeItem('fm_token'); }
}

function renderAuthUI() {
  const isAdmin = currentUser?.role === 'admin';
  document.getElementById('adminLink').style.display = isAdmin ? '' : 'none';
  if (currentUser) {
    document.getElementById('navAuth').style.display = 'none';
    document.getElementById('navUser').style.display = 'flex';
    const av = document.getElementById('navAvatar');
    av.childNodes[0].textContent = (currentUser.name || 'U')[0].toUpperCase();
    av.className = 'nav-avatar' + (isAdmin ? ' is-admin' : '');
    updateWLCount();
    const mar = document.getElementById('menuAuthRow');
    if (mar) mar.style.display = 'none';
    // hide all footer Sign In links
    document.querySelectorAll('.footer-signin').forEach(el => el.style.display = 'none');
  } else {
    document.getElementById('navAuth').style.display = 'flex';
    document.getElementById('navUser').style.display = 'none';
    const mar = document.getElementById('menuAuthRow');
    if (mar) mar.style.display = '';
    // show footer Sign In links
    document.querySelectorAll('.footer-signin').forEach(el => el.style.display = '');
  }
}

function openModal(tab = 'login') {
  document.getElementById('authModal').classList.add('open');
  switchModalTab(tab);
}
function closeModal() { document.getElementById('authModal').classList.remove('open'); }
function closeModalOutside(e) { if (e.target === document.getElementById('authModal')) closeModal(); }

function clearModalState() {
 ['loginEmail','loginPass','signupName','signupEmail','signupPass']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.querySelectorAll('.modal-err,.modal-success').forEach(el => {
    el.textContent = ''; el.classList.remove('show');
  });
}
function switchModalTab(tab) {
  clearModalState();
  document.querySelectorAll('.modal-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('loginForm').style.display   = tab === 'login'  ? '' : 'none';
  document.getElementById('signupForm').style.display  = tab === 'signup' ? '' : 'none';
}
function showModalErr(msg) { const e = document.getElementById('modalErr'); e.textContent = msg; e.classList.add('show'); }
function showModalOk(msg)  { const e = document.getElementById('modalSuccess'); e.textContent = msg; e.classList.add('show'); }

async function doLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
 const password = document.getElementById('loginPass').value; 
  if (!email || !password) { showModalErr('Fill in all fields.'); return; }
  try {
    const { ok, data } = await apiRequest('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    if (!ok) { showModalErr(data.message || 'Login failed.'); return; }
    localStorage.setItem('fm_token', data.token);
    currentUser  = data.user;
    currentToken = data.token;
    wishlist     = data.user.wishlist || [];
    // also fetch full wishlist from DB to be sure
    try {
      const wlRes = await apiRequest('/wishlist');
      if (wlRes.ok) wishlist = wlRes.data.wishlist || [];
    } catch {}
    renderAuthUI();
    updateWLCount();
    closeModal();
    showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
  } catch { showModalErr('Server error. Try again.'); }
}

async function doSignup() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPass').value;
  if (!name || !email || !password) { showModalErr('Fill in all fields.'); return; }
  if (password.length < 6) { showModalErr('Password must be 6+ characters.'); return; }
  try {
    const { ok, data } = await apiRequest('/auth/signup', {
      method: 'POST', body: JSON.stringify({ name, email, password }),
    });
    if (!ok) { showModalErr(data.message || 'Signup failed.'); return; }
    localStorage.setItem('fm_token', data.token);
    currentUser  = data.user;
    currentToken = data.token;
    wishlist     = [];
    renderAuthUI();
    updateWLCount();
    closeModal();
    showToast(`Welcome to Flux Movie, ${data.user.name}! 🎬`, 'success');
  } catch { showModalErr('Server error. Try again.'); }
}

async function logout() {
  try { await apiRequest('/auth/logout', { method: 'POST' }); } catch {}
  localStorage.removeItem('fm_token');
  currentUser  = null;
  currentToken = null;
  wishlist     = [];
  renderAuthUI();
  showHome();
  showToast('Signed out.');
}

/* 4.  WISHLIST */

function updateWLCount() {
  const badge = document.getElementById('wlCount');
  if (badge) badge.textContent = wishlist.length || '';
}

function isInWishlist(id) { return wishlist.some(m => m.imdbID === id); }

async function toggleWishlist(movie) {
  if (!currentUser) { openModal('login'); showToast('Sign in to save movies.', 'info'); return; }
  const inWL = isInWishlist(movie.imdbID);
  try {
    const { ok, data } = await apiRequest(
      inWL ? `/wishlist/${movie.imdbID}` : '/wishlist',
      {
        method: inWL ? 'DELETE' : 'POST',
        body: inWL ? undefined : JSON.stringify({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          imdbRating: movie.imdbRating,
          Genre: movie.Genre,
          Type: movie.Type,
        }),
      }
    );
    if (!ok) { showToast(data.message || 'Error', 'error'); return; }
    wishlist = data.wishlist || [];
    updateWLCount();
    showToast(inWL ? 'Removed from wishlist.' : '❤️ Added to wishlist', inWL ? '' : 'success');
    const btn = document.getElementById('detailWLBtn');
    if (btn) {
      btn.textContent = isInWishlist(movie.imdbID) ? '❤️ In Wishlist' : '🤍 Add to Wishlist';
      btn.classList.toggle('in-wl', isInWishlist(movie.imdbID));
    }
    // if wishlist page is open, refresh it
    const wlPage = document.getElementById('wishlistPage');
    if (wlPage && wlPage.classList.contains('active')) renderWishlistPage();
  } catch (e) { console.error('toggleWishlist error:', e); showToast('Error updating wishlist.', 'error'); }
}

function showWishlist() {
  stopTrailerIfPlaying();
  setNavActive('navWishlist');
  showPage('wishlistPage');
  document.title = 'Wishlist — Flux Movie';
  renderWishlistPage();
  document.getElementById('wishlistPage').classList.add('active');
}

async function renderWishlistPage() {
  const grid = document.getElementById('wlContent');
  if (!currentUser) {
    grid.innerHTML = `<div class="wl-empty"><div class="wl-empty-icon">🔒</div><div class="wl-empty-title">Sign in to see your wishlist</div><button class="btn-primary" onclick="openModal('login')" style="margin-top:.5rem">Sign In</button></div>`;
    return;
  }
  // always refresh from server when opening wishlist page
  grid.innerHTML = '<div style="color:var(--muted);padding:2rem;text-align:center">Loading wishlist…</div>';
  try {
    const wlRes = await apiRequest('/wishlist');
    if (wlRes.ok) { wishlist = wlRes.data.wishlist || []; updateWLCount(); }
  } catch {}
  if (!wishlist.length) {
    grid.innerHTML = `<div class="wl-empty"><div class="wl-empty-icon">🎬</div><div class="wl-empty-title">Your wishlist is empty</div><div class="wl-empty-sub">Browse movies and tap ❤️ to save them here for later.</div><button class="btn-primary" onclick="showHome()" style="margin-top:.5rem">Explore Movies</button></div>`;
    return;
  }
grid.innerHTML = `<div class="wl-grid">
  ${wishlist.map((m, i) => movieCard(m, i, false, true)).join('')}
</div>`;  grid.querySelectorAll('img[data-src]').forEach(lazyImg);
}

async function removeFromWL(imdbID) {
  if (!currentUser) return;
  const movie = wishlist.find(m => m.imdbID === imdbID);
  if (!movie) return;
  try {
    const { ok, data } = await apiRequest(`/wishlist/${imdbID}`, {
      method: 'DELETE',
    });
    if (!ok) { showToast(data.message || 'Error', 'error'); return; }
    wishlist = data.wishlist || [];
    updateWLCount();
    showToast('Removed from wishlist.');
    renderWishlistPage();
  } catch { showToast('Error.', 'error'); }
}

/* 5.  ADMIN PANEL */

function showAdmin() {
  if (!currentUser || currentUser.role !== 'admin') { showToast('Admin access only', 'error'); return; }
  stopTrailerIfPlaying();
  setNavActive('navAdmin');
  showPage('adminPage');
  renderAdminOverview();
}

function adminTab(btn, panel) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['ap-overview','ap-users','ap-jwt','ap-logs'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('ap-' + panel).style.display = 'block';
  if (panel === 'overview') renderAdminOverview();
  if (panel === 'users')    renderUsersTable();
  if (panel === 'jwt')      renderJWT();
  if (panel === 'logs')     renderLogsPanel();
}

async function renderAdminOverview() {
  try {
    const { ok, data } = await apiRequest('/admin/stats');
    if (!ok) return;
    const { total, admins, regular, logs } = data.stats;
    document.getElementById('adminStats').innerHTML = `
      <div class="astat"><div class="astat-val purple">${total}</div><div class="astat-label">Total Users</div></div>
      <div class="astat"><div class="astat-val cyan">${admins}</div><div class="astat-label">Admins</div></div>
      <div class="astat"><div class="astat-val red">${regular}</div><div class="astat-label">Regular Users</div></div>
      <div class="astat"><div class="astat-val" style="color:var(--gold)">${logs}</div><div class="astat-label">Log Entries</div></div>`;
    await fetchAuditLog();
    renderLogPanel('adminLogOverview', auditLog.slice(0, 8));
  } catch {}
}

async function renderUsersTable() {
  const q     = (document.getElementById('adminUserSearch')?.value || '');
  const tbody = document.getElementById('adminUsersBody');
  try {
    const { ok, data } = await apiRequest(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    if (!ok) return;
    const users = data.users || [];
    if (!users.length) { tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">No users found.</td></tr>`; return; }
    tbody.innerHTML = users.map(u => {
      const isMe    = u._id === currentUser?.id || u.email === currentUser?.email;
      const isAdmin = u.role === 'admin';
      return `<tr>
        <td><span class="user-avatar-sm ${isAdmin ? 'is-admin-av' : ''}">${(u.name||'?')[0].toUpperCase()}</span>
            <span style="font-weight:500">${u.name}</span>
            ${isMe ? '<span style="font-size:.6rem;color:var(--accent);margin-left:.3rem">(you)</span>' : ''}</td>
        <td style="color:var(--muted)">${u.email}</td>
        <td><span class="role-badge ${isAdmin ? 'rb-admin' : 'rb-user'}">${u.role||'user'}</span></td>
        <td style="color:var(--muted)">${(u.wishlist||[]).length} saved</td>
        <td style="color:var(--muted)">${u.joined||'—'}</td>
        <td>${!isAdmin && !isMe ? `<button class="promote-btn" onclick="promoteUser('${u._id}')">→ Admin</button>` : ''}
            <button class="del-btn" ${isMe ? 'disabled title="Cannot delete yourself"' : ''} onclick="deleteUser('${u._id}','${u.email}')">🗑 Remove</button></td>
      </tr>`;
    }).join('');
  } catch {}
}

async function deleteUser(id, email) {
  if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
  try {
    const { ok, data } = await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
    if (!ok) { showToast(data.message || 'Error', 'error'); return; }
    showToast(data.message || 'Removed');
    renderUsersTable(); renderAdminOverview();
  } catch {}
}

async function promoteUser(id) {
  try {
    const { ok, data } = await apiRequest(`/admin/users/${id}/promote`, { method: 'PATCH' });
    if (!ok) { showToast(data.message || 'Error', 'error'); return; }
    showToast(`${data.user.name} promoted to Admin`, 'success');
    renderUsersTable(); renderAdminOverview();
  } catch {}
}

function renderJWT() {
  const el = document.getElementById('jwtDisplay');
  const pl = document.getElementById('jwtPayloadDisplay');
  if (!currentToken) { el.textContent = 'Sign in to view your JWT token.'; pl.textContent = '—'; return; }
  const decoded = decodeToken(currentToken);
  if (!decoded) { el.textContent = 'Invalid token.'; return; }
  el.innerHTML  = `<span style="color:var(--accent2)">${decoded.raw.h}</span>.<span style="color:var(--gold)">${decoded.raw.b}</span>.<span style="color:var(--admin)">${decoded.raw.s}</span>`;
  pl.textContent = JSON.stringify(decoded.payload, null, 2);
}

async function fetchAuditLog() {
  try {
    const { ok, data } = await apiRequest('/admin/logs');
    if (ok) auditLog = data.logs || [];
  } catch { auditLog = []; }
}

async function renderLogsPanel() {
  await fetchAuditLog();
  renderLogPanel('adminLogFull', auditLog);
}

function renderLogPanel(id, logs) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!logs.length) { el.innerHTML = `<div class="admin-empty">No log entries yet.</div>`; return; }
  el.innerHTML = logs.map(l => `
    <div class="log-entry">
      <span class="log-time">${l.t}</span>
      <span class="log-icon">${l.icon}</span>
      <span class="log-msg">${l.msg}</span>
      <span class="log-severity ls-${l.severity}">${l.severity}</span>
    </div>`).join('');
}

/* 6.  NAVIGATION & ROUTING */

/* highlight active nav link */
function setNavActive(id) {
  ['navHome','navTrending','navNewReleases','navTopRated','navWishlist','navAdmin'].forEach(n => {
    const el = document.getElementById(n);
    if (el) el.classList.toggle('active', n === id);
  });
}

/* browser history stack so the back button works inside the app */
let _navStack = ['homePage'];

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(pageId);
  if (!el) return;
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (_navStack[_navStack.length - 1] !== pageId) {
    _navStack.push(pageId);
    try { history.pushState({ pageId }, ''); } catch {}
  }
}

function _restorePage(pageId) {
  stopTrailerIfPlaying();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(pageId);
  if (el) { el.classList.add('active'); window.scrollTo({ top: 0, behavior: 'instant' }); }
  if      (pageId === 'homePage')         setNavActive('navHome');
  else if (pageId === 'trendingPage')     setNavActive('navTrending');
  else if (pageId === 'newReleasesPage')  setNavActive('navNewReleases');
  else if (pageId === 'topRatedPage')     setNavActive('navTopRated');
  else if (pageId === 'wishlistPage')     setNavActive('navWishlist');
  else if (pageId === 'adminPage')        setNavActive('navAdmin');
  else setNavActive('');
}

window.addEventListener('popstate', function(e) {
  if (!e.state || !e.state.pageId) return;
  if (_navStack.length > 1) _navStack.pop();
  _restorePage(e.state.pageId);
});

try { history.replaceState({ pageId: 'homePage' }, ''); } catch {}

function showHome() {
  stopTrailerIfPlaying();
  setNavActive('navHome');
  showPage('homePage');
  document.title = 'Flux Movie';
}

let _prevPage = 'home';

function showDetail(movie, fromPage = 'home') {
  stopTrailerIfPlaying();
  _prevPage = fromPage;
  const backBtn = document.getElementById('detailBackBtn');
  if      (fromPage === 'wishlist')  { backBtn.textContent = '← Back to Wishlist';      backBtn.onclick = showWishlist;    }
  else if (fromPage === 'admin')     { backBtn.textContent = '← Back to Admin';          backBtn.onclick = showAdmin;       }
  else if (fromPage === 'trending')  { backBtn.textContent = '← Back to Trending';       backBtn.onclick = showTrending;    }
  else if (fromPage === 'newrel')    { backBtn.textContent = '← Back to New Releases';   backBtn.onclick = showNewReleases; }
  else if (fromPage === 'toprated')  { backBtn.textContent = '← Back to Top Rated';      backBtn.onclick = showTopRated;    }
  else                               { backBtn.textContent = '← Back to Home';           backBtn.onclick = showHome;        }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('detailPage').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  resetTabs();
  loadDetail(movie);
}

/* 7.  UI HELPERS */

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast' + (type ? ' ' + type : '');
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3200);
}

function resetTabs() {
  document.querySelectorAll('.wtab').forEach((b, i)     => b.classList.toggle('active', i === 0));
  document.querySelectorAll('.tab-panel').forEach((p, i) => p.classList.toggle('active', i === 0));
}
function switchTab(name) {
  if (name !== 'trailer') stopTrailerIfPlaying();
  const map = { trailer: 0, ytmovie: 1, external: 2 };
  const idx = map[name];
  document.querySelectorAll('.wtab').forEach((b, i)     => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.tab-panel').forEach((p, i) => p.classList.toggle('active', i === idx));
}

let trailerIsPlaying = false;
let trailerVideoId   = null;

document.addEventListener('keydown', e => {
  if (e.code !== 'Space') return;
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  const detailActive  = document.getElementById('detailPage').classList.contains('active');
  const trailerActive = document.getElementById('tab-trailer').classList.contains('active');
  if (!detailActive || !trailerActive) return;
  e.preventDefault();
  const iframe = document.querySelector('#tab-trailer iframe');
  if (iframe) {
    const cmd = trailerIsPlaying ? 'pauseVideo' : 'playVideo';
    iframe.contentWindow.postMessage(JSON.stringify({ event:'command', func:cmd, args:'' }), '*');
    trailerIsPlaying = !trailerIsPlaying;
  } else {
    const thumb = document.querySelector('#tab-trailer .yt-thumb-wrap');
    if (thumb && trailerVideoId) { thumb.click(); trailerIsPlaying = true; }
  }
  updateSpaceHint();
});
function updateSpaceHint() {
  const hint = document.getElementById('spaceHint');
  if (!hint) return;
  hint.innerHTML = `<kbd>Space</kbd> ${trailerIsPlaying ? 'Pause' : 'Play'} trailer`;
  hint.className = 'space-hint' + (trailerIsPlaying ? ' playing' : '');
}
function stopTrailerIfPlaying() {
  const iframe = document.querySelector('#tab-trailer iframe');
  if (iframe) {
    try { iframe.contentWindow.postMessage(JSON.stringify({ event:'command', func:'pauseVideo', args:'' }), '*'); } catch {}
  }
  trailerIsPlaying = false;
  trailerVideoId   = null;
}

const PC = [
  ['#0d1520','#1a2840'],['#1a0d10','#2d1020'],['#0d1a0d','#102d10'],
  ['#1a1a0d','#2d2d10'],['#0d0d1a','#10102d'],['#1a0d1a','#2d102d'],['#1a100d','#2d1a10'],
];
function ph(title, idx = 0) {
  const [a, b] = PC[idx % PC.length];
  const k = (title || '').split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/>
      </linearGradient></defs>
      <rect width="200" height="300" fill="url(%23g)"/>
      <text x="100" y="155" font-family="sans-serif" font-size="50" font-weight="bold"
            fill="rgba(255,255,255,0.13)" text-anchor="middle">${k}</text>
    </svg>`
  )}`;
}

function lazyImg(img) {
  if (!img.dataset.src) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const tmp = new Image();
      tmp.onload = () => { el.src = el.dataset.src; el.classList.add('loaded'); };
      tmp.src = el.dataset.src;
      io.unobserve(el);
    });
  }, { rootMargin: '200px' });
  io.observe(img);
}

function skCards(n) {
  return Array.from({ length: n }, () => `
    <div class="sk-card">
      <div class="sk-poster"></div>
      <div class="sk-body"><div class="sk-line"></div><div class="sk-line short"></div></div>
    </div>`).join('');
}

/* 8.  API FETCHERS — OMDB, Watchmode, YouTube */




async function fetchMovie(title) {
  if (_tmdbCache[title]) return _tmdbCache[title];
  try {
    const r = await fetch(`${TMDB_BASE}/search/movie?query=${encodeURIComponent(title)}&api_key=${TMDB_KEY}&language=en-US`);
    const d = await r.json();
    const t = d.results?.[0];
    if (!t) return null;
    const full = await fetchMovieByTMDBId(t.id);
    if (full) { _tmdbCache[title] = full; return full; }
    return null;
  } catch { return null; }
}

async function fetchMovieByTMDBId(tmdbId) {
  try {
    const r = await fetch(`${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits,release_dates,videos`);
    const d = await r.json();
    return tmdbToOMDB(d);
  } catch { return null; }
}

async function fetchMovieByID(imdbId) {
  if (imdbId?.startsWith('tmdb_')) return fetchMovieByTMDBId(imdbId.replace('tmdb_', ''));
  try {
    const r = await fetch(`${TMDB_BASE}/find/${imdbId}?api_key=${TMDB_KEY}&external_source=imdb_id`);
    const d = await r.json();
    const t = d.movie_results?.[0];
    if (!t) return null;
    return fetchMovieByTMDBId(t.id);
  } catch { return null; }
}

function tmdbToOMDB(d) {
  const genres   = (d.genres || []).map(g => g.name).join(', ');
  const cast     = (d.credits?.cast || []).slice(0, 4).map(c => c.name).join(', ');
  const director = (d.credits?.crew || []).find(c => c.job === 'Director')?.name || '—';
  const writer   = (d.credits?.crew || []).filter(c => ['Writer','Screenplay','Story'].includes(c.job)).slice(0,2).map(c=>c.name).join(', ') || '—';
  const lang     = d.original_language === 'hi' ? 'Hindi' : (d.spoken_languages?.[0]?.english_name || 'English');
  return {
    imdbID:     d.imdb_id || `tmdb_${d.id}`,
    tmdbID:     d.id,
    Title:      d.title || d.original_title,
    Year:       d.release_date?.split('-')[0] || '—',
    Poster:     d.poster_path ? `${TMDB_IMG}${d.poster_path}` : null,
    imdbRating: d.vote_average ? d.vote_average.toFixed(1) : '—',
    Genre:      genres || '—',
    Plot:       d.overview || 'No description available.',
    Type:       'movie',
    Language:   lang,
    Runtime:    d.runtime ? `${d.runtime} min` : '—',
    Director:   director,
    Writer:     writer,
    Actors:     cast,
    Country:    (d.production_countries || []).map(c => c.name).join(', ') || '—',
    Awards:     '—',
    Rated:      '—',
    BoxOffice:  d.revenue ? `$${(d.revenue/1e6).toFixed(1)}M` : '—',
    Metascore:  '—',
    TrailerKey: trailer ? trailer.key : null,

  };
}

async function fetchWatchmode(imdbID) {
  try {
    const sr = await fetch(`https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_KEY}&search_field=imdb_id&search_value=${imdbID}`);
    if (!sr.ok) return [];
    const sd = await sr.json();
    const wmID = sd.title_results?.[0]?.id;
    if (!wmID) return [];
    const cr = await fetch(`https://api.watchmode.com/v1/title/${wmID}/sources/?apiKey=${WATCHMODE_KEY}`);
    if (!cr.ok) return [];
    const cd = await cr.json();
    return (cd || []).filter(s => s.region === 'IN' || s.region === 'US').map(s => ({
      name:    s.name,
      type:    s.type,
      price:   s.price,
      web_url: s.web_url,
    }));
  } catch { return []; }
}

async function ytSearch(query, n = 10) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${n}&type=video&key=${YT_KEY}`;
    const r   = await fetch(url);
    if (!r.ok) return [];
    const d = await r.json();
    if (d.error) return [];
    return (d.items || []).map(i => ({
      id:      i.id?.videoId,
      title:   i.snippet.title,
      channel: i.snippet.channelTitle,
      thumb:   i.snippet.thumbnails?.high?.url || i.snippet.thumbnails?.medium?.url,
    })).filter(x => x.id);
  } catch { return []; }
}
function ytThumb(id)   { return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`; }
function ytThumbFB(id) { return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }
function isOfficial(item, kwList = OFFICIAL_KW) {
  return kwList.some(k => (item.channel || '').toLowerCase().includes(k));
}
async function fetchMoviesFromYTThenOMDB(queries, limit = 40) {
  return []; // disabled — TMDB handles this now
}

/* 9.  MOVIE CARD BUILDER */

let allMovies        = [];
let filteredMovies   = [];
let hindiMovies      = [];
let currentPage      = 1;
let _pageMovies      = [];
let _hindiPageMovies = [];
let _searchMovies    = [];
let _tickerMovies    = [];

function movieCard(m, i, isHindi = false, isWL = false) {
  const poster = m.Poster && m.Poster !== 'N/A' ? m.Poster : ph(m.Title, i);
  const rating = m.imdbRating && m.imdbRating !== 'N/A' ? m.imdbRating : '—';
  const genre  = (m.Genre || '').split(',')[0].trim() || 'Movie';
  const type   = m.Type === 'series' ? 'SERIES' : 'FILM';
  const delay  = (i % PER_PAGE) * 0.035;
  return `
    <div class="movie-card" style="animation-delay:${delay}s"
         data-idx="${i}" data-type="${isHindi ? 'hindi' : isWL ? 'wl' : 'eng'}"
         onclick="clickCard(this)">
      ${isWL ? `<button class="wl-remove-btn" onclick="event.stopPropagation();removeFromWL('${m.imdbID}')">✕</button>` : ''}
      <div class="poster-wrap">
        <img class="c-poster-img" data-src="${poster}" src="${ph(m.Title, i)}" alt="${m.Title}" loading="lazy"/>
        <div class="c-type">${type}</div>
        ${rating !== '—' ? `<div class="c-rating">★ ${rating}</div>` : ''}
        <div class="c-overlay"><button class="c-overlay-btn">▶ View Details</button></div>
      </div>
      <div class="c-body">
        <div class="c-title">${m.Title}</div>
        <div class="c-meta">
          <span class="c-year">${m.Year || '—'}</span>
          <span class="c-genre">${genre}</span>
        </div>
      </div>
    </div>`;
}

function clickCard(el) {
  const i    = parseInt(el.dataset.idx);
  const type = el.dataset.type;
  let m = null;

  if (document.getElementById('trendingPage').classList.contains('active')) {
    m = _trendingPageMovies[i]; if (m) showDetail(m, 'trending'); return;
  }
  if (document.getElementById('newReleasesPage').classList.contains('active')) {
    m = _newRelPageMovies[i]; if (m) showDetail(m, 'newrel'); return;
  }
  const trPage = document.getElementById('topRatedPage');
  if (trPage && trPage.classList.contains('active')) {
    m = _topRatedPageMovies[i]; if (m) showDetail(m, 'toprated'); return;
  }
  if (type === 'hindi')   m = _hindiPageMovies[i];
  else if (type === 'wl') m = wishlist[i];
  else                    m = _pageMovies[i];

  const fromPage = type === 'wl' ? 'wishlist'
    : document.getElementById('adminPage').classList.contains('active') ? 'admin' : 'home';
  if (m) showDetail(m, fromPage);
}

/* 10.  HOME PAGE — grids, ticker, search, pagination */

async function loadHindiMovies() {
  const grid = document.getElementById('hindiGrid');
  grid.innerHTML = skCards(PER_PAGE);
  // fetch 60 movies (cached after first load = 0 extra API calls)
  const pool = [...HINDI_POOL].sort(() => Math.random() - .5).slice(0, PER_PAGE);
  const all = [];
  for (let i = 0; i < pool.length; i += 10) {
    const batch = await Promise.allSettled(pool.slice(i, i + 10).map(t => fetchMovie(t)));
    batch.forEach(r => { if (r.status === 'fulfilled' && r.value) { all.push(r.value); _movieMap[r.value.imdbID] = r.value; } });
    await new Promise(r => setTimeout(r, 50));
  }
  hindiMovies      = [...all];
  _hindiPageMovies = hindiMovies.slice(0, PER_PAGE);
  grid.innerHTML   = _hindiPageMovies.map((m, i) => movieCard(m, i, true)).join('');
  grid.querySelectorAll('img[data-src]').forEach(lazyImg);
}

async function loadMovies() {
  const grid = document.getElementById('moviesGrid');
  grid.innerHTML = skCards(PER_PAGE);
  // fetch 60 movies (cached after first load = 0 extra API calls)
  const pool = [...ENG_POOL].sort(() => Math.random() - .5);
  const all  = [];
  for (let i = 0; i < pool.length; i += 10) {
    const batch = await Promise.allSettled(pool.slice(i, i + 10).map(t => fetchMovie(t)));
    batch.forEach(r => { if (r.status === 'fulfilled' && r.value) { all.push(r.value); _movieMap[r.value.imdbID] = r.value; } });
    await new Promise(r => setTimeout(r, 50));
  }
  allMovies      = [...all];
  filteredMovies = [...allMovies];
  currentPage    = 1;
  renderPage();
  loadTicker();
}

function renderPage() {
  const grid  = document.getElementById('moviesGrid');
  const start = (currentPage - 1) * PER_PAGE;
  const page  = filteredMovies.slice(start, start + PER_PAGE);
  _pageMovies = [...page];
  if (!page.length) {
    grid.innerHTML = `<div style="color:var(--muted);padding:3rem;grid-column:1/-1;text-align:center">No movies found.</div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }
  grid.innerHTML = page.map((m, i) => movieCard(m, i, false)).join('');
  grid.querySelectorAll('img[data-src]').forEach(lazyImg);
  renderPagination();
}

function renderPagination() {
  const total = Math.ceil(filteredMovies.length / PER_PAGE);
  const pg    = document.getElementById('pagination');
  if (total <= 1) { pg.innerHTML = ''; return; }
  let h = `<button class="pg-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
  const s = Math.max(1, currentPage - 2), e = Math.min(total, currentPage + 2);
  for (let p = s; p <= e; p++)
    h += `<button class="pg-btn${p === currentPage ? ' active' : ''}" onclick="goPage(${p})">${p}</button>`;
  h += `<button class="pg-btn" onclick="goPage(${currentPage + 1})" ${currentPage === total ? 'disabled' : ''}>›</button>`;
  pg.innerHTML = h;
}

function goPage(p) {
  const total = Math.ceil(filteredMovies.length / PER_PAGE);
  if (p < 1 || p > total) return;
  currentPage = p;
  renderPage();
  document.getElementById('moviesGrid').scrollIntoView({ behavior: 'smooth' });
}

function filterGenre(btn, genre) {
  // clear all pills in this container first
  document.querySelectorAll('#genrePills .gpill').forEach(b => b.classList.remove('active'));
  // set active on the clicked one
  if (btn) btn.classList.add('active');
  filteredMovies = genre
    ? allMovies.filter(m => (m.Genre || '').toLowerCase().includes(genre.toLowerCase()))
    : [...allMovies];
  currentPage = 1;
  renderPage();
}

function loadTicker() {
  const track    = document.getElementById('tickerTrack');
  const combined = [...hindiMovies, ...allMovies]
    .filter(m => m.imdbRating && m.imdbRating !== 'N/A')
    .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
    .slice(0, 14);
  _tickerMovies = [...combined];
  const items = _tickerMovies.map((m, i) => {
    const poster = m.Poster && m.Poster !== 'N/A' ? m.Poster : ph(m.Title, i);
    const isH    = (m.Language || '').toLowerCase().includes('hindi');
    return `<div class="t-item" data-ti="${i}" onclick="clickTicker(this)">
      <span class="t-rank">#${i + 1}</span>
      <img src="${ph(m.Title, i)}" data-src="${poster}" alt="${m.Title}" loading="lazy"/>
      <span>${m.Title}</span>
      ${isH ? `<span style="color:var(--orange);font-size:.65rem">🇮🇳</span>` : ''}
      ${m.imdbRating && m.imdbRating !== 'N/A' ? `<span style="color:var(--gold);font-size:.7rem">★ ${m.imdbRating}</span>` : ''}
    </div>`;
  }).join('');
  track.innerHTML = items + items;
  track.querySelectorAll('img[data-src]').forEach(lazyImg);
}
function clickTicker(el) {
  const i = parseInt(el.dataset.ti) % _tickerMovies.length;
  if (_tickerMovies[i]) showDetail(_tickerMovies[i]);
}

let searchTimeout = null;

document.getElementById('searchInput').addEventListener('input', function () {
  clearTimeout(searchTimeout);
  const q  = this.value.trim();
  const dd = document.getElementById('searchDrop');
  if (!q) { dd.classList.remove('open'); dd.innerHTML = ''; return; }
  searchTimeout = setTimeout(async () => {
    dd.innerHTML = `<div style="padding:.8rem 1rem;color:var(--muted);font-size:.8rem">Searching…</div>`;
    dd.classList.add('open');
    let results = [...hindiMovies, ...allMovies]
      .filter(m => m.Title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
    if (results.length < 3) {
      try {
const r = await fetch(`${TMDB_BASE}/search/movie?query=${encodeURIComponent(q)}&api_key=${TMDB_KEY}&language=en-US`);
if (r.ok) {
  const d = await r.json();
  if (d.results) results = [...results, ...d.results
    .filter(x => !results.find(r => r.imdbID === `tmdb_${x.id}`))
    .map(x => ({ imdbID: `tmdb_${x.id}`, Title: x.title, Year: x.release_date?.split('-')[0], Poster: x.poster_path ? `${TMDB_IMG}${x.poster_path}` : null, Type: 'movie' }))
  ].slice(0, 6);
}       
      } catch {}
    }
    if (!results.length) { dd.innerHTML = `<div style="padding:.8rem 1rem;color:var(--muted);font-size:.8rem">No results found.</div>`; return; }
    _searchMovies = [...results];
    dd.innerHTML  = results.map((m, i) => {
      const poster = m.Poster && m.Poster !== 'N/A' ? m.Poster : ph(m.Title, 0);
      return `<div class="s-item" data-si="${i}" onclick="clickSearch(this)">
        <img src="${ph(m.Title, 0)}" data-src="${poster}" alt="${m.Title}"/>
        <div><div class="s-title">${m.Title}</div><div class="s-meta">${m.Year || ''} ${m.Type ? '· ' + m.Type : ''}</div></div>
      </div>`;
    }).join('');
    dd.querySelectorAll('img[data-src]').forEach(lazyImg);
  }, 350);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) {
    document.getElementById('searchDrop').classList.remove('open');
    document.getElementById('searchInput').value = '';
  }
});

async function clickSearch(el) {
  const i = parseInt(el.dataset.si);
  document.getElementById('searchDrop').classList.remove('open');
  document.getElementById('searchInput').value = '';
  let m = _searchMovies[i];
  if (!m) return;
  if (!m.Plot || !m.Genre) { const full = await fetchMovieByID(m.imdbID); if (full) m = full; }
  showDetail(m);
}

async function loadTrailer(title, year, trailerKey) {
  const container  = document.getElementById('trailerContainer');
  trailerVideoId   = null;
  trailerIsPlaying = false;
  updateSpaceHint();

  // Use TMDB-verified trailer if available — skip YouTube search entirely
  if (trailerKey) {
    trailerVideoId = trailerKey;
    const thumbFB   = ytThumbFB(trailerKey);
    const thumbHD   = ytThumb(trailerKey);
    const safeTitle = (title || '').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    container.innerHTML = `
      <div class="yt-thumb-wrap" onclick="playYTTrailer('${trailerKey}','${safeTitle}')" title="Play trailer — or press Space">
        <img src="${thumbFB}" id="trailerThumbImg" alt="${safeTitle}" style="object-fit:cover"/>
        <div class="yt-thumb-overlay"></div>
        <div class="yt-thumb-play"><svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div>
        <div class="yt-thumb-info">
          <div class="yt-thumb-title">${safeTitle}</div>
          <div class="yt-thumb-channel"><span class="yt-verified">✓ Official Trailer</span></div>
        </div>
      </div>`;
    const hd = new Image();
    hd.onload = () => { const el = document.getElementById('trailerThumbImg'); if (el) el.src = thumbHD; };
    hd.src = thumbHD;
    updateSpaceHint();
    return;
  }

  // Fallback: YouTube search
  const queries = [
    `"${title}" ${year || ''} official trailer`,
    `${title} official trailer ${year || ''}`,
    `${title} trailer official`,
  ];
  let best = null;
  for (const q of queries) {
    const results = await ytSearch(q, 10);
    best = results.find(r => isOfficial(r) && r.title.toLowerCase().includes('official trailer'));
    if (!best) best = results.find(r => isOfficial(r) && r.title.toLowerCase().includes('trailer'));
    if (!best) best = results.find(r => isOfficial(r));
    if (best) break;
  }
  if (!best) {
    container.innerHTML = `<div class="yt-not-found"><div class="yt-not-found-icon">🎬</div><div class="yt-not-found-title">Official trailer not available</div><div class="yt-not-found-sub">No verified official channel uploaded a trailer for this title on YouTube.</div></div>`;
    return;
  }
  trailerVideoId = best.id;
  const thumbFB   = ytThumbFB(best.id);
  const thumbHD   = ytThumb(best.id);
  const safeTitle = best.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const safeCh    = best.channel.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  container.innerHTML = `
    <div class="yt-thumb-wrap" onclick="playYTTrailer('${best.id}','${safeTitle}')" title="Play trailer — or press Space">
      <img src="${thumbFB}" id="trailerThumbImg" alt="${safeTitle}" style="object-fit:cover"/>
      <div class="yt-thumb-overlay"></div>
      <div class="yt-thumb-play"><svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="yt-thumb-info">
        <div class="yt-thumb-title">${safeTitle}</div>
        <div class="yt-thumb-channel"><span>📺 ${safeCh}</span><span class="yt-verified">✓ Official</span></div>
      </div>
    </div>`;
  const hd = new Image();
  hd.onload = () => { const el = document.getElementById('trailerThumbImg'); if (el) el.src = thumbHD; };
  hd.src = thumbHD;
  updateSpaceHint();
}

async function loadYTMovie(title, year) {
  const container = document.getElementById('ytMovieContainer');
  const queries   = [
    `${title} full movie official ${year || ''}`,
    `${title} full movie free`,
    `${title} full movie`,
  ];
  let best = null;
  for (const q of queries) {
    const results  = await ytSearch(q, 10);
    const filtered = results.filter(r => r.title.toLowerCase().includes('full movie') || r.title.toLowerCase().includes('full film'));
    best = filtered.find(r => isOfficial(r, FULL_MOVIE_KW));
    if (best) break;
  }
  if (!best) {
    container.innerHTML = `<div class="yt-not-found"><div class="yt-not-found-icon">📡</div><div class="yt-not-found-title">Not available on YouTube</div><div class="yt-not-found-sub">No verified official channel has uploaded this movie for free. Check Official Platforms below.</div></div>`;
    return;
  }
  const thumbFB   = ytThumbFB(best.id);
  const thumbHD   = ytThumb(best.id);
  const safeTitle = best.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const safeCh    = best.channel.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  container.innerHTML = `
    <div class="yt-found-bar">
      <span style="color:var(--green)">✓</span>
      <span style="color:var(--green)">Found on YouTube:</span>
      <span style="color:var(--text);font-weight:600">${safeTitle}</span>
      <span style="color:var(--muted)">— ${safeCh}</span>
      <span class="yt-verified" style="margin-left:auto">✓ Official</span>
    </div>
    <div class="yt-thumb-wrap" onclick="playYTMovie('ytMovieContainer','${best.id}','${safeTitle}')" style="border-radius:12px;overflow:hidden">
      <img src="${thumbFB}" id="ytMovieThumbImg" alt="${safeTitle}" style="object-fit:cover"/>
      <div class="yt-thumb-overlay"></div>
      <div class="yt-thumb-play" style="background:rgba(0,200,100,.85);box-shadow:0 4px 24px rgba(0,200,100,.5)"><svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="yt-thumb-info">
        <div class="yt-thumb-title">${safeTitle}</div>
        <div class="yt-thumb-channel"><span>📺 ${safeCh}</span><span class="yt-verified">✓ Official</span></div>
      </div>
    </div>`;
  const hd = new Image();
  hd.onload = () => { const el = document.getElementById('ytMovieThumbImg'); if (el) el.src = thumbHD; };
  hd.src = thumbHD;
}

function playYTMovie(containerId, ytId, title) {
  const container = document.getElementById(containerId);
  const bar       = container.querySelector('.yt-found-bar');
  const barHTML   = bar ? bar.outerHTML : '';
  container.innerHTML = barHTML + `
    <div class="yt-player-iframe">
      <iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1"
              allowfullscreen allow="autoplay; encrypted-media" title="${title}"></iframe>
    </div>`;
}

function buildExtServers(imdbID) {
  const grid = document.getElementById('extServersGrid');
  if (!imdbID) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:1.5rem;color:var(--muted);font-size:.83rem">No IMDB ID — cannot generate links.</div>`; return; }
  grid.innerHTML = EXT_SERVERS.map(s => `
    <div class="ext-server-card">
      <div class="ext-server-top"><div class="ext-server-name">${s.name}</div><span class="ext-server-badge ${s.badge}">${s.label}</span></div>
      <div class="ext-server-desc">${s.desc}</div>
      <a class="ext-server-btn" href="${s.url(imdbID)}" target="_blank" rel="noopener noreferrer">↗ Open in New Tab</a>
    </div>`).join('');
}

function renderWatchGrid(sources) {
  const grid  = document.getElementById('watchGrid');
  if (!sources.length) { grid.innerHTML = `<div class="no-watch">📡 No data. Try <a href="https://www.justwatch.com" target="_blank">JustWatch.com</a></div>`; return; }
  const order = { free:0, sub:1, tve:2, rent:3, buy:4 };
  const seen  = new Set();
  const uniq  = [];
  sources.forEach(s => { const k = s.name+'|'+s.type; if (!seen.has(k)) { seen.add(k); uniq.push(s); } });
  uniq.sort((a, b) => (order[a.type] ?? 9) - (order[b.type] ?? 9));
  grid.innerHTML = uniq.slice(0, 12).map(s => {
    const iF = s.type === 'free', iS = s.type === 'sub' || s.type === 'tve', iR = s.type === 'rent';
    const cc  = iF ? 'wf' : iS ? 'ws' : 'wr';
    const bc  = iF ? 'wb-f' : iS ? 'wb-s' : iR ? 'wb-r' : 'wb-b';
    const toINR = usd => usd ? `₹${Math.round(usd * 84)}` : '';
    const bt    = iF ? '🟢 FREE' : iS ? '📺 Sub' : iR ? `💰 Rent${s.price ? ` ${toINR(s.price)}` : ''}` : `💳 Buy${s.price ? ` ${toINR(s.price)}` : ''}`;
    const desc  = iF ? 'Free with ads.' : iS ? 'Included with subscription.' : iR ? 'Rent for limited time.' : 'Buy to own.';
    const btnTxt = iF ? '▶ Watch Free' : iS ? '▶ Stream' : '💰 Rent/Buy';
    return `<div class="wcard ${cc}">
      <div class="wc-top"><div class="wc-name">${s.name}</div><span class="wc-badge ${bc}">${bt}</span></div>
      <div class="wc-desc">${desc}</div>
      <a class="wc-btn ${bc} btn" href="${s.web_url || '#'}" target="_blank" rel="noopener">${btnTxt}</a>
    </div>`;
  }).join('');
}

async function loadDetail(movie) {
  const imdb = movie.imdbID || '';
  document.getElementById('dBadges').innerHTML = '';
  document.getElementById('dTitle').textContent = movie.Title || 'Loading…';
  document.getElementById('dMeta').innerHTML    = '';
  document.getElementById('dPlot').textContent  = '';
  document.getElementById('dActions').innerHTML = '';
  document.getElementById('dPoster').src        = ph(movie.Title || '', 0);

  const sk = (h) => `<div class="skel" style="height:${h}px;border-radius:12px"></div>`;
  document.getElementById('trailerContainer').innerHTML  = sk(300);
  document.getElementById('ytMovieContainer').innerHTML  = sk(300);
  document.getElementById('extServersGrid').innerHTML    = [sk(130),sk(130),sk(130)].join('');
  document.getElementById('watchGrid').innerHTML         = [sk(125),sk(125),sk(125)].join('');
  document.getElementById('infoGrid').innerHTML          = `<div class="icell">${sk(36)}</div><div class="icell">${sk(36)}</div><div class="icell">${sk(36)}</div>`;

  try {
    const needsFull = !movie.Plot || !movie.Director || movie.Plot === 'N/A';
    const [fullMovie, sources] = await Promise.all([
      needsFull && imdb ? fetchMovieByID(imdb) : Promise.resolve(movie),
      imdb               ? fetchWatchmode(imdb)  : Promise.resolve([]),
    ]);
    const m = fullMovie || movie;
    if (m.imdbID) _movieMap[m.imdbID] = m;
    document.title = `${m.Title || movie.Title} – Flux Movie`;

    const posterSrc = m.Poster && m.Poster !== 'N/A' ? m.Poster : ph(m.Title || '', 0);
    document.getElementById('dPoster').src     = posterSrc;
    document.getElementById('dPoster').onerror = function () { this.src = ph(m.Title || '', 0); };

    const isHindi = (m.Language || '').toLowerCase().includes('hindi');
    const inWL    = isInWishlist(m.imdbID);
    let bdg = `<span class="dbadge db-type">${m.Type === 'series' ? 'SERIES' : 'FILM'}</span>`;
    if (isHindi)                                bdg += `<span class="dbadge db-hindi">🇮🇳 Hindi</span>`;
    if (m.imdbRating && m.imdbRating !== 'N/A') bdg += `<span class="dbadge db-rate">★ ${m.imdbRating} IMDb</span>`;
    if (m.Rated && m.Rated !== 'N/A')           bdg += `<span class="dbadge db-pg">${m.Rated}</span>`;
    document.getElementById('dBadges').innerHTML  = bdg;
    document.getElementById('dTitle').textContent = m.Title || movie.Title || '';

    const chips = [];
    if (m.Year     && m.Year     !== 'N/A') chips.push(`<span class="d-chip">📅 <b>${m.Year}</b></span>`);
    if (m.Runtime  && m.Runtime  !== 'N/A') chips.push(`<span class="d-chip">⏱ <b>${m.Runtime}</b></span>`);
    if (m.Genre    && m.Genre    !== 'N/A') chips.push(`<span class="d-chip">🎭 <b>${m.Genre.split(',')[0].trim()}</b></span>`);
    if (m.Language && m.Language !== 'N/A') chips.push(`<span class="d-chip">🌐 <b>${m.Language.split(',')[0].trim()}</b></span>`);
    document.getElementById('dMeta').innerHTML = chips.join('');

    document.getElementById('dPlot').textContent = m.Plot && m.Plot !== 'N/A' ? m.Plot : 'No description available.';
    document.getElementById('dActions').innerHTML = `
      <button class="da-watch" onclick="switchTab('trailer')">🎬 Watch Trailer</button>
      <button class="da-ghost" onclick="switchTab('ytmovie')">📺 Watch Free</button>
      <button class="da-ghost" onclick="switchTab('external')">⚡ Stream</button>
      <button class="da-wl ${inWL ? 'in-wl' : ''}" id="detailWLBtn" data-imdb="${m.imdbID}"
        onclick="toggleWishlist(_movieMap['${m.imdbID}'])">
        ${inWL ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
      </button>`;

    await Promise.all([
      loadTrailer(m.Title || movie.Title, m.Year, m.TrailerKey),
      loadYTMovie(m.Title || movie.Title, m.Year),
      Promise.resolve(buildExtServers(imdb)),
      Promise.resolve(renderWatchGrid(sources)),
    ]);

    const fields = [
      ['Director',  m.Director],  ['Writer',    m.Writer],
      ['Starring',  m.Actors],    ['Genre',     m.Genre],
      ['Released',  m.Released],  ['Runtime',   m.Runtime],
      ['Country',   m.Country],   ['Language',  m.Language],
      ['Box Office',m.BoxOffice], ['Awards',    m.Awards],
      ['Metascore', m.Metascore && m.Metascore !== 'N/A' ? `${m.Metascore}/100` : null],
      ['IMDb ID',   m.imdbID],
    ].filter(([, v]) => v && v !== 'N/A');

    document.getElementById('infoGrid').innerHTML = fields.length
      ? fields.map(([l, v]) => `<div class="icell"><label>${l}</label><span>${v}</span></div>`).join('')
      : `<div class="icell" style="grid-column:1/-1"><span style="color:var(--muted)">No additional info available.</span></div>`;

  } catch (err) {
    console.error('Detail error:', err);
    showToast('⚠️ Could not load movie data.', 'error');
  }
}

/* 12.  TRENDING PAGE */

const TRENDING_POOL = [
    'Pushpa 2: The Rule','Stree 2','Chhaava','Sky Force','Kalki 2898 AD',
  'Singham Returns','Devara','Fighter','Maidaan','Animal','Jawan','Pathaan',
  'Dunki','Gadar 2','OMG 2','12th Fail','Sam Bahadur','Tiger 3',
  'Rocky Aur Rani Kii Prem Kahaani','Bade Miyan Chote Miyan',
  'Crew','Baby John','Srikanth','Vedaa','Emergency','Deva',
  'Raayan','Thangalaan','Indian 2','Adipurush',

  'Dangal','3 Idiots','KGF Chapter 2','RRR','Andhadhun',
  'Bajrangi Bhaijaan','Uri: The Surgical Strike','Drishyam 2',
  'Tanhaji','Sooryavanshi','83','PK','Queen','Barfi','Kahaani',
  'Zindagi Na Milegi Dobara','Dil Chahta Hai','Rang De Basanti',
  'Taare Zameen Par',"Schindler's List",'Mughal-E-Azam','Sholay',
  'Lagaan','Gangs of Wasseypur','Tumbbad','Article 15','Masaan',

  'Deadpool & Wolverine','Inside Out 2','Dune: Part Two',
  'Alien: Romulus','Twisters','A Quiet Place: Day One',
  'Kingdom of the Planet of the Apes','Furiosa: A Mad Max Saga',
  'Godzilla x Kong: The New Empire','The Substance',
  'Wicked','Gladiator II','Moana 2','Civil War','Oppenheimer','Barbie',
  'Captain America: Brave New World','Thunderbolts','Sinners',
  'Mickey 17','A Minecraft Movie','The Accountant 2',
  'Final Destination Bloodlines','Novocaine','Wolf Man','Black Bag',

  'The Dark Knight','Interstellar','Inception','Parasite',
  'The Shawshank Redemption','The Godfather','Avengers: Endgame',
  'Top Gun: Maverick','John Wick','1917','The Matrix','Forrest Gump',
  'Pulp Fiction','Fight Club','Goodfellas','The Silence of the Lambs',
  'The Lord of the Rings: The Return of the King','Whiplash',
  'The Departed','No Country for Old Men','Blade Runner 2049',
  'Mad Max: Fury Road','Her','Arrival','The Prestige',
];

let trendingAll         = [];
let trendingFiltered    = [];
let trendingPage        = 1;
let _trendingPageMovies = [];
let _trendingLoaded     = false;

async function showTrending() {
  stopTrailerIfPlaying();
  setNavActive('navTrending');
  showPage('trendingPage');
  document.title = 'Trending — Flux Movie';
  if (!_trendingLoaded) await loadTrendingPage();
}

async function loadTrendingPage() {
  const grid = document.getElementById('trendingGrid');
  grid.innerHTML = skCards(PER_PAGE);

  const poolRes = [];
const pool = [...TRENDING_POOL];
  for (let i = 0; i < pool.length; i += 10) {
    const batch = await Promise.allSettled(pool.slice(i, i + 10).map(t => fetchMovie(t)));
    batch.forEach(r => { if (r.status === 'fulfilled' && r.value) { poolRes.push(r.value); _movieMap[r.value.imdbID] = r.value; } });
     await new Promise(r => setTimeout(r, 50));
  }
  const ytRes = await fetchMoviesFromYTThenOMDB([
    'official trailer 2025 hindi movie',
    'official trailer 2025 english movie',
    'official trailer 2026 movie',
  ], 20).catch(() => []);

  const seen = new Set();
  const all  = [];
  for (const m of [...poolRes, ...ytRes]) {
    if (!seen.has(m.imdbID)) { seen.add(m.imdbID); all.push(m); }
  }
  trendingAll = all.sort((a, b) => (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));
  trendingFiltered = [...trendingAll];
  trendingPage     = 1;
  _trendingLoaded  = true;
  renderTrendingPage();
}

function renderTrendingPage() {
  const grid  = document.getElementById('trendingGrid');
  const start = (trendingPage - 1) * PER_PAGE;
  const page  = trendingFiltered.slice(start, start + PER_PAGE);
  _trendingPageMovies = [...page];
  if (!page.length) { grid.innerHTML = `<div style="color:var(--muted);padding:3rem;grid-column:1/-1;text-align:center">No movies found.</div>`; document.getElementById('trendingPagination').innerHTML = ''; return; }
  grid.innerHTML = page.map((m, i) => {
    const rank = start + i + 1;
    let card = movieCard(m, i, false, false);
    const badge = `<div class="trend-rank">#${rank}</div>`;
    card = card.replace('<div class="c-type">', badge + '<div class="c-type">');
    return card;
  }).join('');
  grid.querySelectorAll('img[data-src]').forEach(lazyImg);
  renderTrendingPagination();
}

function renderTrendingPagination() {
  const total = Math.ceil(trendingFiltered.length / PER_PAGE);
  const pg    = document.getElementById('trendingPagination');
  if (total <= 1) { pg.innerHTML = ''; return; }
  let h = `<button class="pg-btn" onclick="goTrendingPage(${trendingPage-1})" ${trendingPage===1?'disabled':''}>‹</button>`;
  const s = Math.max(1, trendingPage-2), e = Math.min(total, trendingPage+2);
  for (let p = s; p <= e; p++) h += `<button class="pg-btn${p===trendingPage?' active':''}" onclick="goTrendingPage(${p})">${p}</button>`;
  h += `<button class="pg-btn" onclick="goTrendingPage(${trendingPage+1})" ${trendingPage===total?'disabled':''}>›</button>`;
  pg.innerHTML = h;
}

function goTrendingPage(p) {
  const total = Math.ceil(trendingFiltered.length / PER_PAGE);
  if (p < 1 || p > total) return;
  trendingPage = p;
  renderTrendingPage();
  document.getElementById('trendingGrid').scrollIntoView({ behavior: 'smooth' });
}

function trendingFilterGenre(btn, genre) {
  document.querySelectorAll('#trendingGenrePills .gpill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  trendingFiltered = genre
    ? trendingAll.filter(m => (m.Genre || '').toLowerCase().includes(genre.toLowerCase()))
    : [...trendingAll];
  trendingPage = 1;
  renderTrendingPage();
}

/* 13.  NEW RELEASES PAGE */

const NEW_RELEASES_POOL = [
  'Chhaava','Sky Force','Baby John','Emergency','Deva',
  'Pushpa 2: The Rule','Stree 2','Singham Returns','Devara',
  'Kalki 2898 AD','Fighter','Maidaan','Bade Miyan Chote Miyan',
  'Crew','Srikanth','Vedaa','Do Aur Do Pyaar',
  'Raayan','Thangalaan','Indian 2','Auron Mein Kahan Dum Tha',

  'Sam Bahadur','Tiger 3','Rocky Aur Rani Kii Prem Kahaani',
  'Dunki','Animal','OMG 2','Gadar 2','12th Fail',
  'Jawan','Pathaan','Adipurush','Tu Jhoothi Main Makkaar',
  'Kisi Ka Bhai Kisi Ki Jaan',

  'Captain America: Brave New World','Thunderbolts','Sinners',
  'Mickey 17','A Minecraft Movie','Novocaine','The Monkey',
  'Wolf Man','Companion','Black Bag','The Accountant 2',
  'Final Destination Bloodlines',

  'Deadpool & Wolverine','Inside Out 2','Dune: Part Two',
  'Alien: Romulus','Twisters','A Quiet Place: Day One',
  'Kingdom of the Planet of the Apes','Furiosa: A Mad Max Saga',
  'Godzilla x Kong: The New Empire','The Substance',
  'Wicked','Gladiator II','Moana 2','Civil War',
  'Poor Things','Saltburn','Killers of the Flower Moon',
  'Oppenheimer','Barbie','Wonka',

  'Napoleon','Aquaman and the Lost Kingdom','The Marvels',
  'Indiana Jones and the Dial of Destiny','Fast X',
  'Mission: Impossible - Dead Reckoning Part One',
  'Ant-Man and the Wasp: Quantumania',
  'Avatar: The Way of Water','Black Panther: Wakanda Forever',
  'Doctor Strange in the Multiverse of Madness',
  'The Batman','Top Gun: Maverick','Elvis',
  'Everything Everywhere All at Once',
  'Glass Onion: A Knives Out Mystery',
  // Extra trending
  'Interstellar','Inception','The Dark Knight','Oppenheimer',
  'Dune','Dune: Part Two','Spider-Man: No Way Home',
  'John Wick: Chapter 4','Mission: Impossible - Fallout',
  'Guardians of the Galaxy Vol. 3','Ant-Man and the Wasp: Quantumania',
  'Shershaah','Gangubai Kathiawadi','Bhool Bhulaiyaa 2',
  'Brahmastra','KGF Chapter 2','RRR','Vikram',
  'Pushpa: The Rise','Uri: The Surgical Strike',
  'War','Pathaan','Jawan','Animal','Dunki',
];

let newRelAll         = [];
let newRelFiltered    = [];
let newRelPage        = 1;
let _newRelPageMovies = [];
let _newRelLoaded     = false;

async function showNewReleases() {
  stopTrailerIfPlaying();
  setNavActive('navNewReleases');
  showPage('newReleasesPage');
  document.title = 'New Releases — Flux Movie';
  if (!_newRelLoaded) await loadNewRelPage();
}

async function loadNewRelPage() {
  const grid = document.getElementById('newRelGrid');
  grid.innerHTML = skCards(PER_PAGE);

  const poolRes = [];
const pool = [...TRENDING_POOL].sort(() => Math.random() - .5);  for (let i = 0; i < pool.length; i += 10) {
    const batch = await Promise.allSettled(pool.slice(i, i + 8).map(t => fetchMovie(t)));
    batch.forEach(r => { if (r.status === 'fulfilled' && r.value) { poolRes.push(r.value); _movieMap[r.value.imdbID] = r.value; } });
     await new Promise(r => setTimeout(r, 50));
  }

  const ytRes = await fetchMoviesFromYTThenOMDB([
    'new hindi movie official trailer 2025',
    'new hindi movie official trailer 2026',
    'new english movie official trailer 2025',
    'new english movie official trailer 2026',
    'bollywood official trailer 2025',
    'hollywood official trailer 2026',
  ], 50).catch(() => []);

  const seen = new Set();
  const all  = [];
  for (const m of [...ytRes, ...poolRes]) {
    if (!seen.has(m.imdbID)) { seen.add(m.imdbID); all.push(m); }
  }

  newRelAll = all.sort((a, b) => {
    const ya = parseInt(a.Year) || 0, yb = parseInt(b.Year) || 0;
    if (yb !== ya) return yb - ya;
    return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
  });

  newRelFiltered = [...newRelAll];
  newRelPage     = 1;
  _newRelLoaded  = true;
  renderNewRelPage();
}

function renderNewRelPage() {
  const grid  = document.getElementById('newRelGrid');
  const start = (newRelPage - 1) * PER_PAGE;
  const page  = newRelFiltered.slice(start, start + PER_PAGE);
  _newRelPageMovies = [...page];
  if (!page.length) { grid.innerHTML = `<div style="color:var(--muted);padding:3rem;grid-column:1/-1;text-align:center">No movies found.</div>`; document.getElementById('newRelPagination').innerHTML = ''; return; }

  grid.innerHTML = page.map((m, i) => {
    const yr    = parseInt(m.Year) || 0;
    let card    = movieCard(m, i, false, false);
    const badge = yr >= 2025 ? `<div class="nr-badge">🆕 ${yr}</div>` : '';
    if (badge) card = card.replace('<div class="c-type">', badge + '<div class="c-type">');
    return card;
  }).join('');
  grid.querySelectorAll('img[data-src]').forEach(lazyImg);
  renderNewRelPagination();
}

function renderNewRelPagination() {
  const total = Math.ceil(newRelFiltered.length / PER_PAGE);
  const pg    = document.getElementById('newRelPagination');
  if (total <= 1) { pg.innerHTML = ''; return; }
  let h = `<button class="pg-btn" onclick="goNewRelPage(${newRelPage-1})" ${newRelPage===1?'disabled':''}>‹</button>`;
  const s = Math.max(1, newRelPage-2), e = Math.min(total, newRelPage+2);
  for (let p = s; p <= e; p++) h += `<button class="pg-btn${p===newRelPage?' active':''}" onclick="goNewRelPage(${p})">${p}</button>`;
  h += `<button class="pg-btn" onclick="goNewRelPage(${newRelPage+1})" ${newRelPage===total?'disabled':''}>›</button>`;
  pg.innerHTML = h;
}

function goNewRelPage(p) {
  const total = Math.ceil(newRelFiltered.length / PER_PAGE);
  if (p < 1 || p > total) return;
  newRelPage = p;
  renderNewRelPage();
  document.getElementById('newRelGrid').scrollIntoView({ behavior: 'smooth' });
}

function newRelFilterGenre(btn, genre) {
  document.querySelectorAll('#newRelGenrePills .gpill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  newRelFiltered = genre
    ? newRelAll.filter(m => (m.Genre || '').toLowerCase().includes(genre.toLowerCase()))
    : [...newRelAll];
  newRelPage = 1;
  renderNewRelPage();
}

/* 14.  TOP RATED PAGE */

const TOP_RATED_POOL = [
  'Dangal','3 Idiots','Dil Chahta Hai','Taare Zameen Par','Mughal-E-Azam',
  'Sholay','Andhadhun','Drishyam','12th Fail','Gangs of Wasseypur',
  'A Wednesday','Masaan','Court','Lunchbox','Piku',
  'Kapoor & Sons','Tumbbad','Andaz Apna Apna','Rang De Basanti',
  'Lagaan','Black','Swades','Dev.D','Queen','Kahaani',
  'Bajrangi Bhaijaan','Uri: The Surgical Strike','Talaash',

  'The Shawshank Redemption','The Godfather','The Dark Knight',
  "Schindler's List",'12 Angry Men','Pulp Fiction',
  'The Lord of the Rings: The Return of the King',
  'Forrest Gump','Inception','Fight Club','Goodfellas',
  'Interstellar','The Matrix','Parasite','Oppenheimer',
  'Whiplash','The Silence of the Lambs','Spirited Away',
  'The Prestige','Gladiator','The Departed','Arrival',
  'No Country for Old Men','Blade Runner 2049','1917',
  'Mad Max: Fury Road','Her','Eternal Sunshine of the Spotless Mind',
  'The Grand Budapest Hotel','Oldboy','City of God',
];

let topRatedAll         = [];
let topRatedFiltered    = [];
let topRatedPage        = 1;
let _topRatedPageMovies = [];
let _topRatedLoaded     = false;

async function showTopRated() {
  stopTrailerIfPlaying();
  setNavActive('');
  showPage('topRatedPage');
  document.title = 'Top Rated — Flux Movie';
  if (!_topRatedLoaded) await loadTopRatedPage();
}

async function loadTopRatedPage() {
  const grid = document.getElementById('topRatedGrid');
  grid.innerHTML = skCards(PER_PAGE);
  const pool    = [...TOP_RATED_POOL]; // fetch all, cache will handle repeats
  const results = [];
  for (let i = 0; i < pool.length; i += 8) {
    const batch = await Promise.allSettled(pool.slice(i, i + 8).map(t => fetchMovie(t)));
    batch.forEach(r => { if (r.status === 'fulfilled' && r.value) { results.push(r.value); _movieMap[r.value.imdbID] = r.value; } });
     await new Promise(r => setTimeout(r, 50));
  }
  topRatedAll = results.sort((a, b) => (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));
  topRatedFiltered = [...topRatedAll];
  topRatedPage     = 1;
  _topRatedLoaded  = true;
  renderTopRatedPage();
}

function renderTopRatedPage() {
  const grid  = document.getElementById('topRatedGrid');
  const start = (topRatedPage - 1) * PER_PAGE;
  const page  = topRatedFiltered.slice(start, start + PER_PAGE);
  _topRatedPageMovies = [...page];
  if (!page.length) { grid.innerHTML = `<div style="color:var(--muted);padding:3rem;grid-column:1/-1;text-align:center">No movies found.</div>`; document.getElementById('topRatedPagination').innerHTML = ''; return; }
  grid.innerHTML = page.map((m, i) => {
    const rank  = start + i + 1;
    let card    = movieCard(m, i, false, false);
    const badge = `<div class="trend-rank">#${rank}</div>`;
    card = card.replace('<div class="c-type">', badge + '<div class="c-type">');
    return card;
  }).join('');
  grid.querySelectorAll('img[data-src]').forEach(lazyImg);
  const total = Math.ceil(topRatedFiltered.length / PER_PAGE);
  const pg    = document.getElementById('topRatedPagination');
  if (total <= 1) { pg.innerHTML = ''; return; }
  let h = `<button class="pg-btn" onclick="goTopRatedPage(${topRatedPage-1})" ${topRatedPage===1?'disabled':''}>‹</button>`;
  const s = Math.max(1, topRatedPage-2), e = Math.min(total, topRatedPage+2);
  for (let p = s; p <= e; p++) h += `<button class="pg-btn${p===topRatedPage?' active':''}" onclick="goTopRatedPage(${p})">${p}</button>`;
  h += `<button class="pg-btn" onclick="goTopRatedPage(${topRatedPage+1})" ${topRatedPage===total?'disabled':''}>›</button>`;
  pg.innerHTML = h;
}

function goTopRatedPage(p) {
  const total = Math.ceil(topRatedFiltered.length / PER_PAGE);
  if (p < 1 || p > total) return;
  topRatedPage = p;
  renderTopRatedPage();
  document.getElementById('topRatedGrid').scrollIntoView({ behavior: 'smooth' });
}

function topRatedFilterGenre(btn, genre) {
  document.querySelectorAll('#topRatedGenrePills .gpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  topRatedFiltered = genre
    ? topRatedAll.filter(m => (m.Genre || '').toLowerCase().includes(genre.toLowerCase()))
    : [...topRatedAll];
  topRatedPage = 1;
  renderTopRatedPage();
}

/* 15.  STATIC PAGES — About, Privacy, Contact */

function showAbout()   { stopTrailerIfPlaying(); setNavActive(''); showPage('aboutPage');   document.title = 'About — Flux Movie'; }
function showPrivacy() { stopTrailerIfPlaying(); setNavActive(''); showPage('privacyPage'); document.title = 'Privacy — Flux Movie'; }
function showContact() { stopTrailerIfPlaying(); setNavActive(''); showPage('contactPage'); document.title = 'Contact — Flux Movie'; }

/* 16.  MOBILE HAMBURGER MENU */

function toggleMenu() {
  const menu = document.getElementById('navLinks');
  const btn  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

function toggleAvatarDrop() {
  document.getElementById('navAvatar').classList.toggle('drop-open');
}
function closeMenu() {
  const menu = document.getElementById('navLinks');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}

document.addEventListener('click', function(e) {
  // close hamburger menu
  const menu = document.getElementById('navLinks');
  const btn  = document.getElementById('hamburger');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  // close avatar dropdown
  const av = document.getElementById('navAvatar');
  if (av && !av.contains(e.target)) av.classList.remove('drop-open');
});

/* 17.  INIT — runs on page load */

(async () => {
  await loadSession();
  renderAuthUI();
  setNavActive('navHome');
  document.getElementById('homePage').classList.add('active');
  loadHindiMovies();
  loadMovies();
})();