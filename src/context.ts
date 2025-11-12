import type { z } from 'zod';
import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export type Context<
	Params extends ParamsDictionary = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery extends ParsedQs = ParsedQs,
	ReqHeaders = any,
	Locals extends Record<string, any> = Record<string, any>,
	Data extends Record<string, any> = Record<string, any>
> = {
	request: Request<Params, ResBody, ReqBody, ReqQuery, Locals> & {
		headers: ReqHeaders;
	};
	response: Response<ResBody, Locals>;
	data: Data;
};

export type MiddlewareContext<
	Params extends ParamsDictionary = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery extends ParsedQs = ParsedQs,
	ReqHeaders = any,
	Locals extends Record<string, any> = Record<string, any>,
	Data extends Record<string, any> = Record<string, any>
> = Context<Params, ResBody, ReqBody, ReqQuery, ReqHeaders, Locals, Data> & {
	next: () => Promise<void>;
};

// * Mostly just an alias of Context, named differently for different visual contexts
export type PageContext<
	Params extends ParamsDictionary = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery extends ParsedQs = ParsedQs,
	ReqHeaders = any,
	Locals extends Record<string, any> = Record<string, any>,
	Data extends Record<string, any> = Record<string, any>
> = Context<Params, ResBody, ReqBody, ReqQuery, ReqHeaders, Locals, Data>;

// * Supplementary types

export type ContextWithParams<Params extends ParamsDictionary> = Context<Params>;
export type ContextWithBody<ReqBody> = Context<ParamsDictionary, any, ReqBody>;
export type ContextWithQuery<ReqQuery extends ParsedQs> = Context<ParamsDictionary, any, any, ReqQuery>;
export type ContextWithHeaders<ReqHeaders> = Context<ParamsDictionary, any, any, ParsedQs, ReqHeaders>;
export type ContextWithData<Data extends Record<string, any>> = Context<ParamsDictionary, any, any, ParsedQs, any, Record<string, any>, Data>;

export type PageContextWithParams<Params extends ParamsDictionary> = PageContext<Params>;
export type PageContextWithBody<ReqBody> = PageContext<ParamsDictionary, any, ReqBody>;
export type PageContextWithQuery<ReqQuery extends ParsedQs> = PageContext<ParamsDictionary, any, any, ReqQuery>;
export type PageContextWithHeaders<ReqHeaders> = PageContext<ParamsDictionary, any, any, ParsedQs, ReqHeaders>;
export type PageContextWithData<Data extends Record<string, any>> = PageContext<ParamsDictionary, any, any, ParsedQs, any, Record<string, any>, Data>;

export type MiddlewareContextWithParams<Params extends ParamsDictionary> = MiddlewareContext<Params>;
export type MiddlewareContextWithBody<ReqBody> = MiddlewareContext<ParamsDictionary, any, ReqBody>;
export type MiddlewareContextWithQuery<ReqQuery extends ParsedQs> = MiddlewareContext<ParamsDictionary, any, any, ReqQuery>;
export type MiddlewareContextWithHeaders<ReqHeaders> = MiddlewareContext<ParamsDictionary, any, any, ParsedQs, ReqHeaders>;
export type MiddlewareContextWithData<Data extends Record<string, any>> = MiddlewareContext<ParamsDictionary, any, any, ParsedQs, any, Record<string, any>, Data>;

type SchemaConfig = {
	ctx: Context<any, any, any, any, any, any, any>;
	params?: z.ZodTypeAny;
	query?: z.ZodTypeAny;
	headers?: z.ZodTypeAny;
	body?: z.ZodTypeAny;
	data?: z.ZodTypeAny;
};

type InferOr<T extends z.ZodTypeAny | undefined, Default> = T extends z.ZodTypeAny ? z.infer<T> : Default;

export function validateContext<
	Config extends SchemaConfig
>(
	schemas: Config,
	callback?: (ctx: Context<
		InferOr<Config['params'], any> & ParamsDictionary,
		any,
		InferOr<Config['body'], any>,
		InferOr<Config['query'], any> & ParsedQs,
		InferOr<Config['headers'], any>,
		any,
		InferOr<Config['data'], any>
	>) => any
): Context<
	InferOr<Config['params'], any> & ParamsDictionary,
	any,
	InferOr<Config['body'], any>,
	InferOr<Config['query'], any> & ParsedQs,
	InferOr<Config['headers'], any>,
	any,
	InferOr<Config['data'], any>
>{
	const ctx = schemas.ctx;

	if (schemas.params) {
		(ctx.request.params as any) = schemas.params.parse(ctx.request.params);
	}

	if (schemas.query) {
		(ctx.request.query as any) = schemas.query.parse(ctx.request.query);
	}

	if (schemas.headers) {
		(ctx.request.headers as any) = schemas.headers.parse(ctx.request.headers);
	}

	if (schemas.body) {
		(ctx.request.body as any) = schemas.body.parse(ctx.request.body);
	}

	if (schemas.data) {
		(ctx.data as any) = schemas.data.parse(ctx.data);
	}

	if (!callback) {
		return ctx as any;
	}

	return callback(ctx);
}
