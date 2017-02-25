var add = (a, b) => {
    return a + b;
}

var asynAdd = (a, b, callback) => {
    setTimeout(() => {
        return callback(add(a, b));
    }, 1000);
}

var square = (a) => {
    return a * a;
}

var asynSquare = (a, callback) =>{
    setTimeout(() => {
        return callback(square(a));
    },1000);
}

module.exports = {
    add,
    asynAdd,
    square,
    asynSquare
}