# Especificación funcional del sitio Labucal (V2)

Documento de referencia para **rehacer el sitio desde cero** en cualquier stack. Contiene la
información de negocio, contenido, estructura, integraciones y comportamiento.

> **Versión vigente:** desde mayo/2026 el sitio publicado es la **V2** ("sistema Precisão" — serif
> Newsreader, fondo bone, acento azul, 4 escenas animadas por scroll). La versión anterior (v1) quedó
> archivada en la carpeta `old/` (solo local, gitignored; recuperable del historial de git).
>
> **Alcance:** describe *qué* hace el sitio y *qué dice*. Para el detalle visual fino ver
> `docs/EDITING_GUIDE.md` y el `:root` de `styles.css`.

---

## 1. Resumen

- **Producto:** sitio web institucional de **Labucal**, laboratorio de prótesis dentaria.
- **Modelo de negocio:** **B2B exclusivo.** Atiende solo a dentistas autónomos (CPF) y clínicas
  (CNPJ). **No atiende pacientes directos.** Todos los servicios son **sob prescripción del dentista**.
- **Sede:** Sorocaba, SP, Brasil. Atiende todo el estado y demás capitales por logística rastreada.
- **Idioma:** portugués de Brasil (`lang="pt-BR"`).
- **Tipo:** sitio estático, **sin framework ni build step**. HTML + CSS externo + JS vanilla.
- **Concepto:** "Precisão" — cuenta la historia de la precisión con **4 escenas que se montan al
  scrollear**, en vez de solo texto.
- **Objetivo de conversión:** que el dentista/clínica pida un orçamento (formulario→WhatsApp, WhatsApp
  directo, teléfono o e-mail) o use el chat Labucalzinho.

---

## 2. Datos del negocio (NAP y oficiales)

Deben ser **idénticos** en todo el sitio (consistencia NAP para SEO local):

| Campo | Valor |
|---|---|
| Nombre / Razón social | Labucal |
| CNPJ | 12.720.218/0001-08 |
| Teléfono / WhatsApp | (15) 99110-7117 — internacional `+5515991107117` |
| E-mail | contato@labucal.com.br |
| Dirección | Rua Cônego Januário Barbosa, 225 · Jardim Vergueiro · Sorocaba/SP · CEP 18030-075 |
| País | Brasil (BR) · Coordenadas: lat -23.5084267, lng -47.4584548 |
| Horario | Segunda a sexta, 08h às 18h |
| Facebook | https://www.facebook.com/labucalprotese ("Labucal Prótese Odontológica") |
| Instagram | https://www.instagram.com/labucalprotese/ (@labucalprotese) |

**Place ID de Google** (Places API): `ChIJ6f3VvLmLxZQRdLE0dLMATaI`

Al cambiar un dato, actualizar TODAS sus apariciones: contacto, footer, mapa (iframe + link Google
Maps), JSON-LD, **el `SYSTEM_PROMPT` del chat y los textos de `FALLBACK`/`fallback()` en `script.js`**.

---

## 3. Hosting, deploy y dominios

- **Hosting:** Cloudflare Pages → `https://labucal.pages.dev/` (la V2 sirve desde la **raíz**).
- **Dominio de marca:** `labucal.com.br` — lo poseen, aún no apuntado. Al migrar, actualizar
  `canonical`, `og:url`, `og:image`/`twitter:image`, el `"url"` del JSON-LD y `sitemap.xml`.
- **Repositorio:** https://github.com/Pcxddg/labucal (rama `main`).
- **Deploy automático:** `.github/workflows/deploy-pages.yml` — corre en push a `main`, al completar el
  workflow de reseñas, o manual. Usa `cloudflare/wrangler-action@v3` con `pages deploy .`.
- **Secrets de GitHub:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (deploy) ·
  `GOOGLE_PLACES_API_KEY` (reseñas).
- **`old/`** (v1 archivada): gitignored → no se despliega ni se sube; existe solo en local.

---

## 4. Estructura de archivos

```
index.html            ← página principal (estructura HTML + JSON-LD)
privacidade.html      ← Política de Privacidade (LGPD)
styles.css            ← TODO el CSS (sistema "Precisão", ~1000 líneas)
script.js             ← interactividad: data render, chat, form, reseñas, FAQ, cookie, scrollbar custom
scroll.js             ← animaciones por scroll: 4 escenas + dientes del hero + footer
sitemap.xml · robots.txt
data/reviews.json     ← AUTO-GENERADO cada 6h (no editar a mano)
scripts/fetch-reviews.js   ← consulta Google Places y escribe reviews.json + parchea aggregateRating
.github/workflows/    ← deploy-pages.yml + update-reviews.yml
assets/brand/         ← logo, favicons
assets/labucal-images/ ← hero, servicios, galería, prótesis del hero
assets/decor/         ← 4 prótesis decorativas PNG (animadas por scroll)
assets/assembly/      ← capas de la escena "Anatomia" (webp)
assets/quality/       ← pieza de la escena "Controle"
docs/                 ← documentación
old/                  ← v1 archivada (solo local, gitignored)
```

> A diferencia de la v1 (un único `index.html` con CSS y JS embebidos), la V2 separa CSS y JS en
> archivos externos (`styles.css`, `script.js`, `scroll.js`).

---

## 5. Páginas y navegación

### Páginas
1. **`index.html`** — home (todo el contenido + escenas).
2. **`privacidade.html`** — política LGPD. Enlazada desde footer y aviso de cookies.

### Navegación (header sticky)
Links: **Serviços** (`#servicos`), **Processo** (`#processo`), **Galeria** (`#galeria`),
**Contato** (`#contato`) · teléfono visible · CTA **"Pedir orçamento"** → `#contato`.
Menú mobile (hamburguesa, ≤920px) agrega **Rede** (`#rede`).

### Secciones (en orden) y sus IDs
`#top` (hero) · `#sobre` (3 pilares) · `#anatomia` (escena 1) · `#servicos` (4+4) · `#processo`
(escena 2, 5 etapas) · `#galeria` (6) · `#controle` (escena 3) · `#rede` (red + depoimentos) ·
`#contato` (form + mapa) · `#faq` (7). No cambiar los IDs sin actualizar nav, menú mobile y footer.

### Footer
Logo + tagline + sociales · columna "Navegação" (Serviços/Processo/Galeria/Rede/Perguntas frequentes)
· columna "Contato" (NAP) · barra inferior: `© 2026 Labucal`, link privacidade, `CNPJ 12.720.218/0001-08`.

---

## 6. Sistema de diseño "Precisão" (resumen)

Definido en `:root` de `styles.css`. *(Detalle visual completo en `EDITING_GUIDE.md`.)*

| Token | HEX | Rol |
|---|---|---|
| `--ink` | **#0B1B3A** | navy — marca, títulos, secciones oscuras |
| `--paper` | **#F4EFE6** | bone — fondo claro |
| `--text` | **#15233F** | texto |
| `--accent` | **#3E92C0** | azul cielo — acento (constelación, detalles, links) |
| `--accent-deep` | **#2C7299** | azul profundo — **botones**, hover, checks (cumple contraste AA) |
| `--accent-soft` | **#7FBBDD** | azul claro — sobre fondo oscuro |
| `--accent-tint` | **#DDEEF6** | azul muy claro — tints |

- ⚠️ El acento es **azul** (antes fue ámbar `#C0772C` en el prototipo; ya migrado). Los botones usan
  `--accent-deep` para pasar contraste AA (texto blanco).
- **Tipografía:** Newsreader (display serif, títulos) · Plus Jakarta Sans (UI/cuerpo) · Space Mono
  (rótulos/labels técnicos). Cargadas de Google Fonts.
- **Paletas alternativas:** `styles.css` define dos temas extra activables con el atributo
  `data-palette` en `<html>`: `frio` (teal, "Tecido") y `grafite` (gris/dorado, "Ardósia"). El panel
  visual que las cambiaba era una herramienta del editor y **fue removido**; siguen activables a mano.

---

## 7. Contenido por sección (copy)

### 7.1 Hero (`#top`)
- Overline: **Laboratório de próteses dentárias** · H1: **Sua próxima prótese, *pronta no prazo.***
- Lead: *O laboratório que devolve a peça quando você combinou — sem retrabalho, sem surpresa.
  Atendimento direto com o técnico responsável.*
- CTAs: **Pedir orçamento** (→ `#contato`) · **Conhecer o processo** (→ `#processo`).
- Trust badges: **7** dias corridos · coroa unitária | **24h** retorno do orçamento | **B2B** dentistas e clínicas.
- Visual: prótesis animada (2 partes que se cierran) + constelación + badge "Conferência dimensional".

### 7.2 Sobre (`#sobre`)
- Overline **Sobre o Labucal** · H2 **Precisão técnica, entrega no prazo, parceria de longo prazo.**
- 3 pilares: **Precisão milimétrica** (*Menos retrabalho em cadeira…*) · **Prazos cumpridos** (*O prazo
  combinado é o prazo entregue…*) · **Acompanhamento próximo** (*Sem central de atendimento. Você fala
  direto com o técnico responsável pelo seu caso.*)

### 7.3 Anatomia (`#anatomia`) — escena 1
- Overline **Anatomia de uma peça** · H2 **Camada por camada, até o encaixe perfeito.**
- Lead: *Cada prótese é construída em etapas conferidas — do preparo à caracterização final.*
- Leyenda (4 capas que se montan): **01 Preparo & modelo** · **02 Núcleo em zircônia** · **03 Cerâmica
  de cobertura** · **04 Caracterização & glaze**. Imágenes: `assets/assembly/assembly-layer-*.webp`.

### 7.4 Serviços (`#servicos`)
- Overline **O que fazemos** · H2 **Nossos serviços.** — 4 principales + toggle "Ver mais serviços" →
  4 extra. Render desde `SERVICES`/`SERVICES_EXTRA` en `script.js`. Cada card: imagen + título +
  descripción + CTA "Pedir orçamento" con `data-service` (prefilla el formulario).

| `data-service` | Título |
|---|---|
| protese | Prótese Dentária |
| implantes | Implantes Dentários |
| clareamento | Clareamento Dental |
| alinhadores | Alinhadores Transparentes |
| cad | CAD |
| pt | PT — Prótese Total |
| ppr | PPR — Prótese Parcial Removível |
| metaloceramica | Metalocerâmica |

### 7.5 Processo (`#processo`) — escena 2
- Overline **Como trabalhamos** · H2 **Um processo claro, do pedido à entrega.**
- 5 etapas (token que recorre el riel al scrollear): **Solicitação · Análise técnica · Modelagem ·
  Controle · Entrega.**

### 7.6 Galeria (`#galeria`)
- Overline **Galeria** · H2 **Trabalhos recentes.** — 6 imágenes con "registro NN" y leyenda técnica
  (articulador, arcada, anteriores, coroas, E-max/zircônia, arcada). Render desde `GALLERY`.

### 7.7 Controle (`#controle`) — escena 3
- Overline **Controle** · H2 **Nada sai sem passar pela conferência.**
- Lead: *Cada peça é verificada em três frentes antes de ser embalada.*
- 3 checks (se marcan al scrollear + sello "Aprovado"): **Conferência dimensional** (medidas e adaptação)
  · **Conferência estética** (cor, forma e textura) · **Conferência funcional** (oclusão e encaixe).

### 7.8 Rede (`#rede`) — escena 4
- Overline **Rede** · H2 **Uma rede de profissionais que confiam no nosso trabalho.**
- Mapa/constelación de clínicas (SVG que se dibuja solo) + 3 depoimentos (Dra. Camila Andrade · Dr.
  Rafael Moreira · Dra. Beatriz Salles), **marcados explícitamente como marketing, no reseñas de
  Google**.

### 7.9 Contato (`#contato`)
- Overline **Contato** · H2 **Vamos conversar sobre seu próximo trabalho?**
- Lista de contacto (Telefone/WhatsApp, E-mail, Instagram, Facebook, Endereço→Google Maps, Horário) +
  formulario (§9.2) + mapa OpenStreetMap con overlay anti scroll-capture.

### 7.10 FAQ (`#faq`)
- Overline **FAQ** · H2 **Perguntas frequentes.** — Acordeón de 7 ítems (render desde `FAQ`). Texto
  **verbatim** del JSON-LD `FAQPage`. Cubren: serviços, prazos (**7 dias corridos** para coroa
  unitária; 15–25 dias reabilitações), atendimento a otras ciudades, orçamento, materiais, entrega,
  visita al laboratorio.

---

## 8. Las escenas animadas por scroll (`scroll.js`)

`scroll.js` maneja, con un loop `requestAnimationFrame` sobre el scroll:

1. **Hero — dientes:** la prótesis se "cierra" según el scroll (`heroProsthesis`). En **mobile el visual
   del hero se oculta** (`.hero-visual { display:none }` ≤920px) — queda solo el texto.
2. **Anatomia (escena 1):** las 4 capas caen y se apilan hasta formar la coroa, ancladas (pinned)
   mientras se scrollea (`pinProgress`).
3. **Processo (escena 2):** un token recorre las 5 etapas; cada una se enciende al pasar.
4. **Controle (escena 3):** un escaneo recorre la pieza y marca los 3 controles + sello "Aprovado".
5. **Rede (escena 4):** la constelación de clínicas se dibuja sola (IntersectionObserver).
6. **Footer:** revelación sutil de una prótesis.

**Responsividad de las escenas:** en mobile/tablet las escenas pinneadas se **de-pinnean** (track
`height:auto`, stage estático) y se apilan; Anatomia muestra la pieza ya montada. Todo respeta
`prefers-reduced-motion` (salta al estado final sin animar).

---

## 9. Funcionalidad (`script.js`)

### 9.1 Chat "Labucalzinho" (IA)
- Botón flotante (FAB) → panel (`role="dialog"`, `aria-modal`, botón cerrar, **Escape**, foco al input).
- **Backend:** `POST` a un **Cloudflare Worker proxy** (`https://labucal-gemini-proxy.keanukeanom.workers.dev`)
  que reenvía a Google Gemini. La API key vive en el Worker (nunca en el cliente). El Worker **valida el
  origen** (solo acepta el dominio del sitio).
- **Historial** limitado a 12 turnos. **Contexto dinámico:** lee `/data/reviews.json` y agrega el rating
  real al prompt.
- **Fallback offline** por keywords (prazo/orçamento/agendar/materiais/default) si el Worker falla.
- **WhatsApp contextual:** si la respuesta contiene `(15) 99110-7117`, inyecta un botón "Abrir no
  WhatsApp" con la última consulta. Chips iniciales: orçamento, prazos, materiais, agendar, WhatsApp.
- El **`SYSTEM_PROMPT`** (en `script.js`) define al asistente (contexto del lab, B2B, servicios,
  materiais, prazos, reglas de respuesta). Mantenerlo sincronizado con el NAP/§7.

### 9.2 Formulario de contacto → WhatsApp
- Campos: **Nome** (req), **Clínica** (opc), **E-mail ou WhatsApp** (req, `inputmode=email`),
  **Mensagem** (opc).
- Al enviar: valida nome+contato, arma un mensaje y **abre WhatsApp** (`wa.me/5515991107117`) con los
  datos prellenados; muestra estado "Enviado ✓".
- ⚠️ **No hay envío server-side ni email automático** — depende de WhatsApp + JS. (Pendiente de §16.)

### 9.3 Otros
- **Reseñas:** hidrata el popup desde `/data/reviews.json` (estrellas, rating, conteo, 1 reseña real,
  link al perfil). Fallback estático si no existe.
- **FAQ acordeón**, **toggle "ver mais serviços"**, **aviso de cookies** (`localStorage`).
- **Barra de rolagem custom (overlay):** oculta la barra nativa de la ventana (sin reservar espacio) y
  dibuja un thumb azul que refleja el scroll, arrastrable, auto-hide; respeta touch y reduced-motion;
  fallback `<noscript>` que restaura la barra nativa. La barra del chat (`.chat-body`) tiene su propia
  barra fina.

---

## 10. Componentes flotantes
- **Chat Labucalzinho** (FAB + panel) — §9.1.
- **Popup de reseñas do Google** — abajo a la izquierda, aparece al ~45% de scroll; `sessionStorage`
  para descartar; oculto en ≤520px.
- **Aviso de cookies (LGPD)** — aparece ~700ms en la primera visita; sube por encima del FAB en mobile.

---

## 11. SEO y datos estructurados
- `<title>`: **Laboratório de Prótese Dentária em Sorocaba/SP | Labucal** · meta description (~150c).
- `canonical`, OG y Twitter → raíz del dominio (correcto al estar la V2 en la raíz).
- **JSON-LD:** `MedicalBusiness`+`ProfessionalService` (NAP, geo, horarios, areaServed, sameAs,
  `aggregateRating`) y `FAQPage` (las 7 preguntas verbatim).
- `sitemap.xml` (/ y /privacidade.html) · `robots.txt` (Disallow /scripts/ /.github/ /data/ /docs/).
- a11y: 1 H1, jerarquía de headings, landmarks, `skip-link`, `:focus-visible` global, `alt` en imágenes,
  `aria-hidden` en decorativos, `prefers-reduced-motion`.

---

## 12. Automatización de reseñas
1. `update-reviews.yml` corre **cada 6h** + manual.
2. `scripts/fetch-reviews.js` consulta la **Places API (New)** con `PLACE_ID` + `GOOGLE_PLACES_API_KEY`,
   escribe `data/reviews.json` **y parchea el `aggregateRating`** (ratingValue/reviewCount) del
   `index.html`.
3. Commitea `data/reviews.json` + `index.html` (con `[skip ci]`); el deploy se encadena.

**Estructura de `data/reviews.json`:** `{ updatedAt, name, rating, userRatingCount, googleMapsUri,
reviews:[{author, authorPhoto, rating, text, relativeTime, publishTime}] }`. Costo < USD 1/mes.

---

## 13. Dependencias externas

| Servicio | Uso | Notas |
|---|---|---|
| Cloudflare Pages | Hosting + deploy | secrets de deploy |
| Cloudflare Worker (Gemini proxy) | Backend del chat | hoy en cuenta personal de la agencia; mover a cuenta del cliente |
| Google Gemini API | IA del chat | key dentro del Worker |
| Google Places API (New) | Reseñas en vivo | `GOOGLE_PLACES_API_KEY`; requiere billing |
| Google Fonts | Newsreader + Plus Jakarta + Space Mono | recurso pesado (ver §16) |
| OpenStreetMap | Mapa embebido | sin API key |

**Sin** Google Analytics, píxeles ni cookies de rastreo (solo esenciales — coherente con LGPD).

---

## 14. Inventario de assets
- `assets/brand/`: `labucal-logo-96.png`, `labucal-logo-192.png`, `favicon.ico`, `favicon-32.png`,
  `apple-touch-icon.png`.
- `assets/labucal-images/`: hero (`hero-lab-bg.jpg`, `prosthesis-part-01-upper.webp`,
  `prosthesis-part-02-lower.webp`), servicios (`service-*.jpg`), galería (`lab-gallery-*.jpg`).
- `assets/decor/`: `decor-bridge/implant/partial/veneers.png` (decorativos animados por scroll).
- `assets/assembly/`: `assembly-layer-preparo/zirconia/ceramica/glaze.webp` (escena Anatomia).
- `assets/quality/`: `quality-crown.png` (escena Controle).

---

## 15. Responsividad y accesibilidad (estado)
- **Sin overflow horizontal** 320→1280. Grids colapsan a 1 columna; footer apila.
- **Hero mobile:** sin dientes (solo texto). **Escenas:** de-pinnean y se apilan en mobile/tablet.
- **Cookie** no tapa el FAB en mobile (sube por encima).
- a11y: skip-link, foco visible, chat como diálogo (role/aria/Escape/foco), botón primario con contraste
  AA, `prefers-reduced-motion` en todas las animaciones.

---

## 16. Estado actual y pendientes

### Decisiones / accesos del cliente (para publicar definitivo)
1. **Dominio** `labucal.com.br` → apuntar a Cloudflare y actualizar las URLs absolutas (§3, §11).
2. **Destino del formulario** — hoy WhatsApp; decidir si se suma email automático / sistema de pedidos.
3. **Chat:** mover el Worker de IA a una cuenta propia del laboratorio.
4. **Reseñas:** clave de la Google Places API en cuenta del laboratorio.
5. **Fotos propias** (opcional) — reemplazar imágenes por fotos propias en alta resolución.

### Deuda técnica abierta (mejoras)
- **Performance de imágenes:** varias se sirven 2-4× más grandes que su tamaño mostrado (prótesis, capas
  de assembly) — falta `srcset`/redimensionado; los PNG decorativos (80-186KB) deberían ser WebP;
  recortar pesos de fuentes de Google.
- **Conversión:** el formulario depende 100% de WhatsApp+JS (sin respaldo server-side).
- **a11y:** el chat tiene Escape/role/foco pero falta *focus-trap* completo (atrapar Tab); el popup de
  reseñas puede tapar contenido en desktop.
- **Breakpoints:** el de-pin de escenas (860/900px) y el menú hamburguesa (920px) no están del todo
  alineados.

---

*Última actualización: 2026-05-29. Sitio vigente = V2 en la raíz. v1 archivada en `old/` (local).*
