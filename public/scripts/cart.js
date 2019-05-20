var input = document.getElementById('items');
if (input) {
    input.value = localStorage.getItem('cart');
    if (!localStorage.getItem('cart')) document.getElementById('cart').style.display = "none";
}

//Возвращается массив
function readstore() {
    let str = localStorage.getItem('cart');
    return JSON.parse(str);
}
//Запись массив
function writestore(value) {
    let str = JSON.stringify(value);
    localStorage.setItem('cart', str);
    let input = document.getElementById('items');
    input.value = localStorage.getItem('cart');
}
//добавление товара в массив
function addProductItem(id) {
    now()
    let mass = readstore();
    if (!mass) mass = [];
    let item = mass.find(x => x.id == id);
    if (item) {
        item.count++;
    }
    else {
        mass.push({
            "id": id,
            "count": 1
        });
    }
    writestore(mass);
    cartbox();
    let display_cart = document.getElementById('cart');
    if (display_cart) display_cart.style.display = "";
}
//Удаление товара в массиве
function removeProductItem(id) {
    let mass = readstore();
    let item = mass.find(x => x.id == id);
    if (item) {
        if (item.count > 1) item.count--;
        else {
            pos = mass.map(function (e) { return e.id; }).indexOf(id);
            if (~pos) mass.splice(pos, 1);
        }
    }
    writestore(mass);
}
//подсчет товара и вывод на интерфейс
function cartbox() {
    let mass = readstore();
    if (mass) {
        let result = mass.map(a => a.count);
        var sum = 0
        for (let i = 0; i < result.length; ++i) {
            sum += result[i]
        }
    }
    let cartbox = document.getElementById("cartbox")
    if (sum !== null && sum !== undefined && cartbox) cartbox.innerHTML = "- " + sum + " тов."

}
if (input) cartbox()