axios.defaults.headers.common["Authorization"] = "U6fPRnXorrTvHpB1OupJQJXj";
// Url's API
const getQuizzesURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
// DOM elements
const myQuizzes = document.querySelector(".my-quizzes");
const quizzesCard = document.querySelector(".all-quizzes .cards");
// -------------------------------------
// Functionalities
function renderQuizzes(data, htmlElement, isOurQuiz = false) {
  if (isOurQuiz) {
    myQuizzes.innerHTML = "";
    document.querySelector('.my-quizzes-header').classList.remove('hidden');
  }

  data.forEach((quiz) => {
    htmlElement.innerHTML += `
      <div onclick="getSingleQuizz(${quiz.id})" data-test=${isOurQuiz ? "my-quiz" : "others-quiz"
      } class="card">
        <img src=${quiz.image} />
        <h2>${quiz.title}</h2>
        <div class="edit-quizz ${isOurQuiz ? "" : "hidden"}">
          <ion-icon onclick="editQuizz(${false},${quiz.id
      })" data-test="edit" id="edit-quizz" name="create"></ion-icon>
          <ion-icon onclick="deleteQuizz(${quiz.id
      })" data-test="delete" id="delete-quizz" name="trash"></ion-icon>
        </div>
      </div>      
    `;
  });
}

// Quizzes Request
axios.get(getQuizzesURL).then((res) => {
  const localKeys = Object.keys({ ...localStorage });
  const ourQuizzes = localKeys.map((key) =>
    JSON.parse(localStorage.getItem(key))
  );

  if (Object.keys(ourQuizzes).length) {
    // Filtrando os quizzes que não são os nossos
    const allQuizzes = res.data.filter(
      (quiz) => !localKeys.map((json) => +json).includes(quiz.id)
    );
    renderQuizzes(allQuizzes, quizzesCard);
    renderQuizzes(ourQuizzes, myQuizzes, true);
  } else {
    renderQuizzes(res.data, quizzesCard);
  }
});
