import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 407 (Proxy Authentication Required) error
 *
 * @param message - Error message (defaults to 'Proxy Authentication Required')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus407 extends HTTPError {
	constructor(message = 'Proxy Authentication Required', jsx?: JSX.Element) {
		super(407, message, jsx);
	}
}
