let body = document.querySelector('body');
let quizArea = document.querySelector('.quiz-area');
let resultArea = document.querySelector('.result-area');

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

// mini reactjs
const render = (component, data) => component(data);
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\(/g, "&#040;")
        .replace(/\)/g, "&#041;");
}

// componentes

let answer_component = ({ text, question_index, answer_index }) => `
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <div class="input-group-text">
                <input type="radio" name="${question_index}" value="${answer_index}">
            </div>
        </div>
        <a type="button" class="form-control text-reset text-decoration-none"
            onclick="this.parentNode.querySelector('input[type=radio]').checked = true">
            ${escapeHtml(text)}
        </a>
    </div>
`;


let question_component = (data) => `
        <div class="question" data-question-index="${data.question_index}">
        <p>Pergunta: ${escapeHtml(data.question)}</p>
        ${data.answers.map((answer, index) => render(answer_component, {
    text: answer.text,
    question_index: data.question_index,
    answer_index: index
})).join('')}
    </div>
`;

let btn_close_component = () => `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">
        Fechar
    </button>
`;

let btn_next_component = (data) => `
    <button type="button" class="btn btn-primary" data-target="#${"modalQuestion" + Math.round(data.question_index + 1)}" data-dismiss="modal" data-toggle="modal">
        Próxima pergunta
    </button>
`;

let btn_prev_component = (data) => `
    <button type="button" class="btn btn-secondary" data-target="#${"modalQuestion" + Math.round(data.question_index - 1)}" data-dismiss="modal" data-toggle="modal">
        Voltar
    </button>
`;

let btn_final_component = () => `
    <button type="button" class="btn btn-primary" data-target="#modalResult" data-toggle="modal" data-dismiss="modal" onclick="verifyAnswers()">
        Ver resultado
    </button>
`;

let modal_questions_component = (data) => `
    <div class="modal fade" id="modalQuestion${data.question_index}" data-backdrop="static" data-keyboard="false" tabindex="-1"
        aria-labelledby="modalQuestion${data.question_index}Label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalQuestion${data.question_index}Label">Quiz</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${render(question_component, data)}
                </div>
                <div class="modal-footer">
                    ${data.question_index > 0 ? render(btn_prev_component, data) : render(btn_close_component)}
                    ${data.question_index + 1 < questions.length ? render(btn_next_component, data) : render(btn_final_component)}
                </div>
            </div>
        </div>
    </div>
`;

let modal_result_component = ({ image, message, percent }) => `
   <div class="modal fade" id="modalResult" data-backdrop="static" data-keyboard="false" tabindex="-1"
        aria-labelledby="modalResultLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalResultLabel">Resutado</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="result-img">
                        <img src="assets/img/${image}.png" style="width: 100%;" alt="result">
                    </div>
                    <hr>
                    <div class="result-text text-center">
                        <h2>${message} </h2>
                        <h3>(${percent}% de acerto)</h3>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

// iniciar quiz
function iniciarQuiz() {
    quizArea.innerHTML = '';
    questions.sort(() => Math.random() - 0.5);
    questions.forEach(function (question, index) {
        question.answers.sort(() => Math.random() - 0.5);
        question.question_index = index;
        quizArea.innerHTML += render(modal_questions_component, question);
    });
}

function verifyAnswers() {
    let correct_questions = 0;
    let respostas = [];

    questions.forEach(function (question, index) {
        let html_question = document.querySelector(`[data-question-index="${index}"]`);
        let answer = html_question.querySelector('input[type=radio]:checked');
        let answer_index = -1;

        if (answer) {
            answer_index = parseInt(answer.value);
            respostas.push({ question_index: index, answer_index: answer_index });
            if (question.answers[answer_index].correct) {
                correct_questions++;
            }
        } else {
            respostas.push({ question_index: index, answer_index: answer_index });
        }
    });

    let percentCorrect = (correct_questions / questions.length) * 100;
    let image = "unknown";
    let message = "Clique para ver o resultado";

    if (percentCorrect >= 100) {
        image = "gold";
        message = "Parabéns, você acertou tudo!";
    } else if (percentCorrect >= 70) {
        image = "silver";
        message = "Você acertou quase tudo!";
    } else if (percentCorrect > 0) {
        image = "deny";
        message = "Você errou algumas questões, tente novamente!";
    } else {
        image = "deny";
        message = "Você errou todas as questões, tente novamente!";
    }

    resultArea.innerHTML = render(modal_result_component, {
        image: image,
        message: message,
        percent: percentCorrect,
    });
}