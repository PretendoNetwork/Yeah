import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 406 (Not Acceptable) error
 *
 * @param message - Error message (defaults to 'Not Acceptable')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus406 extends HTTPError {
	constructor(message = 'Not Acceptable', jsx?: JSX.Element) {
		super(406, message, jsx);
	}
}
