// Busca avaliações do Labucal na Places API (New) e grava em data/reviews.json.
// Executado pelo workflow .github/workflows/update-reviews.yml a cada 6 horas.

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

if (!API_KEY) {
  console.error('Falta a variável GOOGLE_PLACES_API_KEY (configure como Secret no GitHub).');
  process.exit(1);
}
if (!PLACE_ID || PLACE_ID === 'REPLACE_WITH_PLACE_ID') {
  console.error('Edite .github/workflows/update-reviews.yml e substitua REPLACE_WITH_PLACE_ID pelo Place ID real do Labucal no Google Maps.');
  process.exit(1);
}

const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=pt-BR`;
const fieldMask = [
  'displayName',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews'
].join(',');

(async () => {
  try {
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': fieldMask
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();

    const output = {
      updatedAt: new Date().toISOString(),
      name: data.displayName?.text || 'Labucal',
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri || null,
      reviews: (data.reviews || []).map(r => ({
        author: r.authorAttribution?.displayName || 'Anônimo',
        authorPhoto: r.authorAttribution?.photoUri || null,
        rating: r.rating ?? null,
        text: r.text?.text || r.originalText?.text || '',
        relativeTime: r.relativePublishTimeDescription || '',
        publishTime: r.publishTime || null
      }))
    };

    const outDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(
      path.join(outDir, 'reviews.json'),
      JSON.stringify(output, null, 2),
      'utf8'
    );

    console.log(`OK: rating ${output.rating} (${output.userRatingCount} avaliações, ${output.reviews.length} com texto)`);

    // Mantém o aggregateRating do JSON-LD em index.html sincronizado com os
    // dados reais. Só atualiza quando há rating e ao menos 1 avaliação — o
    // schema.org exige valores válidos e o Google rejeita reviewCount = 0.
    if (output.rating != null && output.userRatingCount > 0) {
      const indexPath = path.join(process.cwd(), 'index.html');
      try {
        let html = fs.readFileSync(indexPath, 'utf8');
        const ratingStr = Number(output.rating).toFixed(1);
        const countStr = String(output.userRatingCount);
        const before = html;
        html = html
          .replace(/("ratingValue":\s*")[^"]*(")/, `$1${ratingStr}$2`)
          .replace(/("reviewCount":\s*")[^"]*(")/, `$1${countStr}$2`);
        if (html !== before) {
          fs.writeFileSync(indexPath, html, 'utf8');
          console.log(`OK: aggregateRating do index.html -> ${ratingStr} / ${countStr}`);
        }
      } catch (e) {
        console.warn('Aviso: não foi possível atualizar o aggregateRating em index.html:', e.message);
      }
    }
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err.message);
    process.exit(1);
  }
})();
