export const formatDate = (dateString: string) => {    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    if(dateString === ""){
        return new Date().toLocaleDateString('es-ES',options)
    } 
    return new Date(dateString).toLocaleDateString('es-ES', options);
};