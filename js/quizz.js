// DOM elements
const page2 = document.querySelector(".page-2");
const quizz = document.querySelector('.quizz');
const banner = document.querySelector('.banner');
const quizzQuestions = document.querySelector('.quizz-questions');
let totalQuestions, rightAnswers;
let quizzLevels, quizzData;


// -------------------------------------
// Functionalities

function toggleQuizzPage(id) {
    document.querySelector(".page-1").classList.toggle("hidden");
    page2.classList.toggle("hidden");
    getSingleQuizz(id);
}

// Quizz request by id
function getSingleQuizz(id) {
    const res = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/'+id)
    .then(data => {
        quizzData = data.data;
        displayQuizz(quizzData);
        // Reseting parameters for this quizz
        rightAnswers = 0;
        totalQuestions = quizzData.questions.length;
        levels = quizzData.levels;
    })
    
}

function displayQuizz(data){
    // Banner
    banner.innerHTML = `
        <img src="${data.image}"/>
        <h1 class="title">${data.title}</h1>
    `;
    quizzQuestions.innerHTML = "";
    // Questions
    data.questions.forEach(question => {
        quizzQuestions.innerHTML += `
            <div class="question to-answer" data-test="question">
                <div class="title" data-test="question-title">
                    <h2>${question.title}</h2>
                </div>
                <div class="options">
                </div>
            </div>
        `;

        const question_div = quizzQuestions.querySelector('.question:last-child');
        question.answers.sort(comparer);
        question.answers.forEach(answer => {
            const options_div = question_div.querySelector('.options');
            options_div.innerHTML += `
                <div class="answer" onclick="selectAnswer(this)" data-test="answer">
                    <img src="${answer.image}" />
                    <h3 data-test="answer-text">${answer.text}</h3>
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
        updateScore(question);
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

// Checks if the selected question by the user is the right one
function updateScore(question) {
    const selected = question.querySelector('.selected');
    if (selected.classList.contains('right')) rightAnswers++;
}

function finalScore() {
    const score = rightAnswers/totalQuestions*100;
    console.log("score: " + score);
    return Math.round(score);
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
    if (nextQuestion === null) {
        endQuizz();
    }
    else {
        setTimeout(function() {
            nextQuestion.scrollIntoView({behavior: "smooth"});
        }, 2000);
    }
    
}

function endQuizz() {
    if (quizzQuestions.querySelector('.to-answer') === null) {
        const score = finalScore();
        const level = getLevel(score);
        quizzQuestions.innerHTML += `
            <div class="result">
                <div class="title" data-test="level-title">
                    <h2>${score}% de acerto: ${level.title}</h2>
                </div>
                <div class="content">
                    <img src="${level.image}" data-test="level-img"/>
                    <h3 data-test="level-text">${level.text}</h3>
                </div>
                <div class="buttons">
                    <button class="restart-btn" onclick="restartQuizz()" data-test="restart">Reiniciar quizz</button>
                    <button class="home-btn" onclick="homePage()" data-test="go-home">Voltar para home</button>
                </div>
            </div>
        `;
    }
}

function getLevel(score) {
    for(let i=levels.length-1; i>=0; i--){
        if (score >= levels[i].minValue) {
            return levels[i];
        }
    }
    return levels[0];
}

function restartQuizz() {
    rightAnswers = 0;
    displayQuizz(quizzData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function homePage() {
    page2.classList.toggle("hidden");
    document.querySelector(".page-1").classList.toggle("hidden");
    window.scrollTo({ top: 0});
}

// Comparer for randomizer
function comparer() { 
	return Math.random() - 0.5; 
}