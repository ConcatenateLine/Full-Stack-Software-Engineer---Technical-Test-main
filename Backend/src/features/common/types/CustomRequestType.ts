import type { Request } from "express";

export type CustomRequestType = Request & { user?: any };
