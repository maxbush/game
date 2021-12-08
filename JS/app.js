document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	const width = 8;
	const squares = [];

	const ballsColors = ["red", "yellow", "orange", "purple", "green", "blue"];

	// Create board
	function createBoard() {
		for (let i = 0; i < width * width; i++) {
			const square = document.createElement("div");
			let randomColor = Math.floor(Math.random() * ballsColors.length);
			square.style.backgroundColor = ballsColors[randomColor];
			grid.appendChild(square);
			squares.push(square);
		}
	}

	createBoard();
});
