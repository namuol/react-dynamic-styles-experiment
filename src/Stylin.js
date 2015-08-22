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
let rulesMirror = [];

export default function Stylin (Component) {
  return class StylinComponent extends Component {
    static propTypes = Object.assign({
      style: PropTypes.array,
    }, Component.propTypes);

    __removeStyles () {
      if (!!this.__className) {
        const styleCount = styleCounts[this.__className] || 0;
        styleCounts[this.__className] = styleCount - 1;

        if (styleCount > 1) {
          return;
        }

        const rules = styleRules[this.__className];

        let first = rulesMirror.indexOf(rules[0]);
        const last = first + rules.length-1;
        let idx = last;

        root.style.display = 'none';
        while (idx >= first) {
          document.styleSheets[0].deleteRule(idx);
          idx -= 1;
        }
        
        rulesMirror.splice(first, (last-first) + 1);

        root.style.display = 'block';
        
        delete this.__className;
      }
    }

    __updateStyles (props) {
      this.__removeStyles();

      if (!!props.style) {
        const styleList = [Component.baseStyle||{}, ...props.style];
        const styles = merge(styleList);

        this.__className = hashStyle(styles);
        const styleCount = styleCounts[this.__className] || 0;
        styleCounts[this.__className] = styleCount + 1;
        

        if (styleCount > 0) {
          return;
        }

        const rules = styleToRuleStrings(styles, '.'+this.__className);

        root.style.display = 'none';
        styleRules[this.__className] = rules.map((rule) => {
          const idx = document.styleSheets[0].insertRule(rule, document.styleSheets[0].rules.length);
          const ruleObj = document.styleSheets[0].rules[idx];
          rulesMirror.push(ruleObj);
          return ruleObj;
        });
        root.style.display = 'block';
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