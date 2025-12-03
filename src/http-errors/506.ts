import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 506 (Variant Also Negotiates) error
 *
 * @param message - Error message (defaults to 'Variant Also Negotiates')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus506 extends HTTPError {
	constructor(message = 'Variant Also Negotiates', jsx?: JSX.Element) {
		super(506, message, jsx);
	}
}
