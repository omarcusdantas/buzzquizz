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
    ? '<h2 class="section-title">Seus Quizzes</h2>'
    : "";

  data.forEach((quiz) => {
    htmlElement.innerHTML += `
      <div class="card">
        <img src=${quiz.image} />
        <h2>${quiz.title}</h2>
        <div class="edit-quizz ${isOurQuiz ? "" : "hidden"}">
          <ion-icon id="create-quizz" name="create"></ion-icon>
          <ion-icon id="delete-quizz" name="trash"></ion-icon>
        </div>
      </div>      
    `;
  });
}

axios.get(getQuizzesURL).then((res) => {
  console.log(res.data);
  const localKeys = Object.keys({ ...localStorage }).filter((key) =>
    // Convenção do valor para os quizzes criados, para indentificação
    key.match(/(buzzQuizz-\w+)/)
  );
  const ourQuizzes = localKeys.map((key) =>
    JSON.parse(localStorage.getItem(key))
  );
  console.log(ourQuizzes);
  renderQuizzes(res.data, quizzesCard);
  if (Object.keys(ourQuizzes).length) {
    renderQuizzes(ourQuizzes, myQuizzes, true);
  }
});
