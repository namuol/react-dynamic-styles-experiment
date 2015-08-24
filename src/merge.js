function arrayify (val) {
  if (typeof val === 'object') {
    return Object.keys(val).map(k => [k, arrayify(val[k])]);
  } else {
    return val;
  }
}

function objectify (val) {
  if (typeof val === 'object') {
    return val.reduce((result, [k,v]) => {
      result[k] = objectify(v);
      return result;
    }, {});
  } else {
    return val;
  }
}

export default function mergeStyles (styles) {
  return styles.reduce((result, style) => {
    if (!style) {
      return result;
    }

    Object.keys(style).forEach((key) => {
      const val = style[key];
      
      let finalVal;
      if (typeof val === 'object' && result[key]) {
        finalVal = mergeStyles([result[key], val]);
      } else {
        finalVal = val;
      }

      delete result[key];
      result[key] = finalVal;
    });

    return result;
  }, {});
};

import runTests from './runTests';

if (process.env.NODE_ENV !== 'production') {
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
    func: function _arrayifyMergeStyles (styles) {
      return arrayify(mergeStyles(styles));
    },
    funcName: 'mergeStyles',
    tests: mergeStyles_tests,
  });
}
