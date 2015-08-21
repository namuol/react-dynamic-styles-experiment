// Taken from Radium:
// https://github.com/FormidableLabs/radium/blob/b520787f2af69921e1b653298c00be75791a9b26/modules/resolve-styles.js#L45-L63

function _isSpecialKey (key) {
  return key[0] === ':' || key[0] === '@';
};

export default function mergeStyles (styles) {
  var result = {};

  styles.forEach(function (style) {
    if (!style || typeof style !== 'object' || Array.isArray(style)) {
      return;
    }

    Object.keys(style).forEach(function (key) {
      if (_isSpecialKey(key) && result[key]) {
        result[key] = mergeStyles([result[key], style[key]]);
      } else {
        result[key] = style[key];
      }
    });
  });

  return result;
};
