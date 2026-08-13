/**
 * Visuels de repli affichés quand une meet n'a pas d'image.
 *
 * Pour en ajouter un : déposer le fichier dans `public/furmeet/thumbnail/`
 * (webp, ~1000px de large, < 150 Ko) et ajouter son chemin ici.
 */
export const MEET_FALLBACK_IMAGES = [
  "/furmeet/thumbnail/fallback-outdoor.webp",
  "/furmeet/thumbnail/fallback-shuffle.webp",
  "/furmeet/thumbnail/fallback-jtf.webp",
];

/**
 * Choisit un visuel de repli dans la liste ci-dessus.
 *
 * Le tirage est pseudo-aléatoire mais *déterministe* : une même meet garde
 * toujours le même visuel, et deux meets voisines en ont des différents.
 */
export const getMeetFallbackImage = (seed?: string | number | null): string => {
  const key = String(seed ?? "");

  // FNV-1a : bonne dispersion meme sur des identifiants tres proches
  // (`furmeet-mars-2026` / `furmeet-avril-2026`...).
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  const index = hash % MEET_FALLBACK_IMAGES.length;

  return MEET_FALLBACK_IMAGES[index] ?? MEET_FALLBACK_IMAGES[0]!;
};
