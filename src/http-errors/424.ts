import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 424 (Failed Dependency) error
 *
 * @param message - Error message (defaults to 'Failed Dependency')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus424 extends HTTPError {
	constructor(message = 'Failed Dependency', jsx?: JSX.Element) {
		super(424, message, jsx);
	}
}
