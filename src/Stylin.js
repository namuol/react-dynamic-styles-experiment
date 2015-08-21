import {PropTypes, cloneElement} from 'react';
import hashStyle from './hashStyle';
import merge from './merge';
import styleToRuleStrings from './styleToRuleStrings';

function findIndex (arr, val) {
  for (let i=0; i < arr.length; i += 1) {
    if (arr[i] === val) {
      return i;
    }
  }

  return -1;
}

let styleCounts = {};
let styleRules = {};

export default function Stylin (Component) {
  return class StylinComponent extends Component {
    static propTypes = Object.assign({
      style: PropTypes.object,
    }, Component.propTypes);

    __removeStyles () {
      if (!!this.__className) {
        const styleCount = styleCounts[this.__className] || 0;
        styleCounts[this.__className] = styleCount - 1;

        if (styleCount > 1) {
          return;
        }

        const rules = styleRules[this.__className];

        let first = findIndex(document.styleSheets[0].rules, rules[0]);
        const last = first + rules.length-1;
        let idx = last;

        while (idx >= first) {
          document.styleSheets[0].deleteRule(idx);
          idx -= 1;
        }
        
        delete this.__className;
      }
    }

    __updateStyles (props) {
      this.__removeStyles();

      if (!!props.style) {
        const style = merge([Component.baseStyle||{}, props.style]);
        this.__className = hashStyle(style);
        const styleCount = styleCounts[this.__className] || 0;
        styleCounts[this.__className] = styleCount + 1;
        
        if (styleCount > 0) {
          return;
        }

        const rules  = styleToRuleStrings(style, '.' + this.__className);
        styleRules[this.__className] = rules.map((rule) => {
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