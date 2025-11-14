import type { JSX } from 'react';

export default class HTTPError extends Error {
	public statusCode: number;
	public jsx?: JSX.Element;

	constructor(statusCode: number, message: string, jsx?: JSX.Element) {
		super(message);

		this.statusCode = statusCode;
		this.name = this.constructor.name;
		this.jsx = jsx;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
