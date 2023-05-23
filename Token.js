// Token.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "change-me",
  database: "megapaca"
});

let TOKEN; // Variable global para almacenar el resultado de la consulta

async function obtenerToken() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM constantes', (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

async function obtenerYGuardarToken() {
  try {
    const result = await obtenerToken();
    TOKEN = result;
  } catch (error) {
    console.error(error);
  } finally {
    connection.end(); // Cerrar la conexión a la base de datos
  }
}

module.exports = {
  obtenerYGuardarToken
};
