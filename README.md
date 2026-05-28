# Labucal Website

Sitio web estatico para **Labucal**, laboratorio de protesis dentaria en Sorocaba, Brasil.

Produccion:

- Sitio: <https://pcxddg.github.io/labucal/>
- Repositorio: <https://github.com/Pcxddg/labucal>

Este proyecto no usa framework ni build step. Todo esta hecho con HTML, CSS y JavaScript vanilla para que sea facil de mantener y publicar en GitHub Pages.

## Estructura

```text
.
|-- index.html
|-- privacidade.html
|-- sitemap.xml
|-- robots.txt
|-- .github/
|   `-- workflows/
|       |-- deploy-pages.yml
|       `-- update-reviews.yml
|-- scripts/
|   `-- fetch-reviews.js
|-- data/
|   `-- reviews.json   (auto-generado, no editar a mano)
|-- assets/
|   |-- brand/
|   |-- decor/
|   `-- labucal-images/
`-- docs/
```

### Archivos principales

- `index.html`: archivo principal del sitio. Es el unico HTML del sitio principal (antes habia un `Labucal.html` duplicado que se eliminó para evitar tener dos fuentes de verdad).
- `privacidade.html`: pagina de Politica de Privacidade en cumplimiento de la LGPD. Enlazada desde el footer.
- `sitemap.xml` y `robots.txt`: mapa de URLs y reglas de crawl para buscadores.
- `.github/workflows/deploy-pages.yml`: deploya el sitio a Cloudflare Pages en cada push a main y despues de cada update del bot de reviews.
- `.github/workflows/update-reviews.yml`: workflow que cada 6 h consulta Google Places y actualiza `data/reviews.json`. Ver seccion "Avaliacoes do Google" mas abajo.
- `scripts/fetch-reviews.js`: script Node ejecutado por el workflow de reviews.
- `data/reviews.json`: datos de avaliacoes del Google (rating, conteo, link al perfil, hasta 5 reviews con texto). **Auto-generado por el workflow — no editar a mano**. El sitio lo lee en el navegador para hidratar el popup de avaliacoes.
- `assets/brand/`: logo optimizado, favicon y apple touch icon.
- `assets/decor/`: protesis transparentes decorativas usadas en animaciones por scroll.
- `assets/labucal-images/`: fotos, fondo del hero, protesis principales y galeria.
- `.gitignore`: ignora el logo fuente pesado original, carpetas temporales y `assets/incoming/`.

## Identidad visual

La identidad se define en variables CSS dentro de `:root`:

```css
--ink-900: #0A1B3D;
--ink-800: #142A5C;
--ink-600: #2E4A8C;
--ink-300: #7BA7E1;
--bone: #F8F7F4;
--white: #FFFFFF;
--text: #1A1A1A;
--muted: #6B6B6B;
```

Buenas practicas:

- Mantener el azul oscuro como color principal.
- Usar `--ink-300` como acento, no como color dominante.
- Conservar el contraste alto en textos sobre fondos oscuros.
- Evitar introducir paletas nuevas sin actualizar todo el sistema visual.
- Evitar degradados decorativos fuertes. El sitio ya usa profundidad por fotografia, protesis y sombras suaves.

## Secciones

El HTML esta organizado por comentarios grandes:

```html
<!-- ============ NAV ============ -->
<!-- ============ HERO ============ -->
<!-- ============ VALUE PROP ============ -->
<!-- ============ SERVICES ============ -->
<!-- ============ PROCESS ============ -->
<!-- ============ GALLERY ============ -->
<!-- ============ NETWORK / CONSTELLATION ============ -->
<!-- ============ CONTACT ============ -->
<!-- ============ FAQ ============ -->
<!-- ============ FOOTER ============ -->
<!-- ============ LABUCALZINHO ============ -->
```

Cada seccion tiene un `id` usado por la navegacion. No cambiar esos ids sin actualizar tambien los enlaces del nav, menu mobile y footer:

- `#servicos`
- `#processo`
- `#galeria`
- `#rede`
- `#contato`
- `#faq`

## Assets

### Logo y favicon

La fuente pesada original del logo esta ignorada por Git:

```text
522632165_18321130222238761_7326127144279536769_n_upscayl_16x_upscayl-standard-4x-Photoroom.png
```

No usar ese archivo directamente en el HTML. Usar las versiones optimizadas:

- `assets/brand/labucal-logo-96.png`: logo en header y footer.
- `assets/brand/labucal-logo-192.png`: version grande.
- `assets/brand/favicon.ico`: favicon principal.
- `assets/brand/favicon-32.png`: favicon PNG.
- `assets/brand/apple-touch-icon.png`: icono para iOS.

### Imagenes principales

- `assets/labucal-images/hero-lab-bg.jpg`: fondo fotografico del hero, con overlay azul.
- `assets/labucal-images/prosthesis-part-01-upper.webp`: parte superior de la protesis animada del hero.
- `assets/labucal-images/prosthesis-part-02-lower.webp`: parte inferior de la protesis animada del hero.
- `assets/labucal-images/gallery-01.jpg` a `gallery-06.jpg`: galeria.
- `assets/labucal-images/service-*.jpg`: miniaturas de servicios.

### Decoraciones animadas

Las protesis decorativas por seccion viven en:

```text
assets/decor/
|-- decor-bridge.png
|-- decor-implant.png
|-- decor-partial.png
`-- decor-veneers.png
```

Son PNG con transparencia y se mueven con el scroll. Deben mantenerse livianas. Como regla practica, intentar que cada decorativo pese menos de 250 KB.

## Animaciones

El sitio usa tres tipos de animacion:

1. **Reveal on scroll**: elementos con clase `.reveal`.
2. **Hero prosthesis assembly**: protesis del hero en dos capas que se arma al bajar.
3. **Section prosthesis decor**: protesis decorativas que se desplazan, rotan y escalan con el scroll.

### Reveal

Para hacer que un bloque entre suavemente:

```html
<div class="section-head reveal">
  ...
</div>
```

El JavaScript observa `.reveal` con `IntersectionObserver` y agrega `.in` cuando entra en pantalla.

### Protesis del hero

Markup:

```html
<div class="prosthesis assembly" id="prosthesisAssembly">
  <img class="prosthesis-part upper" src="assets/labucal-images/prosthesis-part-01-upper.webp" alt="..." />
  <img class="prosthesis-part lower" src="assets/labucal-images/prosthesis-part-02-lower.webp" alt="..." />
</div>
```

El movimiento se controla con variables CSS:

- `--prosthesis-upper-y`
- `--prosthesis-lower-y`
- `--prosthesis-scale`

El JS calcula esas variables a partir de `window.scrollY`. Para cambiar la velocidad del cierre, editar esta parte:

```js
const raw = window.scrollY / Math.min(760, vh * 0.82);
```

Un divisor mayor hace la animacion mas lenta. Un divisor menor la hace mas rapida.

### Decoracion por seccion

Para agregar una protesis animada a una seccion:

```html
<section class="dark pad with-prosthesis" id="servicos" aria-labelledby="serv-h">
  <img
    class="section-prosthesis decor-left decor-low"
    data-scroll-decor="left"
    src="assets/decor/decor-partial.png"
    alt=""
    loading="lazy"
    aria-hidden="true"
  />
  ...
</section>
```

Clases disponibles:

- `with-prosthesis`: habilita decoracion con overflow controlado.
- `section-prosthesis`: base visual y animable.
- `decor-left`: posiciona desde la izquierda.
- `decor-right`: posiciona desde la derecha.
- `decor-high`: posicion alta.
- `decor-low`: posicion baja.
- `decor-slim`: pieza estrecha.
- `decor-small`: pieza secundaria mas discreta.

Valores de `data-scroll-decor`:

- `left`: entra y se mueve desde la izquierda.
- `right`: entra y se mueve desde la derecha.
- `float`: movimiento flotante con seno, util para piezas pequenas.

Evitar poner decoraciones encima de formularios, botones o texto principal. Siempre revisar en desktop y mobile.

## Contacto y mapa

Datos actuales:

- Telefono / WhatsApp: `(15) 99110-7117`
- E-mail: `contato@labucal.com.br`
- Facebook: <https://www.facebook.com/labucalprotese>
- Instagram: <https://www.instagram.com/labucalprotese/>
- Direccion: `Rua Conego Januario Barbosa, 225, Jardim Vergueiro, Sorocaba, Brazil`

El mapa usa OpenStreetMap embebido, sin API key:

```html
https://www.openstreetmap.org/export/embed.html?...&marker=-23.5084267%2C-47.4584548
```

Tambien hay un enlace a Google Maps para abrir ruta. Si cambia la direccion, actualizar:

- Texto visible en contacto.
- Texto visible en footer.
- URL del iframe OpenStreetMap.
- URL de Google Maps.

## Avaliacoes do Google (live data)

El popup de avaliacoes en la esquina inferior izquierda se hidrata con datos reales del Google Business del laboratorio. El flujo:

1. Un workflow `.github/workflows/update-reviews.yml` corre cada 6 horas.
2. Ejecuta `scripts/fetch-reviews.js` que consulta la Places API (New) de Google.
3. Graba `data/reviews.json` y lo commitea al `main` (solo si hubo cambios reales).
4. El JS del sitio en el navegador hace `fetch('data/reviews.json')` al cargar la pagina y actualiza estrellas, rating y enlace del popup. Si el archivo todavia no existe, el popup queda con el conteudo estatico.

### Setup inicial (una sola vez)

1. **Crear un proyecto en Google Cloud Console**: <https://console.cloud.google.com/>
2. **Habilitar Places API (New)** en el proyecto.
3. **Crear una API key**: APIs & Services > Credentials > Create Credentials > API key. Restringir la key a "Places API (New)" en API restrictions.
4. **Activar facturacion** en el proyecto (sin esto la API no responde). El plan free incluye USD 200 de credito mensual, mas que suficiente para 4 llamadas al dia.
5. **Obtener el Place ID** del Labucal en Google Maps: <https://developers.google.com/maps/documentation/javascript/place-id#find-id>. Buscar "Labucal Sorocaba" y copiar el ID (empieza con `ChIJ...`).
6. **Editar `.github/workflows/update-reviews.yml`** y reemplazar `REPLACE_WITH_PLACE_ID` por el Place ID real.
7. **Crear el Secret en GitHub**: en <https://github.com/Pcxddg/labucal/settings/secrets/actions> > New repository secret > nombre `GOOGLE_PLACES_API_KEY` > valor la API key del paso 3.
8. **Ejecutar el workflow manualmente la primera vez**: en la pestana Actions del repo > "Update Google Reviews" > Run workflow. Eso genera `data/reviews.json` por primera vez.

A partir de ahi, el workflow corre solo cada 6 horas. Cada vez que un cliente deja una resena nueva en Google, en maximo 6 horas el sitio refleja el cambio.

### Estructura del JSON

```json
{
  "updatedAt": "2026-05-24T15:00:00.000Z",
  "name": "Labucal",
  "rating": 4.9,
  "userRatingCount": 50,
  "googleMapsUri": "https://maps.google.com/?cid=...",
  "reviews": [ { "author": "...", "rating": 5, "text": "...", "relativeTime": "..." } ]
}
```

### Costos

Con 4 llamadas al dia (~120 al mes) usando el FieldMask actual (Pro + Atmosphere por incluir `reviews`), el costo mensual estimado es menor a USD 1, totalmente absorbido por el credito gratuito de USD 200 que Google da cada mes.

## Componentes flotantes

El sitio tiene tres elementos UI fijos que viven sobre el contenido principal. Todos respetan la paleta y la tipografia del sitio.

### Aviso de cookies

- HTML: `<div class="cookie-notice" id="cookieNotice">` antes del `<script>` final.
- Posicion: esquina inferior izquierda en desktop, barra full-width en mobile.
- Aparece 700 ms despues de cargar la pagina, solo en la primera visita.
- Al hacer clic en "Entendi" persiste `localStorage.labucal_cookies_accepted = '1'` y no vuelve a aparecer.
- Para resetear durante pruebas: DevTools > Application > Local Storage > borrar la clave.

### Popup de avaliacoes do Google

- HTML: `<div class="gr-popup" id="grPopup">` antes del aviso de cookies.
- Posicion: misma esquina inferior izquierda. Cuando el aviso de cookies esta visible sube automaticamente via regla CSS `body:has(.cookie-notice.in) .gr-popup { bottom: 220px; }`.
- Trigger: aparece cuando el scroll de la pagina pasa el 45 % del documento.
- Persistencia: `sessionStorage.labucal_reviews_dismissed = '1'` al cerrar o clicar el CTA. Vuelve a aparecer en una pestana nueva.
- Datos: hidratados desde `data/reviews.json` (ver seccion "Avaliacoes do Google" arriba). Si el JSON aun no existe, el popup queda con el conteudo estatico (5 estrellas, texto generico).
- Estrellas: soportan medias estrellas. Un rating 4,5 muestra 4 llenas + 1 mitad; un 4,8 redondea a 5 llenas. La logica esta en el IIFE `reviewsPopup` dentro del bloque `hydrate`.
- Para resetear durante pruebas: DevTools > Application > Session Storage > borrar la clave.

### Map overlay (anti scroll-capture)

- HTML: `<div class="map-overlay" id="mapOverlay">` entre el `<iframe>` del mapa y el `.map-info`.
- Proposito: impedir que la rueda del mouse haga zoom en el mapa cuando el usuario esta rodando la pagina y el cursor pasa por encima del iframe.
- Comportamiento: la capa esta encima del iframe e intercepta los eventos de puntero por defecto. Al recibir un clic se anade la clase `.inactive` que la convierte en transparente para eventos (`pointer-events: none`), liberando el mapa. Cuando el cursor sale del `.map-card` (mouseleave) se restaura.
- Hint: el pseudo-elemento `::after` muestra "Clique no mapa para interagir" arriba a la izquierda al hacer hover, y siempre visible en touch (`@media (hover: none)`).
- No afecta al link "Abrir rota no Google Maps" porque `.map-info` queda por encima en el stacking.

## Publicacion

El sitio se publica desde la rama `main` con GitHub Pages.

Flujo recomendado:

```powershell
git status -sb
git add index.html assets docs README.md
git commit -m "Descripcion corta del cambio"
git push
```

Despues de hacer push, revisar:

```powershell
gh api repos/Pcxddg/labucal/pages
```

El estado debe terminar en:

```json
"status": "built"
```

## Checklist antes de publicar

- Solo se trabaja en `index.html` (no hay duplicado que sincronizar).
- No hay capturas temporales en `assets/`.
- No se subio el logo fuente pesado original.
- Todas las rutas `src="assets/..."`, `href="assets/..."` y `url("assets/...")` existen.
- El sitio carga en desktop.
- En mobile no aparecen decoraciones que tapen contenido.
- Los enlaces externos abren en una nueva pestana cuando salen del sitio.
- El mapa sigue respondiendo.

## Validacion rapida de rutas

En PowerShell:

```powershell
$html = Get-Content -Raw -Path "index.html"
$refs = @()
$refs += [regex]::Matches($html, 'href="(assets/[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$refs += [regex]::Matches($html, 'src="(assets/[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$refs += [regex]::Matches($html, 'url\("(assets/[^"]+)"\)') | ForEach-Object { $_.Groups[1].Value }
$refs | Sort-Object -Unique | ForEach-Object {
  [pscustomobject]@{ Path = $_; Exists = Test-Path $_ }
} | Format-Table -AutoSize
```

## Buenas practicas de mantenimiento

- Mantener cambios pequenos y revisables.
- No mezclar redisenos visuales con cambios de contenido.
- Optimizar imagenes antes de agregarlas al repo.
- Usar `loading="lazy"` en imagenes que no esten en el primer viewport.
- Mantener `alt="" aria-hidden="true"` en imagenes puramente decorativas.
- Usar `target="_blank" rel="noopener"` para enlaces externos.
- Revisar contraste cuando se cambie el fondo del hero o la opacidad.
- Evitar JavaScript pesado: este sitio debe seguir cargando rapido como pagina estatica.
- No depender de servicios con API key para funciones simples.

## Documentacion adicional

Ver tambien:

- [Guia de edicion y diseno](docs/EDITING_GUIDE.md)
