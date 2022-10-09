<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar repositorio.

2. Ejecutar el siguiente comando

```bash
 #for install all dependecies

$ npm install
```
3. Tener nest cli instalado.
```
npm i -g @nestjs/cli
```
4. Clonar el archivo ```.env.template ``` and rename a ```.env``` .

5. Llenar las variables de entorno definidas en el  ```.env ``` .

6. Levantar la base de datos.
```
docker-compose up -d
```

7. Ejecutar la aplicacion en modo dev con el comando:
```
npm run start:dev
```
8. Contruir  la base de datos con la semilla.
```
http://localhost:3000/api/v2/seed   GET
```


## Stack used :  
* MongoDB

# Production Build
1. Crear el archivo ```.env.prod```.
2. Llenar las variables de entorno de prod.
3. Crear la nueva imagen.
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

* Nest
# Notas
Heroku redeploy sin cambios
```
git commit --allow-empty -m"Tigger heroku deplay"
git push heroku <main|master> 
```