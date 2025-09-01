import { Request , Response , NextFunction } from "express"
import { ApiError } from "./apiError"

export const errorHandling = (
    error : Error ,
    req : Request,
    res : Response,
    next : NextFunction
) => {
    console.log("Error handler called:", error);
    if(!(error instanceof ApiError)) {
        console.error('UNEXPECTED ERROR' , error)
    }

    if(error instanceof ApiError) {
        return res.status(error.statusCode).json({
            type: error.type,
            message: error.message,
            errors: error.type === 'validation' ? error.errors : undefined
        })
    }

    return res.status(500).json({
        type : 'unknown',
        message : 'An unexpected internal server error occurred'
    })
}