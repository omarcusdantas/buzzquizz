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
      <div onclick="toggleQuizzPage(${quiz.id})" data-test=${isOurQuiz ? "my-quiz" : "others-quiz"
      } class="card">
        <img src=${quiz.image} />
        <h2>${quiz.title}</h2>
        <div class="edit-quizz ${isOurQuiz ? "" : "hidden"}">
          <ion-icon onclick="event.stopPropagation(); editQuizz(${false},${quiz.id
      })" data-test="edit" id="edit-quizz" name="create"></ion-icon>
          <ion-icon onclick="event.stopPropagation(); deleteQuizz(${quiz.id
      })" data-test="delete" id="delete-quizz" name="trash"></ion-icon>
        </div>
      </div>      
    `;
  });
}

// Quizzes Request
axios.get(getQuizzesURL).then((res) => {
  document.querySelector('.loading-screen').classList.add('hidden');
  const localKeys = Object.keys({ ...localStorage });
  const keysBuzzQuizz = localKeys.filter(key => {
    return key.match(/(buzzQuizz-\d+)/)
  });

  const ourQuizzes = keysBuzzQuizz.map((key) =>
    JSON.parse(localStorage.getItem(key))
  )
  if (Object.keys(ourQuizzes).length) {
    // Filtrando os quizzes que não são os nossos
    const allQuizzes = res.data.filter(
      (quiz) => !keysBuzzQuizz.includes(`buzzQuizz-${quiz.id}`)
    );
    renderQuizzes(allQuizzes, quizzesCard);
    renderQuizzes(ourQuizzes, myQuizzes, true);
  } else {
    renderQuizzes(res.data, quizzesCard);
  }
});
