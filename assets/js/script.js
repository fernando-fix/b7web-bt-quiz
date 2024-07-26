let body = document.querySelector('body');

// Carregar o tema
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('tema')) {
        if (localStorage.getItem('tema') === 'dark') {
            body.classList.add('theme-dark');
            body.classList.remove('theme-light');
        } else {
            body.classList.remove('theme-dark');
            body.classList.add('theme-light');
        }
    } else {
        localStorage.setItem('tema', 'light');
        body.classList.add('theme-light');
    }
});

function trocarTema() {
    body.classList.toggle('theme-dark');
    if (body.classList.contains('theme-dark')) {
        localStorage.setItem('tema', 'dark');
    } else {
        localStorage.setItem('tema', 'light');
    }
}

console.log(questions);