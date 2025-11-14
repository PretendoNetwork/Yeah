import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 511 (Network Authentication Required) error
 *
 * @param message - Error message (defaults to 'Network Authentication Required')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus511 extends HTTPError {
	constructor(message = 'Network Authentication Required', jsx?: JSX.Element) {
		super(511, message, jsx);
	}
}
