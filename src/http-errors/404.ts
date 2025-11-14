import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 404 (Not Found) error
 *
 * @param message - Error message (defaults to 'Not Found')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus404 extends HTTPError {
	constructor(message = 'Not Found', jsx?: JSX.Element) {
		super(404, message, jsx);
	}
}
