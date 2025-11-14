import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 416 (Range Not Satisfiable) error
 *
 * @param message - Error message (defaults to 'Range Not Satisfiable')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus416 extends HTTPError {
	constructor(message = 'Range Not Satisfiable', jsx?: JSX.Element) {
		super(416, message, jsx);
	}
}
