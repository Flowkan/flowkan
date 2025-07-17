FROM node:22-bookworm-slim

WORKDIR /code  

# copiamos el código del proyecto dentro del contenedor en /code
COPY . /code

# instalamos las dependencias de mi aplicación
RUN npm install

# Información publica de la imagen
EXPOSE 3000

# comando de inicio para cuando se ejecute docker run
CMD ["npm", "start"]