[![Build Status](https://drone.our.buildo.io/api/badges/buildo/react-cookie-banner/status.svg)](https://drone.our.buildo.io/buildo/react-cookie-banner) ![](https://img.shields.io/npm/v/react-cookie-banner.svg)

# React Cookie Banner

React Cookie banner which can be dismissed with just a scroll. Because fuck The Cookie Law that's why.

If you *really* want to annoy your users you can disable this feature (highly discouraged!).

```jsx
import CookieBanner from 'react-cookie-banner';

React.renderComponent(
  <div>
    <CookieBanner
      message='Yes, we use cookies. If you don't like it change website, we won't miss you!'
      onAccept={() => {}}
      cookie='user-has-accepted-cookies' />
  </div>,
  document.body
);
```

[Live Examples](http://react-components.buildo.io/#cookiebanner)

### Install
```
npm install --save react-cookie-banner
```

### API
You can see `CookieBanner`'s props in its own [README.md](https://github.com/buildo/react-cookie-banner/blob/master/src/README.md)

### Style
ReactCookieBanner by default uses its simple inline style. However you can easily disable it by passing

```jsx
<CookieBanner disableStyle={true} />
```

In this case you can style it using css classes. The banner is structured as follows:

```jsx
<div className={this.props.className + ' react-cookie-banner'}
  <span className='cookie-message'>
    {this.props.message}
    <a className='cookie-link'>
      Learn more
    </a>
  </span>
  <div className='button-close'>
    Got it
  </div>
</div>
```

You can also pass your own CustomCookieBanner as child component which will be rendered in replacement:

```jsx
<CookieBanner>
  <CustomCookieBanner {...myCustomProps} /> {/* rendered directly without any <div> wrapper */}
</CookieBanner>
```

Or you override the predefined inline-styles. This examples puts the message font back to normal weight and makes the banner slightly transparent:

```jsx
<CookieBanner
  styles={{
    banner: { backgroundColor: 'rgba(60, 60, 60, 0.8)' },
    message: { fontWeight: 400 }
  }}
  message='...'
/>
```

See `src/styleUtils.js` for which style objects are availble to be overridden.

### Cookie manipulation
ReactCookieBanner uses and exports the library **`browser-cookie-lite`**

You can import and use it as follows:

```js
import {cookie} from 'react-cookie-banner';

// simple set
cookie("test", "a")
// complex set - cookie(name, value, ttl, path, domain, secure)
cookie("test", "a", 60*60*24, "/api", "*.example.com", true)
// get
cookie("test")
// destroy
cookie("test", "", -1)
```

Please refer to [browser-cookie-lite](https://github.com/litejs/browser-cookie-lite) repo for more documentation.
