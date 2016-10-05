import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
import expect from 'expect';
import CookieBanner from '../../src/CookieBanner';

const resetCookies = function () {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

const renderBanner = (props) => {
  const component = (
    <div>
      <CookieBanner message='cookie message' {...props} />
    </div>
  );
  const cookieWrapper = TestUtils.renderIntoDocument(component);

  return {
    wrapper: cookieWrapper,
    banner: TestUtils.scryRenderedDOMComponentsWithClass(cookieWrapper, 'react-cookie-banner')
  };
};

beforeEach(resetCookies);

describe('CookieBanner', () => {

  it('should be displayed if no cookies are set', () => {
    const banner = renderBanner().banner;
    expect(banner.length).toBe(1, 'cookie banner is not displayed');
  });

  it('should hide on click', () => {
    const banner = renderBanner().banner[0];
    const closeButton = TestUtils.findRenderedDOMComponentWithClass(banner, 'button-close');
    TestUtils.Simulate.click(closeButton);

    const banner2 = renderBanner().banner[0];
    const cookieBanner2 = TestUtils.scryRenderedDOMComponentsWithClass(banner2, 'react-cookie-banner');
    expect(cookieBanner2.length).toBe(0, 'cookie banner is displayed');
  });

  it('should hide on click when dismissOnScroll is false', () => {
    const { banner, wrapper } = renderBanner({ dismissOnScroll: false });
    const closeButton = TestUtils.findRenderedDOMComponentWithClass(banner[0], 'button-close');
    TestUtils.Simulate.click(closeButton);

    const cookieBanners = TestUtils.scryRenderedDOMComponentsWithClass(wrapper, 'react-cookie-banner');
    expect(cookieBanners.length).toBe(0, 'cookie banner is displayed');
  });

  it('should be displayed with correct message', () => {
    const cookieWrapper = TestUtils.renderIntoDocument(
      <div>
        <CookieBanner message='cookie message' />
      </div>
    );

    const messageWrapper = TestUtils.findRenderedDOMComponentWithClass(cookieWrapper, 'cookie-message');
    const message = messageWrapper.getDOMNode().firstChild;
    expect(message.innerHTML).toBe('cookie message', 'wrong message displayed');
  });

  it('should be replaced with custom child component', () => {

    const MyComponent = React.createClass({
      render() {
        return <div className='my-component'/>;
      }
    });

    const component = (
      <div>
        <CookieBanner>
          <MyComponent />
        </CookieBanner>
      </div>
    );

    const cookieWrapper = TestUtils.renderIntoDocument(component);

    const banner = TestUtils.scryRenderedDOMComponentsWithClass(cookieWrapper, 'react-cookie-banner');
    expect(banner.length).toBe(0, 'cookie banner is being displayed');

    const _myComponent = TestUtils.scryRenderedDOMComponentsWithClass(cookieWrapper, 'my-component');
    expect(_myComponent.length).toBe(1, 'cookie banner is not displaing custom child component');
  });

});
