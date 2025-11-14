import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 431 (Request Header Fields Too Large) error
 *
 * @param message - Error message (defaults to 'Request Header Fields Too Large')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus431 extends HTTPError {
	constructor(message = 'Request Header Fields Too Large', jsx?: JSX.Element) {
		super(431, message, jsx);
	}
}
