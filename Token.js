// Token.js

const mysql = require('mysql2');

async function obtenerToken() {
  const connection = mysql.createConnection({
    host: "localhost",
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

module.exports = {
  obtenerToken
};
