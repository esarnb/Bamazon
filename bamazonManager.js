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
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
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
      case "Quit": promptCB("Thanks for stopping by manager!".cyan, function () { connection.end() })
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

function addToInventory() {
  console.clear();
  connection.query("SELECT * FROM products", function (err, resp) {
    var choices = resp.map(el => el.item_id.toString());
    displayTable(connection, function () {
      inquirer.prompt([
        {
          type: "input",
          name: "itemID",
          message: "Input an [ID] item to add quantity to [Enter 'q' to Quit]: ",
          choices: choices
        }
      ]).then((response1) => {
        var theItem = resp.find(el => el.item_id == response1.itemID);
        if (theItem.itemID === "q") {return promptCB("Thanks for stopping by, Manager!"), function(){connection.end()}}
        else {
          inquirer.prompt([
            {
              type: "input",
              name: "itemQuantity",
              message: "How many would you like to add? [Enter 'q' to Quit] ",
            }
          ]).then((response2) => {
            // var theQuantity = resp.find(el => el.stock_quantity == response2.itemQuantity);
            if (theItem.itemID === "q") {return promptCB("Thanks for stopping by, Manager!"), function(){connection.end()}}
            else {
              connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [theItem.stock_quantity + parseInt(response2.itemQuantity), theItem.item_id], function(err) { if (err) throw err; promptCB("Updated Product!".green, function(){displayTable(connection, managerMenu)}) })
            }
          })
        }
      })
    })

  })
}

function addNewProduct(cb) {
  console.clear()

  //

  cb()
}

function promptCB(prompt, cb) {
  console.log("\n", prompt); cb();
}  
