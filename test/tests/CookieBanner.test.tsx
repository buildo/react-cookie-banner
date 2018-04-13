import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { shallow, mount } from 'enzyme';

import CookieBanner from '../../src';
import { getStyle } from '../../src/styleUtils';

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

  it('should be displayed with correct default styles', () => {
    const component = mount(
      <CookieBanner message='cookie message' link={<a />} onAccept={() => {}} />
    );

    expect(component.find('.cookie-message').prop('style')).toEqual(getStyle('message'));
    expect(component.find('.button-close').prop('style')).toEqual(getStyle('button'));
    expect(component.find('a').prop('style')).toEqual(getStyle('link'));

    const componentWithIcon = mount(
      <CookieBanner closeIcon='icon' onAccept={() => {}} />
    );

    expect(componentWithIcon.find('.icon').length).toBe(1);
    expect(componentWithIcon.find('button').prop('style')).toEqual(getStyle('icon'));
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

  it('should be displayed with correct link element', () => {
    const children = 'children!'
    const component = mount(
      <CookieBanner link={<a className='cookie-link'>{children}</a>} onAccept={() => {}} />
    );

    const cookieBanner = component.find('.cookie-link');
    expect(cookieBanner.text()).toBe(children);
  });

  it('should not overwrite link\'s style props, if present', () => {
    const style = { color: 'red' }
    const component = mount(
      <CookieBanner link={<a style={style} className='cookie-link' />} onAccept={() => {}} />
    );

    const cookieBanner = component.find('.cookie-link');
    expect(cookieBanner.prop('style')).toEqual(style);
  });

  it('should be displayed with correct link element', () => {
    const children = 'children!'
    const component = mount(
      <CookieBanner link={<a className='cookie-link'>{children}</a>} onAccept={() => {}} />
    );

    expect(component.find('.cookie-link').text()).toBe(children);
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

describe('build', () => {

  it('build script generates every needed file', () => {
    execSync('npm run build')
    expect(fs.readdirSync(path.resolve(__dirname, '../../lib'))).toMatchSnapshot()
  })

})
