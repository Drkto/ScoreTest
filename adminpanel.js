module.exports = function (app) {
    var sqlite3 = require('sqlite3').verbose();
    function connection() {
        return new sqlite3.Database('database/db.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.error(err.message);
            else console.log('Connected to the user database.');
        });
    };
    function redirectToErrorPage(res, err) {
        res.render('error', err);
    }
    let admins = [];
    app.post('/authorization', function (req, res) {
        let login = req.body.login;
        let password = req.body.password;
        let db = connection();
        db.serialize(() => {
            let sql = "SELECT Log, Pass FROM ADMIN";
            db.all(sql, function (err, rows) {
                if (err) console.log(err)
                else {
                    let Login = rows.map(a => a.Log);
                    let Password = rows.map(a => a.Pass);
                    if (login == Login && password == Password) {
                        if (admins.length > 100) admins = [];
                        admins.push({ ip: req.host, date: new Date() })
                        res.redirect('adminpanel')
                    }
                    else res.redirect('/adminconsole')
                }
            })
        })
    })
    app.get('/adminpanel', function (req, res) {
        let user = admins.find(x => x.ip == req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        let date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        if (!admins || admins.length == 0 || !user || (user.date.getHours() < hour && user.date.getMinutes() < minutes)) {
            res.redirect('/adminconsole')
        } else {
            var db = connection();
            let sql = `SELECT Name, Product_Name, Count, Address, Phone, Date, Getting, Price*Count AS PriceALL  FROM Orders
            LEFT JOIN Product p ON Orders.ID_Product = p.ID`;
            db.serialize(() => {
                db.all(sql, (err, rows) => {
                    if (err) {
                        res.statusCode = 500
                        redirectToErrorPage(res, err);
                    }
                    else res.render("adminpanel", {mas: rows});
                });
                db.close(() => {
                    console.log('db close')
                })
            });
        }
    })
    app.post("/delproduct", function(req, res){
        let db = connection();
        let idproduct = req.body.idproduct;
        let sql = `DELETE FROM Product WHERE ID = ${idproduct}`
        db.serialize(()=> {
            db.run(sql, (err)=> {
                if (err) {
                    res.statusCode = 500
                    redirectToErrorPage(res, err);
                }
                else res.redirect("adminpanel")
            })
            db.close(() => {
                console.log('db close')
            });
        }) 
    })
    app.post("/delorder", function(req, res){
        let db = connection();
        let idorder = req.body.idorder;
        let sql = `DELETE FROM Orders WHERE ID = ${idorder}`
        db.serialize(()=> {
            db.run(sql, (err)=> {
                if (err) {
                    return console.log(err.message);
                }
                else res.redirect("adminpanel")
            })
            db.close(() => {
                console.log('db close')
            });
        }) 
    })
    app.post("/insproduct", function(req, res){
        let db = connection();
        let idproduct = req.body.idproduct;
        let nameproduct = req.body.nproduct;
        let price = req.body.price;
        let photo = req.body.photo;
        let quin = req.body.quintity
        let sql = `INSERT INTO Product(ID, Product_Name, Price, PhotoID, Quintity) VALUES (${idproduct}, '${nameproduct}', ${price}, '${photo}', ${quin})`
        db.serialize(()=> {
            db.run(sql, (err)=> {
                if (err) {
                    return console.log(err.message);
                }
                else res.redirect("adminpanel")
            })
            db.close(() => {
                console.log('db close')
            });
        }) 
    })
}