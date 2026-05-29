# Guía de edición y diseño de Labucal (V2)

Cómo editar el sitio manteniendo el sistema "Precisão", las escenas animadas y las buenas prácticas.

> Aplica a la **V2** (sitio vigente en la raíz). La v1 archivada en `old/` ya no se usa.
> Visión funcional completa: [`ESPECIFICACION-DEL-SITIO.md`](ESPECIFICACION-DEL-SITIO.md).

## Principio general

Labucal tiene una estética de **laboratorio dental premium y técnico**:

- navy profundo + papel cor de osso + un acento **azul** de precisión;
- título en **serif** (Newsreader) con calor, cuerpo limpio (Plus Jakarta), rótulos en mono (Space Mono);
- **escenas que se montan al scrollear** (no solo texto);
- mucho espacio respirable; encuadre claro B2B (dentistas y clínicas, sob prescripción, no pacientes).

Cuando agregues una pieza, debe sentirse parte de ese sistema. Evitar landing genérica, iconos sueltos
o colores fuera de la paleta.

## Dónde vive cada cosa

| Querés cambiar… | Archivo |
|---|---|
| Estructura HTML, hero, encabezados de sección, contacto, FAQ markup | `index.html` |
| Textos de servicios, pasos, galería, FAQ, depoimentos | **`script.js`** (arreglos `SERVICES`, `STEPS`, `GALLERY`, `FAQ`, `DEPO`) |
| Colores, tipografía, espaciados, layout | `styles.css` (`:root` + reglas) |
| Animaciones por scroll (4 escenas, dientes del hero) | `scroll.js` |
| Comportamiento del chat (prompt, fallback) | `script.js` (`SYSTEM_PROMPT`, `FALLBACK`) |

## Editar texto y contenido

- **Hero, encabezados de sección (overline + H2), copy de Anatomia/Controle, contacto, FAQ visible:**
  están en `index.html`. Buscá el texto con `rg "..." index.html` y editá.
- **Servicios / pasos / galería / FAQ / depoimentos:** se renderizan desde `script.js`. Por ejemplo,
  para editar un servicio cambiá su objeto en `const SERVICES = [...]` (campos `t` título, `d`
  descripción, `img` imagen, `s` clave `data-service`). El FAQ visible y el JSON-LD `FAQPage` deben
  coincidir **verbatim** — si cambiás una pregunta, actualizá el array `FAQ` **y** el JSON-LD en
  `index.html`.
- **NAP / datos de contacto:** si cambia el teléfono, e-mail o dirección, actualizá TODAS las
  apariciones: contacto y footer (`index.html`), JSON-LD, **el `SYSTEM_PROMPT` y los textos de
  `FALLBACK`/`fallback()` del chat en `script.js`**, y el mapa.

```powershell
rg "99110|contato@|labucalprotese|Conego|7 dias corridos" .
```

## Paleta y tipografía

En `:root` de `styles.css`. El acento es **azul**:

```css
--ink:#0B1B3A; --paper:#F4EFE6; --text:#15233F;
--accent:#3E92C0; --accent-deep:#2C7299; --accent-soft:#7FBBDD; --accent-tint:#DDEEF6;
```

- Usá **`--accent`** para detalles/links y **`--accent-deep`** para botones y texto sobre fondo claro
  (pasa contraste WCAG AA; `--accent` solo no alcanza para texto/botones).
- Sobre fondo navy (`.on-ink`) usá `--accent-soft`.
- Evitá hardcodear el azul como `rgba(...)`; derivá del token cuando se pueda.
- **Paletas alternativas:** `:root[data-palette="frio"]` (teal) y `"grafite"` (gris/dorado). Se activan
  poniendo el atributo en `<html>`. No introducir paletas nuevas sin actualizar todo el sistema.
- **Tipografía:** se carga desde Google Fonts en el `<head>`. Si agregás un peso, sumalo a esa URL.

## Agregar o editar una sección

Patrón de una sección normal (clara o `on-ink` para oscura):

```html
<section class="section novo has-decor" id="novo-id">
  <!-- (opcional) piezas decorativas animadas -->
  <div class="wrap">
    <div class="section-head">
      <p class="overline">Etiqueta</p>
      <h2 class="title">Título de la sección.</h2>
    </div>
    <!-- contenido -->
  </div>
</section>
```

- `.wrap` es el contenedor centrado. `.section` da el padding vertical. `on-ink` = fondo navy.
- `has-decor` habilita las prótesis decorativas que se mueven con el scroll (ver abajo).
- Si la agregás al menú, actualizá nav desktop, menú mobile y footer.

### Piezas decorativas animadas (`.section-prosthesis`)

```html
<img class="section-prosthesis decor-right decor-high" data-scroll-decor="right"
     src="/assets/decor/decor-bridge.png" alt="" loading="lazy" aria-hidden="true" />
```

Clases: `decor-left`/`decor-right`, `decor-high`/`decor-low`, `decor-small`, `decor-slim`. Modos de
`data-scroll-decor`: `left`, `right`, `float`. Se ocultan en mobile. No poner sobre texto o formularios.

## Reemplazar imágenes

Todas las rutas son absolutas (`/assets/...`) porque el sitio sirve desde la raíz.

- **Servicios** (`/assets/labucal-images/service-*.jpg`) — escenas reales, JPG, ancho 1000-1400 px,
  < 250 KB. Los nombres se referencian en `SERVICES`/`SERVICES_EXTRA` (`script.js`).
- **Galería** (`/assets/labucal-images/lab-gallery-*.jpg`) — referenciadas en `GALLERY`.
- **Hero — prótesis animada** (`prosthesis-part-01-upper.webp` / `prosthesis-part-02-lower.webp`): PNG/
  WebP con transparencia y espacio alrededor para que no se corten al animar.
- **Escena Anatomia** (`/assets/assembly/assembly-layer-{preparo,zirconia,ceramica,glaze}.webp`): las 4
  capas que se apilan.
- **Escena Controle** (`/assets/quality/quality-crown.png`): la pieza inspeccionada.
- **Logo/favicons** en `/assets/brand/`.

> Optimizá antes de subir: las imágenes deberían servirse cerca de su tamaño mostrado (hoy hay deuda de
> imágenes sobredimensionadas — ver pendientes en la especificación).

## Ajustar las escenas por scroll (`scroll.js`)

Cada escena pinneada calcula su progreso con `pinProgress(track)` (el track es más alto que el
viewport). Para cambiar la velocidad/longitud de una escena, ajustá la altura del track en `styles.css`
(`.assembly-track`, `.proc-track`, `.ctrl-track`, en `vh`). Para los **dientes del hero** editá
`heroProsthesis()`:

```js
const raw = scrollY / Math.min(760, vh * 0.82);   // divisor mayor = más lento
```

- En mobile las escenas se **de-pinnean** (track `height:auto`, stage estático) y la pieza se muestra
  montada. Todo respeta `prefers-reduced-motion`.
- No uses animaciones CSS infinitas para estas piezas: la intención es que respondan al scroll.

## Chat "Labucalzinho"

- El comportamiento está en `script.js`: `SYSTEM_PROMPT` (contexto y reglas), `FALLBACK`/`fallback()`
  (respuestas offline por keyword) y `GEMINI_PROXY_URL` (el Worker que reenvía a Gemini).
- Si cambia info del laboratorio, actualizá el `SYSTEM_PROMPT` para que el bot no dé datos viejos.
- El Worker valida el origen: si se cambia el dominio, hay que actualizar el allowlist del Worker.

## Mapa y contacto

Mapa OpenStreetMap embebido (sin API key) + link a Google Maps para rutas. Si cambia la dirección,
actualizá el `bbox`/`marker` del iframe **y** la query del link de Google Maps.

## Accesibilidad

Mantener: 1 solo H1, jerarquía de headings, `aria-label` en controles icónicos, `alt=""` +
`aria-hidden` en decorativos y `alt` descriptivo en informativas, **skip-link**, foco visible
(`:focus-visible` — no quitar el `outline` sin reemplazo), el chat como diálogo (`role="dialog"`,
Escape, foco), contraste suficiente (botones en `--accent-deep`), `target="_blank" rel="noopener"` en
externos.

## Performance

Sitio rápido y estático. Preferir JPG para fotos y WebP/PNG transparente solo para piezas; `loading="lazy"`
fuera del hero; `width`/`height` en `<img>` para evitar CLS; sin librerías JS pesadas; no agregar fuentes
sin necesidad.

## Publicar cambios

```powershell
git add -A
git commit -m "Descripción del cambio"
git push   # dispara deploy-pages.yml → Cloudflare Pages (~30 s)
```

## Errores comunes

- Editar `data/reviews.json` a mano (es auto-generado cada 6 h por el workflow).
- Cambiar un servicio/pregunta solo en `index.html` o solo en `script.js` (deben coincidir; el FAQ
  además con el JSON-LD).
- Usar `--accent` (claro) en botones/texto → falla contraste; usar `--accent-deep`.
- Romper el encuadre B2B (el laboratorio no atiende pacientes directos).
- Cambiar ids de sección sin actualizar nav/menú/footer.
- Reintroducir el panel de "tweaks"/`postMessage` (era una herramienta del editor; no va en producción).
- Poner decoraciones encima de texto o formulario; quitar `aria-hidden` de decorativos.
