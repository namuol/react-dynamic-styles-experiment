import React, {Component, PropTypes} from 'react';
import Stylin from './Stylin';

function randomColor () {
  return `rgb(${[0,1,2].map(channel => Math.round(Math.random()*255)).join(',')})`;
}

const BASE_STYLE = {
  border: 0,
  padding: '10px',
  margin: '5px',
  cursor: 'pointer',
};

@Stylin
class Button extends Component {
  render () {
    return (
      <button style={Object.assign({}, BASE_STYLE, this.props.style)} onClick={this.props.onClick}>CLICK</button>
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
    }} onClick={() => {
      this.setState({
        color: randomColor(),
      });
    }} />
  }
}
