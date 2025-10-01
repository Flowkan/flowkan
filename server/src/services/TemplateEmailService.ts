import { render } from "@react-email/render";
import Welcome from "../react-email-starter/emails/welcome";


export async function generateWelcomeEmailTemplate(url:string,token:string) {       
    return await render(Welcome({nombreUsuario:'Jairo'}))

}