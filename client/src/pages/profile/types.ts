import { z } from 'zod';

const ERRORS = {
    min: (min:number)=> (`minimo ${min} carácteres`),
    max: (max:number)=> (`máximo ${max} carácteres`),
    email: 'email inválido',
    nowhitespaces:'no debe contener espacios'
}


export const ProfileUpdateSchema = z.object({    
    name:z.string().min(5,{error:ERRORS.min(5)}).max(100,{error:ERRORS.max(5)}),
    email:z.email().readonly(),
    photo:z.file().or(z.string()).optional(),
    username:z.string().max(50)
    .refine(value=> !value.includes(' '), {message: ERRORS.nowhitespaces})
    .optional(),
    dateBirth:z.string().optional(),
    location:z.string().max(100,{error:ERRORS.max(100)}).optional(),
    allowNotifications:z.boolean(),
    bio:z.string().max(300,{error:ERRORS.max(300)}).optional(),
});

export const ProfileUpdatedSchema = ProfileUpdateSchema
.omit({photo:true,email:true})
.extend({
    photo:z.string()
});


export const ProfileSchema = z.object({
    username:z.string(),    
	dateBirth:z.string(),
	location:z.string(),
	allowNotifications:z.boolean(),
	bio:z.string()
})

export const EditableUserSchema = z.object({
    name:z.string(),
    photo:z.string()
})

export const EditableProfileSchema = z.object({
    username:z.string(),
    dateBirth:z.string(),
    location:z.string(),
    allowNotifications:z.boolean(),
	bio:z.string()
})

export const ProfileCardSchema = z.object({
    user:EditableUserSchema,
    profile:EditableProfileSchema
})

export const ResponseProfileSchema = z.object({
    error:z.string().nullable(),
    profile:ProfileSchema.nullable()
})

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>

export type ProfileUpdatedType = z.infer<typeof ProfileUpdatedSchema>

export type ProfileType = z.infer<typeof ProfileSchema>

export type ProfileCardType = z.infer<typeof ProfileCardSchema>

export type ResponseProfileData = z.infer<typeof ResponseProfileSchema>