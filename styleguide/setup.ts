import { Cookies, CookiesProvider } from 'react-cookie';
import { CookieBannerUniversal } from '../src';

import '../examples/examples.scss';
import '../examples/cookie.png';

(global as any).cookies = new Cookies();
(global as any).CookiesProvider = CookiesProvider;
(global as any).Cookies = Cookies;
(global as any).CookieBannerUniversal = CookieBannerUniversal;
