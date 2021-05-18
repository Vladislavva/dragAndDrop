let isDragging = false;
localStorage.clear();

const enterText = () => {
  const divForResult = document.querySelector("#field");

  const result = document.getElementById("textInput").value;
  document.getElementById("textInput").value = "";
  result.split("").map((element, id) => {
    const p = `<div class="draggable" id="${id}">${element}</div>`;
    divForResult.insertAdjacentHTML("afterend", p);
  });
};
document.addEventListener("mousedown", function (event) {
  const onMouseUp = (event) => {
    finishDrag(event.clientX, event.clientY);
  };

  const onMouseMove = (event) => {
    moveAt(event.clientX, event.clientY);
  };

  const startDrag = (element, clientX, clientY) => {
    if (isDragging) {
      return;
    }
    const currentPosition = `${clientX},${clientY}`;
    localStorage.setItem(dragElement.id, currentPosition);

    isDragging = true;

    document.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseup", onMouseUp);

    shiftX = clientX - element.getBoundingClientRect().left;
    shiftY = clientY - element.getBoundingClientRect().top;

    element.style.position = "fixed";

    moveAt(clientX, clientY);
  };

  const finishDrag = (clientX, clientY) => {
    const currentPosition = `${localStorage.getItem(
      dragElement.id
    )}, ${clientX},${clientY}`;
    localStorage.setItem(dragElement.id, currentPosition);

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      const position = localStorage.getItem(key).split(",");

      //Проверка на не текущий элемент
      if (key !== dragElement.id) {
        if (
            //проверка попадает ли новый элемнт на старый с разницй в десять пикселей по модулю 
          Math.abs(+position[2] - clientX) < 10 &&
          Math.abs(+position[3] - clientY) < 10
        ) {
            //обращение для предыдущего элемента для дачи новых стилей
          const prevElement = document.getElementById(key);
          //получение предыдущего координат текущего элемента
          const prevElementData = localStorage.getItem(
            dragElement.id
          ).split(',');
          prevElement.style.left = `${prevElementData[0]}px`;
          prevElement.style.top = `${prevElementData[1]}px`;
        }
      }
    }

    if (!isDragging) {
      return;
    }

    isDragging = false;
    dragElement.style.top =
      parseInt(dragElement.style.top) + pageYOffset + "px";
    dragElement.style.position = "absolute";

    document.removeEventListener("mousemove", onMouseMove);
    dragElement.removeEventListener("mouseup", onMouseUp);
  };

  const moveAt = (clientX, clientY) => {
    let newX = clientX - shiftX;
    let newY = clientY - shiftY;

    let newBottom = newY + dragElement.offsetHeight;

    if (newBottom > document.documentElement.clientHeight) {
      let docBottom = document.documentElement.getBoundingClientRect().bottom;

      let scrollY = Math.min(docBottom - newBottom, 10);

      if (scrollY < 0) scrollY = 0;

      window.scrollBy(0, scrollY);

      newY = Math.min(
        newY,
        document.documentElement.clientHeight - dragElement.offsetHeight
      );
    }

    if (newY < 0) {
      let scrollY = Math.min(-newY, 10);
      if (scrollY < 0) scrollY = 0;
      window.scrollBy(0, -scrollY);
      newY = Math.max(newY, 0);
    }

    if (newX < 0) newX = 0;
    if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
      newX = document.documentElement.clientWidth - dragElement.offsetWidth;
    }

    dragElement.style.left = newX + "px";
    dragElement.style.top = newY + "px";
  };
  let dragElement = event.target.closest(".draggable");

  if (!dragElement) return;

  event.preventDefault();

  dragElement.ondragstart = function () {
    return false;
  };

  let shiftX, shiftY;

  startDrag(dragElement, event.clientX, event.clientY);
});
