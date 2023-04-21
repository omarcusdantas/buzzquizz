const urlAPI = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";

const setData = (id) => {
  const data = JSON.parse(localStorage.getItem(id));
  console.log(data);
  return {
    headers: {
      "Secret-Key": data.key.toString(),
    },
  };
};

function deleteQuizz(id) {
  const config = setData(id);
  axios
    .delete(urlAPI + `/${id}`, config)
    .then((res) => {
      console.log(res);
      localStorage.removeItem(id);
      window.location.reload();
    })
    .catch(() => {
      alert("Ocorreu um erro ao deletar o quiz.");
      window.location.reload();
    });
}


function editQuizz(edited, id, data) {
  if (!edited) {
    toggleCreateQuiz(true, id);
  };
  if (data) {
    const config = setData(id);
    const quiz = data;

    axios
      .put(urlAPI + `/${id}`, quiz, config)
      .then(res => {
        console.log(res);
        localStorage.setItem(id, JSON.stringify(res.data));
        alert("Quiz editado com sucesso!");
        window.location.reload();
      })
  }
}