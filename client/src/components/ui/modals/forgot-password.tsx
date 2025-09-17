import { useEffect, useRef, useState, type ChangeEvent, type ComponentProps, type FormEvent } from 'react';
import { FormFields } from '../FormFields';
import { IconCancel } from '../../icons/IconCancel';
import { resetPassword } from '../../../pages/login/service';


interface ForgotPasswordProps extends Omit<ComponentProps<"dialog">,"ref"|"onSubmit"> {
    // onSubmit?:(e:FormEvent<HTMLFormElement>)=>void;
    show?:boolean;
    onClose?:()=>void;
    // dialogRef: RefObject<HTMLDialogElement>
}

const ForgotPassword = ({onClose,show=false,...props}:ForgotPasswordProps) => {
    const [email,setEmail] = useState('admin@demo.com');
    const modalForgotPassword = useRef<HTMLDialogElement|null>(null)
    const inputEmail = useRef<HTMLInputElement>(null)    
    async function handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault()
		const validateData = validationForm({email})
        if(validateData){
            await resetPassword(validateData.email)
            handleClose()
        }
    }
    function handleClose(){
        if(onClose){
            onClose()
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
            console.log(e.key);
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
        backdrop:from-white/20 backdrop:to-transparent
        backdrop:pointer-events-none m-auto rounded-md
        shadow-2xl
        `} ref={modalForgotPassword}  {...props}>
            <div className='w-[80vw] rounded-lg'>
                <div className='bg-gray-800 flex items-center justify-between px-3 py-4'>
                    <p className='text-white text-xl font-semibold tracking-wider'>Recuperar Contraseña</p>
                    <button className='hover:bg-gray-600 p-2 rounded-md cursor-pointer' type='button'
                    onClick={handleClose}
                    >
                        <IconCancel className='text-white stroke-white' />
                    </button>
                </div>
                <form className='flex flex-col p-5 gap-4' onSubmit={handleSubmit}
                >                    
                    <div className='flex-1'>
                        <label htmlFor="forgot-password">Corre electrónico</label>
                        <FormFields 
                        type='email'
                        name='forgot-password'
                        id='forgot-password'
                        className='w-full inline-block flex-1 border border-accent px-2 py-1 rounded-lg text-lg'
                        placeholder='Correo electrónico'
                        value={email}
                        onChange={handleChange}
                        ref={inputEmail}
                        />
                    </div>
                    <div className='flex gap-2'>
                        <button className='cursor-pointer px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary-hover transition-colors duration-300' type="submit">Send</button>
                        <button className='cursor-pointer px-4 py-2 transition-colors duration-300 rounded-lg text-white bg-accent hover:bg-accent-hover' type='button' onClick={handleClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ForgotPassword;
