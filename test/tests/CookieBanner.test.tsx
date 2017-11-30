import * as React from 'react';
import { shallow, mount } from 'enzyme';

import CookieBanner from '../../src';

function resetCookies() {
  const cookies = document.cookie.split(';');

  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
};

beforeEach(resetCookies);

describe('secondsSinceExpiration', () => {
  const { getSecondsSinceExpiration } = new CookieBanner({ onAccept: () => {} });

  it('should return "cookieExpiration" if it is an integer', () => {
    expect(getSecondsSinceExpiration(12345)).toBe(12345);
  });

  it('should transform "years", "days" and "hours" into seconds', () => {
    expect(getSecondsSinceExpiration({ years: 1, days: 10, hours: 5 })).toBe(32418000);
  });

  it('should handle missing "years", "days" or "hours"', () => {
    expect(getSecondsSinceExpiration({ days: 10 })).toBe(864000);
    expect(getSecondsSinceExpiration({})).toBe(0);
  });

});

describe('CookieBanner', () => {

  it('should be displayed if no cookies are set', () => {
    const component = shallow(
      <CookieBanner message='cookie message' onAccept={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should hide on click', () => {
    const component = mount(
      <CookieBanner message='cookie message' onAccept={() => {}} />
    );

    expect(component.find('.react-cookie-banner')).toHaveLength(1);
    component.find('.button-close').simulate('click');
    expect(component.find('.react-cookie-banner')).toHaveLength(0);
  });

  it('should hide on click when dismissOnScroll is false', () => {
    const component = mount(
      <CookieBanner message='cookie message' onAccept={() => {}} dismissOnScroll={false} />
    );

    expect(component.find('.react-cookie-banner')).toHaveLength(1);
    component.find('.button-close').simulate('click');
    expect(component.find('.react-cookie-banner')).toHaveLength(0);
  });

  it('should be displayed with correct message', () => {
    const component = mount(
      <CookieBanner message='cookie message' onAccept={() => {}} />
    );

    expect(component.find('.cookie-message').text()).toBe('cookie message');
  });

  it('should be replaced with custom child component', () => {
    const MyComponent = () => (
      <div className='my-component' />
    );

    const component = mount(
      <CookieBanner message='cookie message' onAccept={() => {}}>
        <MyComponent />
      </CookieBanner>
    );

    expect(component.find('.my-component')).toHaveLength(1);
  });

  it('should be replaced with custom child component using function', () => {
    const MyOtherComponent = ({ onAccept }) => (
      <div className='my-other-component' onClick={onAccept} />
    );

    const customTrigger = onAccept => <MyOtherComponent onAccept={onAccept} />;

    const component = mount(
      <CookieBanner onAccept={() => {}}>
        {customTrigger}
      </CookieBanner>
    );

    expect(component.find('.my-other-component')).toHaveLength(1);
  });

});
