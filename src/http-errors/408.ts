import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 408 (Request Timeout) error
 *
 * @param message - Error message (defaults to 'Request Timeout')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus408 extends HTTPError {
	constructor(message = 'Request Timeout', jsx?: JSX.Element) {
		super(408, message, jsx);
	}
}
