import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 505 (HTTP Version Not Supported) error
 *
 * @param message - Error message (defaults to 'HTTP Version Not Supported')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus505 extends HTTPError {
	constructor(message = 'HTTP Version Not Supported', jsx?: JSX.Element) {
		super(505, message, jsx);
	}
}
