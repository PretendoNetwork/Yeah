import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 510 (Not Extended) error
 *
 * @param message - Error message (defaults to 'Not Extended')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus510 extends HTTPError {
	constructor(message = 'Not Extended', jsx?: JSX.Element) {
		super(510, message, jsx);
	}
}
