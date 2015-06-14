# React Cookie Banner

React Cookie banner which can be dismissed with just a scroll. Because fuck EU that's why.

If you *really* want to annoy your users you can disable this feature (highly discouraged!).

```
var CookieBanner = require('react-cookie-banner');

React.renderComponent(
  <div>
    <CookieBanner message='Yes, we use cookies. If you don't like it change website, we won't miss you!' />
  </div>,
  document.body);
```

###Install
```
npm install --save react-cookie-banner
```



###API
```
  message:         React.PropTypes.string.isRequired,
  onAccept:        React.PropTypes.func,
  link:            React.PropTypes.shape({
                     msg: React.PropTypes.string,
                     url: React.PropTypes.string.isRequired,
                   }),
  cookie:          React.PropTypes.string, // defaults to 'accepts-cookie'
  dismissOnScroll: React.PropTypes.bool, // true by default!
  closeIcon:       React.PropTypes.string, // this should be the className of the icon. if undefined use button
  disableStyle:    React.PropTypes.bool,
  className:       React.PropTypes.string
```
**Coming next**:
```
  shortMessage: React.PropTypes.string, // to be used with smaller screens
```

###Style
ReactCookieBanner by default uses its simple inline style. However you can easily disable it by passing
```
<CookieBanner disableStyle={true} />
```
In this case you can style it using css classes. The banner is structured as follows:
```
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
