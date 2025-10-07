export interface EmailPayload {
  to: string;
  subject?: string;
  type: "CONFIRMATION" | "PASSWORD_RESET" | "WELCOME" | "GENERIC" | "GOODBYE";
  data?: dataUser;
  language?: string;
}

export interface dataUser {
    token?: string;
    url?: string;
    name?: string;
}


export interface MakeThumbnailPayload {
  userId:number;    
  // file:Express.Multer.File;
  // pathImage?:string;
  // originalSize?: { width:number; height:number };
  originalPath:string;
  thumbPath:string;
  thumbSize?: { width: number; height: number };
}