import { useCallback, useState } from "react"
import type { ErrorValidation, ValidationError } from "../utils/validations";


type validationResult<T> = {
    error:ValidationError<T>|null;
    data:T|null;
}
type Validator<T> = (data:unknown,fieldName?:keyof T) => validationResult<T>
export function useValidationForm<T>(validator:Validator<T>) {
    const [data,setData] = useState<T|null>(null)
    const [error,setError] = useState<ErrorValidation<T>|null>(null); 
    const [isValid,setIsValid] = useState(false); 
    const [fieldApproved,setFieldApproved] = useState<[keyof T,boolean]|null>(null);  
    const validate = useCallback((formData:unknown,fieldName?:keyof T)=>{
        const result = validator(formData,fieldName)
        if(fieldName){
            setError(prev => {
                const newErrors:ErrorValidation<T> = {...prev}
                if(result.error){
                    setIsValid(false)
                    const fieldError = result.error.errorsList[fieldName];
                    if(fieldError){
                        newErrors[fieldName] = fieldError
                    }
                }else{
                    delete newErrors[fieldName]
                }
                return Object.keys(newErrors).length === 0 ? null : newErrors
            })
        } else {            
            setError( result.error ? result.error.errorsList : null)            
        }
        if(result.data){
            if(fieldName){
                setData(prev => ({
                    ...prev as T,
                    ...result.data as Partial<T>
                }))
                setFieldApproved([fieldName,true])
            }else{
                setData(result.data)
            }
            setIsValid(true)
        }
        // setData(result.data)
        return result.error === null
    },[validator])
    const reset = useCallback(()=>{
        setData(null)
        setError(null)
        setIsValid(false)
    },[])
    const checkField = useCallback((fieldName:keyof T)=>{
        if(data){
            if(data[fieldName]){
                return true
            }
        }
        return false
    },[data])
    return {
        validate,
        reset,
        data,
        error,
        isValid,
        fieldApproved,
        checkField
    }
}