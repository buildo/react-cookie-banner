import * as React from 'react';
import * as PropTypes from 'prop-types';
import omit = require('lodash.omit');
import { Cookies } from 'react-cookie';
import BannerContent, { propTypes as BannerContentPropTypes, Props as BannerContentProps } from './BannerContent';

export type CookieBannerRequiredProps = {
  /** custom component rendered if user has not accepted cookies */
  children?: any,
  /** called when user accepts cookies */
  onAccept?: (o: { cookie: string }) => void,
  /** instance of Cookies class to be used in server-side-rendering */
  cookies?: Cookies,
  /** cookie-key used to save user's decision about you cookie-policy */
  cookie?: string,
  /** used to set the cookie expiration */
  cookieExpiration?: number | {
    years?: number,
    days?: number,
    hours?: number
  },
  /** used to set the cookie path */
  cookiePath?: string,
  /** whether the cookie banner should be dismissed on scroll or not */
  dismissOnScroll?: boolean,
  /** amount of pixel the user need to scroll to dismiss the cookie banner */
  dismissOnScrollThreshold?: number
}

export type CookieBannerDefaultProps = {
  onAccept: () => void,
  dismissOnScroll: boolean,
  cookies: Cookies,
  cookie: string,
  cookieExpiration: { years: number },
  buttonMessage: string,
  dismissOnScrollThreshold: number,
  styles: object
}

export type CookieBannerProps = BannerContentProps & CookieBannerRequiredProps & Partial<CookieBannerDefaultProps>;

export namespace CookieBanner {
  export type Props = CookieBannerProps;
}

type CookieBannerDefaultedProps = CookieBannerRequiredProps & CookieBannerDefaultProps;

export type State = {
  listeningScroll: boolean
}

/**
 * React Cookie banner dismissable with just a scroll!
 */
export default class CookieBanner extends React.Component<CookieBanner.Props, State> {

  static propTypes = {
    ...BannerContentPropTypes,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    onAccept: PropTypes.func,
    cookies: PropTypes.instanceOf(Cookies),
    cookie: PropTypes.string,
    cookieExpiration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        years: PropTypes.number,
        days: PropTypes.number,
        hours: PropTypes.number
      })
    ]),
    cookiePath: PropTypes.string,
    dismissOnScroll: PropTypes.bool,
    dismissOnScrollThreshold: PropTypes.number
  }

  static defaultProps = {
    onAccept: () => {},
    dismissOnScroll: true,
    cookies: new Cookies(),
    cookie: 'accepts-cookies',
    cookieExpiration: { years: 1 },
    buttonMessage: 'Got it',
    dismissOnScrollThreshold: 0,
    styles: {}
  };

  state = { listeningScroll: false }

  componentDidMount() {
    this.addOnScrollListener();
  }

  addOnScrollListener = (props?: CookieBanner.Props) => {
    const _props = props || this.props;
    if (!this.state.listeningScroll && !this.hasAcceptedCookies() && _props.dismissOnScroll) {
      if ((window as any).attachEvent) {
        // Internet Explorer
        (window as any).attachEvent('onscroll', this.onScroll);
      } else if (window.addEventListener) {
        window.addEventListener('scroll', this.onScroll, false);
      }
      this.setState({ listeningScroll: true });
    }
  }

  removeOnScrollListener = () => {
    if (this.state.listeningScroll) {
      if ((window as any).detachEvent) {
        // Internet Explorer
        (window as any).detachEvent('onscroll', this.onScroll);
      } else if (window.removeEventListener) {
        window.removeEventListener('scroll', this.onScroll, false);
      }
      this.setState({ listeningScroll: false });
    }
  }

  onScroll = () => {
    // tacit agreement buahaha! (evil laugh)
    const { dismissOnScrollThreshold } = this.props as CookieBannerDefaultedProps;
    if (window.pageYOffset > dismissOnScrollThreshold) {
      this.onAccept();
    }
  }

  getSecondsSinceExpiration = (cookieExpiration: CookieBannerRequiredProps['cookieExpiration']) => {
    if (typeof cookieExpiration === 'number') {
      return cookieExpiration;
    }

    const SECONDS_IN_YEAR = 31536000;
    const SECONDS_IN_DAY = 86400;
    const SECONDS_IN_HOUR = 3600;

    const _cookieExpiration = {
      years: 0, days: 0, hours: 0,
      ...cookieExpiration
    };

    const { years, days, hours } = _cookieExpiration;

    return (years * SECONDS_IN_YEAR) + (days * SECONDS_IN_DAY) + (hours * SECONDS_IN_HOUR);
  }

  onAccept = () => {
    const { cookies, cookie, cookieExpiration, cookiePath: path, onAccept } = this.props as CookieBannerDefaultedProps;

    cookies.set(cookie, true, {
      path,
      expires: new Date(Date.now() + (this.getSecondsSinceExpiration(cookieExpiration) * 1000))
    });

    onAccept({ cookie });

    if (this.state.listeningScroll) {
      this.removeOnScrollListener();
    } else {
      this.forceUpdate();
    }
  }

  hasAcceptedCookies() {
    const { cookies, cookie } = this.props as CookieBannerDefaultedProps;
    return cookies.get(cookie);
  }

  templateChildren(children: CookieBanner.Props['children'], onAccept: CookieBannerDefaultProps['onAccept']) {
    if (typeof children === 'function') {
      return children(onAccept);
    }
    return children;
  }

  render() {
    const {
      onAccept,
      props: {
        message, link, buttonMessage, closeIcon,
        disableStyle, styles, className, children, dismissOnClick, ...props
      }
    } = this;

    const hasAcceptedCookies = this.hasAcceptedCookies();
    const bannerContentProps = {
      ...omit(props, Object.keys(CookieBanner.propTypes)),
      message, onAccept, link, buttonMessage,
      closeIcon, disableStyle, styles, className, dismissOnClick,
    };

    if (hasAcceptedCookies) {
      return null;
    }

    return children ?
      this.templateChildren(children, onAccept) :
      <BannerContent {...bannerContentProps} />;
  }

  componentWillReceiveProps(nextProps: CookieBanner.Props) {
    if (nextProps.dismissOnScroll) {
      this.addOnScrollListener(nextProps);
    } else {
      this.removeOnScrollListener();
    }
  }

  componentWillUnmount() {
    this.removeOnScrollListener();
  }

}
