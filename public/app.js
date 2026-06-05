const remove = async (id) => {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
};

const change = async (id, title) => {
  await fetch(`/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      title,
    }),
  });
};

document.addEventListener("click", async (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  } else if (event.target.dataset.type === "change") {
    const id = event.target.dataset.id;

    const title = prompt("Введите новое название");

    if (title) {
      await change(id, title);

      event.target.closest("li").querySelector(".note-title").textContent =
        title;
    }
  }
});
