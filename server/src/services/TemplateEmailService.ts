import { render } from "@react-email/render";
import Confirmation from "../react-email-starter/emails/confirmation";
import PasswordReset from "../react-email-starter/emails/passwordreset";
import { Welcome } from "../react-email-starter/emails/welcome";
import { Goodbye } from "../react-email-starter/emails/goodBye";


export async function generateConfirmationEmailTemplate(
  name: string,
  url: string,
  token: string,
  language?:string
) {
  return await render(Confirmation({ name, url, token, language }));
}


export async function generatePasswordResetEmailTemplate(  
  url: string, 
  token:string,
  language?:string 
) {
  return await render(PasswordReset({ url,token,language }));
}

export async function generateWelcomeEmailTemplate(  
    url: string,   
    name?:string,
    language?:string
) {  
  const html = await render(Welcome({name,url,language}));    
    return html  
}

export async function generateGoodbyeEmailTemplate(         
    name:string,
    url:string,
    language?:string
) {  
  const html = await render(Goodbye({name,url,language}));    
    return html  
}