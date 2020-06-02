import './style.css';
ymaps.ready(init);

function init () {
    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 10
    });

    const formatDate = date => {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yy = date.getFullYear() % 100;

        dd = (dd < 10) ? '0' + dd : dd;
        mm = (mm < 10) ? '0' + mm : mm;
        yy = (yy < 10) ? '0' + yy : yy;

        return dd + '.' + mm + '.' + yy;
    };

    const getStorageData = () => {
        if (localStorage.getItem('MapStorage')) {
            return JSON.parse(localStorage.getItem('MapStorage'));
        }

        return [];
    }
    const setStorageData = storageData => localStorage.setItem('MapStorage', JSON.stringify(storageData));

    // Вытаскиваем плейсмарки с данными из хранилища
    const renderStorage = () => {
        const data = getStorageData();

        data.forEach((item, index) => {
            const placemark = new ymaps.Placemark(item.testCoords, {
                testName: item.testName,
                testPlace: item.testPlace,
                testDate: item.testDate,
                testInfo: item.testInfo,
                testAddress: item.testAddress,
            });

            myMap.geoObjects.add(placemark);
            clusterer.add(placemark);
        });
    }

    // Кластеризация с каруселью
    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h5 class=ballon_header>$[properties.testPlace]</h5>' +
        '<div class=ballon_body><a class="test-link" href="" data-coords="$[properties.testCoords]">$[properties.testAddress]</a><br>$[properties.testInfo]</div>' +
        '<div class=ballon_footer>$[properties.testDate]</div>', {
            build: function () {
                this.constructor.superclass.build.call(this);
                this._parentElement.querySelector('.test-link').addEventListener('click', this.onLinkClick.bind(this));
            },

            onLinkClick: function (e) {
                e.preventDefault();
                let coords = e.target.dataset.coords.split(',').map(item => + item);

                openBalloon(coords);
            },
        }
    );

    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonPagerSize: 5
    });

    myMap.geoObjects.add(clusterer);

    const SimpleBalloon = ymaps.templateLayoutFactory.createClass(
        '<div class="geotest_modal">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title">$[properties.testAddress]</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '$[[options.contentLayout observeSize minWidth=350]]' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>', {
            build: function () {
                this.constructor.superclass.build.call(this);
                this._container = this._parentElement.querySelector('.geotest_modal');
                this._container.querySelector('.modal-title').textContent = this.getData().balloonHeader;
                this._container.querySelector('.close').addEventListener('click', this.onCloseClick.bind(this));
            },

            onCloseClick: function (e) {
                e.preventDefault();

                this.events.fire('userclose');
            },

            clear: function () {
                this._container.querySelector('.close')
                    .removeEventListener('click', this.onCloseClick.bind(this));

                this.constructor.superclass.clear.call(this);
            },

            getShape: function () {
                let position = {
                    top: this._container.offsetTop,
                    left: this._container.offsetLeft,
                };

                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                    [position.left, position.top], [
                        position.left + this._container.offsetWidth,
                        position.top + this._container.offsetHeight
                    ]
                ]));
            },

        });

    // Создание вложенного макета содержимого балуна.
    const MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="container">' +
        '<div class="test-container">' +
        '<p><strong>$[properties.testName]</strong> $[properties.testPlace] $[properties.testDate]<br>' +
        '$[properties.testInfo]</p>' +
        '</div>' +
        '<h5>ВАШ ОТЗЫВ</h5>' +
        '<form>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" id="nameInput" placeholder="Ваше имя">' +
        '</div>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" id="placeInput" placeholder="Укажите место">' +
        '</div>' +
        '<div class="form-group">' +
        '<textarea class="form-control" id="descriptionTextarea" rows="3" placeholder="Поделитесь впечатлениями"></textarea>' +
        '</div>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">Добавить</button>' +
        '</form>' +
        '</div>', {
            build: function () {
                this.constructor.superclass.build.call(this);
                this._coords = this.getData().balloonCoords !== undefined ? this.getData().balloonCoords : this.getData().geometry.getCoordinates();
                this.renderInfo();
                this._parentElement.querySelector('.btn').addEventListener('click', this.onSendClick.bind(this));
                if (this.getData().properties !== undefined) {

                    // тут я не могу понять почему не отображается текст в заголовке, там вроде всё есть, уже от усталости туплю наверное
                    document.querySelector('.modal-title').textContent = this.getData().properties.get('testAddress');
                }
            },

            renderInfo: function () {
                // если нет данных по геометрии, значит это не балун метки, а просто балун, и мы должны сами положить в него данные, добытые тяжелым трудом
                if (this.getData().geometry === undefined) {
                    let geoObjects = clusterer.getGeoObjects();
                    var testString = '';

                    for (let i = 0, l = geoObjects.length; i < l; i++) {

                        if (JSON.stringify(geoObjects[i].geometry.getCoordinates()) === JSON.stringify(this._coords)) {
                            const name = geoObjects[i].properties.get('testName');
                            const place = geoObjects[i].properties.get('testPlace');
                            const date = geoObjects[i].properties.get('testDate');
                            const text = geoObjects[i].properties.get('testInfo');

                            testString += `<p><strong>${name}</strong> ${place} ${date}<br>${text}</p>`;
                        }

                    }
                    this._parentElement.querySelector('.test-container').innerHTML = testString;
                }
            },

            onSendClick: function (e) {
                e.preventDefault();

                const container = this._parentElement.querySelector('.test-container');
                const name = this._parentElement.querySelector('#nameInput').value;
                const place = this._parentElement.querySelector('#placeInput').value;
                const text = this._parentElement.querySelector('#descriptionTextarea').value;
                const date = formatDate(new Date());
                const testString = `<p><strong>${name}</strong> ${place} ${date}<br>${text}</p>`;
                const placemark = new ymaps.Placemark(this._coords, {
                    testName: name,
                    testPlace: place,
                    testDate: date,
                    testInfo: text,
                });
                const coords = this._coords;

                ymaps.geocode(coords)
                    .then(function (res) {
                        let firstGeoObject = res.geoObjects.get(0);
                        let testAddress = firstGeoObject.getAddressLine();

                        placemark.properties.set('testAddress', testAddress);
                        placemark.properties.set('testCoords', coords);

                        // добавление плейсмарка в локал сторедж
                        let data = getStorageData();

                        data.push({
                            testCoords: coords,
                            testName: name,
                            testPlace: place,
                            testDate: date,
                            testInfo: text,
                            testAddress: testAddress,
                        });
                        setStorageData(data);
                    });

                myMap.geoObjects.add(placemark);

                clusterer.add(placemark);
                container.innerHTML += testString;
                this._parentElement.querySelector('#nameInput').value = this._parentElement.querySelector('#placeInput').value = this._parentElement.querySelector('#descriptionTextarea').value = '';
            },
        }
    );

    // Опции для всех геообъектов
    myMap.geoObjects.options.set({
        iconLayout: 'default#image',
        iconImageHref: 'images/marker.png',
        iconImageSize: [44, 66],
        iconImageOffset: [-22, -66],
        balloonLayout: SimpleBalloon,
        balloonContentLayout: MyBalloonContentLayout,
        hideIconOnBalloonOpen: false, // это чтобы плейсмарк оставался при открытом балуне
        balloonPanelMaxMapArea: 0,
    });

    // Опции для всей карты
    myMap.options.set({
        balloonLayout: SimpleBalloon,
        balloonContentLayout: MyBalloonContentLayout,
    });

    const openBalloon = coords => {

        let balloon = myMap.balloon;

        if (balloon.isOpen()) {
            balloon.close();
        }

        ymaps.geocode(coords)
            .then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);

                balloon.setData (
                    {
                        balloonHeader: firstGeoObject.getAddressLine(),
                        balloonCoords: coords,
                    });
                balloon.open(coords);
            });
    };

    const clickOpenBalloon = e => {
        openBalloon(e.get('coords'));
    };

    myMap.events.add('click', clickOpenBalloon);

    renderStorage();

}