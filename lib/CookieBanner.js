'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _browserCookieLite = require('browser-cookie-lite');

var _styleUtils = require('./styleUtils');

var _styleUtils2 = _interopRequireDefault(_styleUtils);

var CookieBanner = _react2['default'].createClass({
  displayName: 'CookieBanner',

  propTypes: {
    message: _react2['default'].PropTypes.string.isRequired,
    // shortMessage:    React.PropTypes.string,
    onAccept: _react2['default'].PropTypes.func,
    // onDeny:          React.PropTypes.func,
    learnMore: _react2['default'].PropTypes.string,
    dismissOnScroll: _react2['default'].PropTypes.bool,
    closeIcon: _react2['default'].PropTypes.string,
    disableStyle: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      onAccept: function onAccept() {},
      dismissOnScroll: true
    };
  },

  getInitialState: function getInitialState() {
    return {
      acceptsCookies: (0, _browserCookieLite.cookie)('accepts-cookies')
    };
  },

  componentDidMount: function componentDidMount() {
    if (!this.state.acceptsCookies && this.props.dismissOnScroll) {
      window.onscroll = this.onScroll;
    }
  },

  onScroll: function onScroll() {
    // tacit agreement buahaha! (evil laugh)
    this.onAccept();
  },

  onAccept: function onAccept() {
    console.log('accepted');
    (0, _browserCookieLite.cookie)('accepts-cookies', true);
    this.setState({ acceptsCookies: (0, _browserCookieLite.cookie)('accepts-cookies') });
    this.props.onAccept({ 'accepts-cookies': true });
    if (this.props.dismissOnScroll) {
      window.onscroll = null;
    }
  },

  getStyle: function getStyle(style) {
    if (!this.props.disableStyle) {
      return _styleUtils2['default'].getStyle(style);
    }
  },

  getCloseButton: function getCloseButton() {
    if (this.props.closeIcon) {
      return _react2['default'].createElement('i', { className: this.props.closeIcon, onClick: this.onAccept, style: this.getStyle('icon') });
    }
    return _react2['default'].createElement(
      'div',
      { className: 'button-close', onClick: this.onAccept, style: this.getStyle('button') },
      'Got it'
    );
  },

  getLearnMore: function getLearnMore() {
    if (this.props.learnMore) {
      return _react2['default'].createElement(
        'a',
        { href: this.props.learnMore, style: this.getStyle('learnMore') },
        'Learn more'
      );
    }
  },

  getBanner: function getBanner() {
    return _react2['default'].createElement(
      'div',
      { className: this.props.className + ' react-cookie-banner', style: this.getStyle('banner') },
      _react2['default'].createElement(
        'span',
        { className: 'cookie-message', style: this.getStyle('message') },
        this.props.message,
        this.getLearnMore()
      ),
      this.getCloseButton()
    );
  },

  render: function render() {
    return this.state.acceptsCookies ? null : this.getBanner();
  }

});

exports['default'] = CookieBanner;
module.exports = exports['default'];