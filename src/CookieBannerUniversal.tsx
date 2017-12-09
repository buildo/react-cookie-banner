import * as React from 'react';
import { withCookies } from 'react-cookie';
import CookieBanner, { CookieBannerProps } from './CookieBanner';

export default withCookies<CookieBannerProps>(CookieBanner) as React.ComponentClass<CookieBannerProps>;
