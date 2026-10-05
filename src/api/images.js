/**
 * Image fetching module utilizing Wikipedia / Wikimedia REST API.
 * In-memory caching, calm skeleton transitions, typographic fallback.
 */

const imageCache = new Map();

/**
 * Fetch image for a place using its imageQuery or name.
 * @param {{ id: string, name: string, imageQuery?: string, imageCredit?: string }} place 
 * @returns {Promise<{ url: string, credit: string, title: string } | null>}
 */
export async function fetchPlaceImage(place) {
  if (!place) return null;
  if (imageCache.has(place.id)) {
    return imageCache.get(place.id);
  }

  const queries = [place.imageQuery, place.name].filter(Boolean);

  for (const query of queries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, '_'))}`;
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();
      const imageUrl = data.originalimage?.source || data.thumbnail?.source;

      if (imageUrl) {
        // Compose refined credit text
        const credit = place.imageCredit || 
          (data.description ? `${data.description} (Wikimedia Commons)` : 'Wikimedia Commons / Public Domain');

        const result = {
          url: imageUrl,
          credit: credit,
          title: data.titles?.normalized || place.name,
          description: data.description || ''
        };

        imageCache.set(place.id, result);
        return result;
      }
    } catch (err) {
      // Graceful fallback to next query or null
      console.warn(`[Kuru Atlas] Image lookup for "${query}" did not complete:`, err.message);
    }
  }

  // Null indicates fallback to typographic placeholder
  imageCache.set(place.id, null);
  return null;
}
