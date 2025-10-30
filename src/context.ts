import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export type Context<
	Params extends ParamsDictionary = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery extends ParsedQs = ParsedQs,
	Locals extends Record<string, any> = Record<string, any>,
	Data extends Record<string, any> = Record<string, any>
> = {
	request: Request<Params, ResBody, ReqBody, ReqQuery, Locals>;
	response: Response<ResBody, Locals>;
	data: Data;
};

export type MiddlewareContext<
	Params extends ParamsDictionary = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery extends ParsedQs = ParsedQs,
	Locals extends Record<string, any> = Record<string, any>,
	Data extends Record<string, any> = Record<string, any>
> = Context<Params, ResBody, ReqBody, ReqQuery, Locals, Data> & {
	next: () => Promise<void>;
};

// * Mostly just an alias of Context, named differently for different visual contexts
export type PageContext<
	Params extends ParamsDictionary = ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery extends ParsedQs = ParsedQs,
	Locals extends Record<string, any> = Record<string, any>,
	Data extends Record<string, any> = Record<string, any>
> = Context<Params, ResBody, ReqBody, ReqQuery, Locals, Data>;

// * Supplementary types for when a route only needs one specific type of data

export type ContextWithParams<Params extends ParamsDictionary> = Context<Params>;
export type ContextWithBody<ReqBody> = Context<ParamsDictionary, any, ReqBody>;
export type ContextWithQuery<ReqQuery extends ParsedQs> = Context<ParamsDictionary, any, any, ReqQuery>;
export type ContextWithData<Data extends Record<string, any>> = Context<ParamsDictionary, any, any, ParsedQs, Record<string, any>, Data>;

export type PageContextWithParams<Params extends ParamsDictionary> = PageContext<Params>;
export type PageContextWithBody<ReqBody> = PageContext<ParamsDictionary, any, ReqBody>;
export type PageContextWithQuery<ReqQuery extends ParsedQs> = PageContext<ParamsDictionary, any, any, ReqQuery>;
export type PageContextWithData<Data extends Record<string, any>> = PageContext<ParamsDictionary, any, any, ParsedQs, Record<string, any>, Data>;

export type MiddlewareContextWithParams<Params extends ParamsDictionary> = MiddlewareContext<Params>;
export type MiddlewareContextWithBody<ReqBody> = MiddlewareContext<ParamsDictionary, any, ReqBody>;
export type MiddlewareContextWithQuery<ReqQuery extends ParsedQs> = PageContext<ParamsDictionary, any, any, ReqQuery>;
export type MiddlewareContextWithData<Data extends Record<string, any>> = MiddlewareContext<ParamsDictionary, any, any, ParsedQs, Record<string, any>, Data>;
