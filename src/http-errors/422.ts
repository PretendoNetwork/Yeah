import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 422 (Unprocessable Content) error
 *
 * @param message - Error message (defaults to 'Unprocessable Content')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus422 extends HTTPError {
	constructor(message = 'Unprocessable Content', jsx?: JSX.Element) {
		super(422, message, jsx);
	}
}
