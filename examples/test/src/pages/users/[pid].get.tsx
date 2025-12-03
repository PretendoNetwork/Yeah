import { z } from 'zod';
import { validateContext } from '@pretendonetwork/yeah/context';
import type { PageContext } from '@pretendonetwork/yeah/context';

const paramsSchema = z.object({
	pid: z.coerce.number()
});

export function Page(ctx: PageContext) {
	// * This also works
	/*
	const typedContext = validateContext({
		ctx,
		params: paramsSchema
	});

	return (
		<main>hello user {typedContext.request.params.pid}</main>
	);
	*/

	return validateContext({
		ctx,
		params: paramsSchema
	}, (ctx) => {
		return (
			<main>hello user {ctx.request.params.pid}</main>
		);
	})
}
