axios.defaults.headers.common["Authorization"] = "U6fPRnXorrTvHpB1OupJQJXj";
// Url's API
const getQuizzesURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
// DOM elements
const myQuizzes = document.querySelector(".my-quizzes");
const quizzesCard = document.querySelector(".all-quizzes .cards");
// -------------------------------------
// Functionalities

function renderQuizzes(data) {
  console.log(data);
  quizzesCard.innerHTML = "";
  data.forEach((quiz) => {
    quizzesCard.innerHTML += `
      <div class="card">
        <img src=${quiz.image} />
        <h2>${quiz.title}</h2>
      </div>
    `;
  });
}

axios.get(getQuizzesURL).then((res) => renderQuizzes(res.data));
