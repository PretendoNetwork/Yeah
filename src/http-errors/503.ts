import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 503 (Service Unavailable) error
 *
 * @param message - Error message (defaults to 'Service Unavailable')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus503 extends HTTPError {
	constructor(message = 'Service Unavailable', jsx?: JSX.Element) {
		super(503, message, jsx);
	}
}
