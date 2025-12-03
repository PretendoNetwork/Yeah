import type { MiddlewareContext } from '@pretendonetwork/yeah/context';

export default function authMiddleware(ctx: MiddlewareContext) {
	console.log('middleware called');

	ctx.next();

	// return ctx.response.send('error')
}