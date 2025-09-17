import { t } from "i18next";
import IconLogo from "../../components/icons/IconLogo";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { validationForm } from "../../utils/validations";

const ChangePassword = () => {
    const [passwords,setPasswords] = useState({
        password:'',
        confirmPassword:''
    })
    const { password,confirmPassword } = passwords;
    function handleChange(e:ChangeEvent<HTMLInputElement>){
        const prevPass = {...passwords}
        setPasswords({...prevPass,[e.target.name]:e.target.value})
    }
    function handleSubmit(e:FormEvent){
        const {error,data} = validationForm()
    }
    return (
        <div className="w-full min-h-[calc(100vh-638px)] md:min-h-[calc(100vh-351px)] flex">
        <div className="w-full h-h-full flex justify-center items-center p-6">
            <form 
            onSubmit={handleSubmit}
            className="w-[80%] md:w-[40%] flex flex-col gap-4 backdrop-blur-md bg-black/25 drop-shadow-lg border-white p-5 rounded-lg shadow-2xl">
                <div className="flex justify-center items-center py-5">
                    <IconLogo className="text-accent mr-2 h-6 w-6" />
                    <span className="text-gray-100 text-2xl font-bold">
							{t("header.title", "Flowkan")}
					</span>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-100 text-xs font-thin tracking-tight" htmlFor="password-1">Nueva contraseña</label>
                    <input 
                    value={password}
                    name="password"
                    onChange={handleChange}
                    className="transition-all duration-300 hover:bg-black/20 text-md rounded-lg p-2 backdrop-blur-2xl bg-black/5 text-gray-300 " 
                    type="password" id="password-1" />                    
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-100 text-xs font-thin tracking-tight" htmlFor="password-2">Repetir contraseña</label>
                    <input 
                    value={confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                    className="transition-all duration-300 hover:bg-black/20 text-md rounded-lg p-2 backdrop-blur-2xl bg-black/5 text-gray-300" 
                    type="password" id="password-2" />
                </div>
                <div className="flex flex-col">
                    <input                    
                    className="bg-primary px-4 py-3 rounded-2xl text-gray-100 font-thin text-xs tracking-wide"
                    type="submit" value="Guardar Cambios"/>
                </div>
            </form>
        </div>
        </div>
    );
};

export default ChangePassword;
