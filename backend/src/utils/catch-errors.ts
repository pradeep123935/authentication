import { StatusCodes } from "http-status-codes";
import { ErrorCode } from "../enums/errorCode.enum";
import { AppError } from "./app-error";

export class NotFoundException extends AppError {
    constructor(message = "Resources not found", errorCode?: ErrorCode) {
        super(message, StatusCodes.NOT_FOUND, errorCode || ErrorCode.RESOURCE_NOT_FOUND);
    }
}

export class BadRequest extends AppError {
    constructor(message = "Bad Request", errorCode?: ErrorCode) {
        super(message, StatusCodes.BAD_REQUEST, errorCode);
    }
}

export class UnauthorizedException extends AppError {
    constructor(message = "Unauthorized Access", errorCode?: ErrorCode) {
        super(message, StatusCodes.UNAUTHORIZED, errorCode || ErrorCode.ACCESS_UNAUTHORIZED);
    }
}

export class HttpException extends AppError {
    constructor(message = "Http Exception Error", statusCode:StatusCodes, errorCode?: ErrorCode) {
        super(message, statusCode, errorCode);
    }
}