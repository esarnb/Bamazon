/* Packages */
var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table2");
var inquirer = require("inquirer");

//Importing individual functions from toolset.js
var createDB = require("./toolset").createDB;
var displayTable = require("./toolset").displayTable;
var displayAllItemsTable = require("./toolset").displayAllItemsTable;
var promptCB = require("./toolset").promptCB;

//Connect to mysql
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password"
});

connection.connect(function (err) {
  if (err) throw err;

  //Create the database on first start for manager (if user has not), display products to manager.
  createDB(connection, function () {
    displayTable(connection, managerMenu)
  });
});

/*
        Global Variables
*/
var minStock = 11; //Handler variable to decide what is considered "low" stock quantity for the department.

/**
 * Function displays a menu to manage the product's table.
 */
function managerMenu() {
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Restock All", "Quit"]
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
      case "Restock All": restockAll()
        break;
      case "Quit": promptCB("Thanks for stopping by manager!".cyan, function () { connection.end() })
        break;

    }
  })
}

/**
 * Function displays the currently stocked items to the manager.
 */
function viewProductsForSale() {
  console.clear()
  displayTable(connection, function () {
    promptCB("Currently stocked items".green, managerMenu)
  })
}

/**
 * Function selects all items that are less than a certain number (Default: 11) to display to the manager.
 */
function viewLowInventory() {
  console.clear()
  //Select all products where the item's quantity is less than the declared low-stock-quantity. 
  connection.query(("SELECT * FROM products WHERE stock_quantity < " + minStock), function (err, resp) {
    if (err) throw err;
    if (resp.length === 0) console.log(("All items' quantities are greater than " + (minStock - 1) + ".").green);
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

/**
 * Function asks the manager the quantity to add on a selected item
 */
function addToInventory() {
  console.clear();
  //Display all items and provide them in "resp".
  displayAllItemsTable(connection, function (resp) {
    var choices = resp.map(el => el.item_id.toString()); //Get current choices
    //Display the table, then ask which items to add quantity to
      inquirer.prompt([
        {
          type: "input",
          name: "itemID",
          message: "Input an [ID] item to add quantity to [Enter 'q' to Quit]: ",
          choices: choices,
          validate: function(answer) {
            //If the letter is q for quit, quit.
            if (answer === "q") return promptCB("Thanks for stopping by, Manager!", process.exit);
            else if (!choices.includes(answer)) {
              console.log("\nYou need to type a valid ID!\n".yellow)
              return false;
            }
            else return true;
          }
        }
      ]).then((response1) => {
        var theItem = resp.find(el => el.item_id == response1.itemID);
        //Ask manager how much stock to add.
        inquirer.prompt([
          {
            type: "input",
            name: "itemQuantity",
            message: "How many would you like to add? [Enter 'q' to Quit] ",
            validate: function(answer) {
              //If the letter is q for quit, quit.
              if (answer === "q") return promptCB("Thanks for stopping by, Manager!", process.exit);
              else if (isNaN(answer) || !isInteger(parseInt(answer)) || parseInt(answer) < 1) {
                console.log("\nYou need to type a valid amount greater than 0!\n".yellow)
                return false;
              }
              else return true;
            }          
        }
        ]).then((response2) => {
          //Update the selected id with the new quantity 
          connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [theItem.stock_quantity + parseInt(response2.itemQuantity), theItem.item_id], function (err) { if (err) throw err; promptCB("This prompt will not display on current update.", function () { displayTable(connection, managerMenu) }) })
        })
      })
  })
}

/**
 * Function asks manager properties of the item to add into the store.
 */
function addNewProduct() {
  console.clear()

  displayTable(connection, function () {
    //Ask the manager what the item is to add
    inquirer.prompt([
      {
        type: "input", name: "name", message: "What item would you like to add? [Enter 'q' to Quit]", validate: function (answer) {
          if (answer === 'q') promptCB("Thanks for coming!".yellow, process.exit)
          else if (!answer) { console.log("\nName cannot be empty!\n"); return false }
          else return true;
        }
      },
      {
        type: "input", name: "type", message: "What is the item's department type? [Enter 'q' to Quit]", validate: function (answer) {
          if (answer === 'q') promptCB("Thanks for coming!".yellow, process.exit)
          else if (!answer) { console.log("\nType cannot be empty!\n"); return false }
          else return true;
        }
      },
      {
        type: "input", name: "price", message: "What is the price tag of the item? [Enter 'q' to Quit]", validate: function (answer) {
          if (answer === 'q') promptCB("Thanks for coming!".yellow, process.exit)
          else if (!answer || isNaN(answer) || (parseFloat(answer) < 0)) { console.log("\nInvalid price tag!\n"); return false }
          else return true;
        }
      },
      {
        type: "input", name: "stock", message: "How many would you like to add to the shop? [Enter 'q' to Quit]", validate: function (answer) {
          if (answer === 'q') promptCB("Thanks for coming!".yellow, process.exit)        
          else if (!answer || isNaN(answer) || !Number.isInteger(parseInt(answer)) || (parseInt(answer) < 1)) { console.log("\nQuantity should be a whole number greater than 0!\n"); return false }
          else return true;
        }
      }
    ]).then((response) => {
      //Add the item into the store
      connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [response.name, response.type, parseFloat(response.price), parseInt(response.stock)], function (err) {
        if (err) throw err; 
        //Display all items to show the newly added item
        displayAllItemsTable(connection, function(){
          console.log("Added item into the department!".green);
          managerMenu()
        })
      });
      
    });
  })
}


function restockAll() {
  console.clear();
  connection.query("DROP DATABASE IF EXISTS Bamazon", function(err) {
    if (err) throw err;
    //Create the database with new values and display products to manager.
    createDB(connection, function () {
      displayTable(connection, managerMenu)
    });
  })
}