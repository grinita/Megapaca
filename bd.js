var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "change-me"
});

async function getToken(){
    return con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM constantes", function (err, result, fields) {
          if (err) throw err;
          return result
        });
    });
}

console.log(getToken())