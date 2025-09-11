import { z } from 'zod';

const ERRORS = {
    min: (min:number)=> (`minimo ${min} carácteres`),
    max: (max:number)=> (`máximo ${max} carácteres`),
    email: 'email inválido'
}


export const ProfileUpdateSchema = z.object({    
    name:z.string().min(5,{error:ERRORS.min(5)}).max(100,{error:ERRORS.max(5)}),
    username:z.string().max(50)
    .refine(value=> !value.includes(' '), {message: 'no debe contener espacios'})
    .optional(),
    email:z.email().readonly(),
    photo:z.file().optional(),
    dateBirth:z.string().optional(),
    location:z.string().max(100,{error:ERRORS.max(100)}).optional(),
    bio:z.string().max(300,{error:ERRORS.max(300)}).optional(),
});

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>