import HTTPError from '@/http-errors/http-error';
import type { JSX } from 'react';

/**
 * Creates an HTTP 402 (Payment Required) error
 *
 * @param message - Error message (defaults to 'Payment Required')
 * @param jsx - Optional JSX element to render on the error page
 */
export default class HTTPStatus402 extends HTTPError {
	constructor(message = 'Payment Required', jsx?: JSX.Element) {
		super(402, message, jsx);
	}
}
