var Table = require("cli-table2");

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
            //   displayTable(showMenu);
                cb();
            });
          }
        );
      });
    });
  }
  
  
  function displayTable(connection, cb) {
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

  module.exports = {
    createDB: createDB,
    displayTable: displayTable
  };