import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 413 (Content Too Large) error
 *
 * @param message - Error message (defaults to 'Content Too Large')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus413 extends HTTPError {
	constructor(message = 'Content Too Large', jsx?: JSX.Element) {
		super(413, message, jsx);
	}
}
