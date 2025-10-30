import authMiddleware from '@/middleware/auth';
import type { PageContextWithParams } from '@pretendonetwork/yeah/context';

type Params = {
	pid: string;
};

export const config = {
	middleware: [ authMiddleware ],
	// layout: 'nested/deeply/test'
};

export function Page(ctx: PageContextWithParams<Params>) {
	return (
		<main>hello user {ctx.request.params.pid}</main>
	);
}
