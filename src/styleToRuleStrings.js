import {createMarkupForStyles} from 'react/lib/CSSPropertyOperations';

export default function styleToRuleStrings (style, selector) {
  const baseRules = {};
  const topLevelRules = {};

  Object.keys(style).forEach((propName) => {
    const value = style[propName];
    if (typeof value === 'object') {
      topLevelRules[propName] = value;
      return;
    }
    baseRules[propName] = value;
  });

  const ruleStrings = Object.keys(topLevelRules).map((topLevelName) => {
    if (topLevelName[0] === '&') {
      const finalName = selector.concat(topLevelName.substr(1));
      return finalName.concat('{', createMarkupForStyles(topLevelRules[topLevelName]), '}');
    } else {
      return topLevelName.concat('{', styleToRuleStrings(topLevelRules[topLevelName], selector).join(''), '}');
    }
  });

  if (Object.keys(baseRules).length > 0) {
    ruleStrings.unshift(selector.concat('{', createMarkupForStyles(baseRules), '}'));
  }

  return ruleStrings;
}
