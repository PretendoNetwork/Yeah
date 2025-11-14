import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 414 (URI Too Long) error
 *
 * @param message - Error message (defaults to 'URI Too Long')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus414 extends HTTPError {
	constructor(message = 'URI Too Long', jsx?: JSX.Element) {
		super(414, message, jsx);
	}
}
