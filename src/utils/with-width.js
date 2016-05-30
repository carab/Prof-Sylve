import React, {Component} from 'react';
import EventListener from 'react-event-listener';

export const XS = 1;
export const SM = 2;
export const MD = 3;
export const LG = 4;
export const XL = 5;

export default function withWidth(options = {}) {
  const {
    resizeInterval = 166,
  } = options;

  return (MyComponent) => {
    return class WithWidth extends Component {
      constructor(props, context) {
        super(props, context);

        this.handleResize = this.handleResize.bind(this);

        this.state = {
          width: XS,
        };
      }

      componentDidMount() {
        this.updateWidth();
      }

      componentWillUnmount() {
        clearTimeout(this.deferTimer);
      }

      handleResize() {
        clearTimeout(this.deferTimer);
        this.deferTimer = setTimeout(() => {
          this.updateWidth();
        }, resizeInterval);
      }

      updateWidth() {
        const innerWidth = window.innerWidth;
        let width;

        if (innerWidth >= 75*16) {
          width = XL;
        } else if (innerWidth >= 62*16) {
          width = LG;
        } else if (innerWidth >= 48*16) {
          width = MD;
        } else if (innerWidth >= 34*16) {
          width = SM;
        } else {
          width = XS;
        }

        if (width !== this.state.width) {
          this.setState({
            width,
          });
        }
      }

      render() {
        const {width} = this.props;

        return (
          <EventListener target={window} onResize={this.handleResize}>
            <MyComponent
              {...this.props}
              width={this.state.width}
            />
          </EventListener>
        );
      }
    };
  };
}
