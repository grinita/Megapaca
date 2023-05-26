// Token.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'd8f406ed5c65',
  user: 'root',
  password: 'change-me',
  database: 'megapaca'
});


async function obtenerToken() {
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


// Función para obtener el descuento
async function getDescuento(userId, color) {
  try {
    connection.connect();

    const query = "SELECT descuento FROM carrito WHERE usuario = ? AND color = ?";
    const [rows] = await connection.promise().query(query, [userId, color]);

    if (rows.length > 0) {
      return rows[0].descuento;
    } else {
      return 0;
    }
  } catch (error) {
    throw error;
  } finally {
    connection.end();
  }
}

// Función para insertar un registro en el carrito
async function insertRegistro(userId, descripcion, precio, descuento, precioFinal, color) {
  try {
    connection.connect();

    const query = "INSERT INTO carrito (usuario, descripcion, precio_normal, descuento, precio_final, color) VALUES (?, ?, ?, ?, ?, ?)";
    await connection.promise().query(query, [userId, descripcion, precio, descuento, precioFinal, color]);
  } catch (error) {
    throw error;
  } finally {
    connection.end();
  }
}

// Función para obtener los registros del carrito
async function getRegistrosCarrito(userId) {
  try {
    connection.connect();

    const query = "SELECT * FROM carrito WHERE usuario = ?";
    const [rows] = await connection.promise().query(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.end();
  }
}

// Función para eliminar un registro del carrito
async function deleteRegistroCarrito(id, userId) {
  try {
    connection.connect();

    let query;
    let params;

    if (id) {
      query = "DELETE FROM carrito WHERE id = ? AND usuario = ?";
      params = [id, userId];
    } else {
      query = "DELETE FROM carrito WHERE usuario = ?";
      params = [userId];
    }

    await connection.promise().query(query, params);
  } catch (error) {
    throw error;
  } finally {
    connection.end();
  }
}


module.exports = {
  obtenerToken,
  guardarUsuarioEnBD,
  guardarRespuestaEnBD,
  obtenerDescuentosPorUsuario,
  getDescuento,
  insertRegistro,
  getRegistrosCarrito,
  deleteRegistroCarrito
};

