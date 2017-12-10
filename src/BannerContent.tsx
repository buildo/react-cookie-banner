import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as omit from 'lodash.omit';
import * as cx from 'classnames';
import * as styleUtils from './styleUtils';

export type Props = {
  /** message written inside default cookie banner */
  message?: string,
  /** called when user accepts cookies */
  onAccept: () => void,
  /** object with infos used to render a link to your cookie-policy page */
  link?: {
    msg?: string,
    url: string,
    target?: '_blank' | '_self' | '_parent' | '_top' | 'framename',
    rel?: string,
  },
  /** message written inside the button of the default cookie banner */
  buttonMessage?: string,
  /** className passed to close-icon */
  closeIcon?: string,
  /** pass `true` if you want to disable default style */
  disableStyle?: boolean,
  /** object with custom styles used to overwrite default ones */
  styles?: object,
  className?: string
}

export const propTypes = {
  message: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  link: PropTypes.shape({
    msg: PropTypes.string,
    url: PropTypes.string.isRequired,
    target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top', 'framename'])
  }),
  buttonMessage: PropTypes.string,
  closeIcon: PropTypes.string,
  disableStyle: PropTypes.bool,
  styles: PropTypes.object,
  className: PropTypes.string
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

  templateLink = (style: React.CSSProperties, link?: Props['link']) => {
    if (link) {
      const { url: href, target, rel, msg } = link;
      return (
        <a className='cookie-link' {...{ href, target, style, rel }}>
          {msg || 'Learn more'}
        </a>
      );
    }
  }

  render() {
    const {
      getStyle,
      props: { onAccept, className, message, link, closeIcon, buttonMessage = 'Got it', ..._wrapperProps }
    } = this;

    const cookieMessageStyle = getStyle('message');
    const wrapperProps = {
      ...omit(_wrapperProps, Object.keys(propTypes)),
      className: cx('react-cookie-banner', className),
      style: getStyle('banner')
    };

    return (
      <div {...wrapperProps}>
        <span className='cookie-message' style={cookieMessageStyle}>
          {message}
          {this.templateLink(getStyle('link'), link)}
        </span>
        {!closeIcon && this.templateCloseButton(buttonMessage, onAccept, getStyle('button'))}
        {!!closeIcon && this.templateCloseIcon(closeIcon, onAccept, getStyle('icon'))}
      </div>
    );
  }

}
