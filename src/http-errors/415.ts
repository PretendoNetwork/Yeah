import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 415 (Unsupported Media Type) error
 *
 * @param message - Error message (defaults to 'Unsupported Media Type')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus415 extends HTTPError {
	constructor(message = 'Unsupported Media Type', jsx?: JSX.Element) {
		super(415, message, jsx);
	}
}
