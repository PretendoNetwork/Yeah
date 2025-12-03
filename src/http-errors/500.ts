import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 500 (Internal Server Error) error
 *
 * @param message - Error message (defaults to 'Internal Server Error')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus500 extends HTTPError {
	constructor(message = 'Internal Server Error', jsx?: JSX.Element) {
		super(500, message, jsx);
	}
}
