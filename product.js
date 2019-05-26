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
    app.get("/product/fun", function (req, res) {
        try {
            var db = connection();
            let sql = `SELECT * FROM Product WHERE ID > 30000 AND ID < 40000`;
            db.serialize(() => {
                db.all(sql, (err, rows) => {
                    if (err) {
                        res.statusCode = 500
                        redirectToErrorPage(res, err);
                    }
                    else res.render("fun", { mas: rows });
                });
                db.close(() => {
                    console.log('db close')
                })
            });
        }
        catch (err) {
            redirectToErrorPage(res, err);
        }
    });
    app.get("/product/dif", function (req, res) {
        try {
            var db = connection();
            let sql = `SELECT * FROM Product WHERE ID > 20000 AND ID < 30000`;
            db.serialize(() => {
                db.all(sql, (err, rows) => {
                    if (err) {
                        res.statusCode = 500
                        redirectToErrorPage(res, err);
                    }
                    else res.render("dif", { mas: rows });
                });
                db.close(() => {
                    console.log('db close')
                })
            });
        }
        catch (err) {
            redirectToErrorPage(res, err);
        }
    });
    app.get("/product/decor", function (req, res) {
        try {
            var db = connection();
            let sql = `SELECT * FROM Product WHERE ID > 10000 AND ID < 20000`;
            db.serialize(() => {
                db.all(sql, (err, rows) => {
                    if (err) {
                        res.statusCode = 500
                        redirectToErrorPage(res, err);
                    }
                    else res.render("decor", { mas: rows });
                });
                db.close(() => {
                    console.log('db close')
                })
            });
        }
        catch (err) {
            redirectToErrorPage(res, err);
        }
    });
    app.get("/product/toys", function (req, res) {
        try {
            var db = connection();
            let sql = `SELECT * FROM Product WHERE ID > 1000 AND ID < 2000`;
            db.serialize(() => {
                db.all(sql, (err, rows) => {
                    if (err) {
                        res.statusCode = 500
                        redirectToErrorPage(res, err);
                    }
                    else res.render("toys", { mas: rows });
                });
                db.close(() => {
                    console.log('db close')
                })
            });
        }
        catch (err) {
            redirectToErrorPage(res, err);
        }
    });
}