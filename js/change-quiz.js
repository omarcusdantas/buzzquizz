const urlAPI = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";

const setData = (id) => {
  const data = JSON.parse(localStorage.getItem(`buzzQuizz-${id}`));
  return {
    headers: {
      "Secret-Key": data.key.toString(),
    },
  };
};

function retrieveDataLevels(oldData) {
  oldData.levels.forEach((level, i) => {
    document.querySelector(`#tL-${i + 1}`).value = level.title;
    document.querySelector(`#perc-${i + 1}`).value = level.minValue;
    document.querySelector(`#imgL-${i + 1}`).value = level.image;
    document.querySelector(`#l${i + 1}-desc`).value = level.text;
  });
};

function retrieveDataQuestions(oldData) {
  oldData.questions.forEach((question, i) => {
    document.querySelector(`#q-${i + 1}`).value = question.title;
    document.querySelector(`#bg-${i + 1}`).value = question.color;

    question.answers.forEach((answer, j) => {
      document.querySelector(`#a-${j + 1}${i + 1}`).value = answer.text;
      document.querySelector(`#Img-${j + 1}${i + 1}`).value = answer.image;
    });
  });
}

function deleteQuizz(id) {
  const confirmation = confirm("Tem certeza que quer deletar esse quiz?");
  if (confirmation) {
    document.querySelector('.loading-screen').classList.remove('hidden');
  const config = setData(id);
  axios
    .delete(urlAPI + `/${id}`, config)
    .then(() => {
      document.querySelector('.loading-screen').classList.add('hidden');
      localStorage.removeItem(`buzzQuizz-${id}`);
      alert("Quiz deletado com sucesso!");
      window.location.reload();
    })
    .catch(() => {
      alert("Ocorreu um erro ao deletar o quiz.");
      window.location.reload();
    });
  }
}


function editQuizz(edited, id, data) {
  if (!edited) {
    const oldData = JSON.parse(localStorage.getItem(`buzzQuizz-${id}`));
    toggleCreateQuiz(true, id, oldData);
  };
  if (data) {
    const config = setData(id);
    const quiz = data;

    axios
      .put(urlAPI + `/${id}`, quiz, config)
      .then(res => {
        localStorage.setItem(`buzzQuizz-${id}`, JSON.stringify(res.data));
        alert("Quiz editado com sucesso!");
        window.location.reload();
      })
  }
}