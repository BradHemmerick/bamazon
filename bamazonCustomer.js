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
            process.exit();
        }
    })
}

function shop() {
    console.log('Here are the Items available!')
    connection.query(
        'SELECT * FROM products',
        function (err, res) {
            if (err) throw err;
            console.log(res);
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

    ]).then(function buyItems (){
        console.log(answer.id)
        console.log(answer.quanity)
    })
}