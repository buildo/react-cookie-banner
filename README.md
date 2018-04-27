[![Build Status](https://drone.our.buildo.io/api/badges/buildo/react-cookie-banner/status.svg)](https://drone.our.buildo.io/buildo/react-cookie-banner) ![](https://img.shields.io/npm/v/react-cookie-banner.svg)

# React Cookie Banner

A cookie banner for React that can be dismissed with a simple scroll. Because [fuck the Cookie Law](http://nocookielaw.com/) that's why.

(If you *really* want to annoy your users you can disable this feature but this is strongly discouraged!).

```jsx
import CookieBanner from 'react-cookie-banner';

React.renderComponent(
  <div>
    <CookieBanner
      message="Yes, we use cookies. If you don't like it change website, we won't miss you!"
      onAccept={() => {}}
      cookie="user-has-accepted-cookies" />
  </div>,
  document.body
);
```

[Live Examples](http://react-components.buildo.io/#cookiebanner)

## Install
```
npm install --save react-cookie-banner
```

or using `yarn`:

```
yarn add react-cookie-banner
```

## API
You can see `CookieBanner`'s props in its own [README.md](https://github.com/buildo/react-cookie-banner/blob/master/src/README.md)

## Style
`react-cookie-banner` comes with a nice default style made using inline-style.

Of course, you can customize it as you like in several ways.

Based on how many changes you want to apply, you can style `react-cookie-banner` as follows:

### You like the original style and you wish to make only a few modifications
Why spending hours on the CSS when you have such a nice default style? :)

In this case you can:

#### 1) Override the predefined inline-styles
In this example we change the message font-size and make the banner slightly transparent with the `styles` prop:

```jsx
<CookieBanner
  styles={{
    banner: { backgroundColor: 'rgba(60, 60, 60, 0.8)' },
    message: { fontWeight: 400 }
  }}
  message='...'
/>
```

See [`src/styleUtils.ts`](https://github.com/buildo/react-cookie-banner/blob/master/src/styleUtils.ts) for a complete list of overridable style objects.

#### 2) Beat it with good old CSS (or SASS)

The banner is structured as follows:

```jsx
<div className={this.props.className + ' react-cookie-banner'}
  <span className='cookie-message'>
    {this.props.message}
    <a className='cookie-link'>
      Learn more
    </a>
  </span>
  <button className='button-close'>
    Got it
  </button>
</div>
```

You can style every part of it using the appropriate `className`:

```sass
.your-class-name.react-cookie-banner {
  background-color: rgba(60, 60, 60, 0.8);

  .cookie-message {
    font-weight: 400;
  }
}
```

### You need to heavily adapt the style to your application
Your creative designer wants to change the style of the cookie banner completely?
Don't worry, we got your covered!

If you need to re-style it, you can:

#### 1) Disable the default style and use your CSS

You may disable the default style by simply setting the prop `disableStyle` to `true`:

```jsx
<CookieBanner disableStyle={true} />
```

Now you can re-style the cookie banner completely using your own CSS.

#### 2) Use your own cookie banner!
Don't like the layout either?
You can use your own custom cookie banner component by passing it as `children` and still let `react-cookie-banner` handle the hassle of managing `cookies` for you :)

```jsx
<CookieBanner>
  {(onAccept) => (
    <MyCustomCookieBanner {...myCustomProps} onAccept={onAccept} /> {/* rendered directly without any <div> wrapper */}
  )}
</CookieBanner>
```

## Cookies manipulation
`react-cookie-banner` uses **`universal-cookie`** to manipulate cookies.

You can import the `Cookies` class and use it as follows:

```js
import { Cookies } from 'react-cookie-banner'

const cookies = new Cookies(/* Your cookie header, on browsers defaults to document.cookie */)

// simple set
cookie.set('test', 'a')
// complex set - cookie(name, value, ttl, path, domain, secure)
cookie.set('test', 'a', {
  expires: new Date(2020-05-04)
  path: '/api',
  domain: '*.example.com',
  secure: true
})
// get
cookies.get('test')
// destroy
cookies.remove('test', '', -1)
```

Please refer to [universal-cookie](https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie#api---cookies-class) repo for more documentation.

## Server side rendering (aka Universal)
`react-cookie-banner` supports SSR thanks to `react-cookie`.
If you want to support SSR, you should use the `CookieProvider` from `react-cookie` and the `CookieBannerUniversal` wrapper:

```jsx
import { Cookies, CookiesProvider, CookieBannerUniversal } from 'react-cookie-banner'

const cookies = new Cookies(/* Your cookie header, on browsers defaults to document.cookie */)

<CookiesProvider cookies={cookies}>
  <CookieBannerUniversal />
</CookiesProvider>
```

