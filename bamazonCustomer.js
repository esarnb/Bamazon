/* MySQL Database Connection */
var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table2");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password"
});

connection.connect(function (err) {
  if (err) throw err;
  createDB();
});

function promptCB(prompt, cb) {
  console.log("\n", prompt); cb();
}
