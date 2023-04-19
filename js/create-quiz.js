const createQuizScreen = document.querySelector(".create-quiz");
let numberQuestions, numberLevels, quizImageUrl;

function toggleCreateQuiz() {
    document.querySelector(".page-1").classList.toggle("hidden");
    createQuizScreen.classList.toggle("hidden");
}

function returnMainPage() {
    toggleCreateQuiz();
    createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Comece pelo começo</h2>
        <div class="inputs-container">
            <input id="quizTitleCreation" type="text" placeholder="Título do seu quiz">
            <input id="quizImageCreation" type="text" placeholder="URL da imagem do seu quiz">
            <input id="numberQuestionsCreation" type="text" placeholder="Quantidade de perguntas do quiz">
            <input id="numberLevelsCreation" type="text" placeholder="Quantidade de níveis do quiz">
        </div>
        <div class="button-container">
            <button onclick="createQuestions()">Prosseguir pra criar perguntas</button>
        </div>
    `;
}

function quizCreated() {
    createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Seu quizz está pronto!</h2>
        <div class="quiz-creation-banner">
            <img src="${quizImageUrl}">
            <p class="quiz-created-title">${quizTitle}</p>
        </div>
        <div class="button-container">
            <button>Acessar Quizz</button>
            <button onclick="returnMainPage()">Voltar pra home</button>
        </div>
    `;    
}

function toggleLevel(levelButton) {
    const preselected = createQuizScreen.querySelector(".selected-level");
    preselected.classList.remove("selected-level");
    preselected.querySelector("ion-icon").classList.remove("hidden");
    preselected.nextElementSibling.classList.add("hidden");

    const level = levelButton.parentElement;
    level.classList.add("selected-level")
    level.querySelector("ion-icon").classList.add("hidden");
    level.nextElementSibling.classList.remove("hidden");
}

function renderLevelsCreation() {
    let inputs = `
        <div class="inputs-container">
            <div class="question-banner selected-level">
                <h3 class="create-quiz-subtitle">Nível 1</h3>
                <ion-icon name="create-outline" class="hidden" onclick="toggleLevel(this)"></ion-icon>
            </div>
            <div class="question">
                <input type="text" placeholder="Título do nível">
                <input type="text" placeholder="% de acerto mínima">
                <input type="text" placeholder="URL da imagem do nível">
                <textarea placeholder="Descrição do nível"></textarea>
            </div>
        </div>
    `;
    for (let i = 2; i <= numberLevels; i++) {
        inputs += `
            <div class="inputs-container">
                <div class="question-banner">
                    <h3 class="create-quiz-subtitle">Nível ${i}</h3>
                    <ion-icon name="create-outline" onclick="toggleLevel(this)"></ion-icon>
                </div>
                <div class="question hidden">
                    <input type="text" placeholder="Título do nível">
                    <input type="text" placeholder="% de acerto mínima">
                    <input type="text" placeholder="URL da imagem do nível">
                    <textarea placeholder="Descrição do nível"></textarea>
                </div>
            </div>
        `;
    }

    createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Agora, decida os níveis!</h2>
        ${inputs}
        <div class="button-container">
            <button onclick="quizCreated()">Finalizar Quizz</button>
        </div>
    `;
}

function toggleQuestion(questionButton) {
    const preselected = createQuizScreen.querySelector(".selected-question");
    preselected.classList.remove("selected-question");
    preselected.querySelector("ion-icon").classList.remove("hidden");
    preselected.nextElementSibling.classList.add("hidden");

    const question = questionButton.parentElement;
    question.classList.add("selected-question")
    question.querySelector("ion-icon").classList.add("hidden");
    question.nextElementSibling.classList.remove("hidden");
}

function renderQuestionsCreation() {
    let inputs = `
        <div class="inputs-container">
            <div class="question-banner selected-question">
                <h3 class="create-quiz-subtitle">Pergunta 1</h3>
                <ion-icon name="create-outline" class="hidden" onclick="toggleQuestion(this)"></ion-icon>
            </div>
            <div class="question">
                <div class="input-box">
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <h3 class="create-quiz-subtitle">Resposta correta</h3>
                <div class="input-box">
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                </div>
                <h3 class="create-quiz-subtitle">Respostas incorretas</h3>
                <div class="input-box">
                    <input type="text" placeholder="Resposta incorreta 1">
                    <input type="text" placeholder="URL da imagem 1">
                </div>
                <div class="input-box">
                    <input type="text" placeholder="Resposta incorreta 2">
                    <input type="text" placeholder="URL da imagem 2">
                </div>
                <div class="input-box">
                    <input type="text" placeholder="Resposta incorreta 3">
                    <input type="text" placeholder="URL da imagem 3">
                </div>
            </div>
        </div>
    `;
    for (let i = 2; i <= numberQuestions; i++) {
        inputs += `
            <div class="inputs-container">
                <div class="question-banner">
                    <h3 class="create-quiz-subtitle">Pergunta ${i}</h3>
                    <ion-icon name="create-outline" onclick="toggleQuestion(this)"></ion-icon>
                </div>
                <div class="question hidden">
                    <div class="input-box">
                        <input type="text" placeholder="Texto da pergunta">
                        <input type="text" placeholder="Cor de fundo da pergunta">
                    </div>
                    <h3 class="create-quiz-subtitle">Resposta correta</h3>
                    <div class="input-box">
                        <input type="text" placeholder="Resposta correta">
                        <input type="text" placeholder="URL da imagem">
                    </div>
                    <h3 class="create-quiz-subtitle">Respostas incorretas</h3>
                    <div class="input-box">
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="text" placeholder="URL da imagem 1">
                    </div>
                    <div class="input-box">
                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="text" placeholder="URL da imagem 2">
                    </div>
                    <div class="input-box">
                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
            </div>
        `;
    }

    createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Crie suas perguntas</h2>
        ${inputs}
        <div class="button-container">
            <button onclick="renderLevelsCreation()">Prosseguir pra criar níveis</button>
        </div>
    `;
}

function createQuestions() {
    quizTitle = createQuizScreen.querySelector("#quizTitleCreation").value;
    quizImageUrl = createQuizScreen.querySelector("#quizImageCreation").value;
    numberQuestions = createQuizScreen.querySelector("#numberQuestionsCreation").value;
    numberLevels = createQuizScreen.querySelector("#numberLevelsCreation").value;
    renderQuestionsCreation();
}