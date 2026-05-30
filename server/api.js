const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ishop",
    password: "password",
    port: 5432
});


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Ishop API Running");
});


// GET ALL CUSTOMERS
app.get("/customers", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM customers"
        );

        res.send(result.rows);

    } catch (err) {

        console.log(err);
        res.send("Database Error");

    }

});


// REGISTER CUSTOMER
app.post("/registercustomer", async (req, res) => {

    try {

        const customer = req.body;

        await pool.query(
            "INSERT INTO customers(userid, username, password, age, email, mobile) VALUES($1,$2,$3,$4,$5,$6)",
            [
                customer.UserId,
                customer.UserName,
                customer.Password,
                customer.Age,
                customer.Email,
                customer.Mobile
            ]
        );

        res.send("Customer Registered Successfully");

    } catch (err) {

        console.log(err);
        res.send("Insert Error");

    }

});


// LOGIN CUSTOMER
app.post("/logincustomer", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM customers WHERE userid=$1",
            [req.body.UserId]
        );

        if (result.rows.length > 0) {

            const customer = result.rows[0];

            if (customer.password === req.body.Password) {

                res.send({
                    success: true,
                    message: "Login Success",
                    user: customer
                });

            } else {

                res.send({
                    success: false,
                    message: "Invalid Password"
                });

            }

        } else {

            res.send({
                success: false,
                message: "User Not Found"
            });

        }

    } catch (err) {

        console.log(err);

        res.send({
            success: false,
            message: "Login Error"
        });

    }

});


// ADMIN LOGIN
// Username: admin  Password: admin123
app.post("/adminlogin", (req, res) => {

    var username = req.body.Username;
    var password = req.body.Password;

    if (username == "admin" && password == "admin123") {

        res.json({
            success: true,
            message: "Admin Login Success"
        });

    } else {

        res.json({
            success: false,
            message: "Invalid Admin Credentials"
        });

    }

});


// DELETE CUSTOMER
app.delete("/deletecustomer/:id", async (req, res) => {

    var userid = req.params.id;

    try {

        await pool.query(
            "DELETE FROM customers WHERE userid = $1",
            [userid]
        );

        res.json({
            success: true,
            message: "Customer Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false,
            message: "Delete Failed"
        });

    }

});


// START SERVER
app.listen(4400, () => {
    console.log("Server Started : http://localhost:4400");
});