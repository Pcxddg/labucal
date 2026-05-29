/* ============================================================
   LABUCAL — interactivity (vanilla JS)
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PHONE = "(15) 99110-7117";
  const WA = "5515991107117";

  /* ---------- imagem real dentro do container .ph ---------- */
  const ASSETS = "/assets/labucal-images/";
  const ph = (file, dark, alt = "") =>
    `<div class="ph ${dark ? "dark" : ""}"><img src="${ASSETS}${file}" alt="${alt}" loading="lazy" /></div>`;

  /* =====================================================
     DATA
     ===================================================== */
  const SERVICES = [
    { s: "protese", img: "service-protese.jpg", t: "Prótese Dentária", d: "Parcial, total, fixa, coroas e facetas. Material escolhido caso a caso — zircônia, dissilicato ou cerâmica feldspática. Sai pronta para você entregar ao paciente." },
    { s: "implantes", img: "service-implantes.jpg", t: "Implantes Dentários", d: "Coroas, abutments e barras para o implante que você já colocou. Encaixe verificado antes de sair — sem ajuste surpresa de cadeira." },
    { s: "clareamento", img: "service-clareamento.jpg", t: "Clareamento Dental", d: "Placas e moldeiras sob medida para o clareamento caseiro do seu paciente. Você manda a moldagem, recebe a placa pronta para entregar." },
    { s: "alinhadores", img: "service-alinhadores.jpg", t: "Alinhadores Transparentes", d: "Você envia o escaneamento ou modelo, a gente confecciona a sequência de alinhadores e acompanha tecnicamente cada etapa do tratamento." },
  ];
  const SERVICES_EXTRA = [
    { s: "cad", img: "service-cad.jpg", t: "CAD", d: "Planejamento e modelagem digital de próteses com tecnologia computer-aided design para precisão milimétrica." },
    { s: "pt", img: "service-pt.jpg", t: "PT — Prótese Total", d: "Reabilitação completa da arcada para casos de edentulismo, com ajuste anatômico e estética cuidada." },
    { s: "ppr", img: "service-ppr.jpg", t: "PPR — Prótese Parcial Removível", d: "Estrutura com grampos de retenção em dentes remanescentes, garantindo estabilidade e conforto ao uso." },
    { s: "metaloceramica", img: "service-metaloceramica.jpg", t: "Metalocerâmica", d: "Coroas com infraestrutura metálica e cobertura cerâmica, combinando resistência e estética em harmonia." },
  ];
  const STEPS = [
    { t: "Solicitação", d: "Recebemos o caso do dentista com modelo e diretrizes." },
    { t: "Análise técnica", d: "Avaliamos viabilidade, materiais e cronograma." },
    { t: "Modelagem", d: "Produção da peça com aferição em cada etapa." },
    { t: "Controle", d: "Conferência dimensional, estética e funcional." },
    { t: "Entrega", d: "Embalagem identificada e envio no prazo combinado." },
  ];
  const GALLERY = [
    { img: "lab-gallery-articulador.jpg", c: "Modelo em articulador · ajuste de oclusão" },
    { img: "lab-gallery-modelo-arcada-01.jpg", c: "Montagem de arcada · planejamento protético" },
    { img: "lab-gallery-anteriores.jpg", c: "Acabamento anterior · estética e textura" },
    { img: "lab-gallery-coroas-modelo.jpg", c: "Coroas sobre modelo · conferência de adaptação" },
    { img: "lab-gallery-emax-zirconia.jpg", c: "Coroas E-max e zircônia · escolha de material" },
    { img: "lab-gallery-modelo-arcada-02.jpg", c: "Modelo de arcada · prova e refinamento" },
  ];
  const DEPO = [
    { q: "Os ajustes chegam praticamente prontos. Economizo tempo em cadeira e o paciente sai satisfeito no mesmo dia.", n: "Dra. Camila Andrade", w: "Clínica Andrade Odontologia · São Paulo", i: "CA" },
    { q: "Prazo é prazo. Em três anos de parceria, nunca tive uma entrega atrasada. Isso muda como eu planejo a agenda.", n: "Dr. Rafael Moreira", w: "Espaço Odonto · Campinas", i: "RM" },
    { q: "O contato direto com o técnico faz diferença em casos complexos. Resolve dúvidas antes de virar problema.", n: "Dra. Beatriz Salles", w: "Salles Estética Dental · Belo Horizonte", i: "BS" },
  ];
  const FAQ = [
    { q: "Quais serviços vocês oferecem?", a: "Prótese dentária (parcial, total e fixa, coroas e facetas), componentes protéticos sobre implantes já instalados, placas e moldeiras para clareamento caseiro, e alinhadores transparentes. Todos os serviços são executados sob prescrição do dentista. Atendemos exclusivamente profissionais autônomos (CPF) e clínicas (CNPJ) — não atendemos pacientes diretamente." },
    { q: "Quais são os prazos de entrega?", a: "O prazo depende do tipo de serviço. Coroas unitárias saem em 7 dias corridos; reabilitações completas, entre 15 e 25 dias. Para alinhadores e placas de clareamento, definimos o cronograma após análise do caso. O prazo é sempre combinado caso a caso na abertura do pedido." },
    { q: "Vocês atendem clínicas de outras cidades?", a: "Sim. Operamos a partir de Sorocaba, SP. Atendemos todo o estado e demais capitais brasileiras por logística rastreada, com seguro e prazo de envio acordado na abertura do pedido." },
    { q: "Como funciona o orçamento?", a: "Após o envio do caso, retornamos em até 24h com proposta detalhada: material, etapas, prazo e valor. Sem custo de avaliação." },
    { q: "Trabalham com quais materiais?", a: "Zircônia, dissilicato de lítio, cerâmica feldspática, resinas de alta performance e ligas metálicas certificadas. Indicamos o ideal para cada caso." },
    { q: "Como é feita a entrega das próteses?", a: "Embalagem identificada com etiqueta do caso, transportadora parceira e código de rastreio enviado por WhatsApp. Em Sorocaba e região, entrega própria sob demanda." },
    { q: "Posso visitar o laboratório?", a: "Claro. Recebemos profissionais com agendamento prévio para conhecer o espaço, os equipamentos e a equipe técnica." },
  ];

  /* =====================================================
     RENDER
     ===================================================== */
  function servCard(x) {
    return `<article class="serv-card">
      <div class="serv-img">${ph(x.img, false, x.t)}</div>
      <div class="serv-body">
        <h3>${x.t}</h3>
        <p>${x.d}</p>
        <a class="serv-link" href="#contato" data-service="${x.s}">Pedir orçamento <span class="btn-arrow">→</span></a>
      </div>
    </article>`;
  }
  $("#servGrid").innerHTML = SERVICES.map(servCard).join("");
  $("#servExtra").innerHTML = SERVICES_EXTRA.map(servCard).join("");

  $("#steps").innerHTML = STEPS.map((s, i) =>
    `<div class="step"><span class="dot"></span><span class="snum">${String(i + 1).padStart(2, "0")}</span><h3>${s.t}</h3><p>${s.d}</p></div>`
  ).join("");

  $("#galGrid").innerHTML = GALLERY.map((g, i) =>
    `<figure class="gal-item"><span class="reg">registro ${String(i + 1).padStart(2, "0")}</span>${ph(g.img, false, g.c)}<figcaption class="cap">${g.c}</figcaption></figure>`
  ).join("");

  $("#depoList").innerHTML = DEPO.map(d =>
    `<blockquote class="depo"><p>"${d.q}"</p><div class="who"><span class="av">${d.i}</span><div><b>${d.n}</b><span>${d.w}</span></div></div></blockquote>`
  ).join("");
  $("#depoList").insertAdjacentHTML("beforeend", `<p class="depo-note">Depoimentos de parceiros — conteúdo de marketing, não são avaliações verificadas do Google.</p>`);

  $("#faqList").innerHTML = FAQ.map((f, i) =>
    `<div class="faq-item"><button class="faq-q" aria-expanded="false" id="faqq${i}"><span>${f.q}</span><span class="plus"></span></button><div class="faq-a"><div class="faq-a-inner">${f.a}</div></div></div>`
  ).join("");

  /* =====================================================
     HEADER scroll + mobile menu
     ===================================================== */
  const header = $("#header");
  addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 12), { passive: true });
  const mm = $("#mobileMenu"), burger = $("#hamburger");
  const openMM = () => { mm.classList.add("open"); mm.setAttribute("aria-hidden", "false"); burger.setAttribute("aria-expanded", "true"); };
  const closeMM = () => { mm.classList.remove("open"); mm.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); };
  burger.addEventListener("click", openMM);
  $("#mmClose").addEventListener("click", closeMM);
  $$("#mobileMenu a").forEach(a => a.addEventListener("click", closeMM));

  /* =====================================================
     SERVICES toggle
     ===================================================== */
  const servToggle = $("#servToggle"), servExtra = $("#servExtra");
  servToggle.addEventListener("click", () => {
    const open = servExtra.classList.toggle("show");
    servToggle.setAttribute("aria-expanded", String(open));
    servToggle.innerHTML = open ? 'Ocultar serviços extras <span class="btn-arrow">↑</span>' : 'Ver mais serviços <span class="btn-arrow">↓</span>';
  });

  /* track which service triggered the contact jump (prefill form) */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-service]");
    if (!link) return;
    const svc = SERVICES.concat(SERVICES_EXTRA).find(s => s.s === link.dataset.service);
    if (svc) {
      const msg = $("#mensagem");
      if (msg && !msg.value.trim()) msg.value = `Olá! Gostaria de um orçamento para: ${svc.t}.`;
    }
  });

  /* =====================================================
     FAQ accordion
     ===================================================== */
  $$(".faq-item").forEach(item => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", String(open));
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    });
  });

  /* =====================================================
     FORM → WhatsApp
     ===================================================== */
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const nome = (f.get("nome") || "").trim();
    const clinica = (f.get("clinica") || "").trim();
    const contato = (f.get("contato") || "").trim();
    const mensagem = (f.get("mensagem") || "").trim();
    if (!nome || !contato) {
      if (!nome) $("#nome").focus(); else $("#contato").focus();
      return;
    }
    let body = `Olá, Labucal! Sou ${nome}`;
    if (clinica) body += ` (${clinica})`;
    body += `.\nContato: ${contato}.`;
    if (mensagem) body += `\n\n${mensagem}`;
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener");
    form.classList.add("sent");
    setTimeout(() => { form.classList.remove("sent"); form.reset(); }, 4000);
  });

  /* =====================================================
     MAP anti scroll-capture
     ===================================================== */
  const mapOverlay = $("#mapOverlay");
  if (mapOverlay) {
    mapOverlay.addEventListener("click", () => mapOverlay.classList.add("hidden"));
    addEventListener("scroll", () => { if (!mapOverlay.classList.contains("hidden")) {} }, { passive: true });
    // re-arm overlay when pointer leaves the map area
    const mw = mapOverlay.parentElement;
    mw.addEventListener("mouseleave", () => mapOverlay.classList.remove("hidden"));
  }

  /* =====================================================
     CONSTELLATION (hero, decorative) + NET (rede, interactive)
     ===================================================== */
  function drawConstellation() {
    const svg = $(".constellation");
    if (!svg) return;
    const pts = Array.from({ length: 16 }, () => ({ x: Math.random() * 400, y: Math.random() * 450 }));
    let lines = "";
    pts.forEach((p, i) => {
      const nb = pts.map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) })).filter(o => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
      nb.forEach(o => { if (o.j > i) lines += `<line x1="${p.x}" y1="${p.y}" x2="${pts[o.j].x}" y2="${pts[o.j].y}" stroke="#7FBBDD" stroke-opacity="0.28" stroke-width="1"/>`; });
    });
    const dots = pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="${1.6 + Math.random() * 2}" fill="#7FBBDD" fill-opacity="${0.4 + Math.random() * 0.5}"/>`).join("");
    svg.innerHTML = lines + dots;
  }
  drawConstellation();

  function drawNet() {
    const svg = $("#netSvg"), tip = $("#netTip");
    if (!svg) return;
    const W = 460, H = 400;
    const nodes = [
      { x: 230, y: 200, label: "Sorocaba", sub: "sede do laboratório", hub: true },
      { x: 350, y: 110, label: "São Paulo", sub: "capital" },
      { x: 120, y: 120, label: "Campinas", sub: "interior" },
      { x: 360, y: 290, label: "Belo Horizonte", sub: "capital" },
      { x: 95, y: 270, label: "Jundiaí", sub: "interior" },
      { x: 250, y: 60, label: "Ribeirão Preto", sub: "interior" },
      { x: 400, y: 200, label: "Santos", sub: "litoral" },
      { x: 150, y: 340, label: "Bauru", sub: "interior" },
      { x: 300, y: 360, label: "Demais capitais", sub: "logística rastreada" },
    ];
    let lines = "";
    for (let i = 1; i < nodes.length; i++) {
      lines += `<line x1="${nodes[0].x}" y1="${nodes[0].y}" x2="${nodes[i].x}" y2="${nodes[i].y}" stroke="#7FBBDD" stroke-opacity="0.22" stroke-width="1.2"/>`;
    }
    const g = nodes.map((n, i) =>
      `<g class="node" data-i="${i}" tabindex="0" role="img" aria-label="${n.label} — ${n.sub}">
         <circle cx="${n.x}" cy="${n.y}" r="${n.hub ? 22 : 16}" fill="#7FBBDD" fill-opacity="0.07"/>
         <circle class="core" cx="${n.x}" cy="${n.y}" r="${n.hub ? 8 : 5}" fill="${n.hub ? "#3E92C0" : "#7FBBDD"}"/>
       </g>`).join("");
    svg.innerHTML = lines + g;
    const rect = () => svg.getBoundingClientRect();
    $$(".node", svg).forEach(node => {
      const n = nodes[+node.dataset.i];
      const show = () => {
        const r = rect();
        tip.style.left = (n.x / W) * r.width + "px";
        tip.style.top = (n.y / H) * r.height + "px";
        tip.innerHTML = `<b>${n.label}</b><span>${n.sub}</span>`;
        tip.style.opacity = "1";
      };
      const hide = () => { tip.style.opacity = "0"; };
      node.addEventListener("mouseenter", show);
      node.addEventListener("mouseleave", hide);
      node.addEventListener("focus", show);
      node.addEventListener("blur", hide);
    });
  }
  drawNet();

  /* =====================================================
     STARS + REVIEWS popup (hydrated from data/reviews.json)
     ===================================================== */
  function starSVG(fill) {
    // fill: 'full' | 'half' | 'empty'
    const id = "g" + Math.random().toString(36).slice(2, 7);
    const grad = fill === "half" ? `<defs><linearGradient id="${id}"><stop offset="50%" stop-color="#F5A623"/><stop offset="50%" stop-color="#d9d3c7"/></linearGradient></defs>` : "";
    const c = fill === "full" ? "#F5A623" : fill === "half" ? `url(#${id})` : "#d9d3c7";
    return `<svg width="15" height="15" viewBox="0 0 24 24">${grad}<path fill="${c}" d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`;
  }
  function renderStars(el, rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) html += starSVG("full");
      else if (rating >= i - 0.5) html += starSVG("half");
      else html += starSVG("empty");
    }
    el.innerHTML = html;
  }
  renderStars($("#rpStars"), 5);

  let reviewsData = null;
  fetch("/data/reviews.json").then(r => r.ok ? r.json() : null).then(data => {
    if (!data) return;
    reviewsData = data;
    if (data.rating) { $("#rpRating").textContent = String(data.rating).replace(".", ","); renderStars($("#rpStars"), data.rating); }
    if (data.userRatingCount != null) $("#rpCount").textContent = `${data.userRatingCount} ${data.userRatingCount === 1 ? "avaliação" : "avaliações"} no Google`;
    if (data.googleMapsUri) $("#rpLink").href = data.googleMapsUri;
    // surface a real review quote
    const rev = (data.reviews || []).find(r => r.text && r.text.trim());
    if (rev) {
      $("#rpQuote").textContent = rev.text.trim();
      if (rev.author) { $("#rpAuthor").textContent = rev.author; $("#rpAv").textContent = rev.author.replace(/^(Dra?\.?\s*)/i, "").trim().charAt(0).toUpperCase() || "•"; }
      if (rev.relativeTime) $("#rpTime").textContent = rev.relativeTime;
    }
  }).catch(() => {});

  const reviewsPop = $("#reviewsPop");
  let reviewsShown = false;
  if (sessionStorage.getItem("labucal_reviews_dismissed")) reviewsShown = true;
  addEventListener("scroll", () => {
    if (reviewsShown) return;
    const pct = scrollY / (document.documentElement.scrollHeight - innerHeight);
    if (pct > 0.45) { reviewsPop.classList.add("show"); reviewsShown = true; }
  }, { passive: true });
  $("#rpClose").addEventListener("click", () => {
    reviewsPop.classList.remove("show");
    sessionStorage.setItem("labucal_reviews_dismissed", "1");
  });

  /* =====================================================
     COOKIE notice
     ===================================================== */
  const cookie = $("#cookie");
  if (!localStorage.getItem("labucal_cookies_accepted")) {
    setTimeout(() => cookie.classList.add("show"), 700);
  }
  $("#cookieOk").addEventListener("click", () => {
    cookie.classList.remove("show");
    localStorage.setItem("labucal_cookies_accepted", "1");
  });

  /* =====================================================
     LABUCALZINHO — chat
     ===================================================== */
  const SYSTEM_PROMPT = `Você é o Labucalzinho, o assistente virtual do Labucal — laboratório de próteses dentárias em Sorocaba, SP. Você ajuda dentistas e clínicas com dúvidas sobre nossos serviços.

CONTEXTO DO LABORATÓRIO:
- Endereço: Rua Cônego Januário Barbosa, 225, Jardim Vergueiro, Sorocaba, SP
- Telefone / WhatsApp: (15) 99110-7117
- E-mail: contato@labucal.com.br
- Instagram: @labucalprotese
- Facebook: facebook.com/labucalprotese
- Horário de atendimento: segunda a sexta, 8h às 18h
- CNPJ: 12.720.218/0001-08

CLIENTES:
- Atendemos exclusivamente dentistas e clínicas: autônomos (CPF) e empresas (CNPJ).
- NÃO atendemos pacientes diretamente. Se um paciente perguntar sobre tratamento, oriente-o gentilmente a procurar o dentista de confiança, que entrará em contato com o Labucal.

SERVIÇOS PRINCIPAIS (todos sob prescrição/indicação do dentista):
- Prótese Dentária — parcial, total, fixa, coroas e facetas.
- Implantes Dentários — componentes protéticos (coroa, abutment, barra) sobre implantes JÁ instalados pelo cirurgião-dentista. NÃO realizamos a cirurgia de implante em si.
- Clareamento Dental — confecção de placas e moldeiras para clareamento caseiro supervisionado pelo dentista. NÃO realizamos o clareamento de consultório.
- Alinhadores Transparentes — confecção a partir do escaneamento ou modelo enviado pelo dentista.

TAMBÉM TRABALHAMOS COM:
- CAD — planejamento e modelagem digital (computer-aided design).
- PT (Prótese Total) — reabilitação completa da arcada (edentulismo).
- PPR (Prótese Parcial Removível) — estrutura com grampos metálicos.
- Metalocerâmica — coroas com infraestrutura metálica e cobertura cerâmica.

MATERIAIS: zircônia, dissilicato de lítio, cerâmica feldspática, resinas de alta performance, ligas metálicas certificadas.

PROCESSO (5 etapas): Solicitação → Análise técnica → Modelagem → Controle → Entrega.

PRAZOS:
- Coroas unitárias: 7 dias corridos.
- Reabilitações completas: 15 a 25 dias.
- Cronograma combinado caso a caso na abertura do pedido.

LOGÍSTICA:
- Operamos a partir de Sorocaba, SP. Atendemos todo o estado e demais capitais por logística rastreada com seguro. Em Sorocaba e região, entrega própria sob demanda. Rastreio por WhatsApp.

ORÇAMENTOS: resposta em até 24h; sem custo de avaliação.

REGRAS DE RESPOSTA:
- Português brasileiro, tom profissional, próximo e direto (colega de profissão, sem "senhor/senhora").
- Respostas curtas: máximo 3 frases. Dúvidas técnicas complexas → direcionar para WhatsApp (15) 99110-7117 ou e-mail contato@labucal.com.br.
- Ao sugerir contato, citar explicitamente o número (15) 99110-7117 (este formato dispara o botão de WhatsApp no chat).
- Nunca inventar valores em reais, prazos individuais ou materiais fora da lista.
- Saudações → resposta curta apresentando 2-3 coisas em que pode ajudar.
- Perguntas fora de escopo → redirecionar gentilmente para próteses/parceria.
- Não responder perguntas pessoais sobre o assistente.
- Sem emojis (no máximo 1 se natural).`;

  const WELCOME = "Olá! Sou o Labucalzinho, assistente do laboratório. Tiro dúvidas sobre próteses, materiais, prazos e orçamentos. No que posso te ajudar?";
  const CHIPS = [
    { label: "Pedir orçamento", q: "Como funciona para pedir um orçamento?" },
    { label: "Ver prazos", q: "Quais são os prazos de entrega?" },
    { label: "Materiais que trabalham", q: "Com quais materiais vocês trabalham?" },
    { label: "Agendar visita", q: "Posso agendar uma visita ao laboratório?" },
    { label: "Falar no WhatsApp", wa: true },
  ];

  const fab = $("#fabChat"), panel = $("#chatPanel"), body = $("#chatBody"), chipsEl = $("#chatChips"), chatForm = $("#chatForm"), chatInput = $("#chatInput");
  let history = []; // {role:'user'|'assistant', text}
  let started = false;

  function waButtonHTML(lastQ) {
    const text = encodeURIComponent(lastQ ? `Olá, Labucal! Minha dúvida: ${lastQ}` : "Olá, Labucal! Gostaria de falar sobre um trabalho.");
    return `<a class="wa-btn" href="https://wa.me/${WA}?text=${text}" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3A2.8 2.8 0 0 0 6.5 11a5 5 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c2.4 1 2.4.7 2.8.6a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z"/></svg> Abrir no WhatsApp</a>`;
  }

  function addMsg(text, role, lastQ) {
    const el = document.createElement("div");
    el.className = "msg " + (role === "user" ? "user" : "bot");
    el.textContent = text;
    if (role === "bot" && /\(15\)\s?99110-7117/.test(text)) {
      el.insertAdjacentHTML("beforeend", "<br>" + waButtonHTML(lastQ));
    }
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }
  function typing(on) {
    let t = $("#typingDots");
    if (on && !t) {
      t = document.createElement("div");
      t.id = "typingDots"; t.className = "msg bot typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t); body.scrollTop = body.scrollHeight;
    } else if (!on && t) t.remove();
  }

  function fallback(q) {
    const s = q.toLowerCase();
    if (/prazo|quando|demora|tempo/.test(s)) return "Coroas unitárias saem em 7 dias corridos e reabilitações completas entre 15 e 25 dias. O cronograma é combinado caso a caso na abertura do pedido.";
    if (/or[çc]amento|valor|pre[çc]o|custo/.test(s)) return "Envie o caso pelo WhatsApp (15) 99110-7117 e retornamos em até 24h com material, etapas, prazo e valor. Sem custo de avaliação.";
    if (/agendar|visita|visitar|conhecer/.test(s)) return "Claro! Recebemos profissionais com agendamento prévio. Fale com a gente no (15) 99110-7117 para combinar o melhor horário.";
    if (/material|materiais|zirc|cer[âa]mica|dissilicato/.test(s)) return "Trabalhamos com zircônia, dissilicato de lítio, cerâmica feldspática, resinas de alta performance e ligas metálicas certificadas. Indicamos o ideal para cada caso.";
    return "Posso ajudar com próteses, implantes, clareamento, alinhadores, materiais e prazos. Para um atendimento direto, fale no (15) 99110-7117.";
  }

  const GEMINI_PROXY_URL = "https://labucal-gemini-proxy.keanukeanom.workers.dev";
  async function ask(q) {
    addMsg(q, "user");
    history.push({ role: "user", text: q });
    if (history.length > 12) history = history.slice(-12);
    typing(true);
    let answer = null;
    try {
      let sys = SYSTEM_PROMPT;
      if (reviewsData && reviewsData.rating) sys += `\n\nAVALIAÇÕES ATUAIS NO GOOGLE: ${reviewsData.rating} estrelas em ${reviewsData.userRatingCount} avaliações.`;
      const contents = history.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] }));
      const res = await fetch(GEMINI_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 300, candidateCount: 1 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) answer = reply.trim().replace(/^Labucalzinho:\s*/i, "");
      }
    } catch (e) { answer = null; }
    if (!answer) answer = fallback(q);
    typing(false);
    addMsg(answer, "bot", q);
    history.push({ role: "assistant", text: answer });
  }

  function renderChips() {
    chipsEl.innerHTML = "";
    CHIPS.forEach(c => {
      const b = document.createElement("button");
      b.className = "chip" + (c.wa ? " wa" : "");
      b.textContent = c.label;
      b.addEventListener("click", () => {
        if (c.wa) { window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Olá, Labucal! Gostaria de falar sobre um trabalho.")}`, "_blank", "noopener"); return; }
        ask(c.q);
        chipsEl.style.display = "none";
      });
      chipsEl.appendChild(b);
    });
  }

  function openChat() {
    panel.classList.add("open"); fab.classList.add("open");
    fab.setAttribute("aria-expanded", "true");
    if (!started) {
      started = true;
      addMsg(WELCOME, "bot");
      renderChips();
    }
    setTimeout(() => chatInput.focus(), 300);
  }
  function closeChat() { panel.classList.remove("open"); fab.classList.remove("open"); fab.setAttribute("aria-expanded", "false"); }
  fab.addEventListener("click", () => panel.classList.contains("open") ? closeChat() : openChat());
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = chatInput.value.trim();
    if (!q) return;
    chatInput.value = "";
    chipsEl.style.display = "none";
    ask(q);
  });

  /* =====================================================
     SCROLL reveal
     ===================================================== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".section-head, .pillar, .serv-card, .gal-item, .depo, .form-card").forEach((el, i) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = (i % 4) * 60 + "ms";
    io.observe(el);
  });

  /* =====================================================
     PEÇAS DECORATIVAS ANIMADAS POR SCROLL (port da v1)
     ===================================================== */
  const decor = $$(".section-prosthesis");
  if (decor.length) {
    if ("IntersectionObserver" in window) {
      const dio = new IntersectionObserver((ents) => {
        ents.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
      }, { rootMargin: "-8% 0px -12%", threshold: 0.1 });
      decor.forEach(d => dio.observe(d));
    } else decor.forEach(d => d.classList.add("in"));

    const updateDecor = () => {
      const vh = innerHeight || document.documentElement.clientHeight;
      decor.forEach(item => {
        const sec = item.closest("section");
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const t = (p - 0.5) * 2;
        const mode = item.dataset.scrollDecor || "right";
        let x = 0, y = t * 46, rot = t * 7, scale = 0.96 + p * 0.05;
        if (mode === "right") { x = 58 - p * 118; rot = 10 - p * 20; }
        else if (mode === "left") { x = -58 + p * 118; rot = -10 + p * 20; }
        else { x = Math.sin(p * Math.PI) * 30; y = -42 + p * 84; rot = -14 + p * 28; scale = 0.92 + Math.sin(p * Math.PI) * 0.1; }
        item.style.setProperty("--scroll-x", x.toFixed(1) + "px");
        item.style.setProperty("--scroll-y", y.toFixed(1) + "px");
        item.style.setProperty("--scroll-rot", rot.toFixed(2) + "deg");
        item.style.setProperty("--scroll-scale", scale.toFixed(3));
      });
    };
    addEventListener("scroll", updateDecor, { passive: true });
    addEventListener("resize", updateDecor);
    updateDecor();
  }

  /* =====================================================
     TWEAKS panel (vanilla, host protocol)
     ===================================================== */
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "palette": "clinica",
    "typeface": "serif",
    "heroHeadline": "Sua próxima prótese, pronta no prazo."
  }/*EDITMODE-END*/;

  const tweaks = Object.assign({}, TWEAK_DEFAULTS);
  function applyTweaks() {
    const root = document.documentElement;
    if (tweaks.palette && tweaks.palette !== "clinica") root.setAttribute("data-palette", tweaks.palette);
    else root.removeAttribute("data-palette");
    if (tweaks.typeface === "grotesk") root.setAttribute("data-type", "grotesk");
    else root.removeAttribute("data-type");
    const h1 = $(".hero-copy h1");
    if (h1 && tweaks.heroHeadline) {
      // keep last clause emphasized
      const parts = tweaks.heroHeadline.split(",");
      if (parts.length > 1) h1.innerHTML = parts[0] + ", <em>" + parts.slice(1).join(",").trim() + "</em>";
      else h1.textContent = tweaks.heroHeadline;
    }
  }
  applyTweaks();

  function setTweak(key, val) {
    tweaks[key] = val;
    applyTweaks();
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
    buildPanel();
  }

  const PALETTES = [
    { id: "clinica", label: "Clínica", sw: ["#0B1B3A", "#F4EFE6", "#3E92C0"] },
    { id: "frio", label: "Tecido", sw: ["#0B1B3A", "#F1F3F5", "#1E7C8C"] },
    { id: "grafite", label: "Ardósia", sw: ["#1A1A1E", "#E9E6E0", "#A8853C"] },
  ];

  const panelEl = $("#tweaksPanel");
  let panelOpen = false;
  function buildPanel() {
    panelEl.innerHTML = `
      <div class="tw-head"><span>Tweaks</span><button class="tw-x" id="twX" aria-label="Fechar">&times;</button></div>
      <div class="tw-body">
        <div class="tw-sec">Paleta</div>
        <div class="tw-swatches">
          ${PALETTES.map(p => `<button class="tw-pal ${tweaks.palette === p.id ? "on" : ""}" data-pal="${p.id}">
            <span class="tw-dots">${p.sw.map(c => `<i style="background:${c}"></i>`).join("")}</span>${p.label}</button>`).join("")}
        </div>
        <div class="tw-sec">Tipografia dos títulos</div>
        <div class="tw-seg">
          <button data-type="serif" class="${tweaks.typeface === "serif" ? "on" : ""}">Serifada</button>
          <button data-type="grotesk" class="${tweaks.typeface === "grotesk" ? "on" : ""}">Grotesca</button>
        </div>
        <div class="tw-sec">Título do hero</div>
        <textarea class="tw-text" id="twHead" rows="2">${tweaks.heroHeadline}</textarea>
      </div>`;
    $("#twX", panelEl).addEventListener("click", dismissPanel);
    $$(".tw-pal", panelEl).forEach(b => b.addEventListener("click", () => setTweak("palette", b.dataset.pal)));
    $$(".tw-seg button", panelEl).forEach(b => b.addEventListener("click", () => setTweak("typeface", b.dataset.type)));
    const ta = $("#twHead", panelEl);
    ta.addEventListener("change", () => setTweak("heroHeadline", ta.value.trim() || TWEAK_DEFAULTS.heroHeadline));
  }
  function openPanel() { panelOpen = true; panelEl.classList.add("open"); buildPanel(); }
  function dismissPanel() { panelOpen = false; panelEl.classList.remove("open"); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }

  window.addEventListener("message", (e) => {
    const t = e && e.data && e.data.type;
    if (t === "__activate_edit_mode") openPanel();
    else if (t === "__deactivate_edit_mode") { panelOpen = false; panelEl.classList.remove("open"); }
  });
  window.parent.postMessage({ type: "__edit_mode_available" }, "*");
})();

/* ============================================================
   Barra de rolagem custom (overlay) — porte da v1
   Oculta a barra nativa (sem reservar espaço) e desenha um thumb
   que reflete a posição do scroll; arrastável; auto-hide.
   ============================================================ */
(function customScrollbar() {
  "use strict";
  const bar = document.getElementById("appScrollbar");
  const thumb = document.getElementById("appScrollbarThumb");
  if (!bar || !thumb) return;
  const scroller = document.scrollingElement || document.documentElement;
  let hideTimer = null, dragging = false, hovering = false;
  const trackH = () => bar.clientHeight;
  const isScrollable = () => scroller.scrollHeight > window.innerHeight + 2;

  const update = () => {
    const scrollH = scroller.scrollHeight, winH = window.innerHeight;
    if (scrollH <= winH + 2) { bar.classList.remove("is-active"); return; }
    const th = Math.max(36, Math.round(trackH() * (winH / scrollH)));
    const maxThumbTop = Math.max(0, trackH() - th);
    const range = scrollH - winH;
    const top = range > 0 ? (scroller.scrollTop / range) * maxThumbTop : 0;
    thumb.style.height = th + "px";
    thumb.style.transform = "translateY(" + Math.round(top) + "px)";
  };
  const flash = () => {
    if (!isScrollable()) { bar.classList.remove("is-active"); return; }
    bar.classList.add("is-active");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (!dragging && !hovering) bar.classList.remove("is-active"); }, 1200);
  };

  window.addEventListener("scroll", () => { update(); flash(); }, { passive: true });
  window.addEventListener("resize", () => { update(); flash(); }, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(() => { update(); flash(); }).observe(document.body);
  window.addEventListener("load", () => { update(); flash(); });
  window.addEventListener("mousemove", (e) => { if (window.innerWidth - e.clientX < 40) flash(); }, { passive: true });
  bar.addEventListener("mouseenter", () => { hovering = true; flash(); });
  bar.addEventListener("mouseleave", () => { hovering = false; flash(); });

  // arrastar o thumb (geometria congelada no pointerdown)
  let startY = 0, startScroll = 0, dragRange = 0, dragMaxThumbTop = 1;
  thumb.addEventListener("pointerdown", (e) => {
    dragging = true; bar.classList.add("is-dragging", "is-active");
    startY = e.clientY; startScroll = scroller.scrollTop;
    dragRange = Math.max(0, scroller.scrollHeight - window.innerHeight);
    dragMaxThumbTop = Math.max(1, trackH() - thumb.offsetHeight);
    try { thumb.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault();
  });
  thumb.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    let next = startScroll + ((e.clientY - startY) / dragMaxThumbTop) * dragRange;
    scroller.scrollTop = Math.max(0, Math.min(dragRange, next));
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false; bar.classList.remove("is-dragging");
    try { thumb.releasePointerCapture(e.pointerId); } catch (_) {} flash();
  };
  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);

  update(); flash();
})();
