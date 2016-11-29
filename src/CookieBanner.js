import React from 'react';
import omit from 'lodash.omit';
import { t, props } from 'tcomb-react';
import { cookie as cookieLite } from 'browser-cookie-lite';
import BannerContent, { Props as BannerContentProps } from './BannerContent';
t.interface.strict = true;

const Props = {
  ...BannerContentProps,
  children: t.maybe(t.union([
    t.ReactChildren,
    t.Function
  ])),
  onAccept: t.maybe(t.Function),
  cookie: t.maybe(t.String),
  cookieExpiration: t.maybe(t.union([
    t.Integer,
    t.interface({
      years: t.maybe(t.Number),
      days: t.maybe(t.Number),
      hours: t.maybe(t.Number)
    })
  ])),
  dismissOnScroll: t.maybe(t.Boolean),
  dismissOnScrollThreshold: t.maybe(t.Number)
};


/** React Cookie banner dismissable with just a scroll!
 * @param children - custom component rendered if user has not accepted cookies
 * @param message - message written inside default cookie banner
 * @param onAccept - called when user accepts cookies
 * @param link - object with infos used to render a link to your cookie-policy page
 * @param buttonMessage - message written inside the button of the default cookie banner
 * @param cookie - cookie-key used to save user's decision about you cookie-policy
 * @param cookieExpiration - used to set the cookie expiration
 * @param dismissOnScroll - whether the cookie banner should be dismissed on scroll or not
 * @param dismissOnScrollThreshold -
 *   amount of pixel the user need to scroll to dismiss the cookie banner
 * @param closeIcon - className passed to close-icon
 * @param disableStyle - pass `true` if you want to disable default style
 * @param styles - object with custom styles used to overwrite default ones
 */
@props(Props, { strict: false })
export default class CookieBanner extends React.Component {

  static defaultProps = {
    onAccept: () => {},
    dismissOnScroll: true,
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

  addOnScrollListener = (props) => {
    const _props = props || this.props;
    if (!this.state.listeningScroll && !this.hasAcceptedCookies() && _props.dismissOnScroll) {
      if (window.attachEvent) {
        //Internet Explorer
        window.attachEvent('onscroll', this.onScroll);
      } else if (window.addEventListener) {
        window.addEventListener('scroll', this.onScroll, false);
      }
      this.setState({ listeningScroll: true });
    }
  }

  removeOnScrollListener = () => {
    if (this.state.listeningScroll) {
      if (window.detachEvent) {
        //Internet Explorer
        window.detachEvent('onscroll', this.onScroll);
      } else if (window.removeEventListener) {
        window.removeEventListener('scroll', this.onScroll, false);
      }
      this.setState({ listeningScroll: false });
    }
  }

  onScroll = () => {
    // tacit agreement buahaha! (evil laugh)
    if (window.pageYOffset > this.props.dismissOnScrollThreshold) {
      this.onAccept();
    }
  }

  getSecondsSinceExpiration = cookieExpiration => {
    if (t.Integer.is(cookieExpiration)) {
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
    const { cookie, cookieExpiration, onAccept } = this.props;

    cookieLite(cookie, true, this.getSecondsSinceExpiration(cookieExpiration));
    onAccept({ cookie });

    if (this.state.listeningScroll) {
      this.removeOnScrollListener();
    } else {
      this.forceUpdate();
    }
  }

  hasAcceptedCookies = () => {
    return (typeof window !== 'undefined') && cookieLite(this.props.cookie);
  }

  getLocals() {
    const {
      onAccept,
      props: {
        message, link, buttonMessage, closeIcon,
        disableStyle, styles, className, children, ...props
      }
    } = this;

    return {
      children,
      onAccept,
      hasAcceptedCookies: this.hasAcceptedCookies(),
      bannerContentProps: {
        ...omit(props, Object.keys(Props)),
        message, onAccept, link, buttonMessage,
        closeIcon, disableStyle, styles, className
      }
    };
  }

  templateChildren({ children, onAccept }) {
    if (t.Function.is(children)) {
      return children(onAccept);
    }
    return children;
  }

  render() {
    const { hasAcceptedCookies, children, bannerContentProps, onAccept } = this.getLocals();

    if (hasAcceptedCookies) {
      return null;
    }

    return children ?
      this.templateChildren({ children, onAccept }) :
      <BannerContent {...bannerContentProps} />;
  }

  componentWillReceiveProps(nextProps) {
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
