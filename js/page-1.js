axios.defaults.headers.common["Authorization"] = "U6fPRnXorrTvHpB1OupJQJXj";
// Url's API
const getQuizzesURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
// DOM elements
const myQuizzes = document.querySelector(".my-quizzes");
const allQuizzes = document.querySelector(".all-quizzes");
// -------------------------------------
// Functionalities

function retrieveQuizzes() {
  axios.get(getQuizzesURL).then((res) => console.log(res));
}

retrieveQuizzes();
