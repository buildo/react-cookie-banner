import React from 'react';
import {cookie} from 'browser-cookie-lite';
import styleUtils from './styleUtils';

const CookieBanner = React.createClass({
  /*eslint-disable */
  propTypes: {
    message:                  React.PropTypes.string,
    onAccept:                 React.PropTypes.func,
    link:                     React.PropTypes.shape({
                                msg: React.PropTypes.string,
                                url: React.PropTypes.string.isRequired,
                              }),
    buttonMessage:            React.PropTypes.string,
    cookie:                   React.PropTypes.string,
    dismissOnScroll:          React.PropTypes.bool,
    dismissOnScrollThreshold: React.PropTypes.number,
    closeIcon:                React.PropTypes.string,
    disableStyle:             React.PropTypes.bool,
    children:                 React.PropTypes.element
  },
  /*eslint-enable */

  getDefaultProps() {
    return {
      onAccept: () => {},
      dismissOnScroll: true,
      cookie: 'accepts-cookies',
      buttonMessage: 'Got it',
      className: '',
      dismissOnScrollThreshold: 0
    };
  },

  getInitialState() {
    return {
      listeningScroll: this.props.dismissOnScroll
    };
  },

  componentDidMount() {
    if (!this.acceptsCookies() && this.props.dismissOnScroll) {
      window.onscroll = this.onScroll;
    }
  },

  onScroll() {
    // tacit agreement buahaha! (evil laugh)
    if (window.pageYOffset > this.props.dismissOnScrollThreshold) {
      this.onAccept();
    }
  },

  onAccept() {
    cookie(this.props.cookie, true);
    this.props.onAccept({cookie: this.props.cookie});
    if (this.props.dismissOnScroll) {
      window.onscroll = null;
      this.setState({listeningScroll: false});
    }
  },

  getStyle(style) {
    if (!this.props.disableStyle) {
      return styleUtils.getStyle(style);
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
      <div className={this.props.className + ' react-cookie-banner'} style={this.getStyle('banner')}>
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
    if (!this.acceptsCookies() && nextProps.dismissOnScroll && !this.state.listeningScroll) {
      window.onscroll = this.onScroll;
      this.setState({listeningScroll: true});
    }
  },

});

export default CookieBanner;
