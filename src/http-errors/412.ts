import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 412 (Precondition Failed) error
 *
 * @param message - Error message (defaults to 'Precondition Failed')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus412 extends HTTPError {
	constructor(message = 'Precondition Failed', jsx?: JSX.Element) {
		super(412, message, jsx);
	}
}
