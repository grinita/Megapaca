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
        TOKEN = results; // Asignar el valor de results a TOKEN
        resolve(); // Resolver la promesa sin devolver ningún valor
      }
    });
  });
}

async function obtenerYGuardarToken() {
  try {
    await obtenerToken(); // Esperar a que se complete la consulta
  } catch (error) {
    console.error(error);
  } finally {
    connection.end(); // Cerrar la conexión a la base de datos
  }
}

module.exports = {
  obtenerYGuardarToken,
  TOKEN // Exportar la variable TOKEN
};
