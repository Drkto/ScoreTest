function readstore() {
    let str = localStorage.getItem('cart');
    return JSON.parse(str);
}
function writestore(value) {
    let str = JSON.stringify(value);
    localStorage.setItem('cart', str);
    let input = document.getElementById('items');
    input.value = localStorage.getItem('cart');
}
let mass = readstore();
mass.sort(function(obj1, obj2){
    return  obj1.id - obj2.id;
})
writestore(mass)