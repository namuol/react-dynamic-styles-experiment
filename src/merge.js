// Taken from Radium:
// https://github.com/FormidableLabs/radium/blob/b520787f2af69921e1b653298c00be75791a9b26/modules/resolve-styles.js#L45-L63

function _isSpecialKey (key) {
  return (/^[@&]/).test(key);
};

function arrayify (obj) {
  if (typeof obj === 'object') {
    return Object.keys(obj).map(k => [k, arrayify(obj[k])]);
  } else {
    return obj;
  }
}

function objectify (arr) {
  if (typeof arr === 'object') {
    return arr.reduce((result, [k,v]) => {
      result[k] = objectify(v);
      return result;
    }, {});
  } else {
    return arr;
  }
}

function _mergeStyles (styles) {
  let indices = {};
  let result = [];
  let lastObjectForKey = {};

  styles.forEach((style) => {
    if (!style || typeof style !== 'object' || Array.isArray(style)) {
      return;
    }

    Object.keys(style).forEach((key) => {
      if (indices[key] != null) {
        result[indices[key]] = false;
      }

      const val = style[key];

      if (typeof val === 'object' && lastObjectForKey[key]) {
        indices[key] = result.push([key, _mergeStyles([lastObjectForKey[key], val])]) - 1;
      } else {
        indices[key] = result.push([key, arrayify(val)]) - 1;
      }

      if (typeof val === 'object') {
        lastObjectForKey[key] = val;
      }
    });
  });

  return result.filter(v => v !== false);
};

export default function mergeStyles (styles) {
  return objectify(_mergeStyles(styles));
}

import runTests from './runTests';

const mergeStyles_tests = [
  {
    input: [
      {color:'red'},
      {color:'black'},
    ],
    expected: [
      ['color', 'black'],
    ],
  },

  {
    input: [
      {'&:hover': {color:'red'}},
      {'&:hover': {color:'black'}},
    ],
    expected: [
      ['&:hover', [
        ['color', 'black'],
      ]],
    ],
  },

  {
    input: [
      {
        '@media': {},
      },

      {
        '&:hover': {
          color: 'red',
        },
        '@media': {
          '&:hover': {
            color: 'black'
          },
        },
      },
      
    ],

    expected: [
      ['&:hover', [
        ['color', 'red'],
      ]],

      ['@media', [
        ['&:hover', [
          ['color', 'black'],
        ]],
      ]],
    ],
  },

  {
    input: [
      {color:'red', backgroundColor: 'blue'},
      {color:'black'},
    ],
    expected: [
      ['backgroundColor', 'blue'],
      ['color', 'black'],
    ],
  },

  {
    input: [
      {
        '@media': {
          color: 'black',
        }
      },
      {
        '@media': {
          '&:hover': {
            color: 'black',
          },
        },
      },
    ],
    expected: [
      ['@media', [
        ['color', 'black'],
        ['&:hover', [
          ['color', 'black'],
        ]],
      ]],
    ],
  },

  {
    input: [
      {
        '@media1': {
          padding: '10px',
        },
        '@media2': {
          padding: '20px',
        },
      },
      {
        backgroundColor: 'black',
        '&:hover': {
          backgroundColor: 'red',
        },
        '@media1': {
          '&:hover': {
            backgroundColor: 'black',
          },
        },
        '@media2': {
          padding: '100px',
        },
      },
      false
    ],

    expected: [
      ['backgroundColor', 'black'],
      ['&:hover', [
        ['backgroundColor', 'red'],
      ]],

      ['@media1', [
        ['padding', '10px'],
        ['&:hover', [
          ['backgroundColor', 'black'],
        ]],
      ]],

      ['@media2', [
        ['padding', '100px'],
      ]],
    ],
  }
];

runTests({
  func: _mergeStyles,
  tests: mergeStyles_tests,
});