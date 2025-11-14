import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 428 (Precondition Required) error
 *
 * @param message - Error message (defaults to 'Precondition Required')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus428 extends HTTPError {
	constructor(message = 'Precondition Required', jsx?: JSX.Element) {
		super(428, message, jsx);
	}
}
