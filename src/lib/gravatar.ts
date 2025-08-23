import crypto from 'crypto';

/**
 * Génère une URL Gravatar basée sur l'email de l'utilisateur
 * @param email - L'email de l'utilisateur
 * @param size - La taille de l'avatar (défaut: 80)
 * @param defaultImage - L'image par défaut si pas de Gravatar (défaut: 'identicon')
 * @returns L'URL complète de l'avatar Gravatar
 */
export function getGravatarUrl(
  email: string | null | undefined,
  size: number = 80,
  defaultImage: string = 'identicon'
): string {
  if (!email) {
    return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=${defaultImage}`;
  }

  // Normaliser l'email (minuscules et trim)
  const normalizedEmail = email.toLowerCase().trim();

  // Créer le hash MD5 de l'email
  const hash = crypto.createHash('md5').update(normalizedEmail).digest('hex');

  // Construire l'URL Gravatar
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}

/**
 * Options Gravatar disponibles pour l'image par défaut
 */
export const GRAVATAR_DEFAULTS = {
  IDENTICON: 'identicon', // Motif géométrique unique
  MONSTERID: 'monsterid', // Monstre généré
  WAVATAR: 'wavatar',     // Visages générés
  RETRO: 'retro',         // Sprites 8-bit
  ROBOHASH: 'robohash',   // Robots générés
  BLANK: 'blank'          // Image transparente
} as const;
