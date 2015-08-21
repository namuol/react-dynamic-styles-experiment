import equal from 'deep-equal';
import pretty from './pretty';
import isFunc from './isFunc';

export default function runTests ({funcName, func, tests, expandArguments=false}) {
  funcName = funcName || func.name;
  
  console.info('Running tests for', funcName);

  let errorMsgs = [];

  tests.forEach(({input, expected}, testNum) => {
    let result;
    if (expandArguments) {
      result = func(...input);
    } else {
      result = func(input);
    }
    
    if (!!result && isFunc(result.toJS)) {
      result = result.toJS();
    }

    if (!equal(result, expected)) {
      errorMsgs.push(`${funcName} test #${testNum}:\nExpected ${pretty(expected)}\nbut got ${pretty(result)}`);
    }
  });

  if (errorMsgs.length > 0) {
    throw new Error(errorMsgs.join('\n\n'));
  }
}
