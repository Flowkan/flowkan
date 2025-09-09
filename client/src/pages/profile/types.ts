import { z } from 'zod';

const ERRORS = {
    min: (min:number)=> (`minimo ${min} carácteres`),
    max: (max:number)=> (`máximo ${max} carácteres`),
    email: 'email inválido'
}


export const ProfileSchema = z.object({
    id:z.string(),
    name:z.string().min(5,{error:ERRORS.min(5)}).max(100,{error:ERRORS.max(5)}),
    username:z.string().min(5,ERRORS.min(5)).max(50),
    email:z.email(),
    photo:z.string().optional(),
    bio:z.string().max(300,{error:ERRORS.max(300)}).optional(),
    dateBirth:z.string().optional(),
    location:z.string().max(100,{error:ERRORS.max(100)}).optional()
});

export type ProfileType = z.infer<typeof ProfileSchema>