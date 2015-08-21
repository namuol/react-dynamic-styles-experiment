/**
 * Generate a hash value from a string.
 */
function hash (str, seed) {
  let value = seed ? parseInt(seed, 16) : 0x811c9dc5

  for (let i = 0; i < str.length; i++) {
    value ^= str.charCodeAt(i)
    value += (value << 1) + (value << 4) + (value << 7) + (value << 8) + (value << 24)
  }

  return (value >>> 0).toString(16)
}

/**
 * Hash a style object.
 */
export default function hashStyle (style) {
  return hash(JSON.stringify(style))
}