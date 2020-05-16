/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const isMatching = (full, chunk) => full.toLowerCase().includes(chunk.toLowerCase());

const getCookies = () => {

    return document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});

};

/**
 * Возвращает фрагмент для вставки в tbody
 *
 * @returns {DocumentFragment}
 */
const renderCookiesArray = () => {
    const cookiesTbody = document.createDocumentFragment();
    const cookies = getCookies();

    for (let item in cookies) {
        const tdName = document.createElement('td');
        const tdValue = document.createElement('td');
        const deleteButton = document.createElement('td');
        const tr = document.createElement('tr');

        // проверка значения в поле filterNameInput
        const fiterValue = filterNameInput.value;

        if (!isMatching(item, fiterValue) && !isMatching(cookies[item], fiterValue)) {
            continue;
        }

        tdName.textContent = item;
        tdValue.textContent = cookies[item];
        deleteButton.innerHTML = '<button class="deleteButton">Удалить</button>';

        tr.appendChild(tdName);
        tr.appendChild(tdValue);
        tr.appendChild(deleteButton);

        cookiesTbody.appendChild(tr);

        deleteButton.addEventListener('click', (e) => {
            const target = e.target;
            const cookieName = target.parentElement.parentElement.cells[0].textContent;

            document.cookie = `${cookieName}=''; expires=${new Date(0)}`;
            listTable.textContent = '';
            listTable.appendChild(renderCookiesArray());
        });
    }

    return cookiesTbody;
};

listTable.appendChild(renderCookiesArray());

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    listTable.textContent = '';
    listTable.appendChild(renderCookiesArray());
});

addButton.addEventListener('click', () => {
    if (!addNameInput.value) {
        return;
    }
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    listTable.textContent = '';
    addNameInput.value = addValueInput.value = '';
    listTable.appendChild(renderCookiesArray());
});
