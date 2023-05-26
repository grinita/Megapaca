// Token.js

const mysql = require('mysql2');

async function obtenerToken() {
  const connection = mysql.createConnection({
    host: "d8f406ed5c65",
    user: "root",
    password: "change-me",
    database: "megapaca"
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query('SELECT * FROM constantes', (error, results) => {
        if (error) {
          reject(error);
        } else {
          connection.end(); // Cerrar la conexión después de obtener los resultados
          resolve(results[0]["token"]);
        }
      });
    });
  });
}

async function guardarUsuarioEnBD(usuarioId, firstName, lastName) {
  const token = await obtenerToken();

  // Conexión a la base de datos
  const connection = mysql.createConnection({
    host: "d8f406ed5c65",
    user: "root",
    password: "change-me",
    database: "megapaca"
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }

    const query = `INSERT INTO usuario (id, first_name, last_name) VALUES (${usuarioId}, '${firstName}', '${lastName}')`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al guardar el usuario en la base de datos:', error);
      } else {
        console.log('Usuario guardado correctamente en la base de datos');
      }

      connection.end(); // Cerrar la conexión después de ejecutar la consulta
    });
  });
}

async function guardarRespuestaEnBD(usuarioId, descuento, color) {
  const token = await obtenerToken();

  // Conexión a la base de datos
  const connection = mysql.createConnection({
    host: "d8f406ed5c65",
    user: "root",
    password: "change-me",
    database: "megapaca"
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }

    const query = `INSERT INTO descuento (usuario, porcentaje, color) VALUES (${usuarioId}, ${descuento}, '${color}')`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al guardar la respuesta en la base de datos:', error);
      } else {
        console.log('Respuesta guardada correctamente en la base de datos');
      }

      connection.end(); // Cerrar la conexión después de ejecutar la consulta
    });
  });
}

module.exports = {
  obtenerToken,
  guardarUsuarioEnBD,
  guardarRespuestaEnBD
};
