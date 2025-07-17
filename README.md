# Flowkan - Tablero kanbna para gestionar tus tareas

## Desplegar release en servidor
 - Para desplegar crear un tag sobre main
 - Entrar al servidor, editar el yml y en image poner el tag que se va a desplegar (se puede ver en el repo de github)
 - ejecutar: docker-compose -f xxxx.yml up -d (para recrear los contenedores)

## montar imagen en local
Entrar en la carpeta server y ejecutar: docker-compose up --build