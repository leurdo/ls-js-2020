import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const Handlebars = require('handlebars');
const chatWindow = document.querySelector('#chatContainer');
let CurrentUser = '';

const renderHbs = (id, data) => {
    const el = document.querySelector(`#${id}`);
    const source = document.querySelector(`#${id}Template`).innerHTML;
    const hbsHtml = Handlebars.compile(source);

    el.innerHTML = hbsHtml(data);
}

const renderUserBox = () => {
    const users = getPersonsData();
    let userArray = [];

    for (let name in users) {
        if (users.hasOwnProperty(name)) {
            let current = name === CurrentUser;

            userArray.push({
                'name': name,
                'fio': users[name].fio,
                'photo': users[name].photo,
                'current': current,
            });
        }
    }
    renderHbs('usersBox', { users: userArray });
    chatWindow.style.display = 'block';
}

const newPerson = e => {
    e.preventDefault();
    const target = e.target.closest('#form-signin');

    const fio = target.querySelector('#fioInput').value;
    const name = target.querySelector('#nameInput').value;
    const person = {
        'fio': fio,
        'photo': '',
    };

    let personData = getPersonsData() ? getPersonsData() : {};

    if (!personData[name]) {
        personData[name] = person;
        setPersonsData(personData);
    }

    CurrentUser = name;
    document.cookie = `user=${name}`;

    target.style.display = 'none';
    renderUserBox();

    const currentPhoto = document.querySelector('.active .media');

    currentPhoto.addEventListener('click', setPhoto);
}

const checkLatin = e => {
    let regexp = /^[a-zA-Z]+$/;

    if (!regexp.test(e.key)) {
        e.preventDefault();
    }
}

const setPhoto = () => {
    const users = getPersonsData();
    const setPhotoBox = document.querySelector('#setPhoto');
    const loadPhoto = e => {
        const fileReader = new FileReader();
        const file = e.target.files[0];

        if (file) {
            if (file.size > 300 * 1034) {
                document.querySelector('#fileResponse').textContent = 'Слишком большой файл';
            } else {
                fileReader.readAsDataURL(file);
            }
        }

        fileReader.addEventListener('load', () => {
            const savePhoto = () => {
                const users = getPersonsData();

                users[CurrentUser].photo = fileReader.result;
                setPersonsData(users);

                setPhotoBox.style.display = 'none';
                renderUserBox();
            }

            document.querySelector('#photoImg').src = fileReader.result;
            document.querySelector('#save').addEventListener('click', savePhoto);
        });
    }

    renderHbs('setPhoto',
        { userData:
                {
                    'fio': users[CurrentUser].fio,
                    'photo': users[CurrentUser].photo,
                }
        });
    setPhotoBox.style.display = 'block';

    setPhotoBox.addEventListener('click', (e) => {
        if (e.target.closest('button') && e.target.closest('button').classList.contains('close')) {
            setPhotoBox.style.display = 'none';
        }

        if (e.target.id === 'close') {
            setPhotoBox.style.display = 'none';
        }
    });

    document.querySelector('#photoInput').addEventListener('change', loadPhoto);
}

const getPersonsData = () => JSON.parse(localStorage.getItem('chatPersons'));
const setPersonsData = personsData => localStorage.setItem('chatPersons', JSON.stringify(personsData));

document.querySelector('#loginSubmit').addEventListener('click', newPerson);
document.querySelector('#nameInput').addEventListener('keydown', checkLatin);
