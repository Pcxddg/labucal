# Labucal — Site institucional (V2)

Sitio web estático para **Labucal**, laboratorio de prótesis dentaria **B2B** en Sorocaba/SP, Brasil.
Atiende dentistas y clínicas (no pacientes), sob prescripción del dentista.

- **Producción:** <https://labucal.pages.dev/> (Cloudflare Pages)
- **Repositorio:** <https://github.com/Pcxddg/labucal>

> **Versión vigente:** desde mayo/2026 el sitio es la **V2** ("sistema Precisão": serif Newsreader,
> fondo bone, acento azul, 4 escenas animadas por scroll). La versión anterior (**v1**) quedó archivada
> en la carpeta `old/` (solo local, gitignored; recuperable del historial de git).

No usa framework ni build step: **HTML + CSS externo + JS vanilla**, fácil de mantener y publicar.

## Estructura

```text
index.html            página principal (estructura + JSON-LD)
privacidade.html      Política de Privacidade (LGPD)
styles.css            todo el CSS (sistema "Precisão")
script.js             interactividad: render de datos, chat, formulario, reseñas, FAQ, cookie, scrollbar
scroll.js             animaciones por scroll: 4 escenas + dientes del hero + footer
sitemap.xml · robots.txt
data/reviews.json     auto-generado cada 6h (no editar a mano)
scripts/fetch-reviews.js   consulta Google Places y actualiza reviews.json + aggregateRating
.github/workflows/    deploy-pages.yml + update-reviews.yml
assets/brand|labucal-images|decor|assembly|quality
old/                  v1 archivada (solo local, gitignored)
docs/
```

- A diferencia de la v1 (un único `index.html` con CSS/JS embebidos), la V2 usa **CSS y JS externos**.
- El **contenido** (servicios, pasos, galería, FAQ, depoimentos) se renderiza desde arreglos de datos
  en `script.js` (`SERVICES`, `STEPS`, `GALLERY`, `FAQ`, `DEPO`).

## Secciones

`#top` (hero) · `#sobre` (3 pilares) · `#anatomia` (escena 1) · `#servicos` (4+4 con toggle) ·
`#processo` (escena 2, 5 etapas) · `#galeria` (6) · `#controle` (escena 3) · `#rede` (red +
depoimentos) · `#contato` (form + mapa) · `#faq` (7). No cambiar los IDs sin actualizar nav, menú
mobile y footer.

## Sistema de diseño "Precisão"

Variables CSS en `:root` de `styles.css`:

```css
--ink:        #0B1B3A;  /* navy — marca, títulos, secciones oscuras */
--paper:      #F4EFE6;  /* bone — fondo claro */
--text:       #15233F;
--accent:     #3E92C0;  /* azul cielo — acento */
--accent-deep:#2C7299;  /* azul profundo — botones/hover (contraste AA) */
--accent-soft:#7FBBDD;
--accent-tint:#DDEEF6;
```

- **Acento azul** (antes ámbar en el prototipo; ya migrado). Los botones usan `--accent-deep` por
  contraste AA.
- **Tipografía:** Newsreader (display serif) · Plus Jakarta Sans (UI) · Space Mono (rótulos).
- Hay dos paletas alternativas en el CSS (`data-palette="frio"` / `"grafite"`), activables a mano.
- Detalle completo de edición en [docs/EDITING_GUIDE.md](docs/EDITING_GUIDE.md).

## Escenas animadas (`scroll.js`)

Cuatro escenas se "montan" al scrollear (con `prefers-reduced-motion` respetado, y de-pin en mobile):

1. **Anatomia** — las capas (preparo → zircônia → cerâmica → glaze) se apilan hasta formar la coroa.
2. **Processo** — un token recorre las 5 etapas y las enciende.
3. **Controle** — un escaneo marca los 3 controles + sello "Aprovado".
4. **Rede** — la constelación de clínicas se dibuja sola.

Además, los **dientes del hero** se cierran con el scroll (ocultos en mobile) y el footer revela una
prótesis sutil.

## Funcionalidad (`script.js`)

- **Chat Labucalzinho** (IA): FAB → panel `role="dialog"`. Llama a un **Cloudflare Worker proxy** que
  reenvía a Google Gemini (la API key vive en el Worker). Fallback offline por keywords; inyecta botón
  de WhatsApp cuando cita el teléfono. El comportamiento se define en el `SYSTEM_PROMPT` dentro de
  `script.js`.
- **Formulario → WhatsApp:** valida y abre `wa.me` con los datos prellenados. *(Sin envío server-side
  por ahora — ver pendientes.)*
- **Reseñas:** hidrata el popup desde `/data/reviews.json`.
- **Barra de rolagem custom:** oculta la nativa de la ventana y dibuja un thumb azul overlay (no
  desplaza el contenido); fallback `<noscript>` restaura la nativa.
- FAQ acordeón, toggle de servicios, aviso de cookies (LGPD).

## Avaliações do Google (datos en vivo)

El popup y el `aggregateRating` se hidratan con datos reales del Google Business:

1. `.github/workflows/update-reviews.yml` corre **cada 6 h** (y manual).
2. Ejecuta `scripts/fetch-reviews.js`, que consulta la **Places API (New)** con el `GOOGLE_PLACE_ID`
   (ya configurado en el workflow) y el secret `GOOGLE_PLACES_API_KEY`.
3. Escribe `data/reviews.json`, **parchea el `aggregateRating` del `index.html`** y commitea ambos a
   `main` (con `[skip ci]`). El deploy se encadena.

Setup (una sola vez, ya hecho): proyecto en Google Cloud con **Places API (New)** habilitada + billing,
API key como secret `GOOGLE_PLACES_API_KEY`, y `GOOGLE_PLACE_ID` en el workflow. Costo < USD 1/mes.

## Publicación

El deploy es automático: cada push a `main` dispara `deploy-pages.yml` → Cloudflare Pages publica la
raíz en ~30 s.

```powershell
git add -A
git commit -m "Descripción corta del cambio"
git push
gh api repos/Pcxddg/labucal/pages   # opcional: estado
```

## Pendientes para publicación definitiva

- **Dominio** `labucal.com.br` → apuntar a Cloudflare y actualizar canonical/OG/sitemap.
- **Formulario:** decidir si se mantiene solo WhatsApp o se suma email automático / sistema de pedidos.
- **Chat:** mover el Worker de IA a una cuenta propia del laboratorio.
- **Reseñas:** clave de Google Places en cuenta del laboratorio.
- **Performance:** optimizar imágenes (srcset/redimensionado, PNG→WebP) y pesos de fuente.

## Documentación

- [Especificación funcional completa](docs/ESPECIFICACION-DEL-SITIO.md) — referencia para rehacer el sitio.
- [Guía de edición y diseño](docs/EDITING_GUIDE.md).
