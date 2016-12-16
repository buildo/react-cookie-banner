import React from 'react';
import CookieBanner, { BannerContent, cookie } from '../src';

cookie('accepts-cookies', '');

class Example extends React.Component {

  state = {
    dismissOnScroll: true
  }

  resetCookies = () => {
    cookie('accepts-cookies', '');
    this.refresh();
  }

  toggleDismissOnScroll = () => {
    this.setState({ dismissOnScroll: !this.state.dismissOnScroll });
  }

  refresh = () => {
    this.setState({});
  }

  render() {

    const {
      refresh, toggleDismissOnScroll, resetCookies,
      state: { dismissOnScroll }
    } = this;

    const cookieProps = {
      dismissOnScroll,
      onAccept: refresh
    };

    const bannerContentProps = {
      styles: { button: { color: 'blue' } },
      message: 'your own custom message',
      link: { msg: 'link to cookie policy', url: 'http://nocookielaw.com/' },
      buttonMessage: 'close button message'
    };

    return (
      <div style={{ height: 2000, fontFamily: 'sans-serif' }}>

        <CookieBanner {...cookieProps}>
          {(onAccept) => (
            <div onClick={onAccept}>
              <BannerContent {...bannerContentProps} onAccept={onAccept} />
            </div>
          )}
        </CookieBanner>

        <div style={{ margin: 20 }}>
          <p>accepts-cookies: {cookie('accepts-cookies') ? 'true' : 'false'}</p>
          <button onClick={toggleDismissOnScroll}>
            {dismissOnScroll ? 'Disable' : 'Activate'} "dismissOnScroll"
          </button>
          <button onClick={resetCookies}>
            Reset Cookies
          </button>
          <h2>Try dismissing with a scroll</h2>
        </div>

      </div>
    );
  }

}

React.render(<Example />, document.getElementById('container'));
