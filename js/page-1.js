axios.defaults.headers.common["Authorization"] = "U6fPRnXorrTvHpB1OupJQJXj";
// Url's API
const getQuizzesURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
// DOM elements
const myQuizzes = document.querySelector(".my-quizzes");
const quizzesCard = document.querySelector(".all-quizzes .cards");
// -------------------------------------
// Functionalities
function renderQuizzes(data, htmlElement, isOurQuiz = false) {
  htmlElement.innerHTML = isOurQuiz
    ? `<div class="my-quizzes-header">
        <h2 class="section-title">Seus Quizzes</h2>
        <ion-icon data-test="create-btn" name="add-circle"></ion-icon>
      <div>`
    : "";

  data.forEach((quiz) => {
    htmlElement.innerHTML += `
      <div data-test=${isOurQuiz ? "my-quiz" : "others-quiz"} class="card">
        <img src=${quiz.image} />
        <h2>${quiz.title}</h2>
        <div class="edit-quizz ${isOurQuiz ? "" : "hidden"}">
          <ion-icon onclick="editQuizz()" data-test="edit" id="edit-quizz" name="create"></ion-icon>
          <ion-icon onclick="deleteQuizz()" data-test="delete" id="delete-quizz" name="trash"></ion-icon>
        </div>
      </div>      
    `;
  });
}

// Quizzes Request
axios.get(getQuizzesURL).then((res) => {
  const localKeys = Object.keys({ ...localStorage }).filter((key) =>
    // Convenção do valor para os quizzezs criados, para indentificação
    key.match(/(buzzQuizz-\w+)/)
  );
  const ourQuizzes = localKeys.map((key) =>
    JSON.parse(localStorage.getItem(key))
  );

  renderQuizzes(res.data, quizzesCard);
  if (Object.keys(ourQuizzes).length) {
    renderQuizzes(ourQuizzes, myQuizzes, true);
  }
});
