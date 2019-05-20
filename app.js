const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = require("hbs");
let admins = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.engine("hbs", exphbs(
    {
        layoutsDir: "views/partials",
        extname: "hbs"
    }
))
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

var sqlite3 = require('sqlite3').verbose();
function connection() {
    return new sqlite3.Database('database/db.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message);
        else console.log('Connected to the user database.');
    });
};

//Рендеринг
app.get('/', function (req, res) {
    res.render('main');
});

app.get('/delivery', function (req, res) {
    res.render('delivery');
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


function redirectToErrorPage(res, err) {
    res.render('error', err);
}

app.get('/about', function (req, res) {
    res.render('about');
});
app.get('/product', function (req, res) {
    res.render('product');
});
app.post("/cart", function (req, res) {
    var items = JSON.parse(req.body.items);
    var item = items.map(a => a.id);
    var count = items.map(a => a.count);
    let db = connection();
    let sql = `SELECT
                    ID,
                    Product_Name,
                    Price,
                    PhotoID 
                FROM Product WHERE ID in (${item})`
    db.serialize(() => {
        db.all(sql, (err, rows) => {
            if (err)
                console.log(err);
            else {
                let result = rows.map(a => a.Price);
                var sum = 0;
                for (var i = 0; i < result.length; ++i) {
                    sum += result[i] * count[i];
                    rows[i].count = count[i];
                }
                res.render("cart", {
                    mas: rows,
                    PriceAll: sum
                })
            }
        });
    });
    db.close(() => {
        console.log('db close')
    });
});
//отправка на оформленный заказ
app.get('/order', function (req, res) {
    res.render('order');
});
//отправка заказа в магазин
app.post("/order", function (req, res) {
    function formatDate(date) {
        var monthNames = [
            "Января", "Февраля", "Марта",
            "Апреля", "Мая", "Июня", "Июля",
            "Августа", "Сентября", "Октября",
            "Ноября", "Декабря"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ':' + minutes + ' , ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
    };
    var name = req.body.Name;
    var address = req.body.activeAddress;
    var phone = req.body.Telephone;
    var date = formatDate(new Date());
    let db = connection();
    if (address == null) address = "самовывоз";
    db.serialize(() => {
        let items_mas = [];
        for (let k in req.body) {
            if (+k) items_mas.push({ id: k, count: req.body[k] })
        }
        let id = items_mas.map(e => e.id)
        let count = items_mas.map(e => e.count)
        for (let i = 0; i < id.length; i++) {
            db.run(`INSERT INTO Orders (Name, ID_Product, Count, Address, Phone, Date) VALUES (?, ?, ?, ?, ?, ?)`,
                name, id[i], count[i], address, phone, date, function (err) {
                    if (err)
                        return console.log(err.message);
                });
        }
        db.close(() => {
            console.log('db close')
        });
        res.redirect('/order');
    })
});
app.get('/adminconsole', function (req, res) {
    res.render('adminpineapple')
})
app.post('/authorization', function (req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var log = 'genamakarov';
    var pass = '0903';
    if (login === log && password === pass) {
        if (admins.length > 100) admins = [];
        admins.push({ ip: req.host, date: new Date() })
        res.redirect('adminpanel')
    }
    else res.redirect('/adminconsole')
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
                else res.render("adminpanel", { mas: rows });
            });
            db.close(() => {
                console.log('db close')
            })
        });
    }
})
app.use(function (req, res) {
    res.send(404, "Page Not Found")
});