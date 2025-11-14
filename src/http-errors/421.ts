import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 421 (Misdirected Request) error
 *
 * @param message - Error message (defaults to 'Misdirected Request')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus421 extends HTTPError {
	constructor(message = 'Misdirected Request', jsx?: JSX.Element) {
		super(421, message, jsx);
	}
}
