import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 423 (Locked) error
 *
 * @param message - Error message (defaults to 'Locked')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus423 extends HTTPError {
	constructor(message = 'Locked', jsx?: JSX.Element) {
		super(423, message, jsx);
	}
}
