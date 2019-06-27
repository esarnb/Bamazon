var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table2");
var inquirer = require("inquirer");
var createDB = require("./createProductDatabase").createDB
var displayTable = require("./createProductDatabase").displayTable

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password"
});

connection.connect(function (err) {
  if (err) throw err;

  //Running createProductDatabase.js functions to setup the db and tables
  createDB(connection, function () {
    displayTable(connection, managerMenu)
  });
});

function managerMenu() {
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "=====Exit====="]
    }
  ]).then((answer) => {
    switch (answer.action) {

      case "View Products for Sale": viewProductsForSale()
        break;
      case "View Low Inventory": viewLowInventory()
        break;
      case "Add to Inventory": addToInventory()
        break;
      case "Add New Product": addNewProduct()
        break;
      case "=====Exit=====": promptCB("Thanks for stopping by manager!".cyan, function () { connection.end() })
        break;

    }
  })
}

function viewProductsForSale() {
  console.clear()
  displayTable(connection, function () {
    promptCB("Currently stocked items".green, managerMenu)
  })
}

function viewLowInventory() {
  console.clear()
  connection.query("SELECT * FROM products WHERE stock_quantity < 11", function (err, resp) {
    if (err) throw err;
    if (resp.length === 0) console.log("All items' quantity is greater than 10.".green);
    else {
      var table = new Table({
        head: ["ID", "Item", "Department", "Price", "Stock"]
      });
      for (row of resp) { table.push([row.item_id, row.product_name, row.department_name, "$" + row.price.toFixed(2), row.stock_quantity]); }
      console.log(table.toString());
      console.log("Low quantity items".red);

    }
    managerMenu();
  })
}

function addToInventory(cb) {
  console.clear();

  //

  cb()
}

function addNewProduct(cb) {
  console.clear()

  //

  cb()
}

function promptCB(prompt, cb) {
  console.clear()
  console.log("\n", prompt); cb();
}  
