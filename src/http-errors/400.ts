import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 400 (Bad Request) error
 *
 * @param message - Error message (defaults to 'Bad Request')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus400 extends HTTPError {
	constructor(message = 'Bad Request', jsx?: JSX.Element) {
		super(400, message, jsx);
	}
}
