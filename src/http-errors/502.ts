import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 502 (Bad Gateway) error
 *
 * @param message - Error message (defaults to 'Bad Gateway')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus502 extends HTTPError {
	constructor(message = 'Bad Gateway', jsx?: JSX.Element) {
		super(502, message, jsx);
	}
}
