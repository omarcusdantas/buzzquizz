const createQuizScreen = document.querySelector(".create-quiz");
let numberQuestions, numberLevels, quizImageUrl, quizTitle;
const questions = [],
  levels = [];

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

function sendQuiz() {
  const data = {
    title: quizTitle,
    image: quizImageUrl,
    questions,
    levels,
  };

  //   Mandando para o servidor e armazenando localmente
  /* axios
    .post("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes", data)
    .then((res) => {
      console.log(res.data);
      localStorage.setItem(
        `buzzQuizz-${Object.keys({ ...localStorage }).length}`,
        JSON.stringify(data)
      );
      quizCreated();
    }); */
  console.log(data);
  quizCreated();
}

function saveLevels() {
  const getValue = (id) => {
    return document.getElementById(id) !== null
      ? document.getElementById(id).value
      : false;
  };
  for (let i = 1; i <= numberLevels; i++) {
    const title = getValue(`tL-${i}`);
    const image = getValue(`imgL-${i}`);
    const text = getValue(`l${i}-desc`);
    const minValue = getValue(`perc-${i}`);

    if (title && image && text && minValue)
      levels.push({
        title,
        image,
        text,
        minValue,
      });
  }
}

async function saveQuiz() {
  const levels = await saveLevels();
  const send = levels;
  sendQuiz(); 
}

function toggleLevel(levelButton) {
  const preselected = createQuizScreen.querySelector(".selected-level");
  preselected.classList.remove("selected-level");
  preselected.querySelector("ion-icon").classList.remove("hidden");
  preselected.nextElementSibling.classList.add("hidden");

  const level = levelButton.parentElement;
  level.classList.add("selected-level");
  level.querySelector("ion-icon").classList.add("hidden");
  level.nextElementSibling.classList.remove("hidden");
}

function saveQuestions() {
  let answers = [];
  const getValue = (id) => {
    return document.getElementById(id) !== null
      ? document.getElementById(id).value
      : false;
  };

  for (let i = 1; i <= numberQuestions; i++) {
    const title = getValue(`q-${i}`);
    const color = getValue(`bg-${i}`);

    if (title && color) {
      for (let j = 1; j <= 4; j++) {
        const text = getValue(`a-${j}${i}`);
        const image = getValue(`Img-${j}${i}`);

        if (text && image) {
          answers.push({
            text,
            image,
            isCorrectAnswer: j === 1,
          });
        }
      }
      questions.push({
        title,
        color,
        answers,
      });
      answers = [];
    }
  }
}

function renderLevelsCreation() {
  saveQuestions();
  let inputs = `
        <div class="inputs-container">
            <div class="question-banner selected-level">
                <h3 class="create-quiz-subtitle">Nível 1</h3>
                <ion-icon name="create-outline" class="hidden" onclick="toggleLevel(this)"></ion-icon>
            </div>
            <div class="question">
                <input id="tL-1" type="text" placeholder="Título do nível">
                <input id="perc-1" type="text" placeholder="% de acerto mínima">
                <input id="imgL-1" type="text" placeholder="URL da imagem do nível">
                <textarea id="l1-desc" placeholder="Descrição do nível"></textarea>
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
                    <input id="tL-${i}" type="text" placeholder="Título do nível">
                    <input id="perc-${i}" type="text" placeholder="% de acerto mínima">
                    <input id="imgL-${i}" type="text" placeholder="URL da imagem do nível">
                    <textarea id="l${i}-desc" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
        `;
  }

  createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Agora, decida os níveis!</h2>
        ${inputs}
        <div class="button-container">
            <button onclick="saveQuiz()">Finalizar Quizz</button>
        </div>
    `;
}

function toggleQuestion(questionButton) {
  const preselected = createQuizScreen.querySelector(".selected-question");
  preselected.classList.remove("selected-question");
  preselected.querySelector("ion-icon").classList.remove("hidden");
  preselected.nextElementSibling.classList.add("hidden");

  const question = questionButton.parentElement;
  question.classList.add("selected-question");
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
                    <input id="q-1" type="text" placeholder="Texto da pergunta">
                    <input id="bg-1" type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <h3 class="create-quiz-subtitle">Resposta correta</h3>
                <div class="input-box">
                    <input id="a-11" type="text" placeholder="Resposta correta">
                    <input id="Img-11" type="text" placeholder="URL da imagem">
                </div>
                <h3 class="create-quiz-subtitle">Respostas incorretas</h3>
                <div class="input-box">
                    <input id="a-21" type="text" placeholder="Resposta incorreta 1">
                    <input id="Img-21" type="text" placeholder="URL da imagem 1">
                </div>
                <div class="input-box">
                    <input id="a-31" type="text" placeholder="Resposta incorreta 2">
                    <input id="Img-31" type="text" placeholder="URL da imagem 2">
                </div>
                <div class="input-box">
                    <input id="a-41" type="text" placeholder="Resposta incorreta 3">
                    <input id="Img-41" type="text" placeholder="URL da imagem 3">
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
                        <input id="q-${i}" type="text" placeholder="Texto da pergunta">
                        <input id="bg-${i}" type="text" placeholder="Cor de fundo da pergunta">
                    </div>
                    <h3 class="create-quiz-subtitle">Resposta correta</h3>
                    <div class="input-box">
                        <input id="a-1${i}" type="text" placeholder="Resposta correta">
                        <input id="Img-1${i}" type="text" placeholder="URL da imagem">
                    </div>
                    <h3 class="create-quiz-subtitle">Respostas incorretas</h3>
                    <div class="input-box">
                        <input id="a-2${i}" type="text" placeholder="Resposta incorreta 1">
                        <input id="Img-2${i}" type="text" placeholder="URL da imagem 1">
                    </div>
                    <div class="input-box">
                        <input id="a-3${i}" type="text" placeholder="Resposta incorreta 2">
                        <input id="Img-3${i}" type="text" placeholder="URL da imagem 2">
                    </div>
                    <div class="input-box">
                        <input id="a-4${i}" type="text" placeholder="Resposta incorreta 3">
                        <input id="Img-4${i}" type="text" placeholder="URL da imagem 3">
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
  numberQuestions = createQuizScreen.querySelector(
    "#numberQuestionsCreation"
  ).value;
  numberLevels = createQuizScreen.querySelector("#numberLevelsCreation").value;
  renderQuestionsCreation();
}
