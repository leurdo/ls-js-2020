/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */

function forEach(array, fn) {

    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }

}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let newArray = [];

    for (let i = 0; i < array.length; i++) {
        newArray[i] = fn(array[i], i, array);
    }

    return newArray;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let prev = initial === undefined ? array[0] : initial;
    let i = initial === undefined ? 1 : 0;

    for (; i < array.length; i++) {
        prev = fn(prev, array[i], i, array);
    }

    return prev;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let returnArray = [];

    for (let key in obj) {
        returnArray.push(key.toUpperCase());
    }

    return returnArray;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from = 0, to = array.length) {
    const length = array.length;
    let returnArray = [];

    // обработка отрицательных from
    if (from < 0) {
        from = length - Math.abs(from);
        from < 0 ? from = 0 : true;
    }

    // обработка отрицательных to
    if (to < 0) {
        to = length - Math.abs(to);
        if ( to < 0 ) {
            return [];
        }
    }

    // если to больше длины массива
    to > length ? to = length : true;

    for (let i = from; i < to; i++) {
        returnArray.push(array[i]);
    }

    return returnArray;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    obj = new Proxy(obj, {
        set(target, prop, val) {
            target[prop] = val ** 2;

            return true;
        }
    });

    return obj;
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
