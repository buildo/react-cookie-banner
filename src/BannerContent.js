import React from 'react';
import omit from 'lodash.omit';
import cx from 'classnames';
import { t, props } from 'tcomb-react';
import styleUtils from './styleUtils';
t.interface.strict = true;

export const Props = {
  message: t.maybe(t.String),
  onAccept: t.Function,
  link: t.maybe(t.interface({
    msg: t.maybe(t.String),
    url: t.String,
    target: t.maybe(t.enums.of(['_blank', '_self', '_parent', '_top', 'framename']))
  })),
  buttonMessage: t.maybe(t.String),
  closeIcon: t.maybe(t.String),
  disableStyle: t.maybe(t.Boolean),
  styles: t.maybe(t.Object),
  className: t.maybe(t.String)
};


/** React Cookie banner template
 * @param message - message written inside default cookie banner
 * @param onAccept - called when user accepts cookies
 * @param link - object with infos used to render a link to your cookie-policy page
 * @param buttonMessage - message written inside the button of the default cookie banner
 * @param closeIcon - className passed to close-icon
 * @param disableStyle - pass `true` if you want to disable default style
 * @param styles - object with custom styles used to overwrite default ones
 */
@props(Props, { strict: false })
export default class BannerContent extends React.Component {

  static defaultProps = {
    buttonMessage: 'Got it',
    styles: {}
  };

  getStyle = (style) => {
    const { disableStyle, styles } = this.props;
    if (!disableStyle) {
      // apply custom styles if available
      return { ...styleUtils.getStyle(style), ...styles[style] };
    }
  }

  templateCloseIcon = ({ className, onClick, style }) => (
    <i {...{ className, onClick, style }} />
  )

  templateCloseButton = ({ buttonMessage, onClick, style }) => (
    <div className='button-close' {...{ onClick, style }}>
      {buttonMessage}
    </div>
  )

  templateLink = ({ link, style }) => {
    if (link) {
      const { url: href, target, msg } = link;
      return (
        <a className='cookie-link' {...{ href, target, style }}>
          {msg || 'Learn more'}
        </a>
      );
    }
  }

  getLocals() {
    const {
      getStyle,
      props: { onAccept, className, message, link, closeIcon, buttonMessage, ...wrapperProps }
    } = this;

    return {
      message,
      cookieMessageStyle: getStyle('message'),
      wrapperProps: {
        ...omit(wrapperProps, Object.keys(Props)),
        className: cx('react-cookie-banner', className),
        style: getStyle('banner')
      },
      linkProps: {
        link,
        style: getStyle('link')
      },
      closeButtonProps: !closeIcon && {
        buttonMessage,
        onClick: onAccept,
        style: getStyle('button')
      },
      closeIconProps: !!closeIcon && {
        className: closeIcon,
        onClick: onAccept,
        style: getStyle('icon')
      }
    };
  }

  render() {
    const {
      message, cookieMessageStyle, wrapperProps,
      linkProps, closeButtonProps, closeIconProps
    } = this.getLocals();

    return (
      <div {...wrapperProps}>
        <span className='cookie-message' style={cookieMessageStyle}>
          {message}
          {this.templateLink(linkProps)}
        </span>
        {closeButtonProps && this.templateCloseButton(closeButtonProps)}
        {closeIconProps && this.templateCloseIcon(closeIconProps)}
      </div>
    );
  }

}
