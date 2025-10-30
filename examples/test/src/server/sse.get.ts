import { setupSSE, sendEvent } from '@pretendonetwork/yeah/sse';
import type { Context } from '@pretendonetwork/yeah/context';

export async function Route(ctx: Context) {
	setupSSE(123, ctx);

	const interval = setInterval(() => {
		sendEvent('timestamp', 123, { timestamp: Date.now() });
	}, 1000);

	ctx.request.on('close', () => {
		clearInterval(interval);
	});
}