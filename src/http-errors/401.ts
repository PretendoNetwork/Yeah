import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 401 (Unauthorized) error
 *
 * @param message - Error message (defaults to 'Unauthorized')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus401 extends HTTPError {
	constructor(message = 'Unauthorized', jsx?: JSX.Element) {
		super(401, message, jsx);
	}
}
