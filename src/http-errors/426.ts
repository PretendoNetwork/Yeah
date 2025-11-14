import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 426 (Upgrade Required) error
 *
 * @param message - Error message (defaults to 'Upgrade Required')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus426 extends HTTPError {
	constructor(message = 'Upgrade Required', jsx?: JSX.Element) {
		super(426, message, jsx);
	}
}
