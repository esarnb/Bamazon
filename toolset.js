var Table = require("cli-table2");

/**
 * 
 * @param {Object} connection is the mysql initialized connection.
 * @param {Function} cb is the callback function ran once the database is created.
 */
function createDB(connection, cb) {
  connection.query("CREATE DATABASE IF NOT EXISTS bamazon", function (err) {
    if (err) throw err;
    connection.query("USE bamazon", function (err) {
      if (err) throw err;
      connection.query("CREATE TABLE IF NOT EXISTS products (item_id INT NOT NULL AUTO_INCREMENT, product_name VARCHAR(255), department_name VARCHAR(255), price DECIMAL(10, 2), stock_quantity INT, PRIMARY KEY(item_id))",
        function (err) {
          if (err) throw err;
          connection.query("SELECT * FROM products", function (err, resp) {
            if (err) throw err;
            //Insert all new products
            if (resp.length < 1) {
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Cookies", "Food & Drinks", 5, 100], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Water Bottle", "Food & Drinks", 2, 500], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Cats", "Pets", 100, 36], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Dogs", "Pets", 100, 29], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Parrot", "Pets", 90, 48], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Nintendo Switch", "Gaming Consoles", 300, 42], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["PlayStation 4", "Gaming Consoles", 400, 32], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["XBox 1", "Gaming Consoles", 380, 30], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Tesla Roadster", "Vehicles ", 400000, 33], function (err) { if (err) throw err; });
              connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ["Hyundai Elantra", "Vehicles", 102050.34, 100], function (err) { if (err) throw err; });
            }
            cb(); //Display new table to user/manager or start a menu

            /**
             * Notes for Graders
             * 
             * I could not get multiple insertions to work. Any insight would be helpful, I would like to merge different query executions all into one.
             * 
             * Here is the link I used to seek help: https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js
             * 
             * Here is what I tried:
             
             //All insertions are put into an array. :params is used because npm-package MySql does not accept value ? as an accepted arrayParameter, node-Mysql does.
             
              var sqlStatement = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
              var values = [
                ["Cookies", "Food & Drinks", 5, 100], ["Water Bottle", "Food & Drinks", 2, 500], ["Cats", "Pets", 100, 36], ["Dogs", "Pets", 100, 29], ["Parrot", "Pets", 90, 48],
                ["Nintendo Switch", "Gaming Consoles", 300, 42], ["PlayStation 4", "Gaming Consoles", 400, 32], ["XBox 1", "Gaming Consoles", 380, 30], 
                ["Tesla Roadster", "Vehicles ", 400000, 33], ["Hyundai Elantra", "Vehicles", 102050.34, 100]
              ];
              //Insert all 10 items into the table
              connection.query(sqlStatement, values, function (err) { if (err) throw err; });

             */
          });
        }
      );
    });
  });
}

/**
 * 
 * @param {Object} connection is the mysql initialized connection.
 * @param {Function} cb is the callback function ran once the database is created.
 */
function displayTable(connection, cb) {
  console.clear();
  //Show currently stocked items
  connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, resp) {
    if (err) throw err;
    var table = new Table({
      head: ["ID", "Item", "Department", "Price", "Stock"]
    });
    for (row of resp) { table.push([row.item_id, row.product_name, row.department_name, "$" + row.price.toFixed(2), row.stock_quantity]); }
    console.log(table.toString()); cb();
  });
}

/**
 * 
 * @param {Object} connection is the mysql initialized connection.
 * @param {Function} cb is the callback function ran once the database is created.
 */
function displayAllItemsTable(connection, cb) {
  console.clear();
  //Show currently stocked items
  connection.query("SELECT * FROM products", function (err, resp) {
    if (err) throw err;
    var table = new Table({
      head: ["ID", "Item", "Department", "Price", "Stock"]
    });
    for (row of resp) { table.push([row.item_id, row.product_name, row.department_name, "$" + row.price.toFixed(2), row.stock_quantity]); }
    console.log(table.toString()); cb(resp);
  });
}

/**
 * 
 * @param {String} prompt is the string to report to the user/manager.
 * @param {Function} cb is the callback function to run once the user is prompted.
 */
function promptCB(prompt, cb) {
  console.log("\n", prompt); cb();
}  


module.exports = {
  createDB: createDB,
  displayTable: displayTable,
  promptCB: promptCB,
  displayAllItemsTable: displayAllItemsTable
};