import FreeStyle from 'react-free-style';
import React, {Component, PropTypes} from 'react';
import Button from './Button';

const Style = FreeStyle.create();

function count (max, mapFunc) {
  let result = [];
  let total = 0;
  while (total < max) {
    result.push(mapFunc(total));
    total += 1;
  }
  return result;
}

@FreeStyle.injectStyle(Style)
export default class App extends Component {
  static propTypes = {
  };

  static childContextTypes = {
    Style: PropTypes.object.isRequired,
  };

  getChildContext () {
    return { Style };
  }

  render () {
    return (
      <div>
        <div>
          {count(100, (idx) => {
            return <Button key={idx} />
          })}
        </div>

        <Style.Element />
      </div>
    )
  }
}
