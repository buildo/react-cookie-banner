import React from 'react';
import {cookie} from 'browser-cookie-lite';
import styleUtils from './styleUtils';

const CookieBanner = React.createClass({
  /*eslint-disable */
  propTypes: {
    message:         React.PropTypes.string,
    onAccept:        React.PropTypes.func,
    link:            React.PropTypes.shape({
                       msg: React.PropTypes.string,
                       url: React.PropTypes.string.isRequired,
                     }),
    cookie:          React.PropTypes.string,
    dismissOnScroll: React.PropTypes.bool,
    closeIcon:       React.PropTypes.string,
    disableStyle:    React.PropTypes.bool,
    children:        React.PropTypes.element
  },
  /*eslint-enable */

  getDefaultProps() {
    return {
      className: '',
      onAccept: () => {},
      dismissOnScroll: true,
      cookie: 'accepts-cookies'
    };
  },

  getInitialState() {
    return {
      acceptsCookies: cookie(this.props.cookie)
    };
  },

  componentDidMount() {
    if (!this.state.acceptsCookies && this.props.dismissOnScroll) {
      window.onscroll = this.onScroll;
    }
  },

  onScroll() {
    // tacit agreement buahaha! (evil laugh)
    this.onAccept();
  },

  onAccept() {
    cookie(this.props.cookie, true);
    this.setState({acceptsCookies: cookie(this.props.cookie)});
    this.props.onAccept({cookie: this.props.cookie});
    if (this.props.dismissOnScroll) {
      window.onscroll = null;
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
    return <div className='button-close' onClick={this.onAccept} style={this.getStyle('button')}>Got it</div>;
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

  render() {
    return this.state.acceptsCookies ? null : this.getBanner();
  }

});

export default CookieBanner;
