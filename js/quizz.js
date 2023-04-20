// DOM elements
const banner = document.querySelector('.banner');
const quizzQuestions = document.querySelector('.quizz-questions');
// -------------------------------------

/* Tests
    getSingleQuizz(20);
*/

// -------------------------------------
// Functionalities

// Quizz request by id
function getSingleQuizz(id) {
    const res = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/'+id)
    .then(data => {
        console.log(data.data);
        displayQuizz(data.data);
    })
}

function displayQuizz(data){
    // Banner
    banner.innerHTML = `
        <img src="${data.image}"/>
        <h1 class="title">${data.title}</h1>
    `;

    // Questions
    data.questions.forEach(question => {
        quizzQuestions.innerHTML += `
            <div class="question to-answer">
                <div class="title">
                    <h2>${question.title}</h2>
                </div>
                <div class="options">
                </div>
            </div>
        `;
        const question_div = quizzQuestions.querySelector('.question:last-child');
        question.answers.forEach(answer => {
            const options_div = question_div.querySelector('.options');
            options_div.innerHTML += `
                <div class="answer" onclick="selectAnswer(this)">
                    <img src="${answer.image}" />
                    <h3>${answer.text}</h3>
                </div>
            `;

            answer_div = options_div.querySelector('.answer:last-child');
            (answer.isCorrectAnswer ? answer_div.classList.add('right') : answer_div.classList.add('wrong'));
        });
    });
}


// Functionalities - Quizz answering

// Select answer clicked by the user
function selectAnswer(answer) {
    const question = answer.parentNode;
    const selected = question.querySelector('.selected');
    if(selected === null){
        answer.classList.add('selected');
        question.parentNode.classList.remove('to-answer');
        disableOtherOptions(question);
        showCorrectAnswer(question);
        slideToNextQuestion();
    }
}

function disableOtherOptions(question) {
    const options = question.querySelectorAll('.answer');
    options.forEach(answer => {
        if(!answer.classList.contains('selected')){
            answer.classList.add('not-selected');
        }
    });
}

function showCorrectAnswer(question) {
    const options = question.querySelectorAll('.answer');
    options.forEach(answer => {
        if(answer.classList.contains('right')){
            answer.style.color = "green";
        } else if(answer.classList.contains('wrong')){
            answer.style.color = "red";
        }
    });
}

function slideToNextQuestion(){
    const nextQuestion = quizzQuestions.querySelector('.to-answer');
    setTimeout(function() {
        nextQuestion.scrollIntoView({behavior: "smooth"});
    }, 2000);
}