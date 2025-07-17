# Flowkan - Tablero kanbna para gestionar tus tareas

## Despligue imagen a github

 1. construir imagen para github ->  docker build -t ghcr.io/flowkan/flowkan .
 2. login para poder subir imagen -> docker login ghcr.io -u virgulilla
  la contraseña es el token creado en github, apartado settings > Developer settings > Personal access tokens
3. subir imagen a github -> docker push ghcr.io/flowkan/flowkan:latest

## Ejecutar imagen de docker en servidor
1. docker run ghcr.io/flowkan/flowkan
2. docker-compose -f flowkan.yml up

## montar imagen en local
Entrar en la carpeta server y ejecutar: docker-compose up --build