/**
 * @swagger
 * /libros:
 *   get:
 *     tags:
 *       - "Libros"
 *     summary: Obtener todos los libros almacenados
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para listar los libros que han sido guardados
 *     responses: 
 *      200:
 *       description: Petición exitosa
 *       schema:
 *         type: "array"
 *         items:
 *           $ref: "#/definitions/libro"
 *      400:
 *        description: Petición inválida
 * definitions:
 *   libro:
 *     type: "object"
 *     required:
 *     - "titulo"
 *     - "autor"
 *     - "year"
 *     properties:
 *       titulo:
 *         type: string
 *       autor:
 *         type: string
 *       year:
 *         type: number
 */

/**
 * @swagger
 * /libros/{id}:
 *   get:
 *     tags:
 *       - "Libros"
 *     summary: Obtener un libro por ID
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para mostrar un libro según su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro que se busca
 *         schema:
 *           type: string
 *     responses: 
 *      200:
 *       description: Petición exitosa
 *       schema:
 *         type: "array"
 *         items:
 *           $ref: "#/definitions/libro"
 *      400:
 *        description: ID inválido
 *      404:
 *        description: Libro no encontrado
 * definitions:
 *   libro:
 *     type: "object"
 *     required:
 *     - "titulo"
 *     - "autor"
 *     - "year"
 *     properties:
 *       titulo:
 *         type: string
 *       autor:
 *         type: string
 *       year:
 *         type: number
 */

/**
 * @swagger
 * /libros:
 *   post:
 *     tags:
 *       - "Libros"
 *     summary: Agregar un nuevo libro
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para agregar un nuevo libro a la base de datos
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         required: true
 *         description: Objeto libro requerido para agregarlo a la colección
 *         schema:
 *           $ref:  "#/definitions/libro"
 *     responses:
 *       200:
 *         description: Libro creado correctamente
 *       405:
 *         description: Datos incorrectos
 * definitions:
 *   libro:
 *     type: "object"
 *     required:
 *     - "titulo"
 *     - "autor"
 *     - "year"
 *     properties:
 *       titulo:
 *         type: string
 *       autor:
 *         type: string
 *       year:
 *         type: number
 */

/**
 * @swagger
 * /libros/{id}:
 *   put:
 *     tags:
 *       - "Libros"
 *     summary: Actualizar un libro existente
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para actualizar información de un libro existente
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "path"
 *         name: "id"
 *         description: ID del libro que se va a actualizar
 *         required: true
 *         type: "string"
 *       - in: "body"
 *         name: "body"
 *         required: true
 *         description: Objeto libro requerido para actualizar la información
 *         schema:
 *           $ref:  "#/definitions/libro"
 *     responses:
 *       200:
 *         description: Libro actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Libro no encontrado
 *       405:
 *         description: Excepción de validación
 * definitions:
 *   libro:
 *     type: "object"
 *     required:
 *     - "titulo"
 *     - "autor"
 *     - "year"
 *     properties:
 *       titulo:
 *         type: string
 *       autor:
 *         type: string
 *       year:
 *         type: number
 */

/**
 * @swagger
 * /libros/{id}:
 *   delete:
 *     tags:
 *       - "Libros"
 *     summary: Eliminar un libro por ID
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para eliminar un libro existente
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "path"
 *         name: "id"
 *         required: true
 *         description: ID del libro a eliminar
 *     responses:
 *       202:
 *         description: Libro eliminado  correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - "Usuarios"
 *     summary: Agregar un nuevo usuario
 *     description: Endpoint para agregar un nuevo usuario a la base de datos
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         required: true
 *         description: Objeto usuario requerido para agregarlo a la colección
 *         schema:
 *           $ref:  "#/definitions/usuario"
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 *       405:
 *         description: Datos incorrectos
 * definitions:
 *   usuario:
 *     type: "object"
 *     required:
 *     - "email"
 *     - "password"
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /get-token:
 *   post:
 *     tags:
 *       - "Usuarios"
 *     summary: Solicitar un token
 *     description: Endpoint para obtener un token de autenticación
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         required: true
 *         description: Objeto usuario requerido para generar un token de autenticación
 *         schema:
 *           $ref:  "#/definitions/token"
 *     responses:
 *       200:
 *         description: Token creado correctamente
 *       405:
 *         description: Datos incorrectos
 * definitions:
 *   token:
 *     type: "object"
 *     required:
 *     - "email"
 *     - "api_key"
 *     properties:
 *       email:
 *         type: string
 *       api_key:
 *         type: string
 */