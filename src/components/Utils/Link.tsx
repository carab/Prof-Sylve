import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Override } from 'types/utils';

export function isExternalUrl(url: string): boolean {
  // Case 1 : URLs starting with double slash, ie '//google.fr'
  if (/^\/\//.test(url)) {
    return true;
  }

  // Case 2 : URLs starting with a protocol and a column, ie 'http://google.fr' or 'mailto:bouh@bouh.bouh'
  if (/^[0-9a-zA-Z-]+:/.test(url)) {
    return true;
  }

  // All other cases seem to be internal URLs
  return false;
}

type RouterLinkProps = React.ComponentPropsWithRef<typeof RouterLink>;
type AnchorProps = React.ComponentPropsWithRef<'a'>;

export type LinkProps = Override<
  RouterLinkProps | AnchorProps,
  {
    to: string;
  }
>;

function isAnchor(
  to: string,
  props: Omit<RouterLinkProps | AnchorProps, 'to'>,
): props is AnchorProps {
  return isExternalUrl(to);
}

function isRouterLink(
  to: string,
  props: Omit<RouterLinkProps | AnchorProps, 'to'>,
): props is RouterLinkProps {
  return !isExternalUrl(to);
}

const hostRegex = new RegExp(`^http(s?)://${window.location.host}`);

/**
 * Remove current domain from given URL to allow internal router
 */
function transformTo(to: string): string {
  return to.replace(hostRegex, '');
}

function Link({
  to: originalTo,
  children,
  ...props
}: LinkProps) {
  const to = transformTo(originalTo);

  if (isAnchor(to, props)) {
    return (
      <a
        href={to}
        target="_blank"
        rel="external noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isRouterLink(to, props)) {
    return (
      <RouterLink to={to} {...props}>
        {children}
      </RouterLink>
    );
  }

  return null;
}

export default Link