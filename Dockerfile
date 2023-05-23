# Selecciona la imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al directorio de trabajo del contenedor
COPY package.json package-lock.json /app/
COPY . /app

# Instala las dependencias del proyecto
RUN npm install

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 443

# Define el comando de inicio para ejecutar la aplicación
CMD ["node", "index.js"]
