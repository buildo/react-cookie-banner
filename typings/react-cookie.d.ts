// react-cookies typings are in WIP... copied the following from https://github.com/reactivestack/cookies/issues/107

declare module 'react-cookie' {
  import { Component, ComponentClass } from 'react';

  export type Cookie = string;

  export class CookiesProvider extends Component<{},{}>{}

  export function withCookies<T>(Component: ComponentClass): ComponentClass<T>;

  export interface ReactCookieGetOptions{
    doNotParse?: boolean;
  }

  export interface ReactCookieGetAllOptions{
    doNotParse?: boolean;
  }

  export interface ReactCookieSetOptions{
    path?: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
  }

  export interface ReactCookieRemoveOptions{
    path?: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
  }

  export class Cookies {
    get: (key: string, options?: ReactCookieGetOptions) => Cookie | undefined;
    getAll: (options?: ReactCookieGetAllOptions) => Cookie[];
    set(name: string, value: any, options?: ReactCookieSetOptions): void;
    remove(name: string, options?: ReactCookieRemoveOptions): void;
  }
}
