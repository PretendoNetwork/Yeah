import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 411 (Length Required) error
 *
 * @param message - Error message (defaults to 'Length Required')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus411 extends HTTPError {
	constructor(message = 'Length Required', jsx?: JSX.Element) {
		super(411, message, jsx);
	}
}
