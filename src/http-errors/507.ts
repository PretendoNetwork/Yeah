import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 507 (Insufficient Storage) error
 *
 * @param message - Error message (defaults to 'Insufficient Storage')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus507 extends HTTPError {
	constructor(message = 'Insufficient Storage', jsx?: JSX.Element) {
		super(507, message, jsx);
	}
}
