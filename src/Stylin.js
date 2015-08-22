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

let __rulesMirror = [];

function findRuleIndex (rule) {
  return __rulesMirror.indexOf(rule);
}

let __rulesToInsert = [];
let __rulesToDelete = [];

function __insertRule (rule) {
  __rulesMirror.push(rule);
  return document.styleSheets[0].insertRule(rule, document.styleSheets[0].rules.length);
}

function __deleteRule (idx) {
  __rulesMirror.splice(idx, 1);
  return document.styleSheets[0].deleteRule(idx);
}

function flushRules () {
  if (__rulesToDelete.length > 0) {
    __rulesToDelete.sort().reverse().forEach(__deleteRule);
    __rulesToDelete = [];
  }

  if (__rulesToInsert.length > 0) {
    __rulesToInsert.forEach(__insertRule)
    __rulesToInsert = [];
  }
  window.requestAnimationFrame(flushRules);
}

window.requestAnimationFrame(flushRules);

function insertRule (rule) {
  const addedLength = __rulesToInsert.push(rule);
  document.styleSheets[0].rules.length + addedLength - 1;
}

function deleteRule (idx) {
  __rulesToDelete.push(idx);
}

let styleCounts = {};
let styleRules = {};

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

        let first = findRuleIndex(rules[0]);
        const last = first + rules.length-1;
        let idx = last;

        while (idx >= first) {
          deleteRule(idx);
          idx -= 1;
        }
        
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
        rules.forEach(insertRule);
        styleRules[this.__className] = rules;
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