import { useEffect, useRef, useState, type ChangeEvent, type ComponentProps, type FormEvent } from 'react';
import { FormFields } from '../FormFields';
import { IconCancel } from '../../icons/IconCancel';
import { resetPassword } from '../../../pages/login/service';
import { validationForm } from '../../../utils/validations';
import type { FormSendEmail } from '../../../pages/login/types';
import { ForgotPasswordSchema } from '../../../utils/auth.schema';


interface ForgotPasswordProps extends Omit<ComponentProps<"dialog">,"ref"|"onSubmit"> {
    // onSubmit?:(e:FormEvent<HTMLFormElement>)=>void;
    show?:boolean;
    onClose?:()=>void;
    // dialogRef: RefObject<HTMLDialogElement>
}

const ForgotPassword = ({onClose,show=false,...props}:ForgotPasswordProps) => {
    const [email,setEmail] = useState('jairom94@gmail.com');
    const [errorsForm,setErrorsForm] = useState<{
        [k in keyof FormSendEmail]?:string[]
    }>({});
    const modalForgotPassword = useRef<HTMLDialogElement|null>(null)
    const inputEmail = useRef<HTMLInputElement>(null)        
    async function handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault()
		const {error,data} = validationForm<FormSendEmail>(ForgotPasswordSchema,{email})        
        if(error){            
            setErrorsForm(error.errorsList)            
            return            
        }
        await resetPassword(data.email)
        handleClose()
    }
    function handleClose(){
        if(onClose){
            onClose()
            setEmail('')
            setErrorsForm({})
        }
    }
    function handleChange(e:ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value)
    }
    useEffect(()=>{
        if(show){
            modalForgotPassword.current?.showModal()
            inputEmail.current?.focus()
        }else{
            modalForgotPassword.current?.close()
        }
    },[show])
    useEffect(()=>{
        const modal = modalForgotPassword.current
        function handleKeyUp(e:KeyboardEvent){            
            if(e.key === 'Escape'){
                if(onClose){
                    onClose()
                }
            }            
        }
        if(modal){
            modal.addEventListener('keydown',handleKeyUp)
        }
        return () => {
            modal?.removeEventListener('keydown',handleKeyUp)            
        }
    },[])
    return (
        <dialog className={`
        backdrop:backdrop-blur-xl backdrop:bg-gradient-to-b 
        backdrop:from-primary/20 backdrop:to-transparent
        backdrop:pointer-events-none m-auto rounded-md
        shadow-2xl shadow-accent/60
        `} ref={modalForgotPassword}  {...props}>
            <div className='w-[80vw] md:w-[40dvw] rounded-lg '>
                <div className='bg-accent-hover flex items-center justify-between px-3 py-4'>
                    <p className='text-white text-lg font-thin tracking-wide'>Recuperar Contraseña</p>
                    <button className='hover:bg-accent transition-colors duration-300 p-2 rounded-md cursor-pointer' type='button'
                    onClick={handleClose}
                    >
                        <IconCancel className='text-white stroke-white' />
                    </button>
                </div>
                <form className='flex flex-col p-5 gap-4' onSubmit={handleSubmit}
                >                    
                    <div className='flex-1'>
                        <label 
                        className='text-lg font-bold'
                        htmlFor="forgot-password">Correo electrónico</label>
                        <FormFields 
                        type='email'
                        name='forgot-password'
                        id='forgot-password'
                        className={`
                            w-full inline-block flex-1 border border-accent p-2 
                            rounded-lg text-md tracking-wide focus:outline-2 focus:outline-accent
                            ${errorsForm.email ? 'border-red-500 focus:outline-2 focus:outline-red-500 placeholder:text-red-300' : ''}
                            `}
                        placeholder='Correo electrónico'
                        value={email}
                        onChange={handleChange}
                        ref={inputEmail}
                        />
                        <ul className='text-xs text-red-600 px-1 pt-1'>
                            { errorsForm.email && errorsForm.email.map(err => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        className='cursor-pointer px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary-hover transition-colors duration-300'
                        type="submit" value="Enviar" />
                        <button className='cursor-pointer px-4 py-2 transition-colors duration-300 rounded-lg text-white bg-accent hover:bg-accent-hover' type='button' onClick={handleClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ForgotPassword;
