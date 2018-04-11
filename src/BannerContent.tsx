import * as React from 'react';
import * as PropTypes from 'prop-types';
import omit = require('lodash.omit');
import * as cx from 'classnames';
import * as styleUtils from './styleUtils';

export type Props = {
  /** message written inside default cookie banner */
  message?: string,
  /** called when user accepts cookies */
  onAccept: () => void,
  /** JSX element to link to your cookie-policy page */
  link?: JSX.Element,
  /** message written inside the button of the default cookie banner */
  buttonMessage?: string,
  /** className passed to close-icon */
  closeIcon?: string,
  /** pass `true` if you want to disable default style */
  disableStyle?: boolean,
  /** object with custom styles used to overwrite default ones */
  styles?: object,
  className?: string,
  /** pass `true` if you want to dismiss by clicking anywhere on the banner */
  dismissOnClick?: boolean
}

export const propTypes = {
  message: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  link: PropTypes.element,
  buttonMessage: PropTypes.string,
  closeIcon: PropTypes.string,
  disableStyle: PropTypes.bool,
  styles: PropTypes.object,
  className: PropTypes.string,
  dismissOnClick: PropTypes.bool
};


/**
 * React Cookie banner template
 */
export default class BannerContent extends React.Component<Props> {

  static propTypes = propTypes

  getStyle = (style: 'message' | 'banner' | 'link' | 'button' | 'icon') => {
    const { disableStyle, styles = {} } = this.props;
    if (!disableStyle) {
      // apply custom styles if available
      return { ...styleUtils.getStyle(style), ...styles[style] };
    }
  }

  templateCloseIcon = (className: string, onClick: () => void, style: React.CSSProperties ) => (
    <button {...{ onClick, style }}>
      <i {...{ className }} />
    </button>
  )

  templateCloseButton = (buttonMessage: string, onClick: () => void, style: React.CSSProperties) => (
    <button className='button-close' {...{ onClick, style }}>
      {buttonMessage}
    </button>
  )

  templateLink = (link: JSX.Element, style: React.CSSProperties) => (
    React.cloneElement(link, link.props.style ? undefined : { style })
  )

  render() {
    const {
      getStyle,
      props: {
        onAccept, className, message,
        closeIcon, link, buttonMessage = 'Got it',
        ..._wrapperProps
      }
    } = this;

    const cookieMessageStyle = getStyle('message');
    const wrapperProps = {
      ...omit(_wrapperProps, Object.keys(propTypes)),
      className: cx('react-cookie-banner', className),
      style: getStyle('banner')
    };

    return (
      <div {...wrapperProps} onClick={this.bannerClicked}>
        <span className='cookie-message' style={cookieMessageStyle}>
          {message}
          {link && this.templateLink(link, getStyle('link'))}
        </span>
        {!closeIcon && this.templateCloseButton(buttonMessage, onAccept, getStyle('button'))}
        {!!closeIcon && this.templateCloseIcon(closeIcon, onAccept, getStyle('icon'))}
      </div>
    );
  }

  bannerClicked = () => {
    if (this.props.dismissOnClick) {
      this.props.onAccept();
    }
  }

}
