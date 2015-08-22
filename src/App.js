import React, {Component, PropTypes} from 'react';
import Button from './Button';

function count (max, mapFunc) {
  let result = [];
  let total = 0;
  while (total < max) {
    result.push(mapFunc(total));
    total += 1;
  }
  return result;
}

export default class App extends Component {
  render () {
    return (
      <div>
        <div>
          {count(3000, (idx) => {
            return <Button key={idx} />
          })}
        </div>
      </div>
    )
  }
}
