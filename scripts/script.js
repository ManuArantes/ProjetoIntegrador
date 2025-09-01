/***********************
 * Helpers de Storage
 ***********************/
const DB_KEYS = {
  USERS: "clmc_users",
  CURRENT: "clmc_current_user",
  ARTICLES: "clmc_articles",
  FORUM: "clmc_forum_threads",
  RELATOS: "clmc_user_relatos"
};

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

/***********************
 * Sessão / Usuário
 ***********************/
function getCurrentUser() { return load(DB_KEYS.CURRENT, null); }
function setCurrentUser(user) { save(DB_KEYS.CURRENT, user); }
function getUsers() { return load(DB_KEYS.USERS, []); }
function setUsers(arr) { save(DB_KEYS.USERS, arr); }

function upsertUser(user) {
  const users = getUsers();
  const idx = users.findIndex(u => u.cpf === user.cpf);
  if (idx >= 0) users[idx] = user; else users.push(user);
  setUsers(users);
  setCurrentUser(user);
}

/***********************
 * Cadastro (pages/cadastro.html)
 ***********************/
function mostrarRegistro(mostrar) {
  const el = document.getElementById("registroProfissional");
  if (el) el.style.display = mostrar ? "block" : "none";
}

function validarCadastro(ev) {
  ev.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const tipo = document.querySelector('input[name="tipo"]:checked');
  const msg = document.getElementById("mensagemCadastro");
  const registro = document.getElementById("registro")?.value.trim() || "";

  if (!nome || !cpf || !cidade || !nascimento || !tipo) {
    msg.textContent = "Preencha todos os campos obrigatórios!";
    msg.style.color = "red";
    return false;
  }
  if (tipo.value === "profissional" && !registro) {
    msg.textContent = "Informe seu número de registro profissional.";
    msg.style.color = "red";
    return false;
  }

  const user = {
    nome, cpf, cidade, nascimento,
    tipo: tipo.value, registro: tipo.value === "profissional" ? registro : ""
  };
  upsertUser(user);
  msg.textContent = "Seja bem-vinda(o) à nossa plataforma!";
  msg.style.color = "#4a148c";
  return true;
}

/***********************
 * Minha História (index)
 ***********************/
function mostrarHistoria() {
  const btn = document.querySelector('section.bloco button[onclick="mostrarHistoria()"]');
  let conteudo = document.getElementById("conteudoHistoria");
  if (!btn) return;

  if (!conteudo) {
    const section = btn.parentElement;
    conteudo = document.createElement("div");
    conteudo.id = "conteudoHistoria";
    conteudo.style.marginTop = "15px";
    conteudo.innerHTML = `
      <p style="color:#4a148c; font-weight:bold;">
        Olá, meu nome é Emanuelly Arantes de Oliveira, tenho 17 anos e sou portadora de Miastenia Congênita
      </p>
      <img src="images/minha-foto.jpeg" alt="Foto de Emanuelly Arantes de Oliveira" class="foto-historia" width="250" />
    `;
    section.appendChild(conteudo);
    btn.textContent = "Esconder Minha História";
  } else {
    const show = conteudo.style.display !== "block";
    conteudo.style.display = show ? "block" : "none";
    btn.textContent = show ? "Esconder Minha História" : "Mostrar Minha História";
  }
}

/***********************
 * Artigos Médicos
 ***********************/
function getArticles() {
  const seed = [
    {
      id: "seed1",
      titulo: "Síndromes Miastênicas Congênitas: visão geral (Orphanet)",
      url: "https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=PT&Expert=590",
      origem: "Orphanet",
      autor: "Equipe Orphanet",
      revisado: true
    },
    {
      id: "seed2",
      titulo: "Congenital Myasthenic Syndromes (GARD - NIH)",
      url: "https://rarediseases.info.nih.gov/diseases/6431/congenital-myasthenic-syndromes",
      origem: "NIH GARD",
      autor: "NIH",
      revisado: true
    },
    {
      id: "seed3",
      titulo: "GeneReviews®: Congenital Myasthenic Syndromes Overview",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK1168/",
      origem: "NCBI GeneReviews",
      autor: "Engel & Sine",
      revisado: true
    },
    {
      id: "seed4",
      titulo: "Miastenia congênita: abordagem clínica",
      url: "https://www.scielo.br/j/anp/a/4TQzZ8rQ6J9ZkM6rH9wKv3H/",
      origem: "SciELO",
      autor: "Revista ANP",
      revisado: true
    }
  ];
  const local = load(DB_KEYS.ARTICLES, []);
  // evita duplicar seeds se já salvei alguma vez
  if (!local.some(a => a.id === "seed1")) {
    const merged = [...seed, ...local];
    save(DB_KEYS.ARTICLES, merged);
    return merged;
  }
  return local;
}
function setArticles(arr) { save(DB_KEYS.ARTICLES, arr); }

function renderArticles() {
  const wrap = document.getElementById("lista-artigos");
  if (!wrap) return;
  const artigos = getArticles();
  wrap.innerHTML = "";
  artigos.forEach(a => {
    const div = document.createElement("div");
    div.className = "artigo-item";
    div.innerHTML = `
      <a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.titulo}</a>
      <div class="artigo-meta">
        Fonte: ${a.origem || "—"} · Autor(es): ${a.autor || "—"} ${a.revisado ? "· ✔ verificado" : ""}
      </div>
    `;
    wrap.appendChild(div);
  });
}

function setupArticleSearch() {
  const input = document.getElementById("inputBusca");
  const lista = document.getElementById("lista-artigos");
  if (!input || !lista) return;

  input.addEventListener("input", () => {
    const filtro = input.value.toLowerCase();
    [...lista.children].forEach(el => {
      const txt = el.textContent.toLowerCase();
      el.style.display = txt.includes(filtro) ? "block" : "none";
    });
  });
}

function toggleFormArtigo() {
  const form = document.getElementById("formArtigoWrap");
  if (form) form.style.display = form.style.display === "none" ? "block" : "none";
}

function publicarArtigo(ev) {
  ev.preventDefault();
  const user = getCurrentUser();
  if (!user) { alert("Faça login/cadastro para publicar."); return; }
  if (user.tipo !== "profissional") {
    alert("Somente profissionais da saúde podem publicar em Artigos Médicos.");
    return;
  }
  const titulo = document.getElementById("art_titulo").value.trim();
  const url = document.getElementById("art_url").value.trim();
  const origem = document.getElementById("art_origem").value.trim();
  const autor = document.getElementById("art_autor").value.trim();

  if (!titulo || !url) { alert("Preencha pelo menos Título e URL."); return; }

  const artigos = getArticles();
  artigos.unshift({
    id: "usr_" + Date.now(),
    titulo, url, origem, autor,
    revisado: false,
    criadoPor: user.nome
  });
  setArticles(artigos);
  renderArticles();
  document.getElementById("formArtigo").reset();
  alert("Artigo enviado!");
}

/***********************
 * Acolhimento (Fórum + Relatos)
 ***********************/
function getForum() { return load(DB_KEYS.FORUM, []); }
function setForum(arr) { save(DB_KEYS.FORUM, arr); }
function getRelatos() { return load(DB_KEYS.RELATOS, []); }
function setRelatos(arr) { save(DB_KEYS.RELATOS, arr); }

function switchTab(tab) {
  const b1 = document.getElementById("tabForum");
  const b2 = document.getElementById("tabRelatos");
  const s1 = document.getElementById("secForum");
  const s2 = document.getElementById("secRelatos");
  if (!b1 || !b2) return;
  if (tab === "forum") {
    b1.classList.add("active"); b2.classList.remove("active");
    s1.style.display = "block"; s2.style.display = "none";
  } else {
    b2.classList.add("active"); b1.classList.remove("active");
    s2.style.display = "block"; s1.style.display = "none";
  }
}

/* Fórum: mensagem com respostas e curtidas */
function publicarMensagem(ev) {
  ev.preventDefault();
  const user = getCurrentUser();
  const nome = user?.nome || "Usuário";
  const tipo = user?.tipo || "convidado";

  const texto = document.getElementById("forum_texto").value.trim();
  if (!texto) return;

  const threads = getForum();
  threads.unshift({
    id: "t_" + Date.now(),
    autor: nome,
    role: tipo,
    texto,
    likes: 0,
    criadoEm: new Date().toISOString(),
    respostas: []
  });
  setForum(threads);
  document.getElementById("formForum").reset();
  renderForum();
}

function responderMensagem(id, texto) {
  const user = getCurrentUser();
  const nome = user?.nome || "Usuário";
  const tipo = user?.tipo || "convidado";

  const threads = getForum();
  const t = threads.find(x => x.id === id);
  if (!t) return;
  t.respostas.push({
    id: "r_" + Date.now(),
    autor: nome,
    role: tipo,
    texto,
    criadoEm: new Date().toISOString(),
    likes: 0
  });
  setForum(threads);
  renderForum();
}

function likeMensagem(id, isReply=false, parentId=null) {
  const threads = getForum();
  if (!isReply) {
    const t = threads.find(x => x.id === id);
    if (t) t.likes++;
  } else {
    const t = threads.find(x => x.id === parentId);
    const r = t?.respostas.find(y => y.id === id);
    if (r) r.likes++;
  }
  setForum(threads);
  renderForum();
}

function renderForum() {
  const wrap = document.getElementById("listaForum");
  if (!wrap) return;
  const threads = getForum();
  wrap.innerHTML = "";

  threads.forEach(t => {
    const div = document.createElement("div");
    div.className = "mensagem";
    div.innerHTML = `
      <div class="msg-top">
        <span><strong>${t.autor}</strong> <span class="badge-role">${t.role}</span></span>
        <span>${new Date(t.criadoEm).toLocaleString()}</span>
      </div>
      <div class="msg-conteudo">${t.texto}</div>
      <div class="msg-acoes">
        <button onclick="likeMensagem('${t.id}')">Curtir (${t.likes})</button>
        <button onclick="document.getElementById('resp_${t.id}').style.display='block'">Responder</button>
      </div>
      <div class="respostas">
        ${t.respostas.map(r => `
          <div class="mensagem">
            <div class="msg-top">
              <span><strong>${r.autor}</strong> <span class="badge-role">${r.role}</span></span>
              <span>${new Date(r.criadoEm).toLocaleString()}</span>
            </div>
            <div class="msg-conteudo">${r.texto}</div>
            <div class="msg-acoes">
              <button onclick="likeMensagem('${r.id}', true, '${t.id}')">Curtir (${r.likes})</button>
            </div>
          </div>
        `).join("")}
      </div>
      <div id="resp_${t.id}" class="form-resposta" style="display:none; margin-top:6px;">
        <textarea id="resp_txt_${t.id}" placeholder="Escreva uma resposta..."></textarea>
        <button onclick="responderMensagem('${t.id}', document.getElementById('resp_txt_${t.id}').value)">Enviar resposta</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

/* Relatos: apenas publicar e curtir */
function publicarRelato(ev) {
  ev.preventDefault();
  const user = getCurrentUser();
  const nome = user?.nome || "Usuário";
  const texto = document.getElementById("relato_texto").value.trim();
  if (!texto) return;

  const relatos = getRelatos();
  relatos.unshift({
    id: "l_" + Date.now(),
    autor: nome,
    texto,
    criadoEm: new Date().toISOString(),
    likes: 0
  });
  setRelatos(relatos);
  document.getElementById("formRelato").reset();
  renderRelatos();
}

function likeRelato(id) {
  const relatos = getRelatos();
  const r = relatos.find(x => x.id === id);
  if (r) r.likes++;
  setRelatos(relatos);
  renderRelatos();
}

function renderRelatos() {
  const wrap = document.getElementById("listaRelatos");
  if (!wrap) return;
  const relatos = getRelatos();
  wrap.innerHTML = "";
  relatos.forEach(r => {
    const div = document.createElement("div");
    div.className = "relato";
    div.innerHTML = `
      <div class="msg-top">
        <span><strong>${r.autor}</strong></span>
        <span>${new Date(r.criadoEm).toLocaleString()}</span>
      </div>
      <div class="msg-conteudo">${r.texto}</div>
      <div class="msg-acoes">
        <button onclick="likeRelato('${r.id}')">Curtir (${r.likes})</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

/***********************
 * Inicializações por página
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  // Artigos
  if (document.getElementById("lista-artigos")) {
    renderArticles();
    setupArticleSearch();
    const btn = document.getElementById("btnNovoArtigo");
    if (btn) {
      btn.addEventListener("click", () => {
        const user = getCurrentUser();
        if (!user) return alert("Você precisa fazer cadastro/login.");
        if (user.tipo !== "profissional")
          return alert("Somente profissionais da saúde podem publicar nesta aba.");
        toggleFormArtigo();
      });
    }
    const f = document.getElementById("formArtigo");
    if (f) f.addEventListener("submit", publicarArtigo);
  }

  // Fórum/Relatos
  if (document.getElementById("tabForum")) {
    switchTab("forum");
    renderForum();
    renderRelatos();
    document.getElementById("tabForum").onclick = () => switchTab("forum");
    document.getElementById("tabRelatos").onclick = () => switchTab("relatos");
    document.getElementById("formForum")?.addEventListener("submit", publicarMensagem);
    document.getElementById("formRelato")?.addEventListener("submit", publicarRelato);
  }
});
