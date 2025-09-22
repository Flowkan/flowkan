import z from 'zod';
// import type {ForgotPasswordSchema, NewPasswordSchema}  from '../utils/auth.schema';
// import type { ZodSchema } from 'zod/v3';

type ErrorValidation<Data> = {
    [k in keyof Data]?:string[]
}

class ValidationError<Data> extends Error {
    public errorsList:ErrorValidation<Data>;
    // constructor(zodError:z.ZodError<Data>){
    constructor(zodError:z.ZodError<Data>){
        super('Validation Error')
        // this.errorsList = zodError.flatten().fieldErrors as ErrorValidation<Data>;
        this.errorsList = z.flattenError(zodError).fieldErrors as ErrorValidation<Data>
    }
}

// type Schema = typeof ForgotPasswordSchema 
export function validationForm<T extends z.ZodType>(schema:T,data:unknown){
    const parseData = schema.safeParse(data)
    if(!parseData.success){        
        return {error:new ValidationError<z.infer<T>>(parseData.error),data:null}
        // throw new ValidationError(parseData.error)
    }
    return {error:null,data:parseData.data}
}