import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 451 (Unavailable For Legal Reasons) error
 *
 * @param message - Error message (defaults to 'Unavailable For Legal Reasons')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus451 extends HTTPError {
	constructor(message = 'Unavailable For Legal Reasons', jsx?: JSX.Element) {
		super(451, message, jsx);
	}
}
