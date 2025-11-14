import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 501 (Not Implemented) error
 *
 * @param message - Error message (defaults to 'Not Implemented')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus501 extends HTTPError {
	constructor(message = 'Not Implemented', jsx?: JSX.Element) {
		super(501, message, jsx);
	}
}
