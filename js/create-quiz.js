const createQuizScreen = document.querySelector(".create-quiz");
let numberQuestions, numberLevels, quizImageUrl, quizTitle;
let questions = [],
  levels = [];
let isEdition = false;
let id;
let oldData;

function toggleCreateQuiz() {
  if (arguments[0]) {
    id = arguments[1];
    isEdition = true;
    oldData = arguments[2];
    // Preenchendo os inputs da main info com os dados do quiz no server
    quizTitle = createQuizScreen.querySelector("#quizTitleCreation").value = oldData.title;
    quizImageUrl = createQuizScreen.querySelector("#quizImageCreation").value = oldData.image;
    numberQuestions = createQuizScreen.querySelector("#numberQuestionsCreation").value = oldData.questions.length;
    numberLevels = createQuizScreen.querySelector("#numberLevelsCreation").value = oldData.levels.length;

  }

  document.querySelector(".page-1").classList.toggle("hidden");
  createQuizScreen.classList.toggle("hidden");
}

function returnMainPage() {
  toggleCreateQuiz();
  createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Comece pelo começo</h2>
        <div class="inputs-container">
            <input id="quizTitleCreation" type="text" placeholder="Título do seu quiz" data-test="title-input">
            <input id="quizImageCreation" type="text" placeholder="URL da imagem do seu quiz" data-test="img-input">
            <input id="numberQuestionsCreation" type="text" placeholder="Quantidade de perguntas do quiz" data-test="questions-amount-input">
            <input id="numberLevelsCreation" type="text" placeholder="Quantidade de níveis do quiz" data-test="levels-amount-input">
        </div>
        <div class="button-container">
            <button onclick="createQuestions()" data-test="go-create-questions">Prosseguir pra criar perguntas</button>
        </div>
  `;
}

function accessCreatedQuiz(id) {
  toggleCreateQuiz();
  toggleQuizzPage(id);
  createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Comece pelo começo</h2>
        <div class="inputs-container">
            <input id="quizTitleCreation" type="text" placeholder="Título do seu quiz" data-test="title-input">
            <input id="quizImageCreation" type="text" placeholder="URL da imagem do seu quiz" data-test="img-input">
            <input id="numberQuestionsCreation" type="text" placeholder="Quantidade de perguntas do quiz" data-test="questions-amount-input">
            <input id="numberLevelsCreation" type="text" placeholder="Quantidade de níveis do quiz" data-test="levels-amount-input">
        </div>
        <div class="button-container">
            <button onclick="createQuestions()" data-test="go-create-questions">Prosseguir pra criar perguntas</button>
        </div>
  `;
}

function quizCreated(quizData) {
  createQuizScreen.innerHTML = `
    <h2 class="create-quiz-title">Seu quizz está pronto!</h2>
    <div class="quiz-creation-banner" data-test="success-banner">
        <img src="${quizData.image}">
        <p class="quiz-created-title">${quizData.title}</p>
    </div>
    <div class="button-container">
        <button onclick="accessCreatedQuiz(${quizData.id})" data-test="go-quiz">Acessar Quizz</button>
        <button onclick="returnMainPage()" data-test="go-home">Voltar pra home</button>
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
  // Verificando se foi uma edição de um quiz existente
  if (isEdition) {
    editQuizz(true, id, data)
  } else {
    //   Mandando para o servidor e armazenando localmente
    axios
      .post("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes", data)
      .then((res) => {
        localStorage.setItem(`buzzQuizz-${res.data.id}`, JSON.stringify(res.data));
        quizCreated(res.data);
      });
  }
}

function isURL(str) {
  const pattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  return pattern.test(str);
}

function isHexColor(str) {
  const pattern = /^#?([0-9A-F]{6})$/i;
  return pattern.test(str);
}

function checkLevels() {
  let wrongInput, easyLevel;
  wrongInput = 0;
  easyLevel = 0;

  levels.forEach((level) => {
    if (level.title.length < 10) {
      wrongInput++;
    };

    if (!isURL(level.image)) {
      wrongInput++;
    }

    if (parseInt(level.minValue) < 0 || parseInt(level.minValue) > 100 || isNaN(parseInt(level.minValue))) {
      wrongInput++;
    }

    if (parseInt(level.minValue) === 0)
      easyLevel++;

    if (level.text.length < 30) {
      wrongInput++;
    }
  })

  if (easyLevel > 0 && wrongInput === 0 && levels.length === numberLevels) {
    sendQuiz();
    return;
  }
  alert("Preencha corretamente");
}

function saveLevels() {
  levels = [];
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

  checkLevels();
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

function renderLevelsCreation() {
  let inputs = `
        <div class="inputs-container" data-test="level-ctn">
            <div class="question-banner selected-level">
                <h3 class="create-quiz-subtitle">Nível 1</h3>
                <ion-icon name="create-outline" class="hidden" onclick="toggleLevel(this)" data-test="toggle"></ion-icon>
            </div>
            <div class="question">
                <input id="tL-1" type="text" placeholder="Título do nível" data-test="level-input">
                <input id="perc-1" type="text" placeholder="% de acerto mínima" data-test="level-percent-input">
                <input id="imgL-1" type="text" placeholder="URL da imagem do nível" data-test="level-img-input">
                <textarea id="l1-desc" placeholder="Descrição do nível" data-test="level-description-input"></textarea>
            </div>
        </div>
    `;
  for (let i = 2; i <= numberLevels; i++) {
    inputs += `
            <div class="inputs-container" data-test="level-ctn">
                <div class="question-banner">
                    <h3 class="create-quiz-subtitle">Nível ${i}</h3>
                    <ion-icon name="create-outline" onclick="toggleLevel(this)" data-test="toggle"></ion-icon>
                </div>
                <div class="question hidden">
                    <input id="tL-${i}" type="text" placeholder="Título do nível" data-test="level-input">
                    <input id="perc-${i}" type="text" placeholder="% de acerto mínima" data-test="level-percent-input">
                    <input id="imgL-${i}" type="text" placeholder="URL da imagem do nível" data-test="level-img-input">
                    <textarea id="l${i}-desc" placeholder="Descrição do nível" data-test="level-description-input"></textarea>
                </div>
            </div>
        `;
  }

  createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Agora, decida os níveis!</h2>
        ${inputs}
        <div class="button-container">
            <button onclick="saveLevels()" data-test="finish">${isEdition ? "Finalizar edição" : "Finalizar Quizz"}</button>
        </div>
    `;
  if (isEdition) retrieveDataLevels(oldData); 
}

function checkQuestions() {
  let wrongInput = 0;
  let correctAnswer = 0;

  questions.forEach((item) => {
    if (item.title.length < 20) {
      wrongInput++;
    };

    if (!isHexColor(item.color)) {
      wrongInput++;
    };

    if (item.answers.length < 2) {
      wrongInput++;
    }

    item.answers.forEach((answer) => {
      if (answer.text == "") {
        wrongInput++;
      }

      if (!isURL(answer.image)) {
        wrongInput++;
      }

      if (answer.isCorrectAnswer) {
        correctAnswer++;
      }
    })
  })

  if (correctAnswer === numberQuestions && wrongInput === 0 && questions.length === numberQuestions) {
    renderLevelsCreation();
    return;
  }
  alert("Preencha corretamente");
}

function saveQuestions() {
  questions = [];
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

  checkQuestions();
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
        <div class="inputs-container" data-test="question-ctn">
            <div class="question-banner selected-question">
                <h3 class="create-quiz-subtitle">Pergunta 1</h3>
                <ion-icon name="create-outline" class="hidden" onclick="toggleQuestion(this)" data-test="toggle"></ion-icon>
            </div>
            <div class="question">
                <div class="input-box">
                    <input id="q-1" type="text" placeholder="Texto da pergunta" data-test="question-input">
                    <input id="bg-1" type="text" placeholder="Cor de fundo da pergunta" data-test="question-color-input">
                </div>
                <h3 class="create-quiz-subtitle">Resposta correta</h3>
                <div class="input-box">
                    <input id="a-11" type="text" placeholder="Resposta correta" data-test="correct-answer-input">
                    <input id="Img-11" type="text" placeholder="URL da imagem" data-test="correct-img-input">
                </div>
                <h3 class="create-quiz-subtitle">Respostas incorretas</h3>
                <div class="input-box">
                    <input id="a-21" type="text" placeholder="Resposta incorreta 1" data-test="wrong-answer-input">
                    <input id="Img-21" type="text" placeholder="URL da imagem 1" data-test="wrong-img-input">
                </div>
                <div class="input-box">
                    <input id="a-31" type="text" placeholder="Resposta incorreta 2" data-test="wrong-answer-input">
                    <input id="Img-31" type="text" placeholder="URL da imagem 2" data-test="wrong-img-input">
                </div>
                <div class="input-box">
                    <input id="a-41" type="text" placeholder="Resposta incorreta 3" data-test="wrong-answer-input">
                    <input id="Img-41" type="text" placeholder="URL da imagem 3" data-test="wrong-img-input">
                </div>
            </div>
        </div>
    `;
  for (let i = 2; i <= numberQuestions; i++) {
    inputs += `
            <div class="inputs-container" data-test="question-ctn">
                <div class="question-banner">
                    <h3 class="create-quiz-subtitle">Pergunta ${i}</h3>
                    <ion-icon name="create-outline" onclick="toggleQuestion(this)" data-test="toggle"></ion-icon>
                </div>
                <div class="question hidden">
                    <div class="input-box">
                        <input id="q-${i}" type="text" placeholder="Texto da pergunta" data-test="question-input">
                        <input id="bg-${i}" type="text" placeholder="Cor de fundo da pergunta" data-test="question-color-input">
                    </div>
                    <h3 class="create-quiz-subtitle">Resposta correta</h3>
                    <div class="input-box">
                        <input id="a-1${i}" type="text" placeholder="Resposta correta" data-test="correct-answer-input">
                        <input id="Img-1${i}" type="text" placeholder="URL da imagem" data-test="correct-img-input">
                    </div>
                    <h3 class="create-quiz-subtitle">Respostas incorretas</h3>
                    <div class="input-box">
                        <input id="a-2${i}" type="text" placeholder="Resposta incorreta 1" data-test="wrong-answer-input">
                        <input id="Img-2${i}" type="text" placeholder="URL da imagem 1" data-test="wrong-img-input">
                    </div>
                    <div class="input-box">
                        <input id="a-3${i}" type="text" placeholder="Resposta incorreta 2" data-test="wrong-answer-input">
                        <input id="Img-3${i}" type="text" placeholder="URL da imagem 2" data-test="wrong-img-input">
                    </div>
                    <div class="input-box">
                        <input id="a-4${i}" type="text" placeholder="Resposta incorreta 3" data-test="wrong-answer-input">
                        <input id="Img-4${i}" type="text" placeholder="URL da imagem 3" data-test="wrong-img-input">
                    </div>
                </div>
            </div>
        `;
  }

  createQuizScreen.innerHTML = `
        <h2 class="create-quiz-title">Crie suas perguntas</h2>
        ${inputs}
        <div class="button-container">
            <button onclick="saveQuestions()" data-test="go-create-levels">Prosseguir pra criar níveis</button>
        </div>
    `;
  if (isEdition) retrieveDataQuestions(oldData); 
}

function checkMainInfo() {
  let wrongInput = 0;

  if (quizTitle.length < 20 || quizTitle.length > 65) {
    wrongInput++;
  }

  if (!isURL(quizImageUrl)) {
    wrongInput++;
  }

  if (numberQuestions < 3) {
    wrongInput++;
  }

  if (numberLevels < 2) {
    wrongInput++;
  }

  if (wrongInput === 0) {
    renderQuestionsCreation();
    return;
  }
  console.log(wrongInput);
  alert("Preencha corretamente");
}

function createQuestions() {
  quizTitle = createQuizScreen.querySelector("#quizTitleCreation").value;
  quizImageUrl = createQuizScreen.querySelector("#quizImageCreation").value;
  numberQuestions = parseInt(createQuizScreen.querySelector("#numberQuestionsCreation").value);
  numberLevels = parseInt(createQuizScreen.querySelector("#numberLevelsCreation").value);

  checkMainInfo();
}
