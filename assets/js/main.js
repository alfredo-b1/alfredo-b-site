/* =========================================================================
   ALFREDO B — main.js
   Gère : thème clair/sombre, navigation mobile, bras de lecture (scroll),
   animations au scroll, rendu des données (blog/vidéos/musique/galerie),
   recherche, filtres, formulaires (newsletter/contact), commentaires démo.
   ========================================================================= */

/* ---------- Thème clair / sombre ---------- */
(function initTheme(){
  const saved = localStorage.getItem('ab-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ab-theme', next);
}

/* ---------- Navigation mobile ---------- */
function initNav(){
  const burger = document.querySelector('.burger');
  const links = document.querySelector('nav.links');
  if(!burger || !links) return;
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ---------- Bras de lecture (indicateur de scroll, signature du site) ---------- */
function initTonearm(){
  const head = document.querySelector('.tonearm-rail .head');
  const track = document.querySelector('.tonearm-rail .track');
  if(!head || !track) return;
  const update = () => {
    const trackRect = track.getBoundingClientRect();
    const doc = document.documentElement;
    const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight || 1);
    const usable = trackRect.height;
    head.style.top = (trackRect.top + scrolled * usable) + 'px';
  };
  update();
  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
}

/* ---------- Révélation au scroll ---------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.12 });
  items.forEach(i => io.observe(i));
}

/* ---------- Utilitaires ---------- */
const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

async function loadJSON(path){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('fetch failed');
    return await res.json();
  }catch(e){
    console.warn('Impossible de charger', path, '— vérifiez que le site tourne sur un serveur http (pas en fichier local).', e);
    return [];
  }
}

/* ---------- Rendu : Blog (accueil + page blog) ---------- */
function postCard(p){
  return `
  <article class="card reveal">
    <div class="thumb"><span>${p.category}</span></div>
    <div class="meta"><span class="tag cat-no">${p.number}</span><span>${fmtDate(p.date)}</span><span>${p.readTime} de lecture</span></div>
    <h3>${p.title}</h3>
    <p class="excerpt">${p.excerpt}</p>
    <a class="card-link" href="article.html?id=${p.id}">Lire l'article →</a>
  </article>`;
}

async function renderBlogPreview(limit=3){
  const el = document.getElementById('blog-preview');
  if(!el) return;
  const posts = await loadJSON('assets/data/posts.json');
  el.innerHTML = posts.slice(0, limit).map(postCard).join('');
  initReveal();
}

async function renderBlogPage(){
  const grid = document.getElementById('blog-grid');
  if(!grid) return;
  const posts = await loadJSON('assets/data/posts.json');
  const search = document.getElementById('blog-search');
  const filters = document.getElementById('blog-filters');
  const categories = ['Tous', ...new Set(posts.map(p => p.category))];

  if(filters){
    filters.innerHTML = categories.map((c,i) => `<button data-cat="${c}" class="${i===0?'active':''}">${c}</button>`).join('');
  }

  let activeCat = 'Tous';
  let query = '';

  function draw(){
    const filtered = posts.filter(p => {
      const matchCat = activeCat === 'Tous' || p.category === activeCat;
      const matchQuery = (p.title + p.excerpt).toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
    grid.innerHTML = filtered.length ? filtered.map(postCard).join('') : '<p class="muted">Aucun article ne correspond à votre recherche.</p>';
    initReveal();
  }

  filters?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    draw();
  });

  search?.addEventListener('input', (e) => { query = e.target.value; draw(); });

  draw();
}

async function renderArticle(){
  const el = document.getElementById('article-content');
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const posts = await loadJSON('assets/data/posts.json');
  const post = posts.find(p => p.id === id) || posts[0];
  if(!post){ el.innerHTML = '<p>Article introuvable.</p>'; return; }

  document.title = `${post.title} — Alfredo B`;
  el.innerHTML = `
    <div class="eyebrow">${post.category} · ${post.number}</div>
    <h1>${post.title}</h1>
    <div class="meta muted" style="margin-bottom:2rem;font-family:'IBM Plex Mono',monospace;font-size:.78rem;">
      ${fmtDate(post.date)} · ${post.readTime} de lecture
    </div>
    <div class="article-body">${post.content}</div>
  `;

  const shareUrl = encodeURIComponent(location.href);
  const shareTitle = encodeURIComponent(post.title);
  const share = document.getElementById('share-row');
  if(share){
    share.innerHTML = `
      <span>Partager</span>
      <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}" target="_blank" rel="noopener" aria-label="Partager sur X">X</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" aria-label="Partager sur Facebook">F</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener" aria-label="Partager sur LinkedIn">L</a>
      <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener" aria-label="Partager sur WhatsApp">W</a>
    `;
  }
}

/* ---------- Rendu : Vidéos ---------- */
function videoCard(v){
  return `
  <article class="card reveal">
    <div class="thumb">
      <div class="play-icon">▶</div>
    </div>
    <div class="meta"><span class="tag cat-no">${v.number}</span><span>${v.category}</span><span>${v.duration}</span></div>
    <h3>${v.title}</h3>
    <p class="excerpt">${v.excerpt}</p>
    <span class="card-link">${fmtDate(v.date)}</span>
  </article>`;
}

async function renderVideosPreview(limit=3){
  const el = document.getElementById('videos-preview');
  if(!el) return;
  const videos = await loadJSON('assets/data/videos.json');
  el.innerHTML = videos.slice(0, limit).map(videoCard).join('');
  initReveal();
}

async function renderVideosPage(){
  const grid = document.getElementById('videos-grid');
  if(!grid) return;
  const videos = await loadJSON('assets/data/videos.json');
  grid.innerHTML = videos.map(videoCard).join('');
  initReveal();
}

/* ---------- Rendu : Musique ---------- */
function trackRow(t){
  return `
  <div class="player reveal">
    <div class="pnum">${t.number}</div>
    <div class="pinfo">
      <h4>${t.title}</h4>
      <span>${t.project} · ${t.year}</span>
    </div>
    ${t.src ? `<audio controls preload="none" src="${t.src}"></audio>` : `<span class="muted" style="font-family:'IBM Plex Mono',monospace;font-size:.72rem;">fichier à venir</span>`}
  </div>`;
}

async function renderTracks(){
  const el = document.getElementById('tracks-list');
  if(!el) return;
  const tracks = await loadJSON('assets/data/tracks.json');
  el.innerHTML = tracks.map(trackRow).join('');
  initReveal();
}

/* ---------- Rendu : Galerie ---------- */
async function renderGallery(){
  const el = document.getElementById('gallery-grid');
  if(!el) return;
  const items = await loadJSON('assets/data/gallery.json');
  el.innerHTML = items.map(g => `
    <figure>
      ${g.src ? `<img src="${g.src}" alt="${g.caption}" loading="lazy">` : `<div class="placeholder" style="width:100%;height:100%;">Photo à ajouter</div>`}
      <figcaption>${g.caption}</figcaption>
    </figure>`).join('');
}

/* ---------- Formulaires (démo front-end — à relier à un service d'envoi) ---------- */
function initForms(){
  const nl = document.getElementById('newsletter-form');
  nl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('newsletter-msg');
    if(msg) msg.textContent = 'Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.';
    nl.reset();
  });

  const contact = document.getElementById('contact-form');
  contact?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('contact-msg');
    if(msg) msg.textContent = 'Message envoyé — réponse sous 2 à 3 jours ouvrés.';
    contact.reset();
  });

  const comment = document.getElementById('comment-form');
  comment?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('comment-name').value || 'Anonyme';
    const text = document.getElementById('comment-text').value;
    if(!text) return;
    const list = document.getElementById('comments-list');
    const row = document.createElement('div');
    row.className = 'comment';
    row.innerHTML = `<div class="who">${name} <span>à l'instant</span></div><p>${text}</p>`;
    list.prepend(row);
    comment.reset();
  });
}

/* ---------- Init global ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTonearm();
  initReveal();
  initForms();
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  renderBlogPreview();
  renderBlogPage();
  renderArticle();
  renderVideosPreview();
  renderVideosPage();
  renderTracks();
  renderGallery();
});
