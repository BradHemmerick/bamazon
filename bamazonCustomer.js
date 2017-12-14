var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localHost',
    port: 3306,
    user: 'root',
    password: "dobbyTheCoder",
    database: 'bamazon'
})

connection.connect(function (err) {
    console.log(`connected as id: ${connection.threadId}`)
    startBam()
})

var startBam = function () {
    inquirer.prompt({
        name: "postorBid",
        type: 'rawlist',
        message: 'Welcome to bamazon! Would you like to Shop or [Exit app]?',
        choices: ['Shop', 'Exit app']
    }).then(function (answer) {
        if (answer.postorBid == "Shop") {
            shop();
        } else {
            connection.end();
        }
    })
}

function shop() {
    console.log('Here are the Items available!')
    connection.query(
        'SELECT * FROM products',
        function (err, res) {
            if (err) throw err;
            for(var i = 0; i < res.length; i++){
                console.log(`Id: ${res[i].item_id} Name: ${res[i].product_name} Price: ${res[i].price} Quantity: ${res[i].stock_quantity}`);
            }
            buyBam();
        }
    )
}

function buyBam() {
    inquirer.prompt([{
            name: "grabID",
            type: 'input',
            message: 'What is the product id of the item you would like to purchase?',
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "quanity",
            type: 'input',
            message: 'how many would you like to buy?',
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }

    ]).then(function buyItems (answer){
        console.log(answer.grabID)
        console.log(answer.quanity)
        var query = 'SELECT * FROM products WHERE item_id = ?';
        connection.query(query, [answer.grabID], function (err, res) {
                if (err) throw err;
                // console.log(res);
						completeOrder(res[0], answer.grabID, parseInt(answer.quanity))
              
            }
        )

    })
}

function completeOrder(resObj, usrProdID, usrQty){
    //see if the quantity is not more then what the user ordered
    if(resObj.stock_quantity > usrQty){
				//update our database subtracting the quantity from the stock quantity
			var quanity = resObj.stock_quantity - usrQty;

			var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

			connection.query(query, [quanity, usrProdID], function (err, res) {
                if (err) throw err;
								// console.log(res);
								console.log(`order was successfully completed your card will be billed for the ammount of $${usrQty * resObj.price}.00 usd`)
                connection.end()
            }
        )
		}
		else{
			console.log(`ERROR: the product you orded does not have enought stock to be purchesd `);
			connection.end()
		}
		
    //show message saying their is not enough product
}