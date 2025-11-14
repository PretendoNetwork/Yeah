import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 504 (Gateway Timeout) error
 *
 * @param message - Error message (defaults to 'Gateway Timeout')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus504 extends HTTPError {
	constructor(message = 'Gateway Timeout', jsx?: JSX.Element) {
		super(504, message, jsx);
	}
}
