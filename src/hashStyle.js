function memoize (fn) {
  const memo = {};

  return function memoized (arg) {
    const value = memo[arg];

    if (memo.hasOwnProperty(arg)) {
      return memo[arg]
    }

    return memo[arg] = fn(arg);
  }
}

const hash = memoize(function (str) {
  let hash = 5381,
      i    = str.length

  while(i)
    hash = (hash * 33) ^ str.charCodeAt(--i)

  const ret = (hash >>> 0).toString(36);
  if (parseInt(ret[0]) >= 0) {
    return ('_').concat(ret);
  }
  return ret;
});

/**
 * Hash a style object.
 */
export default function hashStyle (style) {
  return hash(JSON.stringify(style));
}