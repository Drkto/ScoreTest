module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('main');
    });
    app.get('/delivery', function (req, res) {
        res.render('delivery');
    });
    app.get('/about', function (req, res) {
        res.render('about');
    });
    app.get('/product', function (req, res) {
        res.render('product');
    });
    app.get('/order', function (req, res) {
        res.render('order');
    });
    app.get('/adminconsole', function (req, res) {
        res.render('adminpineapple')
    })
}