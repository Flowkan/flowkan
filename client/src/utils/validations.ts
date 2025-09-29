import z from 'zod';

export type ErrorValidation<Data> = {
    [k in keyof Data]?:string[]
}

export class ValidationError<Data> extends Error {
    public errorsList:ErrorValidation<Data>;
    // constructor(zodError:z.ZodError<Data>){
    constructor(zodError:z.ZodError<Data>){
        super('Validation Error')
        // this.errorsList = zodError.flatten().fieldErrors as ErrorValidation<Data>;
        this.errorsList = z.flattenError(zodError).fieldErrors as ErrorValidation<Data>
    }
}

// type Schema = typeof ForgotPasswordSchema 
export function validationForm<T extends z.ZodObject>(schema:T,data:unknown,fieldToValidate?:keyof z.infer<T>){
    let schemaToUse = schema;
    if(fieldToValidate){
        schemaToUse = schema.pick({ [fieldToValidate]:true } as const) as T
    }
    const parseData = schemaToUse.safeParse(data)
    if(!parseData.success){        
        return {error:new ValidationError<z.infer<T>>(parseData.error),data:null}
        // throw new ValidationError(parseData.error)
    }
    return {error:null,data:parseData.data}
}