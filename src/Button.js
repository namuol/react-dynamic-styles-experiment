import React, {Component, PropTypes} from 'react';
import Stylin from './Stylin';

function randomColor () {
  return `rgb(${[0,1,2].map(channel => Math.round(Math.random()*255)).join(',')})`;
}

const NARROW_QUERY = '@media only screen and (max-width: 800px)';

@Stylin
class Button extends Component {
  static baseStyle = {
    border: 0,
    padding: '10px',
    margin: '5px',
    cursor: 'pointer',
    [NARROW_QUERY]: {
      margin: '5px 0',
      padding: '15px',
      width: '100%',
    }
  };

  render () {
    return (
      <button onClick={this.props.onClick}>CLICK</button>
    )
  }
}

export default class ColorfulButton extends Component {
  state = {
    color: randomColor(),
    hoverColor: randomColor(),
  };

  render () {
    return <Button style={{
      backgroundColor: this.state.color,
      '&:hover': {
        backgroundColor: this.state.hoverColor,
      },
      [NARROW_QUERY]: {
        '&:hover': {
          backgroundColor: this.state.color,
        },
      },
    }} onClick={() => {
      this.setState({
        color: randomColor(),
        hoverColor: randomColor(),
      });
    }} />
  }
}
