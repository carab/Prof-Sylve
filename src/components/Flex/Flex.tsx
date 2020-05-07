import React from 'react';
import classnames from 'classnames';
import { Override } from 'types/utils';

import './Flex.scss';

export type FlexProps = Override<
  React.ComponentPropsWithoutRef<'div'>,
  {
    gutter?: string;
    inline?: boolean;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    direction?: 'row' | 'column';
    align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
    justify?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly';
  }
>;

function Flex({
  gutter,
  inline,
  wrap,
  direction,
  align,
  justify,
  children,
  className,
  style,
  ...props
}: FlexProps) {
  const classes = classnames(className, 'Flex');
  const styles = ({
    '--flex-gutter': gutter,
    '--flex-display': inline ? 'inline-flex' : undefined,
    '--flex-wrap': wrap,
    '--flex-direction': direction,
    '--flex-align': align,
    '--flex-justify': justify,
    ...style,
  } as unknown) as React.CSSProperties;

  return (
    <div className={classes} style={styles} {...props}>
      {children}
    </div>
  );
}

export default Flex;
