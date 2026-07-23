/* HE2DIHÉLIA, SARL — main.js
   Lê o conteúdo de /content/companies.json e /content/news.json
   e constrói a página. Para editar textos, imagens, vídeos e notícias,
   basta editar esses dois ficheiros (ou usar o painel em /admin). */

async function loadJSON(path){
  const res = await fetch(path + '?v=' + Date.now());
  if(!res.ok) throw new Error('Falha ao carregar ' + path);
  return res.json();
}

function el(tag, attrs = {}, ...children){
  const node = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === 'html'){ node.innerHTML = v; }
    else if(k.startsWith('on') && typeof v === 'function'){ node.addEventListener(k.slice(2), v); }
    else if(v !== undefined && v !== null && v !== false){ node.setAttribute(k, v); }
  }
  children.flat().forEach(c => {
    if(c === null || c === undefined || c === '') return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function formatDate(iso){
  try{
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('pt-PT', { day:'2-digit', month:'short', year:'numeric' });
  }catch(e){ return iso; }
}

function galleryItem(item, openLightbox){
  const wrap = el('div', { class:'gallery-item', onclick: () => openLightbox(item) });
  if(item.src){
    if(item.tipo === 'video'){
      wrap.appendChild(el('video', { src:item.src, muted:'true', playsinline:'true' }));
      wrap.appendChild(el('span', { class:'play-badge' }, 'VÍDEO'));
    } else {
      wrap.appendChild(el('img', { src:item.src, alt:item.legenda || '', loading:'lazy' }));
    }
  } else {
    wrap.appendChild(el('div', { class:'placeholder' },
      el('span', {}, item.tipo === 'video' ? '🎬' : '🖼️'),
      el('span', {}, item.legenda || 'Por adicionar')
    ));
  }
  return wrap;
}

function buildLightbox(){
  const box = el('div', { class:'lightbox' },
    el('button', { class:'lightbox-close', 'aria-label':'Fechar' }, '×'),
    el('div', { class:'lightbox-inner' })
  );
  document.body.appendChild(box);
  const inner = box.querySelector('.lightbox-inner');
  const close = () => box.classList.remove('open');
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.addEventListener('click', (e) => { if(e.target === box) close(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
  return {
    open(item){
      inner.innerHTML = '';
      if(item.src){
        inner.appendChild(item.tipo === 'video'
          ? el('video', { src:item.src, controls:'true', autoplay:'true' })
          : el('img', { src:item.src, alt:item.legenda || '' }));
      }
      inner.appendChild(el('p', { class:'lightbox-caption' }, item.legenda || ''));
      box.classList.add('open');
    }
  };
}

function renderNav(companies){
  const links = document.getElementById('navLinks');
  companies.forEach(c => {
    links.appendChild(el('li', {}, el('a', { href: '#' + c.id }, c.nome)));
  });
}

function renderHeroStrip(companies){
  const strip = document.getElementById('heroStrip');
  companies.forEach(c => {
    strip.appendChild(el('div', { class:'mini' },
      el('img', { src:c.logo, alt:c.nome }),
      el('span', {}, c.nome)
    ));
  });
}

function socialLinks(redes, accentColor){
  if(!redes) return null;
  const items = [
    { key:'instagram', label:'Instagram' },
    { key:'facebook', label:'Facebook' },
    { key:'tiktok', label:'TikTok' }
  ].filter(i => redes[i.key]);
  if(items.length === 0) return null;
  return el('div', { class:'social-links' },
    ...items.map(i => el('a', {
      class:'social-link', href:redes[i.key], target:'_blank', rel:'noopener',
      style: accentColor ? `border-color:${accentColor}; color:${accentColor}` : ''
    }, i.label))
  );
}

function companyContactBlock(c){
  const ct = c.contacto || {};
  const social = socialLinks(c.redes_sociais, c.cor_primaria);
  if(!ct.morada && !ct.telefone && !ct.email && !social) return null;
  const lines = [];
  if(ct.morada) lines.push(el('span', {}, ct.morada));
  if(ct.telefone) lines.push(el('span', {}, 'Tel/WhatsApp: ', el('strong', {}, ct.telefone)));
  if(ct.email) lines.push(el('span', {}, 'E-mail: ', el('strong', {}, ct.email)));
  return el('div', { class:'company-contact' },
    ...lines.map(l => el('p', { style:'margin:0 0 4px; font-size:.92rem; color:var(--ink-soft)' }, l)),
    social
  );
}

function renderCompanies(companies, openLightbox){
  const root = document.getElementById('companiesRoot');
  companies.forEach(c => {
    const section = el('section', { class:'company reveal', id:c.id, style:`--company-accent:${c.cor_primaria}` },
      el('div', { class:'container' },
        el('div', { class:'company-top' },
          el('img', { class:'company-logo', src:c.logo, alt:c.nome }),
          el('div', {},
            el('span', { class:'company-sector' }, c.setor),
            el('h2', { class:'company-name' }, c.nome)
          )
        ),
        el('div', { class:'company-grid' },
          el('div', {},
            el('p', { class:'company-slogan' }, c.slogan),
            el('p', { class:'company-desc' }, c.descricao),
            el('ul', { class:'service-list' },
              ...(c.servicos || []).map(s => el('li', {}, el('span', { class:'service-dot' }), s))
            ),
            companyContactBlock(c),
            el('a', { class:'btn btn-outline', href:'#contacto', style:`color:${c.cor_primaria}; border-color:${c.cor_primaria}` }, 'Pedir orçamento')
          ),
          el('div', {},
            el('div', { class:'gallery' }, ...(c.galeria || []).map(g => galleryItem(g, openLightbox)))
          )
        )
      )
    );
    root.appendChild(section);
  });
}

function renderNews(news, companiesById){
  const grid = document.getElementById('newsGrid');
  news
    .slice()
    .sort((a,b) => new Date(b.data) - new Date(a.data))
    .forEach(n => {
      const empresa = companiesById[n.empresa];
      grid.appendChild(el('article', { class:'news-card reveal' },
        el('span', { class:'news-date' }, formatDate(n.data)),
        el('h3', {}, n.titulo),
        el('p', {}, n.resumo),
        el('span', { class:'news-tag' }, empresa ? empresa.nome : 'Grupo HE2DIHÉLIA')
      ));
    });
}

function setupRevealObserver(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  items.forEach(i => io.observe(i));
}

function setupNav(){
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  });
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.addEventListener('click', (e) => { if(e.target.tagName === 'A') links.classList.remove('open'); });
}

async function init(){
  setupNav();
  const lightbox = buildLightbox();
  try{
    const [content, news] = await Promise.all([
      loadJSON('content/companies.json'),
      loadJSON('content/news.json')
    ]);

    document.getElementById('heroLead').textContent = content.grupo.descricao;
    document.getElementById('groupDesc').textContent = content.grupo.descricao;
    document.getElementById('groupNif').textContent = 'NIF ' + content.grupo.nif + ' · ' + content.grupo.pais;

    const gc = content.grupo.contacto || {};
    document.getElementById('groupAddress').textContent = gc.morada || '';
    document.getElementById('groupPhone').textContent = gc.telefone || '';
    document.getElementById('groupEmail').textContent = gc.email || '';
    const emailBtn = document.getElementById('groupEmailBtn');
    if(gc.email){ emailBtn.href = 'mailto:' + gc.email; } else { emailBtn.style.display = 'none'; }
    const groupSocial = socialLinks(content.grupo.redes_sociais, null);
    if(groupSocial) document.getElementById('groupSocial').appendChild(groupSocial);

    renderNav(content.empresas);
    renderHeroStrip(content.empresas);
    renderCompanies(content.empresas, lightbox.open);

    const byId = Object.fromEntries(content.empresas.map(c => [c.id, c]));
    renderNews(news.noticias || [], byId);

    setupRevealObserver();
  }catch(err){
    console.error(err);
    document.getElementById('companiesRoot').innerHTML =
      '<p style="padding:40px;text-align:center;color:#a33">Não foi possível carregar o conteúdo. Se estiver a abrir o ficheiro diretamente (file://), use um servidor local ou publique o site — o navegador bloqueia a leitura de JSON local por segurança.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);
