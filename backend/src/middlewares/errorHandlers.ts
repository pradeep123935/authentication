import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    console.error(`Error occured on PATH: ${req.path}`, error);
    
    if(error instanceof SyntaxError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid JSON format!!"
        })
    }

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode
        })
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown Error Occured",
    })
}