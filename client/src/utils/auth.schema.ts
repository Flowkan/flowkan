import z from "zod";

export const ForgotPasswordSchema = z.object({
	email:z.email("No es un email válido").nonempty("Debe indicar un email")
})


export const NewPasswordSchema = z.object({
	password:z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
	confirmPassword:z.string().min(8, "Debe tener al menos 8 caracteres"),
}).refine((data)=> data.password === data.confirmPassword,{
	error:"Las contraseñas no coinciden",
	path:["confirmPassword"]
})

export const ResponseChangePasswordSchema = z.object({
	message:z.string()
})
