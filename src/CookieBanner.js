import React from 'react';
import cx from 'classnames';
import { cookie as cookieLite } from 'browser-cookie-lite';
import styleUtils from './styleUtils';

const propTypes = {
  message: React.PropTypes.string,
  onAccept: React.PropTypes.func,
  link: React.PropTypes.shape({
    msg: React.PropTypes.string,
    url: React.PropTypes.string.isRequired,
  }),
  buttonMessage: React.PropTypes.string,
  cookie: React.PropTypes.string,
  dismissOnScroll: React.PropTypes.bool,
  dismissOnScrollThreshold: React.PropTypes.number,
  closeIcon: React.PropTypes.string,
  disableStyle: React.PropTypes.bool,
  styles: React.PropTypes.object,
  children: React.PropTypes.element,
  className: React.PropTypes.string
};

export default React.createClass({

  displayName: 'CookieBanner',

  propTypes: propTypes,

  getDefaultProps() {
    return {
      onAccept: () => {},
      dismissOnScroll: true,
      cookie: 'accepts-cookies',
      buttonMessage: 'Got it',
      dismissOnScrollThreshold: 0,
      styles: {}
    };
  },

  getInitialState() {
    return {
      listeningScroll: false
    };
  },

  componentDidMount() {
    this.addOnScrollListener();
  },

  addOnScrollListener() {
    if (!this.acceptsCookies() && this.props.dismissOnScroll && !this.state.listeningScroll) {
      if (window.attachEvent) {
        //Internet Explorer
        window.attachEvent('onmousewheel', this.onScroll);
      } else if(window.addEventListener) {
        window.addEventListener('mousewheel', this.onScroll, false);
      }
      this.setState({ listeningScroll: true });
    }
  },

  removeOnScrollListener() {
    if (this.state.listeningScroll) {
      if (window.detachEvent) {
        //Internet Explorer
        window.detachEvent('onmousewheel', this.onScroll);
      } else if(window.removeEventListener) {
        window.removeEventListener('mousewheel', this.onScroll, false);
      }
      this.setState({ listeningScroll: false });
    }
  },

  onScroll() {
    // tacit agreement buahaha! (evil laugh)
    if (window.pageYOffset > this.props.dismissOnScrollThreshold) {
      this.onAccept();
    }
  },

  onAccept() {
    const { cookie, onAccept } = this.props;
    cookieLite(cookie, true);
    onAccept({ cookie });
    this.removeOnScrollListener();
  },

  getStyle(style) {
    if (!this.props.disableStyle) {
      let styles = styleUtils.getStyle(style);
      // apply custom styles if available
      if (this.props.styles && this.props.styles[style]) {
        Object.assign(styles, this.props.styles[style]);
      }
      return styles;
    }
  },

  getCloseButton() {
    if (this.props.closeIcon) {
      return <i className={this.props.closeIcon} onClick={this.onAccept} style={this.getStyle('icon')}/>;
    }
    return (
      <div className='button-close' onClick={this.onAccept} style={this.getStyle('button')}>
        {this.props.buttonMessage}
      </div>
    );
  },

  getLink() {
    if (this.props.link) {
      return (
        <a
          href={this.props.link.url}
          className='cookie-link'
          style={this.getStyle('link')}>
            {this.props.link.msg || 'Learn more'}
        </a>
      );
    }
  },

  getBanner() {
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <div {...props} className={cx('react-cookie-banner', className)} style={this.getStyle('banner')}>
        <span className='cookie-message' style={this.getStyle('message')}>
          {this.props.message}
          {this.getLink()}
        </span>
        {this.getCloseButton()}
      </div>
    );
  },

  acceptsCookies() {
    return (typeof window !== 'undefined') && cookie(this.props.cookie);
  },

  render() {
    return this.acceptsCookies() ? null : this.getBanner();
  },

  componentWillReceiveProps(nextProps) {
    this.addOnScrollListener();
  },

  componentWillUnmount() {
    this.removeOnScrollListener();
  }

});