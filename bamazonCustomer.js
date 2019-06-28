/* Packages */
var mysql = require("mysql");
var colors = require("colors");
var inquirer = require("inquirer");

//Importing individual functions from toolset.js
var createDB = require("./toolset").createDB;
var displayTable = require("./toolset").displayTable;
var promptCB = require("./toolset").promptCB;

//Connect to mysql
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password"
});

//Establish the connection
connection.connect(function (err) {
  if (err) throw err;

  //Create the database (if manager has not), display the products, show menu to user.
  //These functions are stored in createProductDatabase.js
  createDB(connection, function(){
    displayTable(connection, showMenu)
  });
});

/**
 * Function showMenu asks the user to pick an item to buy and the quantity to purchase until the user quits.
 */
function showMenu() {

  //Get all products that have a quantity
  connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, resp) {
    if (err) throw err;
    //take all products' id's and put them into an array for user's choices.
    var choices = resp.map(el => el.item_id.toString());
    choices.push("q");//Add q choice for quit.

    //Ask the user which item they would like to buy.
    inquirer.prompt([
      {
        type: "input",
        message: "Welcome to SR Depo! Input an ID to buy an item [Enter 'q' to quit]: ",
        name: "pickedItem",
        validate: function(answer) {
          //If the letter is q for quit, quit.
          if (answer === "q") return true;
          //If the user inputs an invalid key or out of range, prompt the user and let the user retry.
          else if (!choices.includes(answer)) {
            console.log("\nYou need to type a valid ID!\n".yellow)
            return false;
          }
          else return true;
        }
      }
    ]).then(response1 => {

      //Find the specific item the user chose from the table.
      var theItem = resp.find(el => el.item_id == parseInt(response1.pickedItem));      
      if (response1.pickedItem === "q") { promptCB("Thanks for coming!".yellow, function () { process.exit() }) }
      //Ask the user how many of item to buy.
      inquirer.prompt([
        {
          type: "input",
          message: "How many would you like to buy? [Enter 'q' to Quit]: ",
          name: "pickedQuantity",
          validate: function (answer) {
            if (answer === 'q') return true;
            //If the user inputs a number higher than the stock, user tries again.
            else if (parseInt(answer) > theItem.stock_quantity) {
              console.log("\nCan't buy more than what you see!\n".red)
              return false;
            }
            //If the user inputs an invalid key or out of range, prompt the user and let the user retry.
            else if (!answer || isNaN(answer) || parseInt(answer) < 1) {
              console.log("\nYou need to type a valid integer!\n".yellow)
              return false;
            }
            else return true;
          }
        }
      ]).then(function (response) {
        if (response.pickedQuantity === "q") { promptCB("Thanks for coming!".yellow, function () { process.exit() }) }
        //Update the selected item's quantity and display a successful transaction.
        connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [theItem.stock_quantity - response.pickedQuantity, theItem.item_id], function (err) {
          if (err) throw err;
          displayTable(connection, function () { promptCB("Congrats, your trade was successful!".green, showMenu); });
        });

      });

    });
  });
}
