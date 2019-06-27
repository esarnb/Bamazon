var mysql = require("mysql");
var colors = require("colors");
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
  createDB(connection, function(){
    displayTable(connection, managerMenu)
  });
});


function promptCB(prompt, cb) {
    console.log("\n", prompt); cb();
  }  

function managerMenu() {
    inquirer([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "=====Exit====="]
        }
    ]).then((answer) => {
        if (answer.action === "=====Exit=====") 

        switch (answer.action) {
            
            case "View Products for Sale": viewProductsForSale()
                break;
            case "View Low Inventory": viewLowInventory()
                break;
            case "Add to Inventory": addToInventory()
                break;
            case "Add New Product": addNewProduct()
                break;
            case "=====Exit=====": promptCB("Thanks for stopping by manager!", function() {connection.end()})
                break;
            
        }
    })
}

function viewProductsForSale() {

}

function viewLowInventory() {

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

