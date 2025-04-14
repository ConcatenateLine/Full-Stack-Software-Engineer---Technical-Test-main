import type { Request } from "express";

export type CustomRequestType = Request & { user?: any };

export type CustomRequestTypeWithFile = CustomRequestType & {
  uploadedFile?: {
    filename: string;
    path: string;
    contentType: string;
  };
};
