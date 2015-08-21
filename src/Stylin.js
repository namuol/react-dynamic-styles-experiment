import {PropTypes, cloneElement} from 'react';
import hashStyle from './hashStyle';
import merge from './merge';

// HACKish:
import {createMarkupForStyles} from 'react/lib/CSSPropertyOperations';
window.createMarkupForStyles = createMarkupForStyles;

function styleToRuleStrings (style, selector) {
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

function findIndex (arr, val) {
  for (let i=0; i < arr.length; i += 1) {
    if (arr[i] === val) {
      return i;
    }
  }

  return -1;
}

export default function Stylin (Component) {
  
  return class StylinComponent extends Component {
    static propTypes = Object.assign({
      style: PropTypes.object,
    }, Component.propTypes);

    __removeStyles () {
      if (!!this.__styleRules) {
        this.__styleRules.forEach((rule) => {
          const idx = findIndex(document.styleSheets[0].rules, rule);
          document.styleSheets[0].deleteRule(idx);
        });
        delete this.__styleRules;
      }
    }

    __updateStyles (props) {
      this.__removeStyles();

      if (!!props.style) {
        const style = merge([Component.baseStyle||{}, props.style]);
        this.__className = 'n' + hashStyle(style);
        const rules  = styleToRuleStrings(style, '.' + this.__className);
        this.__styleRules = rules.map((rule) => {
          const idx = document.styleSheets[0].insertRule(rule, document.styleSheets[0].rules.length);
          return document.styleSheets[0].rules[idx];
        });
      }
    }
    
    componentWillMount () {
      this.__updateStyles(this.props);
    }

    componentWillReceiveProps (props) {
      this.__updateStyles(props);
    }

    componentWillUnmount () {
      this.__removeStyles();
    }

    render () {
      const originalElement = super.render();
      return cloneElement(originalElement, {
        className: this.__className,
      });
    }
  }
}