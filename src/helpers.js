// Helpers
const checkLatin = e => {
    let regexp = /^[a-zA-Z]+$/;

    if (!regexp.test(e.key)) {
        e.preventDefault();
    }
};
const formatDate = date => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear() % 100;
    let h = date.getHours();
    let min = date.getMinutes();

    dd = (dd < 10) ? '0' + dd : dd;
    mm = (mm < 10) ? '0' + mm : mm;
    yy = (yy < 10) ? '0' + yy : yy;
    h = (h < 10) ? '0' + h : h;
    min = (min < 10) ? '0' + min : min;

    return dd + '.' + mm + '.' + yy + ' | ' + h + ':' + min;
};

export { checkLatin, formatDate }