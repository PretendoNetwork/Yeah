import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 425 (Too Early) error
 *
 * @param message - Error message (defaults to 'Too Early')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus425 extends HTTPError {
	constructor(message = 'Too Early', jsx?: JSX.Element) {
		super(425, message, jsx);
	}
}
