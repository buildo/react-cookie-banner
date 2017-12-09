import { Cookies } from 'react-cookie';
import '../examples/cookie.png';

(global as any).cookies = new Cookies();
(global as any).Cookies = Cookies;
