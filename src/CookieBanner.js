import React from 'react';
import {cookie} from 'browser-cookie-lite';
import styleUtils from './styleUtils';

const CookieBanner = React.createClass({

  propTypes: {
    message:         React.PropTypes.string.isRequired,
    // shortMessage:    React.PropTypes.string,
    onAccept:        React.PropTypes.func,
    // onDeny:          React.PropTypes.func,
    learnMore:       React.PropTypes.string,
    dismissOnScroll: React.PropTypes.bool,
    closeIcon:       React.PropTypes.string,
    disableStyle:    React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      className: '',
      onAccept: () => {},
      dismissOnScroll: true
    };
  },

  getInitialState() {
    return {
      acceptsCookies: cookie('accepts-cookies')
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
    console.log('accepted');
    cookie('accepts-cookies', true);
    this.setState({acceptsCookies: cookie('accepts-cookies')});
    this.props.onAccept({'accepts-cookies': true});
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

  getLearnMore() {
    if (this.props.learnMore) {
      return <a href={this.props.learnMore} style={this.getStyle('learnMore')}>Learn more</a>;
    }
  },

  getBanner() {
    return (
      <div className={this.props.className + ' react-cookie-banner'} style={this.getStyle('banner')}>
        <span className='cookie-message' style={this.getStyle('message')}>
          {this.props.message}
          {this.getLearnMore()}
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
