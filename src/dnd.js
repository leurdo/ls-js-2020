/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let div = document.createElement('div');
    let color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1, 6);
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    // так как конкретных указаний нет, пусть высота и ширина будут случайными числами в диапазоне от 50px до 200px
    let width = randomInteger(50, 200);
    let height = randomInteger(50, 200);
    let top = randomInteger(0, screenHeight - height) + 'px';
    let left = randomInteger(0, screenWidth - width) + 'px';

    div.className = 'draggable-div';
    div.style.position = 'absolute';
    div.style.backgroundColor = color;
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.top = top;
    div.style.left = left;
    div.style.cursor = 'move';
    div.setAttribute('draggable', true);

    return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    target.addEventListener('dragend', e => {
        let div = e.target;
        let x = parseInt(div.style.left, 10);
        let y = parseInt(div.style.top, 10);

        div.style.left = x + e.offsetX + 'px';
        div.style.top = y + e.offsetY + 'px';
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
