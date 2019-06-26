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

function displayTable(cb) {
  console.clear();
  connection.query("SELECT * FROM products", function (err, resp) {
    if (err) throw err;
    var table = new Table({
      head: ["ID", "Item", "Department", "Price", "Stock"]
    });
    for (row of resp) { table.push([row.item_id, row.product_name, row.department_name, "$" + row.price.toFixed(2), row.stock_quantity]); }
    console.log(table.toString()); cb();
  });
}

function promptCB(prompt, cb) {
  console.log("\n", prompt); cb();
}
