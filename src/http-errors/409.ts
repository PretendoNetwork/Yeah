import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 409 (Conflict) error
 *
 * @param message - Error message (defaults to 'Conflict')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus409 extends HTTPError {
	constructor(message = 'Conflict', jsx?: JSX.Element) {
		super(409, message, jsx);
	}
}
