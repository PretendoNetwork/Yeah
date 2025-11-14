import type { z } from 'zod';
import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

/**
 * Core context object passed to route handlers/middleware
 *
 * @template Params - URL route parameters
 * @template ResBody - Response body type
 * @template ReqBody - Request body type
 * @template ReqQuery - Query string parameters type
 * @template ReqHeaders - Request headers type
 * @template Locals - Express locals type
 * @template Data - Additional context data type
 */
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

/**
 * Context object for middleware handlers. Includes a `next` function
 *
 * @template Params - URL route parameters
 * @template ResBody - Response body type
 * @template ReqBody - Request body type
 * @template ReqQuery - Query string parameters type
 * @template ReqHeaders - Request headers type
 * @template Locals - Express locals type
 * @template Data - Additional context data type
 */
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

/**
 * Context object for page route handlers (alias of Context for visual clarity)
 *
 * @template Params - URL route parameters
 * @template ResBody - Response body type
 * @template ReqBody - Request body type
 * @template ReqQuery - Query string parameters type
 * @template ReqHeaders - Request headers type
 * @template Locals - Express locals type
 * @template Data - Additional context data type
 */
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

/**
 * Context with typed URL route parameters
 *
 * @template Params - URL route parameters
 */
export type ContextWithParams<Params extends ParamsDictionary> = Context<Params>;

/**
 * Context with typed request body
 *
 * @template ReqBody - Request body type
 */
export type ContextWithBody<ReqBody> = Context<ParamsDictionary, any, ReqBody>;

/**
 * Context with typed query string parameters
 *
 * @template ReqQuery - Query string parameters type
 */
export type ContextWithQuery<ReqQuery extends ParsedQs> = Context<ParamsDictionary, any, any, ReqQuery>;

/**
 * Context with typed request headers
 *
 * @template ReqHeaders - Request headers type
 */
export type ContextWithHeaders<ReqHeaders> = Context<ParamsDictionary, any, any, ParsedQs, ReqHeaders>;

/**
 * Context with typed additional data
 *
 * @template Data - Additional context data type
 */
export type ContextWithData<Data extends Record<string, any>> = Context<ParamsDictionary, any, any, ParsedQs, any, Record<string, any>, Data>;

/**
 * Page context with typed URL route parameters
 *
 * @template Params - URL route parameters
 */
export type PageContextWithParams<Params extends ParamsDictionary> = PageContext<Params>;

/**
 * Page context with typed request body
 *
 * @template ReqBody - Request body type
 */
export type PageContextWithBody<ReqBody> = PageContext<ParamsDictionary, any, ReqBody>;

/**
 * Page context with typed query string parameters
 *
 * @template ReqQuery - Query string parameters type
 */
export type PageContextWithQuery<ReqQuery extends ParsedQs> = PageContext<ParamsDictionary, any, any, ReqQuery>;

/**
 * Page context with typed request headers
 *
 * @template ReqHeaders - Request headers type
 */
export type PageContextWithHeaders<ReqHeaders> = PageContext<ParamsDictionary, any, any, ParsedQs, ReqHeaders>;

/**
 * Page context with typed additional data
 *
 * @template Data - Additional context data type
 */
export type PageContextWithData<Data extends Record<string, any>> = PageContext<ParamsDictionary, any, any, ParsedQs, any, Record<string, any>, Data>;

/**
 * Middleware context with typed URL route parameters
 *
 * @template Params - URL route parameters
 */
export type MiddlewareContextWithParams<Params extends ParamsDictionary> = MiddlewareContext<Params>;

/**
 * Middleware context with typed request body
 *
 * @template ReqBody - Request body type
 */
export type MiddlewareContextWithBody<ReqBody> = MiddlewareContext<ParamsDictionary, any, ReqBody>;

/**
 * Middleware context with typed query string parameters
 *
 * @template ReqQuery - Query string parameters type
 */
export type MiddlewareContextWithQuery<ReqQuery extends ParsedQs> = MiddlewareContext<ParamsDictionary, any, any, ReqQuery>;

/**
 * Middleware context with typed request headers
 *
 * @template ReqHeaders - Request headers type
 */
export type MiddlewareContextWithHeaders<ReqHeaders> = MiddlewareContext<ParamsDictionary, any, any, ParsedQs, ReqHeaders>;

/**
 * Middleware context with typed additional data
 *
 * @template Data - Additional context data type
 */
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

type ValidationErrors = {
	params?: z.ZodError;
	query?: z.ZodError;
	headers?: z.ZodError;
	body?: z.ZodError;
	data?: z.ZodError;
};

/**
 * Validates context fields using Zod schemas. Throws an error on the first validation error
 *
 * @template Config - Schema configuration type
 * @param schemas - An object containing the context and optional Zod schemas for params, query, headers, body, and data
 * @param callback - Optional callback function that receives the validated context
 *
 * @returns The validated context with inferred types from the schemas, if `callback` is not specified
 * @throws {z.ZodError} When any validation fails
 */
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
> {
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

/**
 * Validates context fields using Zod schemas without throwing. Validation errors are attached to the context in a `validationErrors` field
 *
 * @template Config - Schema configuration type
 * @param schemas - An object containing the context and optional Zod schemas for params, query, headers, body, and data
 * @param callback - Optional callback function that receives the validated context
 *
 * @returns The validated context with inferred types from the schemas, if `callback` is not specified
 * @throws {z.ZodError} When any validation fails
 */
export function safeValidateContext<
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
	> & { validationErrors: ValidationErrors }) => any
): Context<
	InferOr<Config['params'], any> & ParamsDictionary,
	any,
	InferOr<Config['body'], any>,
	InferOr<Config['query'], any> & ParsedQs,
	InferOr<Config['headers'], any>,
	any,
	InferOr<Config['data'], any>
> & { validationErrors: ValidationErrors } {
	const ctx = schemas.ctx;
	const validationErrors: ValidationErrors = {};

	if (schemas.params) {
		const result = schemas.params.safeParse(ctx.request.params);
		if (result.success) {
			(ctx.request.params as any) = result.data;
		} else {
			validationErrors.params = result.error;
		}
	}

	if (schemas.query) {
		const result = schemas.query.safeParse(ctx.request.query);
		if (result.success) {
			(ctx.request.query as any) = result.data;
		} else {
			validationErrors.query = result.error;
		}
	}

	if (schemas.headers) {
		const result = schemas.headers.safeParse(ctx.request.headers);
		if (result.success) {
			(ctx.request.headers as any) = result.data;
		} else {
			validationErrors.headers = result.error;
		}
	}

	if (schemas.body) {
		const result = schemas.body.safeParse(ctx.request.body);
		if (result.success) {
			(ctx.request.body as any) = result.data;
		} else {
			validationErrors.body = result.error;
		}
	}

	if (schemas.data) {
		const result = schemas.data.safeParse(ctx.data);
		if (result.success) {
			(ctx.data as any) = result.data;
		} else {
			validationErrors.data = result.error;
		}
	}

	const ctxWithErrors = Object.assign(ctx, { validationErrors });

	if (!callback) {
		return ctxWithErrors as any;
	}

	return callback(ctxWithErrors);
}
