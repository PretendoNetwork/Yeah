import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 417 (Expectation Failed) error
 *
 * @param message - Error message (defaults to 'Expectation Failed')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus417 extends HTTPError {
	constructor(message = 'Expectation Failed', jsx?: JSX.Element) {
		super(417, message, jsx);
	}
}
