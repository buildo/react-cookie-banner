import React from 'react';
import cx from 'classnames';
import omit from 'lodash.omit';
import { t, props } from 'tcomb-react';
import { cookie as cookieLite } from 'browser-cookie-lite';
import styleUtils from './styleUtils';
t.interface.strict = true;

const Props = {
  children: t.maybe(t.union([
    t.ReactChildren,
    t.Function
  ])),
  message: t.maybe(t.String),
  onAccept: t.maybe(t.Function),
  link: t.maybe(t.interface({
    msg: t.maybe(t.String),
    url: t.String,
    target: t.maybe(t.enums.of(['_blank', '_self', '_parent', '_top', 'framename']))
  })),
  buttonMessage: t.maybe(t.String),
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
  dismissOnScrollThreshold: t.maybe(t.Number),
  closeIcon: t.maybe(t.String),
  disableStyle: t.maybe(t.Boolean),
  styles: t.maybe(t.Object),
  className: t.maybe(t.String)
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

  getStyle = (style) => {
    const { disableStyle, styles } = this.props;
    if (!disableStyle) {
      // apply custom styles if available
      return { ...styleUtils.getStyle(style), ...styles[style] };
    }
  }

  getCloseButton = () => {
    const { closeIcon, buttonMessage } = this.props;
    if (closeIcon) {
      return <i className={closeIcon} onClick={this.onAccept} style={this.getStyle('icon')}/>;
    }
    return (
      <div className='button-close' onClick={this.onAccept} style={this.getStyle('button')}>
        {buttonMessage}
      </div>
    );
  }

  getLink = () => {
    const { link } = this.props;
    if (link) {
      return (
        <a
          href={link.url}
          target={link.target}
          className='cookie-link'
          style={this.getStyle('link')}
        >
            {link.msg || 'Learn more'}
        </a>
      );
    }
  }

  getBanner = () => {
    const { children, className, message } = this.props;
    if (children) {
      if (t.Function.is(children)) {
        return children(this.onAccept);
      }
      return children;
    }

    const props = omit(this.props, Object.keys(Props));
    const computedClassName = cx('react-cookie-banner', className);
    return (
      <div {...props} className={computedClassName} style={this.getStyle('banner')}>
        <span className='cookie-message' style={this.getStyle('message')}>
          {message}
          {this.getLink()}
        </span>
        {this.getCloseButton()}
      </div>
    );
  }

  hasAcceptedCookies = () => {
    return (typeof window !== 'undefined') && cookieLite(this.props.cookie);
  }

  render() {
    return this.hasAcceptedCookies() ? null : this.getBanner();
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
