import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 405 (Method Not Allowed) error
 *
 * @param message - Error message (defaults to 'Method Not Allowed')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus405 extends HTTPError {
	constructor(message = 'Method Not Allowed', jsx?: JSX.Element) {
		super(405, message, jsx);
	}
}
