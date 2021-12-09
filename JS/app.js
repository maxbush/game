document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	const width = 8;
	const squares = [];

	const ballsColors = ["red", "yellow", "orange", "purple", "green", "blue"];

	// Create board
	function createBoard() {
		for (
			let i = 0;
			i < width * width;
			i++ //нижеследующая конструкция повторится width*width раз (64)
		) {
			const square = document.createElement("div"); //создаем div
			square.setAttribute("draggable", true);
			square.setAttribute("id", i); //каждый круг i имеет новое значение 0-63 которое становится id
			let randomColor = Math.floor(Math.random() * ballsColors.length); //Math.random от нуля до длины массива (пяти) (массив из 6), округленный в меньшую сторону
			square.style.backgroundColor = ballsColors[randomColor];
			grid.appendChild(square); //пихаем див в переменную grid которая возвращает  .grid
			squares.push(square); // складываем в массив
		}
	}

	createBoard();
});
