/* MySQL Database Connection */
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
    displayTable(connection, showMenu)
  });
});

function showMenu() {
  connection.query("SELECT * FROM products", function (err, resp) {
    if (err) throw err;
    var choices = resp.map(el => el.item_id.toString());
    choices.push("q");
    inquirer.prompt([
      {
        type: "input",
        message: "Welcome to SR Depo! Input an ID to buy an item [Enter 'q' to quit]: ",
        name: "pickedItem"
      },
    ]).then(response1 => {
      if (response1.pickedItem === "q") {
        promptCB("Thanks for coming!", function () {
          process.exit();
        });
      }
      inquirer.prompt([
        {
          type: "input",
          message: "How many would you like to buy?",
          name: "pickedQuantity",
          validate: function (answer) {
            if (!answer || isNaN(answer) || Math.abs(parseInt(answer) < 1)) {
              promptCB("You need to type a valid integer!".yellow, function () { });
              return false;
            }
            else return true;
          }
        }
      ]).then(function (response) {
        var theItem = resp.find(el => el.item_id == parseInt(response1.pickedItem));
        if (Math.abs(parseInt(response.pickedQuantity) < 1))
          return promptCB("You need to specify an amount to buy!".yellow, showMenu);
        else if (parseInt(response.pickedQuantity) > theItem.stock_quantity)
          return promptCB("Can't buy more than what you see!".red, showMenu);
        else {
          connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [theItem.stock_quantity - response.pickedQuantity, theItem.item_id], function (err) {
            if (err) throw err;
            displayTable(connection, function () { promptCB("Congrats, your trade was successful!".green, showMenu); });
          });
        }
      });
    });
  });
}

function promptCB(prompt, cb) {
  console.log("\n", prompt); cb();
}
