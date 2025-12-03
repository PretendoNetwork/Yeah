import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 508 (Loop Detected) error
 *
 * @param message - Error message (defaults to 'Loop Detected')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus508 extends HTTPError {
	constructor(message = 'Loop Detected', jsx?: JSX.Element) {
		super(508, message, jsx);
	}
}
