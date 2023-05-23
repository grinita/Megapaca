// Token.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "change-me",
  database: "megapaca"
});

let TOKEN; // Variable global para almacenar el resultado de la consulta

function obtenerToken() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM constantes', (error, results) => {
      if (error) {
        reject(error);
      } else {
        TOKEN = results;
        resolve();
      }
    });
  });
}

async function obtenerYGuardarToken() {
  try {
    await obtenerToken();
  } catch (error) {
    console.error(error);
  } finally {
    connection.end();
  }
}

module.exports = {
  obtenerYGuardarToken,
  obtenerToken // Exportar la función obtenerToken
};
