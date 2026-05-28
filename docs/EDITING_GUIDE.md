# Guia de edicion y diseno de Labucal

Esta guia explica como editar el sitio manteniendo el diseno, las animaciones y la estructura con buenas practicas.

## Principio general

Labucal tiene una estetica de laboratorio dental premium:

- fondo azul profundo;
- tipografia limpia y amplia;
- imagenes reales o protesis realistas;
- animaciones suaves;
- mucho espacio respirable;
- informacion clara para dentistas y clinicas.

Cuando se agregue una nueva pieza, debe sentirse parte de ese sistema. Evitar secciones con estilo de landing generica, iconos sueltos o colores que no existan en la paleta.

## Editar texto

Los textos visibles estan directamente en HTML. Para cambiar un titulo o parrafo:

1. Buscar el texto exacto con `rg`.
2. Editar en `Labucal.html`.
3. Copiar a `index.html`.
4. Revisar que no se rompan saltos de linea o acentos.

Ejemplo:

```powershell
rg "Vamos conversar" Labucal.html
```

No editar solo `index.html` si se quiere mantener `Labucal.html` como copia sincronizada.

## Agregar una seccion nueva

Usar este patron:

```html
<section class="light pad" id="novo-id" aria-labelledby="novo-h">
  <div class="container">
    <div class="section-head reveal">
      <span class="overline">Etiqueta</span>
      <h2 id="novo-h">Titulo de la seccion.</h2>
    </div>

    <!-- contenido -->
  </div>
</section>
```

Reglas:

- Usar `light` o `dark`, alternando para ritmo visual.
- Mantener `pad` para espaciado vertical.
- Usar `.container` como envoltorio principal.
- Usar `.section-head reveal` para encabezados.
- Si se agrega al menu, actualizar nav desktop, menu mobile y footer.

## Agregar tarjetas

Las tarjetas existentes usan bordes suaves, radios moderados y poco ornamento. Evitar tarjetas dentro de tarjetas.

Para una tarjeta clara:

```html
<article class="quote">
  ...
</article>
```

Para una tarjeta oscura, seguir el patron de `.service`.

## Reemplazar imagenes

### Servicios

Hoy son cuatro tarjetas que viven en la seccion `#servicos` y usan SVG inline (no fotos JPG). Cada card tiene `data-service` para tracking futuro:

- `data-service="protese"` — Prótese Dentária (parcial, total, fixa, coroas, facetas)
- `data-service="implantes"` — Implantes Dentários (componentes proteticos sobre implante ya instalado)
- `data-service="clareamento"` — Clareamento Dental (placas y moldeiras)
- `data-service="alinhadores"` — Alinhadores Transparentes

Importante: el laboratorio trabaja **solo B2B** (dentistas autonomos con CPF y clinicas con CNPJ). Todos los servicios son **sob prescripcion del dentista**. No atendemos pacientes directos. Mantener ese encuadre en cualquier copy nuevo.

Si en algun momento se quieren reintroducir fotos JPG en las cards en lugar de los iconos SVG actuales, usar los mismos requisitos de antes:

- formato JPG, ancho 1000-1400 px, peso menor a 250 KB
- escenas reales de laboratorio o de la pieza terminada
- evitar imagenes de stock genericas

Nota: los archivos `assets/labucal-images/service-parcial.jpg`, `service-total.jpg`, `service-fixa.jpg` y `service-coroas.jpg` quedaron huerfanos despues del cambio de servicios y se pueden borrar para limpiar el repo.

### Galeria

Archivos:

```text
gallery-01.jpg
gallery-02.jpg
gallery-03.jpg
gallery-04.jpg
gallery-05.jpg
gallery-06.jpg
```

Mantener los formatos de los contenedores:

- `.g-tall`: vertical;
- `.g-wide`: horizontal;
- `.g-square`: cuadrado.

No cambiar proporciones en CSS sin revisar mobile.

### Hero

El hero tiene dos capas principales:

1. Fondo fotografico:

```text
assets/labucal-images/hero-lab-bg.jpg
```

2. Protesis animada en dos partes:

```text
assets/labucal-images/prosthesis-part-01-upper.webp
assets/labucal-images/prosthesis-part-02-lower.webp
```

Las piezas de la protesis deben ser PNG transparentes, con bastante espacio alrededor para que no se corten al animar.

## Crear protesis transparentes

Idealmente generar o exportar la protesis sobre fondo transparente. Si se usa fondo cromatico:

- usar verde puro `#00ff00`;
- no usar verde en la pieza;
- retirar el fondo antes de subirlo;
- revisar bordes sobre fondo azul.

Despues de recortar, probar sobre `#0A1B3D` para detectar halos.

## Ajustar animaciones por scroll

### Hero

La funcion esta cerca de:

```js
// ---------- Prosthesis assembly on scroll ----------
```

Variables clave:

```js
const raw = window.scrollY / Math.min(760, vh * 0.82);
const upperY = -150 + (eased * 110);
const lowerY = 170 - (eased * 115);
const scale = 0.86 + (eased * 0.12);
```

Que significa:

- `raw`: cuanto scroll necesita para completar la animacion.
- `upperY`: posicion vertical de la parte superior.
- `lowerY`: posicion vertical de la parte inferior.
- `scale`: crecimiento durante el armado.

Para hacer el cierre mas lento: aumentar `760` o `0.82`.

Para hacer que cierre mas: aumentar los multiplicadores `110` y `115`.

Para que empiece mas abierto: alejar los valores iniciales `-150` y `170`.

### Decoraciones por seccion

La funcion esta cerca de:

```js
const updateDecorScroll = () => { ... }
```

Modos:

- `right`: movimiento desde derecha.
- `left`: movimiento desde izquierda.
- `float`: movimiento flotante.

La decoracion calcula progreso por seccion:

```js
const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
```

No usar animaciones CSS infinitas para estas protesis. La intencion es que respondan al scroll.

## Contacto

Datos oficiales actuales:

```text
Telefone / WhatsApp: (15) 99110-7117
E-mail: contato@labucal.com.br
Facebook: https://www.facebook.com/labucalprotese
Instagram: https://www.instagram.com/labucalprotese/
Endereco: Rua Conego Januario Barbosa, 225, Jardim Vergueiro, Sorocaba, Brazil
```

Cuando se cambie un dato, buscarlo en todo el proyecto:

```powershell
rg "99110|contato@|labucalprotese|Conego" .
```

## Mapa

El mapa no usa Google Maps embebido, sino OpenStreetMap:

```html
<iframe src="https://www.openstreetmap.org/export/embed.html?..."></iframe>
```

Ventajas:

- sin API key;
- funciona en GitHub Pages;
- sencillo de mantener.

Tambien hay enlace externo a Google Maps para rutas. Si se ajusta la direccion, actualizar ambos.

## Accesibilidad

Mantener:

- `aria-label` en botones iconicos.
- `aria-hidden="true"` en decoraciones.
- `alt=""` para imagenes decorativas.
- `alt` descriptivo para imagenes informativas.
- Contraste suficiente en texto.
- Foco visible con `:focus-visible`.

No ocultar informacion importante solo en imagenes.

## Performance

El sitio debe seguir siendo rapido. Reglas:

- Preferir JPG para fotos.
- Preferir PNG solo para transparencias.
- Usar `loading="lazy"` en imagenes fuera del hero.
- Evitar imagenes mayores a 1 MB salvo que sean indispensables.
- No agregar librerias JS si se puede resolver con vanilla JS.
- No agregar fuentes nuevas sin necesidad.

## Publicar cambios

1. Sincronizar HTML:

```powershell
Copy-Item -LiteralPath "Labucal.html" -Destination "index.html" -Force
```

2. Revisar estado:

```powershell
git status -sb
git diff --stat
```

3. Commit:

```powershell
git add Labucal.html index.html assets docs README.md
git commit -m "Descripcion del cambio"
```

4. Push:

```powershell
git push
```

5. Confirmar Pages:

```powershell
gh api repos/Pcxddg/labucal/pages
```

## Errores comunes

- Editar `Labucal.html` y olvidar `index.html`.
- Subir capturas temporales a `assets/`.
- Usar la imagen original pesada del logo en vez de las optimizadas.
- Poner decoraciones encima de texto o formulario.
- Cambiar el color azul principal solo en una seccion.
- Eliminar `loading="lazy"` en imagenes que estan debajo del hero.
- Cambiar ids de secciones sin actualizar enlaces.
- Editar `data/reviews.json` a mano. Es auto-generado por el workflow de GitHub Actions cada 6 horas — cualquier edicion manual sera sobreescrita en la siguiente corrida.
- Olvidar reemplazar `REPLACE_WITH_PLACE_ID` en `.github/workflows/update-reviews.yml`. Sin eso el workflow falla y el popup de avaliacoes queda con datos estaticos. Ver seccion "Avaliacoes do Google" del README.
- "El aviso de cookies / popup de avaliacoes no aparece al recargar". Es esperado: el aviso de cookies persiste en `localStorage.labucal_cookies_accepted` y el popup en `sessionStorage.labucal_reviews_dismissed`. Para forzar reaparicion durante pruebas, borrar la clave en DevTools > Application > Storage.
- Quitar `aria-hidden="true"` del `.map-overlay` o del Place ID en `.gr-popup`. Esas capas son decorativas/funcionales sin contenido relevante para lectores de pantalla.

## Checklist de handoff

Antes de entregar a otro programador:

- Explicar que es un sitio estatico sin build.
- Indicar que GitHub Pages publica `index.html`.
- Mostrar donde estan las variables CSS.
- Mostrar donde estan las animaciones JS.
- Mostrar carpetas de assets.
- Confirmar que tiene acceso al repo GitHub.
- Confirmar que sabe sincronizar `Labucal.html` e `index.html`.
