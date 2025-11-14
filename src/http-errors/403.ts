import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 403 (Forbidden) error
 *
 * @param message - Error message (defaults to 'Forbidden')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus403 extends HTTPError {
	constructor(message = 'Forbidden', jsx?: JSX.Element) {
		super(403, message, jsx);
	}
}
