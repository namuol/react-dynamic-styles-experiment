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

const styleSheet = document.styleSheets[0];

let __rulesMirror = [];

function findRuleIndex (rule) {
  return __rulesMirror.indexOf(rule);
}

let __rulesToInsert = [];
let __rulesToDelete = [];

function __insertRule (rule) {
  __rulesMirror.push(rule);
  styleSheet.insertRule(rule, styleSheet.rules.length);
  // console.log(`inserting rule ${rule}`);
}

function __deleteRule (idx) {
  const [rule] = __rulesMirror.splice(idx, 1);
  styleSheet.deleteRule(idx);
  // console.log(`delete rule ${rule}`);
}

function __deleteRuleSet (rules) {
  const firstIdx = findRuleIndex(rules[0]);

  if (firstIdx < 0) {
    const firstInsertIdx = __rulesToInsert.indexOf(rules[0]);
    __rulesToInsert.splice(firstInsertIdx, rules.length);
  } else {
    const lastIdx = firstIdx + rules.length-1;
    let idx = lastIdx;

    while (idx >= firstIdx) {
      __deleteRule(idx);
      idx -= 1;
    }
  }
}

function flushRules () {
  let mutated = false;
  if (__rulesToDelete.length > 0) {
    __rulesToDelete.forEach((rules) => {
      __deleteRuleSet(rules);
    });
    __rulesToDelete = [];
    mutated = true;
  }

  if (__rulesToInsert.length > 0) {
    __rulesToInsert.filter(r => !!r).forEach(__insertRule)
    __rulesToInsert = [];
    mutated = true;
  }
  
  if (mutated && __rulesMirror.length !== styleSheet.rules.length) {
    console.error('rulesMirror length', __rulesMirror.length, ' ', 'actual count', styleSheet.rules.length);
  }

  window.requestAnimationFrame(flushRules);
}

window.requestAnimationFrame(flushRules);

function insertRule (rule) {
  __rulesToInsert.push(rule);
}

function deleteRules (rules) {
  __rulesToDelete.push(rules);
}

const styleCounts = {};
const rulesByClassName = {};

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

        const rules = rulesByClassName[this.__className];
        deleteRules(rules);
        delete this.__className;
        delete rulesByClassName[this.__className];
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
        rulesByClassName[this.__className] = rules;
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