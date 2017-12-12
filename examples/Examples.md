### Examples

```js
class Component extends React.Component {

  constructor(props) {
    super(props);
    cookies.set('accepts-cookies', '');
    this.state = { dismissOnScroll: true }

    this.resetCookies = this.resetCookies.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.toggleDismissOnScroll = this.toggleDismissOnScroll.bind(this);
  }

  resetCookies() {
    cookies.set('accepts-cookies', '');
    this.forceUpdate();
  }

  onAccept() {
    this.forceUpdate();
  }

  toggleDismissOnScroll() {
    this.setState({ dismissOnScroll: !this.state.dismissOnScroll });
  }

  render() {
    return (
      <div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 999 }}>
          <CookieBanner
            styles={{
              banner: {
                fontFamily: 'Source Sans Pro',
                height: 57,
                background: 'rgba(52, 64, 81, 0.88) url(/cookie.png) 20px 50% no-repeat',
                backgroundSize: '30px 30px',
                backgroundColor: '',
                fontSize: '15px',
                fontWeight: 600
              },
              button: {
                border: '1px solid white',
                borderRadius: 4,
                width: 66,
                height: 32,
                lineHeight: '32px',
                background: 'transparent',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                opacity: 1,
                right: 20,
                marginTop: -18
              },
              message: {
                display: 'block',
                padding: '9px 67px',
                lineHeight: 1.3,
                textAlign: 'left',
                marginRight: 244,
                color: 'white'
              },
              link: {
                textDecoration: 'none',
                fontWeight: 'bold'
              }
            }}
            message="Buildo uses cookies to guarantee users the employment of its site features, offering a better purchasing experience. By continuing to browse the site you're agreeing to our use of cookies."
            link={{ msg: 'More information on our use of cookies', url: 'http://nocookielaw.com/' }}
            buttonMessage='Close'
            dismissOnScroll={this.state.dismissOnScroll}
            onAccept={this.onAccept}
          />
        </div>
        <div>
          <p>
            accepts-cookies: {cookies.get('accepts-cookies') ? 'true' : 'false'}
          </p>
          <button size='small' onClick={this.toggleDismissOnScroll}>
            {`${this.state.dismissOnScroll ? 'Disable' : 'Activate'} dismissOnScroll`}
          </button>
          <button size='small' onClick={this.resetCookies} style={{ marginLeft: 20 }}>
            Reset Cookies
          </button>
        </div>
      </div>
    );
  }

}

<Component />
```

#### Server side rendering
You can pass your own `cookies` instance to `CookiesProvider` to support SSR:

```js
// import { Cookies, CookiesProvider, CookieBannerUniversal } from 'react-cookie-banner';

const cookies = new Cookies(/* Your cookie header, on browser defaults to document.cookie */);

<CookiesProvider cookies={cookies}>
  <CookieBannerUniversal />
</CookiesProvider>
```
