import React, {Component, PropTypes} from 'react';
import Stylin from './Stylin';

const COLORS = [
  '#f00',
  '#0f0',
  '#00f',
];

function randomColor () {
  return `rgb(${[0,1,2].map(channel => Math.round(Math.random()*255)).join(',')})`;
  // return COLORS[Math.floor(Math.random()*COLORS.length)];
}

const NARROW_QUERY = '@media only screen and (max-width: 800px)';
const REALLY_NARROW_QUERY = '@media only screen and (max-width: 400px)';

@Stylin
class Button extends Component {
  static propTypes = {
    blah: PropTypes.bool.isRequired,
  };
  
  static baseStyle = {
    border: 0,
    padding: '10px',
    margin: '5px',
    cursor: 'pointer',
    [NARROW_QUERY]: {
      margin: '5px 0',
      padding: '20px',
      width: '100%',
    },
    [REALLY_NARROW_QUERY]: {
      padding: '10px',
    },
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
    return <Button style={[{
      backgroundColor: this.state.color,
      '&:hover': {
        backgroundColor: this.state.hoverColor,
      },
      [NARROW_QUERY]: {
        '&:hover': {
          backgroundColor: this.state.color,
        },
      },
      [REALLY_NARROW_QUERY]: {
        padding: '100px',
      },
    }, this.props.style]} onClick={() => {
      this.setState({
        color: randomColor(),
        hoverColor: randomColor(),
      });
    }} />
  }
}
