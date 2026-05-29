# Especificación funcional del sitio Labucal

Documento de referencia para **rehacer el sitio desde cero** en cualquier stack. Contiene toda la
información de negocio, contenido, estructura, integraciones y comportamiento.

> **Alcance:** este documento describe *qué* hace el sitio y *qué dice*, NO *cómo se ve*.
> No incluye paleta de colores, tipografías, espaciados, animaciones ni reglas CSS.
> Para la parte visual ver `docs/EDITING_GUIDE.md` y el `:root` del `index.html` actual.

---

## 1. Resumen

- **Producto:** sitio web institucional de **Labucal**, laboratorio de prótesis dentaria.
- **Modelo de negocio:** **B2B exclusivo.** Atiende solo a dentistas autónomos (CPF) y clínicas
  (CNPJ). **No atiende pacientes directos.** Todos los servicios son **sob prescripción del dentista**.
- **Sede:** Sorocaba, SP, Brasil. Atiende todo el estado y demás capitales por logística rastreada.
- **Idioma del sitio:** portugués de Brasil (`lang="pt-BR"`).
- **Tipo:** sitio estático, sin framework ni build step (HTML + CSS + JS vanilla). Una sola página
  principal (`index.html`) + página de privacidad.
- **Objetivo de conversión:** que el dentista/clínica pida un orçamento (vía formulario, WhatsApp,
  teléfono o e-mail).

---

## 2. Datos del negocio (NAP y oficiales)

Estos datos deben ser **idénticos** en todo el sitio (consistencia NAP para SEO local):

| Campo | Valor |
|---|---|
| Nombre | Labucal |
| Razón social | Labucal |
| CNPJ | 12.720.218/0001-08 |
| Teléfono / WhatsApp | (15) 99110-7117 — internacional `+5515991107117` |
| E-mail | contato@labucal.com.br |
| Dirección | Rua Cônego Januário Barbosa, 225 |
| Bairro | Jardim Vergueiro |
| Ciudad / Estado | Sorocaba, SP |
| CEP | 18030-075 |
| País | Brasil (BR) |
| Coordenadas | lat -23.5084267, lng -47.4584548 |
| Horario | Segunda a sexta, 08h às 18h |
| Facebook | https://www.facebook.com/labucalprotese (texto: "Labucal Prótese Odontológica") |
| Instagram | https://www.instagram.com/labucalprotese/ (handle: @labucalprotese) |

**Place ID de Google** (para la Places API): `ChIJ6f3VvLmLxZQRdLE0dLMATaI`

Al cambiar cualquier dato, actualizar TODAS sus apariciones: contacto, footer, mapa (iframe + link
Google Maps), JSON-LD schema, prompt del chat (Labucalzinho) y los textos de fallback del chat.

---

## 3. Hosting, deploy y dominios

- **Hosting actual:** Cloudflare Pages → `https://labucal.pages.dev/`
- **Dominio de marca:** `labucal.com.br` (lo poseen, pero **aún no apuntado** a Cloudflare). Cuando se
  migre, cambiar canonical / OG / sitemap / schema de `labucal.pages.dev` a `labucal.com.br`.
- **Repositorio:** https://github.com/Pcxddg/labucal (rama `main`).
- **Deploy automático:** `.github/workflows/deploy-pages.yml`. Se dispara en:
  - cada push a `main`,
  - al completar con éxito el workflow "Update Google Reviews",
  - manualmente (`workflow_dispatch`).
  - Usa `cloudflare/wrangler-action@v3` con `pages deploy . --project-name=labucal`.
- **Secrets de GitHub necesarios:**
  - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (deploy)
  - `GOOGLE_PLACES_API_KEY` (workflow de reviews)

---

## 4. Estructura de archivos

```
index.html            ← página única principal (estructura + CSS embebido + JS embebido)
privacidade.html      ← Política de Privacidade (LGPD)
sitemap.xml           ← 2 URLs: / y /privacidade.html
robots.txt            ← permite todo; Disallow /scripts/ /.github/ /data/ /docs/
data/reviews.json     ← AUTO-GENERADO cada 6h (no editar a mano)
scripts/fetch-reviews.js          ← consulta Google Places API y escribe reviews.json
.github/workflows/deploy-pages.yml
.github/workflows/update-reviews.yml
assets/brand/         ← logo, favicons, apple-touch-icon
assets/decor/         ← 4 prótesis decorativas PNG
assets/labucal-images/ ← hero, galería, servicios, prótesis del hero
docs/                 ← documentación
```

---

## 5. Páginas y navegación

### Páginas
1. **`index.html`** — home (todo el contenido).
2. **`privacidade.html`** — política de privacidad LGPD. Enlazada desde el footer y el aviso de cookies.

### Navegación principal (header)
Links: **Serviços** (`#servicos`), **Processo** (`#processo`), **Galeria** (`#galeria`),
**Contato** (`#contato`). CTA destacado: **"Pedir orçamento"** → `#contato`.
Menú mobile (hamburguesa) incluye además **Rede** (`#rede`).

### IDs de sección (no cambiar sin actualizar nav, menú mobile y footer)
`#top` (hero) · `#sobre` (value prop) · `#servicos` · `#processo` · `#galeria` · `#rede` ·
`#contato` · `#faq`

### Footer
- Columna marca: logo + tagline + íconos sociales (Instagram, Facebook).
- Columna "Navegação": Serviços, Processo, Galeria, Rede, Perguntas frequentes.
- Columna "Contato": teléfono, e-mail, dirección completa, horario.
- Barra inferior: `© 2026 Labucal · Todos os direitos reservados.` · link Política de privacidade ·
  `CNPJ 12.720.218/0001-08`.

---

## 6. Contenido por sección (copy completo)

### 6.1 Hero (`#top`)
- Overline: **Laboratório de próteses dentárias**
- H1: **Sua próxima prótese, pronta no prazo.**
- Lead: *O laboratório que devolve a peça quando você combinou — sem retrabalho, sem surpresa.
  Atendimento direto com o técnico responsável.*
- CTAs: **Pedir orçamento** (→ `#contato`) y **Conhecer o processo** (→ `#processo`).
- Visual (no diseño): imagen de fondo de laboratorio + una prótesis en 2 partes que se "arma" + un SVG
  de constelación. *(Detalle visual, opcional al rehacer.)*

### 6.2 Value Prop / Sobre (`#sobre`)
- Overline: **Sobre o Labucal**
- H2: **Precisão técnica, entrega no prazo, parceria de longo prazo.**
- 3 pilares:
  1. **Precisão milimétrica** — *Menos retrabalho em cadeira. Cada peça é conferida dimensional e
     funcionalmente antes de sair.*
  2. **Prazos cumpridos** — *O prazo combinado é o prazo entregue. Cronograma definido caso a caso, na
     abertura do pedido.*
  3. **Acompanhamento próximo** — *Sem central de atendimento. Você fala direto com o técnico
     responsável pelo seu caso.*

### 6.3 Serviços (`#servicos`)
- Overline: **O que fazemos** · H2: **Nossos serviços.**
- 4 servicios principales (siempre visibles), cada uno con imagen, título, descripción y CTA
  "Pedir orçamento" (→ `#contato`, con atributo `data-service`):

| `data-service` | Título | Descripción |
|---|---|---|
| `protese` | **Prótese Dentária** | Parcial, total, fixa, coroas e facetas. Material escolhido caso a caso — zircônia, dissilicato ou cerâmica feldspática. Sai pronta para você entregar ao paciente. |
| `implantes` | **Implantes Dentários** | Coroas, abutments e barras para o implante que você já colocou. Encaixe verificado antes de sair — sem ajuste surpresa de cadeira. |
| `clareamento` | **Clareamento Dental** | Placas e moldeiras sob medida para o clareamento caseiro do seu paciente. Você manda a moldagem, recebe a placa pronta para entregar. |
| `alinhadores` | **Alinhadores Transparentes** | Você envia o escaneamento ou modelo, a gente confecciona a sequência de alinhadores e acompanha tecnicamente cada etapa do tratamento. |

- Botón **"Ver mais serviços" / "Ocultar serviços extras"** (toggle, `aria-expanded`) que muestra/oculta
  4 servicios extra:

| `data-service` | Título | Descripción |
|---|---|---|
| `cad` | **CAD** | Planejamento e modelagem digital de próteses com tecnologia computer-aided design para precisão milimétrica. |
| `pt` | **PT — Prótese Total** | Reabilitação completa da arcada para casos de edentulismo, com ajuste anatômico e estética cuidada. |
| `ppr` | **PPR — Prótese Parcial Removível** | Estrutura com grampos de retenção em dentes remanescentes, garantindo estabilidade e conforto ao uso. |
| `metaloceramica` | **Metalocerâmica** | Coroas com infraestrutura metálica e cobertura cerâmica, combinando resistência e estética em harmonia. |

### 6.4 Processo (`#processo`)
- Overline: **Como trabalhamos** · H2: **Um processo claro, do pedido à entrega.**
- 5 pasos numerados:
  1. **Solicitação** — Recebemos o caso do dentista com modelo e diretrizes.
  2. **Análise técnica** — Avaliamos viabilidade, materiais e cronograma.
  3. **Modelagem** — Produção da peça com aferição em cada etapa.
  4. **Controle** — Conferência dimensional, estética e funcional.
  5. **Entrega** — Embalagem identificada e envio no prazo combinado.

### 6.5 Galeria (`#galeria`)
- Overline: **Galeria** · H2: **Trabalhos recentes.**
- 6 imágenes de trabajos reales, cada una con un "registro NN" y label:
  1. Modelo em articulador · ajuste de oclusão
  2. Montagem de arcada · planejamento protético
  3. Acabamento anterior · estética e textura
  4. Coroas sobre modelo · conferência de adaptação
  5. Coroas E-max e zircônia · escolha de material
  6. Modelo de arcada · prova e refinamento

### 6.6 Rede / Constelação (`#rede`)
- Overline: **Rede** · H2: **Uma rede de profissionais que confiam no nosso trabalho.**
- Visual de red/constelación (SVG interactivo con tooltip). *(Detalle visual.)*
- 3 testimonios (depoimentos):
  - *"Os ajustes chegam praticamente prontos. Economizo tempo em cadeira e o paciente sai satisfeito no
    mesmo dia."* — **Dra. Camila Andrade**, Clínica Andrade Odontologia · São Paulo
  - *"Prazo é prazo. Em três anos de parceria, nunca tive uma entrega atrasada. Isso muda como eu
    planejo a agenda."* — **Dr. Rafael Moreira**, Espaço Odonto · Campinas
  - *"O contato direto com o técnico faz diferença em casos complexos. Resolve dúvidas antes de virar
    problema."* — **Dra. Beatriz Salles**, Salles Estética Dental · Belo Horizonte

  > Nota: los testimonios son contenido de marketing (no son reseñas de Google verificadas).

### 6.7 Contato (`#contato`)
- Overline: **Contato** · H2: **Vamos conversar sobre seu próximo trabalho?**
- Lista de contacto (con links): Telefone, E-mail, Facebook, Instagram, Endereço, Horário (ver §2).
- **Formulario** (ver §7).
- **Mapa** (ver §8).

### 6.8 FAQ (`#faq`)
- Overline: **FAQ** · H2: **Perguntas frequentes.** — Acordeón de 7 ítems:

1. **Quais serviços vocês oferecem?**
   Prótese dentária (parcial, total e fixa, coroas e facetas), componentes protéticos sobre implantes já
   instalados, placas e moldeiras para clareamento caseiro, e alinhadores transparentes. Todos os
   serviços são executados sob prescrição do dentista. Atendemos exclusivamente profissionais autônomos
   (CPF) e clínicas (CNPJ) — não atendemos pacientes diretamente.
2. **Quais são os prazos de entrega?**
   O prazo depende do tipo de serviço. Coroas unitárias saem em 7 dias corridos; reabilitações
   completas, entre 15 e 25 dias. Para alinhadores e placas de clareamento, definimos o cronograma após
   análise do caso. O prazo é sempre combinado caso a caso na abertura do pedido.
3. **Vocês atendem clínicas de outras cidades?**
   Sim. Operamos a partir de Sorocaba, SP. Atendemos todo o estado e demais capitais brasileiras por
   logística rastreada, com seguro e prazo de envio acordado na abertura do pedido.
4. **Como funciona o orçamento?**
   Após o envio do caso, retornamos em até 24h com proposta detalhada: material, etapas, prazo e valor.
   Sem custo de avaliação.
5. **Trabalham com quais materiais?**
   Zircônia, dissilicato de lítio, cerâmica feldspática, resinas de alta performance e ligas metálicas
   certificadas. Indicamos o ideal para cada caso.
6. **Como é feita a entrega das próteses?**
   Embalagem identificada com etiqueta do caso, transportadora parceira e código de rastreio enviado por
   WhatsApp. Em Sorocaba e região, entrega própria sob demanda.
7. **Posso visitar o laboratório?**
   Claro. Recebemos profissionais com agendamento prévio para conhecer o espaço, os equipamentos e a
   equipe técnica.

> El texto del FAQ debe coincidir **verbatim** con el schema `FAQPage` (ver §9).

---

## 7. Formulario de contacto

- ID `contactForm`. Campos:
  - **Nome** (`nome`, text, requerido, `autocomplete=name`)
  - **Clínica** (`clinica`, text, opcional, `autocomplete=organization`)
  - **E-mail ou WhatsApp** (`contato`, text, requerido)
  - **Mensagem** (`mensagem`, textarea, opcional; placeholder: "Conte um pouco sobre o caso ou o que
    precisa.")
  - Botón **Enviar**.
- **Envío vía `mailto:` (sin backend).** Al enviar, el handler valida que `nome` y `contato` estén
  completos, arma un `mailto:contato@labucal.com.br` con `subject` ("Pedido de orçamento — {nome}") y
  `body` (nome, clínica, contato, mensagem) y abre el cliente de correo del usuario. No hace `reset()`
  para no perder los datos si el usuario no tiene cliente de e-mail configurado.
  - Limitación conocida: depende de que el dispositivo tenga un cliente de correo. Si en el futuro se
    quiere envío sin salir del sitio, migrar a Web3Forms/Formspree o un Worker de Cloudflare.

---

## 8. Mapa

- **OpenStreetMap embebido** (iframe, sin API key). bbox centrado en las coordenadas del §2, con marker.
- Capa `map-overlay` encima del iframe: evita que la rueda del mouse haga zoom al scrollear; al hacer
  clic libera la interacción del mapa. Hint: "Clique no mapa para interagir".
- Link externo **"Abrir rota no Google Maps"** (`target=_blank rel=noopener`) con la dirección completa.
- Si cambia la dirección: actualizar el `bbox`/`marker` del iframe Y la query del link de Google Maps.

---

## 9. SEO y datos estructurados

### Meta / head
- `<title>`: **Laboratório de Prótese Dentária em Sorocaba/SP | Labucal**
- `meta description`: *Laboratório de prótese dentária em Sorocaba/SP. Próteses, implantes, clareamento e
  alinhadores transparentes para dentistas e clínicas. Prazos cumpridos e precisão milimétrica.*
- `canonical`: `https://labucal.pages.dev/`
- Open Graph + Twitter Card completos (og:title/description/url/image/locale `pt_BR`,
  twitter:card `summary_large_image`). og:image = `.../assets/labucal-images/service-protese.jpg`.
- `theme-color #0A1B3D`, `color-scheme light`, favicons (.ico, png 32, apple-touch-icon).
- `preconnect` a Google Fonts y al Worker proxy del chat.

### JSON-LD (2 bloques)
1. **MedicalBusiness + ProfessionalService** — NAP, geo, `openingHoursSpecification` (Lun–Vie 08–18),
   `areaServed` (Sorocaba, São Paulo, Brasil), `sameAs` (Facebook, Instagram), logo, image, y
   `aggregateRating`.
   - ⚠️ El `aggregateRating` (`ratingValue` / `reviewCount`) se **sincroniza automáticamente** con los
     datos reales de Google: `scripts/fetch-reviews.js` reescribe esos dos valores en `index.html` cada
     corrida del workflow de reviews (solo si hay rating y ≥1 reseña). Al rehacer, mantener esta sync o
     dejarlo estático.
2. **FAQPage** — las 7 preguntas/respuestas del §6.8, texto verbatim.

### sitemap.xml / robots.txt
- sitemap: `/` (priority 1.0, weekly) y `/privacidade.html` (0.3, yearly).
- robots: `Allow: /`; `Disallow` de `/scripts/ /.github/ /data/ /docs/`; declara el sitemap.

---

## 10. Componentes flotantes (UI persistente)

### 10.1 Labucalzinho — chat con IA (Gemini)
Asistente virtual flotante (botón abajo a la derecha → panel de chat). **Es la pieza más compleja.**

- **Backend:** llama a un **Cloudflare Worker proxy** que reenvía a la API de Google Gemini.
  - URL actual: `https://labucal-gemini-proxy.keanukeanom.workers.dev` (cuenta personal — punto único de
    falla; al rehacer conviene mover a un Worker de la cuenta del cliente).
  - La API key de Gemini **vive en el Worker**, nunca en el cliente.
  - Request: `POST` JSON con `{ systemInstruction, contents (history), generationConfig
    {temperature:0.6, maxOutputTokens:300, candidateCount:1} }`.
- **Historial:** se mantiene en memoria, limitado a los últimos 12 turnos.
- **Contexto dinámico:** al cargar, hace `fetch('data/reviews.json')` y, si hay datos, agrega al system
  prompt una línea "AVALIAÇÕES ATUAIS NO GOOGLE: X estrelas em N avaliações."
- **Fallback offline:** si el Worker falla o no hay URL, responde con textos predefinidos según keywords
  (prazo / orçamento / agendar / materiais / default). Nunca queda mudo.
- **Integración WhatsApp contextual:** si la respuesta del bot contiene el teléfono `(15) 99110-7117`
  (detectado por regex), se inyecta automáticamente debajo del mensaje un botón verde "Abrir no
  WhatsApp" con `wa.me/5515991107117` y un texto pre-armado que incluye la última pregunta del usuario.
- **Chips rápidos** iniciales: "Pedir orçamento", "Ver prazos", "Materiais que trabalham",
  "Agendar visita", y "Falar no WhatsApp" (este último abre WhatsApp directo, sin pasar por la IA).
- **Mensaje de bienvenida:** *"Olá! Sou o Labucalzinho, assistente do laboratório. Tiro dúvidas sobre
  próteses, materiais, prazos e orçamentos. No que posso te ajudar?"*

**System prompt (íntegro) que define al asistente:**

```
Você é o Labucalzinho, o assistente virtual do Labucal — laboratório de próteses dentárias em
Sorocaba, SP. Você ajuda dentistas e clínicas com dúvidas sobre nossos serviços.

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
- NÃO atendemos pacientes diretamente. Se um paciente perguntar sobre tratamento, oriente-o
  gentilmente a procurar o dentista de confiança, que entrará em contato com o Labucal.

SERVIÇOS PRINCIPAIS (todos sob prescrição/indicação do dentista):
- Prótese Dentária — parcial, total, fixa, coroas e facetas.
- Implantes Dentários — componentes protéticos (coroa, abutment, barra) sobre implantes JÁ instalados
  pelo cirurgião-dentista. NÃO realizamos a cirurgia de implante em si.
- Clareamento Dental — confecção de placas e moldeiras para clareamento caseiro supervisionado pelo
  dentista. NÃO realizamos o clareamento de consultório.
- Alinhadores Transparentes — confecção a partir do escaneamento ou modelo enviado pelo dentista.

TAMBÉM TRABALHAMOS COM:
- CAD — planejamento e modelagem digital (computer-aided design).
- PT (Prótese Total) — reabilitação completa da arcada (edentulismo).
- PPR (Prótese Parcial Removível) — estrutura com grampos metálicos.
- Metalocerâmica — coroas com infraestrutura metálica e cobertura cerâmica.

MATERIAIS: zircônia, dissilicato de lítio, cerâmica feldspática, resinas de alta performance, ligas
metálicas certificadas.

PROCESSO (5 etapas): Solicitação → Análise técnica → Modelagem → Controle → Entrega.

PRAZOS:
- Coroas unitárias: 7 dias corridos.
- Reabilitações completas: 15 a 25 dias.
- Cronograma combinado caso a caso na abertura do pedido.

LOGÍSTICA:
- Operamos a partir de Sorocaba, SP. Atendemos todo o estado e demais capitais por logística rastreada
  com seguro. Em Sorocaba e região, entrega própria sob demanda. Rastreio por WhatsApp.

ORÇAMENTOS: resposta em até 24h; sem custo de avaliação.

REGRAS DE RESPOSTA:
- Português brasileiro, tom profissional, próximo e direto (colega de profissão, sem "senhor/senhora").
- Respostas curtas: máximo 3 frases. Dúvidas técnicas complexas → direcionar para WhatsApp
  (15) 99110-7117 ou e-mail contato@labucal.com.br.
- Ao sugerir contato, citar explicitamente o número (15) 99110-7117 (este formato dispara o botão de
  WhatsApp no chat).
- Nunca inventar valores em reais, prazos individuais ou materiais fora da lista.
- Saudações → resposta curta apresentando 2-3 coisas em que pode ajudar.
- Perguntas fora de escopo → redirecionar gentilmente para próteses/parceria.
- Não responder perguntas pessoais sobre o assistente.
- Sem emojis (no máximo 1 se natural).
```

### 10.2 Popup de avaliações do Google
- Aparece abajo a la izquierda cuando el scroll pasa ~45% del documento.
- Se hidrata desde `data/reviews.json`: estrellas (soporta medias estrellas), rating, link al perfil.
  Si el JSON no existe, queda con contenido estático (5 estrellas, texto genérico).
- CTA "Ver avaliações" → perfil de Google del laboratorio.
- Se descarta con `sessionStorage.labucal_reviews_dismissed` (reaparece en pestaña nueva).
- Texto: *"Veja o que dentistas e clínicas parceiras dizem do nosso trabalho diretamente no Google."*

### 10.3 Aviso de cookies (LGPD)
- Aparece ~700ms tras cargar, solo en la primera visita.
- Texto: *"Cookies e privacidade. Utilizamos apenas cookies essenciais ao funcionamento do site. Não
  usamos rastreamento publicitário. Saiba mais em nossa Política de Privacidade."* + botón "Entendi".
- Al aceptar, persiste `localStorage.labucal_cookies_accepted = '1'`.

---

## 11. Automatización de reseñas de Google

Flujo (independiente del front):
1. Workflow `update-reviews.yml` corre **cada 6 horas** (cron `0 */6 * * *`) + manual.
2. Ejecuta `scripts/fetch-reviews.js`, que llama a la **Places API (New)** de Google con el `PLACE_ID`
   y la `GOOGLE_PLACES_API_KEY` (FieldMask: displayName, rating, userRatingCount, googleMapsUri,
   reviews).
3. Escribe `data/reviews.json` y además **sincroniza el `aggregateRating`** del JSON-LD en `index.html`.
4. Commitea `data/reviews.json` + `index.html` a `main` (solo si hubo cambios; mensaje con `[skip ci]`).
5. El deploy se encadena al terminar este workflow.

**Estructura de `data/reviews.json`:**
```json
{
  "updatedAt": "ISO-8601",
  "name": "Labucal",
  "rating": 5,
  "userRatingCount": 2,
  "googleMapsUri": "https://maps.google.com/?cid=...",
  "reviews": [
    { "author": "...", "authorPhoto": "...", "rating": 5, "text": "...",
      "relativeTime": "...", "publishTime": "ISO-8601" }
  ]
}
```

**Costo:** ~120 llamadas/mes, < USD 1, absorbido por el crédito gratuito mensual de Google (USD 200).

---

## 12. Dependencias externas y servicios

| Servicio | Uso | Notas |
|---|---|---|
| Cloudflare Pages | Hosting + deploy | Secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| Google Places API (New) | Reseñas en vivo | Secret `GOOGLE_PLACES_API_KEY`; requiere billing activo |
| Cloudflare Worker (Gemini proxy) | Backend del chat | Hoy en cuenta personal; mover a cuenta del cliente |
| Google Gemini API | IA del chat | API key dentro del Worker, no en el cliente |
| Google Fonts | Tipografía | Plus Jakarta Sans (detalle de diseño) |
| OpenStreetMap | Mapa embebido | Sin API key |

**Sin** Google Analytics, ni píxeles, ni cookies de rastreo (solo esenciales — coherente con la
política LGPD).

---

## 13. Inventario de assets

- `assets/brand/`: `labucal-logo-96.png`, `labucal-logo-192.png`, `favicon.ico`, `favicon-32.png`,
  `apple-touch-icon.png`.
- `assets/decor/`: `decor-bridge.png`, `decor-implant.png`, `decor-partial.png`, `decor-veneers.png`
  (PNG transparentes decorativos).
- `assets/labucal-images/`:
  - Hero: `hero-lab-bg.jpg`, `prosthesis-part-01-upper.webp`, `prosthesis-part-02-lower.webp`.
  - Servicios: `service-protese.jpg`, `service-implantes.jpg`, `service-clareamento.jpg`,
    `service-alinhadores.jpg`, `service-cad.jpg`, `service-pt.jpg`, `service-ppr.jpg`,
    `service-metaloceramica.jpg`.
  - Galería: `lab-gallery-articulador.jpg`, `lab-gallery-modelo-arcada-01.jpg`,
    `lab-gallery-anteriores.jpg`, `lab-gallery-coroas-modelo.jpg`, `lab-gallery-emax-zirconia.jpg`,
    `lab-gallery-modelo-arcada-02.jpg`.

Todas las imágenes informativas llevan `alt` descriptivo; las decorativas, `alt="" aria-hidden="true"`.

---

## 14. Requisitos funcionales / checklist para rehacer

- [ ] B2B-only: en todo el copy dejar claro que se atiende a dentistas/clínicas, no pacientes, y que
      todo es sob prescripción del dentista.
- [ ] NAP idéntico en todas las apariciones (§2).
- [ ] Las 8 secciones con sus IDs y el copy del §6.
- [ ] Servicios: 4 principales + 4 extra con toggle.
- [ ] Formulario de contacto **con destino real** (corregir la deuda del §7).
- [ ] Mapa con anti scroll-capture.
- [ ] SEO: title/description/canonical/OG/Twitter + JSON-LD LocalBusiness + FAQPage + sitemap + robots.
- [ ] Chat Labucalzinho: Worker proxy + Gemini + fallback + WhatsApp contextual + system prompt (§10.1).
- [ ] Popup de reseñas hidratado desde `data/reviews.json`.
- [ ] Aviso de cookies LGPD + página `privacidade.html`.
- [ ] Automatización de reseñas (workflow + script) o equivalente.
- [ ] Accesibilidad: 1 solo H1, jerarquía de headings, `aria-label` en controles icónicos,
      `alt`/`aria-hidden` correctos, foco visible, `target=_blank rel=noopener` en links externos.
- [ ] Performance: imágenes con `width`/`height` y `loading="lazy"` fuera del hero; JS vanilla, sin
      librerías pesadas; sitio rápido como estático.
- [ ] Idioma `pt-BR`.

---

*Última actualización: 2026-05-28. Para detalles visuales (paleta, tipografía, animaciones) ver
`docs/EDITING_GUIDE.md` y `README.md`.*
