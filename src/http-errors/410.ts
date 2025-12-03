import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 410 (Gone) error
 *
 * @param message - Error message (defaults to 'Gone')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus410 extends HTTPError {
	constructor(message = 'Gone', jsx?: JSX.Element) {
		super(410, message, jsx);
	}
}
