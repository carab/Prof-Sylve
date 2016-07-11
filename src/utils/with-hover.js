import React, {Component} from 'react';

export default function withHover() {
  return (MyComponent) => {
    return class WithHover extends Component {
      constructor(props) {
        super(props);

        this.state = {
          hover: false,
        };
      }

      render() {
        const {hover} = this.state;

        return (
            <MyComponent
              {...this.props}
              hover={hover}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            />
        );
      }
    };
  };
}
