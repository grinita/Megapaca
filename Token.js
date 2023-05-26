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
  // Conexión a la base de datos
  const connection = mysql.createConnection({
    host: "d8f406ed5c65",
    user: "root",
    password: "change-me",
    database: "megapaca"
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Error de conexión a la base de datos:', err);
        reject(err);
        return;
      }

      const query = `SELECT * FROM usuario WHERE id = ${usuarioId}`;

      connection.query(query, (error, results) => {
        if (error) {
          console.error('Error al consultar el usuario en la base de datos:', error);
          reject(error);
        } else {
          if (results.length > 0) {
            console.log('El usuario ya existe en la base de datos. No se realizará ninguna acción.');
            resolve();
          } else {
            const insertQuery = `INSERT INTO usuario (id, first_name, last_name) VALUES (${usuarioId}, '${firstName}', '${lastName}')`;

            connection.query(insertQuery, (insertError) => {
              if (insertError) {
                console.error('Error al guardar el usuario en la base de datos:', insertError);
                reject(insertError);
              } else {
                console.log('Usuario guardado correctamente en la base de datos');
                resolve();
              }
            });
          }
        }

        connection.end(); // Cerrar la conexión después de ejecutar la consulta
      });
    });
  });
}


async function guardarRespuestaEnBD(usuarioId, descuento, color) {
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

    const selectQuery = `SELECT * FROM descuento WHERE usuario = ${usuarioId} AND porcentaje = ${descuento}`;

    connection.query(selectQuery, (error, results) => {
      if (error) {
        console.error('Error al buscar en la base de datos:', error);
        connection.end();
        return;
      }

      if (results.length > 0) {
        // Si existe un registro con el mismo usuarioId y descuento, se actualiza el atributo color
        const updateQuery = `UPDATE descuento SET color = '${color}' WHERE usuario = ${usuarioId} AND porcentaje = ${descuento}`;

        connection.query(updateQuery, (error, updateResults) => {
          if (error) {
            console.error('Error al actualizar el registro en la base de datos:', error);
          } else {
            console.log('Registro actualizado correctamente en la base de datos');
          }

          connection.end(); // Cerrar la conexión después de ejecutar la consulta
        });
      } else {
        // Si no existe un registro con el mismo usuarioId y descuento, se inserta un nuevo registro
        const insertQuery = `INSERT INTO descuento (usuario, porcentaje, color) VALUES (${usuarioId}, ${descuento}, '${color}')`;

        connection.query(insertQuery, (error, insertResults) => {
          if (error) {
            console.error('Error al insertar el registro en la base de datos:', error);
          } else {
            console.log('Registro insertado correctamente en la base de datos');
          }

          connection.end(); // Cerrar la conexión después de ejecutar la consulta
        });
      }
    });
  });
}



async function obtenerDescuentosPorUsuario(usuarioId) {

  // Conexión a la base de datos
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

      const query = `SELECT * FROM descuento WHERE usuario = ${usuarioId} ORDER BY porcentaje ASC`;

      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }

        connection.end(); // Cerrar la conexión después de obtener los resultados
      });
    });
  });
}

module.exports = {
  obtenerToken,
  guardarUsuarioEnBD,
  guardarRespuestaEnBD,
  obtenerDescuentosPorUsuario
};
