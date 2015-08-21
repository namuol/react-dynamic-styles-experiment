import {PropTypes, cloneElement} from 'react';

export default function Stylin (Component) {
  
  return class StylinComponent extends Component {
    static propTypes = Object.assign({
      style: PropTypes.object,
    }, Component.propTypes);

    static contextTypes = Object.assign({
      Style: PropTypes.object.isRequired,
    }, Component.contextTypes);

    __removeStyles () {
      if (!!this.__style) {
        this.context.Style.remove(this.__style);
        delete this.__style;
      }
    }

    __updateStyles (props) {
      this.__removeStyles();

      if (!!props.style) {
        this.__style = this.context.Style.registerStyle({}, Component.baseStyle, props.style);
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
        className: this.__style.className,
      });
    }
  }
}