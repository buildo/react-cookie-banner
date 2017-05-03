# CookieBanner

React Cookie banner dismissable with just a scroll!

## Props
|Name|Type|Default|Description|
|----|----|-------|-----------|
| **children** | <code>union(ReactChildren &#124; Function)</code> |  | *optional*. Custom component rendered if user has not accepted cookies |
| **message** | <code>String</code> |  | *optional*. Message written inside default cookie banner |
| **onAccept** | <code>Function</code> | <code>"onAccept"</code> | *optional*. Called when user accepts cookies |
| **link** | <code>{msg: ?String, url: String, target: ?"_blank" &#124; "_self" &#124; "_parent" &#124; "_top" &#124; "framename"}</code> |  | *optional*. Object with infos used to render a link to your cookie-policy page |
| **buttonMessage** | <code>String</code> | <code>"Got it"</code> | *optional*. Message written inside the button of the default cookie banner |
| **cookie** | <code>String</code> | <code>"accepts-cookies"</code> | *optional*. Cookie-key used to save user's decision about you cookie-policy |
| **cookieExpiration** | <code>union(Integer &#124; {years: ?Number, days: ?Number, hours: ?Number})</code> | <code>{   "years": 1 }</code> | *optional*. Used to set the cookie expiration |
| **cookiePath** | <code>String</code> |  | *optional*. Used to set the cookie path |
| **dismissOnScroll** | <code>Boolean</code> | <code>true</code> | *optional*. Whether the cookie banner should be dismissed on scroll or not |
| **dismissOnScrollThreshold** | <code>Number</code> | <code>0</code> | *optional*.   amount of pixel the user need to scroll to dismiss the cookie banner |
| **closeIcon** | <code>String</code> |  | *optional*. ClassName passed to close-icon |
| **disableStyle** | <code>Boolean</code> |  | *optional*. Pass `true` if you want to disable default style |
| **styles** | <code>Object</code> | <code>{}</code> | *optional*. Object with custom styles used to overwrite default ones |
| **className** | <code>String</code> |  | *optional*. Additional `className` for wrapper element |