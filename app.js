'use strict';
console.clear();

const express = require('express');
const { PORT } = require('./config');
const authRoutes = require('./auth/auth.routes.js');
const teamsRoutes = require('./teams/teams.routes.js');
const { setupMiddlewares } = require('./middlewares');

// // Initializations:
require('./db.js');
const app = express();

// // Middlewares:
setupMiddlewares(app);

// // Routes:
app.use('/auth', authRoutes);
app.use('/teams', teamsRoutes);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

module.exports = app;

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S4. Refactorizando nuestra API
 * Primer refactor: Carpetas por funcionalidad
  - Para que a futuro el docigo sea escalable y mucho mas facil de mantener
	- Bettatech dice:
	  - Cuando se tiene un proyecto pequeno tener todos los controllers, modes, middlewares juntos va bien
		- Pero cuando el proyecto crece, a Bettatech le Gusta organizar los proyectos por modulos o por funcionalidad
		  - Para no tener q buscar los modulos en diferentes directorios cada vez que se tengan q hacer cambios.
		- Una carpeta por modulo/funcionalidad
		  - Estructura por capas


 * Utilizando Middlewares
  - El archivo/modulo     auth/middleware.js     tiene la f(x)    protectWithJWT()
	  - Con esta funcion establecemso manualmente que rutas estan protegidas con passport en 1 solo lugar.
		- Con esto ya NO importamos passport en ningun router ni debemos establecer logica de passport en ningun router. 
		- Si son muchas rutas deberia tener un Arr de paths permitidos ????
	- Esto es posible gracias al    index   del middlewares/ 
	  -  app.use(protectWithJWT);   <-  app.use se encarga de pasar  req, res, next
	- Esto de tener un middleware en una sola funcion me GUSTO. 
		- setupMiddlewares(app);
	- // TODO: Implementar esta f(x) middleware en TS <- server.ts
	  - Verificar en cuantos archivos se importa passport
		- Aqui solo en el middleware de auth y en ningun otro lado.


 * Separar la logica de los Routes
  - teams.hhtp.js
	  - Gestionara todas las peticiones hhtp
		- 
	- app.js y las routes.js  simplemente se encargan de Gestionar la Definicion de la API
	  - Quien se encarga de implementar la Logica de nuestros procesos YA NO tiene nada que ver con express.
		- Separar la capa de transporte HTPP de las del Bussiness (controllers)
			- La capa intermedia que se encarga de controllar la comunicacion entre transporte http con controllers es el  httpHandler (team.http.js)
			- Solo tiene f(x) q reciben como parametro  req, res
			- Solo deben retornar   Responses   del server
		- Router solo depende de express y del http handler
	

 * Promesas y asycn await
  - Cuando trabajamos con Promesas no necesitamos el callback ni el  done()


 * Gestionando los errores
  - Implementa algo como lo que se hace en  Go
	- Ya no hace falta el try/catch



 * Los Problemas de la API
  - Tiene que ver con la DB
		- En la prox seccion usara MongoDB, lo q ya implemente desde el inicio.
	- Para usar   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT")
	  - Basta con cambiarlo en el auth.middleware
		- Y con enviar    JWT token...    en las solicitudes.
	- 



 * 



*/

/* 










*/

// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S3. Creando nuestra API de POKEMON
 * Empezando sin refactorizacion. Que funcione y ya esta.
	- Crear algo funcional


	- Creamos los end points con un sentido semantico REST


	- Testing:
		- Ya iniciamos con el testing xq ya tenemos los endpoints definidos (TDD)
		  - Las librerias mas populares para el TDD o testing en el backend: Mocha y Chai
			  - Mocha: Es el framework que se utiliza para desarrollar los tests.
					- Nos permite desarrollar tests sync o async.
					  - Con esto podemos testear llamadas a otros servidores <- async
										https://mochajs.org/
					- Chai: Libreria que nos permite realizar las pruebas en si mismas. 
					  - Porbamos mediante f(x) lo que espereriamos que hiciera el codigo.
										https://www.chaijs.com/
		- Instalaciones necesarias para realizar el TDD
				npm i -D mocha chai
		- Test Unitario vs Test end to end: Hacer varios T.U.
			- Test Unitario: Testea funciones concretas. Comprueba si una f(x) devuelve lo que tiene que devolver
			- Test end to end: Simulan un cliente.
		- Testing:
			- Creamos el directory    test/   y dentro   unit-test.test.js 
				- Importamos el assert <- Asegurarnos que algo retorno lo q queremos.
				- Una suite seria un   describe   con varios   it   dentro.
						const assert = require('chai').assert;
						const addValuse = (a, b) => a + b;			<- f(x) de prueba
						describe('Suite de prueba', () => {
							it('should returns 2', () => {
								let va = addValuse(1, 1);          <- La f(x) de prueba a testear
								assert.equal(va, 2);							 <- Comprueba si ↑ retorna 2
							});
						});
					
				- En el package.json: Asi solo ejecutamos  npm run test 
							"scripts": {
								"test": "./node_modules/.bin/mocha"
							},


	- Como testear ENDPOINTS:        https://www.chaijs.com/plugins/chai-http/
	  - Test de integracion: Simula un cliente que consume la API
			- chai-http    es un plugin que le da funcionalidades a chai para poder levantar servidores, consumir nuestro backend.     npm i -D chai-http
			  - Comportamiento    async    x eso usamos el     done(), pa informar cuando termina el test.
							const chaiHttp = require('chai-http');
				- Debemos utilizarlo como un middleware de chai:       chai.use(chaiHttp);
				- Vamos a testear el servidor de express, q esta en:   serverModel.app
							describe('Suit de pruea e2e (end to end/integration)', () => {
								it('should return a json', done => {
									chai
										.request(serverModel.app)
										.get('/api/team')
										.end((err, res) => {
											chai.assert.equal(
												res.type,
												'application/json'
											);
											done();
										});
								});
							});


	- Testeando la autenticacion
		- No confundir con la autorizacion. Van de la mano:
	  	- Autenticacion: Identificar el usuario q esta haciendo una accion. (Logeado)
			- Autorizacion: Determina si un usuario puede o no realizar la accion. (Permisos)
    - En la API tenemos equipos de pokemons, pero queremos que un Usuario pueda tener su propio team, y que cada user pueda modificar su propio team:
		  - Autenticacion: Necesitamos Identificar el User que esta haciendo la peticion, xq queremos modificar solo Su team.
			- Autorizacion: No queremos q users q NO estan autenticados / NO estan registrados en nuestro sistema sean capaces de modificar el equipo de nadie mas.
		- Para la autenticacion vamos a usar 
		  - Passport: En la llamada de Login/Registro generaremos una llave de passport. Esa llave se le enviara de vuelta al User. El User, a todas las llamadas subsecuentes que haga a nuestra API tendra que identificarse con esta llave unica.
			  - Como ya vendra identificado con la llave, no necesitamos una routa:  /api/userID/team
			- Esta llave va a ser el JWT
		- Creando el  auth-test.tes.js:
		  - Test: Enviar un 401 cuando no se envie un JWT valido
			- Test: Enviar un 200 si esta autenticado y autorizado
	

	- Utilizando PassportJS:    http://www.passportjs.org/packages/passport-jwt/
	  - En la clase pasada iniciamos con el test de integracion. Esto antes de establecer la logica como tal de nuestro back. X eso, en este video, vamos a implementar la funcionalidad de   login.
		- Instalamos passport:       npm i passport passport-jwt jsonwebtoken
		- Implementamos el POST para el login:
		  - Creamos el auth.controller.js:
	

	- Refactorizando
	  - Un pequeno refactoring
		- En la siguiente clase debemos tener   tests   x cada  ruta principal
	

	- Y se guardan
	  - Passport agrega   user   al req, y el  value  de este   req.user   sera lo que retornemos como 2do parametro en la f(x)   done(null, user);   de la config de la Strategy de passport.
		- IMPLEMENTAR: Que otro user No pueda hacer nada con lo de otros users:
		  - Debe estar protegido x passport
			  - Crear el   req.user
			- Comparar el  req.user  con el   tema.user  para saber si es el mismo.


	- Vamos a Modificar equipos Pokemon
	  - Primero hacer el test y luego implementa la funcionalidad
		  - Hacemos log in  .post('/auth/login')  >  Enviamos el teamArr  .put('/teams')
				>  Objetenemos la ingo  .get('/teams')

    - Lo hacemos con PUT para ganar Idempotencia


	- Llamadas a la Pokeapi
	  - Axios
		  - En el body nos pasan el nombre del pokemon y con ese naem hacemos la peticion a la pokeapi con axios.
			- La respuesta la estructuramos de acuerdo a mi model de team
		- Aqui ya cada usuario podra ver solo su team xq vinculamos cada team a un UserID de MongoDB en el model.

	
	- Limpiando datos entre tests
	  - Queremos que en cda ejecucion del test se reinicie todo. Mocha nos ayuda con
		  - before(cb):				Se ejecuta antes de cada  DESCRIBE. Antes de los tests
			  - Los  before  se ejecutan ANTES de cada test, no importa cuantor archivos
				- Puede funcionar para registrar users
			- beforeEach(cb):		Se ejecuta antes de cada   IT
			- after(cb):				Se ejecutan Al final del test, terminan los describe y se ejecutan los after de cada archivo.
		- Queremos que en el test se cree un user y todo
		- // TODO: Verificaciones con   express-validator
		  - Si es ID valido, si envia la data, etc  <-  Como con FH
		- .deleteMany({})		<-  Eliminar Documents de una collection Mongoose

	- Tarea - Eliminar pokemon dato 1 token y el Index en el team Arr
	  - En la siguiente seccion haremos un  Refactoring:
		  - Cambiar codigo interno sin que afecte al funcionamiento del sistema
				- Mejoraremos la arquitectura de la API
				- Gracias a los Tests el refactor ser mucho mas facil de lo q es normalmente xq mientras los tests vayan pasando, estaremos seguros q el codigo va bien.

 */

/* 










*/

// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S2. Intro
 * Codigos de error
	-  El estado de la respuesta que hace el servidor viene definido por números que siguen un estandar:
		1. Respuestas Informativas (100 - 199)
		2. Respuestas Satisfactorias (200 - 299)
			200: OK  ← Todo ha salido bien
			201: Created ← El recurso se creó satisfactoriamente (POST)
			202: Accepted ← El servidor ha aceptado la petición de larga duración pero aun no la ha procesado.
		3. Redirecciones: (300 - 399)
			301 - URL movida permanentemente.
		4. Errores de los clientes: (400 - 499)
			400: Bad request  ←  El cliente envio algo mal.
			401: Unauthorized ← No tiene las credenciales para acceder al recurso.
			403: Forbidden ← Indica que el servidor ha entendido nuestra peticion, pero se niega a autorizarla. Y a != del 401, re-autenticarnos No provocara ninguna !=.
			404: Not found  ←  El recurso no existe.
		5. Errores del servidor : (500 - 599)
			504: Gateway Timeout  ←  Toma mucho tiempo la petición. 

 */

/* 










*/

// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/**
 */
