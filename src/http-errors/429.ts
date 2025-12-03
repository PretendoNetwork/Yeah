import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 429 (Too Many Requests) error
 *
 * @param message - Error message (defaults to 'Too Many Requests')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus429 extends HTTPError {
	constructor(message = 'Too Many Requests', jsx?: JSX.Element) {
		super(429, message, jsx);
	}
}
