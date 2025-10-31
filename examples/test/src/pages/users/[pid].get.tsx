import authMiddleware from '@/middleware/auth';
import type { PageContextWithParams } from '@pretendonetwork/yeah/context';

type Params = {
	pid: string;
};

export const config = {
	middleware: [ authMiddleware ],
	// layout: 'nested/deeply/test'
};

export function ClientScript() {
	// * This runs on the client. No server data, including imported modules
	// * can be accessed here. Treat this as if you wrote an in-lined <script>
	// * tag on the page.
	console.log('test console.log');
	alert('test alert');
}

export function Page(ctx: PageContextWithParams<Params>) {
	return (
		<main>hello user {ctx.request.params.pid}</main>
	);
}
