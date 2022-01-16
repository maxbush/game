document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid"); // grid это див .grid
	const scoreDisplay = document.getElementById("score");
	const width = 8;
	const squares = [];
	let score = 0;

	const ballsColors = [
		"url(img/red.png)",
		"url(img/yellow.png)",
		"url(img/orange.png)",
		"url(img/purple.png)",
		"url(img/green.png)",
		"url(img/blue.png)",
	];

	// создаем доску
	function createBoard() {
		for (let i = 0; i < width * width; i++) {
			const square = document.createElement("div"); // Каждую итерацию создает тег div
			square.setAttribute("draggable", true); // можно двигать
			square.setAttribute("id", i); // добавляет атрибут Id со значением i (каждую итерацию новое 0-63)
			let randomColor = Math.floor(Math.random() * ballsColors.length); //Math.random от нуля до длины массива (пяти) (массив из 6), округленный в меньшую сторону
			square.style.backgroundImage = ballsColors[randomColor]; // ставит рандомный цвет из массива
			grid.appendChild(square); // и помещает его (div) в .grid
			squares.push(square); //каждую итерацию добавляет square (div) в конец массива squares
		}
	}

	createBoard();

	// двигаем шары, кхе-кхе

	let colorBeingDragged;
	let colorBeingReplaced;
	let squareIdBeingDragged;
	let squareIdBeingReplaced;

	squares.forEach((square) => square.addEventListener("dragstart", dragStart));
	squares.forEach((square) => square.addEventListener("dragend", dragEnd));
	squares.forEach((square) => square.addEventListener("dragover", dragOver));
	squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
	squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
	squares.forEach((square) => square.addEventListener("drop", dragDrop)); // перебираем каждый элемент масиива на предмет дрэг ивентов и при совпадении запускаем определенную функцию

	function dragStart() {
		colorBeingDragged = this.style.backgroundImage;
		squareIdBeingDragged = parseInt(this.id); //parseInt чтобы это точно было число
		console.log(squareIdBeingDragged);
		console.log(this.id, "dragstart");
	}

	function dragOver(e) {
		e.preventDefault();
		console.log(this.id, "dragover");
	}

	function dragEnter(e) {
		e.preventDefault();
		console.log(this.id, "dragenter");
	}

	function dragLeave() {
		console.log(this.id, "dragleave");
	}

	function dragDrop() {
		colorBeingReplaced = this.style.backgroundImage;
		squareIdBeingReplaced = parseInt(this.id);
		console.log(this.id);
		squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
		this.style.backgroundImage = colorBeingDragged;
		console.log(squares[squareIdBeingReplaced].style.backgroundImage);
		console.log(this.id, "dragdrop");
	}

	function dragEnd() {
		console.log(this.id, "dragend");
		// какое перемещение валидно?
		let validMoves = [
			squareIdBeingDragged - 1, // 1 влево
			squareIdBeingDragged - width, // 1 вверх (-8 это один ряд)
			squareIdBeingDragged + 1,
			squareIdBeingDragged + width,
		];
		let validMove = validMoves.includes(squareIdBeingReplaced); // корректные перемещения это перемещения в такой squareIdBeingReplaced, который входит в спискок данного массива

		if (squareIdBeingReplaced && validMove) {
			squareIdBeingReplaced = null;
		} // если квадрат перемещается и перемещается корректно, цвет заменяемого квадрата удаляется
		else if (squareIdBeingReplaced && !validMove) {
			squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
			squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
		} //если квадрат перемещается по таблице, но не корректно, цветв заменяемого и заменяющего квадратов возвращаются к изначальным
		else
			squares[(squareIdBeingDragged.style.backgroundImage = colorBeingDragged)]; // если съебал куда-то за пределы, просто возвращаем обратно изначальный цвет
	}

	//скидываем шары вниз при очистившихся ячейках

	function moveDown() {
		for (
			i = 0;
			i < 55;
			i++ // чекаем первые 7 рядов
		) {
			if (squares[i + width].style.backgroundImage === "") {
				// если ячейка на ряд ниже пуста
				squares[i + width].style.backgroundImage =
					squares[i].style.backgroundImage; //она красится в цвет верхней
				squares[i].style.backgroundImage = ""; // а верхняя "удаляется"
				const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
				const isFirstRow = firstRow.includes(i); //если i попадает в массив ето первый ряд
				if (isFirstRow && squares[i].style.backgroundImage === "") {
					let randomColor = Math.floor(Math.random() * ballsColors.length);
					squares[i].style.backgroundImage = ballsColors[randomColor];
				}
			}
		}
	}

	moveDown();
	//чекаем совпадения (все пояснения в фунциях на 3 совпадения, внизу)

	//чекаем на 5 в ряд
	function checkRowForFive() {
		for (i = 0; i < 59; i++) {
			let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
			let decidedColor = squares[i].style.backgroundImage;
			const isBlank = squares[i].style.backgroundImage === "";
			const notValid = [
				4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38,
				39, 44, 45, 46, 47, 52, 53, 54, 55,
			];

			if (notValid.includes(i)) continue;

			if (
				rowOfFive.every(
					(index) =>
						squares[index].style.backgroundImage === decidedColor && !isBlank
				)
			) {
				score += 5;
				scoreDisplay.innerHTML = score;
				rowOfFive.forEach((index) => {
					squares[index].style.backgroundImage = "";
				});
			}
		}
	}

	checkRowForFive();

	// чекаем на 5 в колонку

	function checkColumnForFive() {
		for (i = 0; i < 31; i++) {
			let columnOfFive = [
				i,
				i + width,
				i + width * 2,
				i + width * 3,
				i + width * 4,
			];
			let decidedColor = squares[i].style.backgroundImage;
			const isBlank = squares[i].style.backgroundImage === "";
			if (
				columnOfFive.every(
					(index) =>
						squares[index].style.backgroundImage === decidedColor && !isBlank
				)
			) {
				score += 5;
				scoreDisplay.innerHTML = score;
				columnOfFive.forEach((index) => {
					squares[index].style.backgroundImage = "";
				});
			}
		}
	}

	checkColumnForFive();

	//чекаем на 4 в ряд
	function checkRowForFour() {
		for (i = 0; i < 60; i++) {
			let rowOfFour = [i, i + 1, i + 2, i + 3];
			let decidedColor = squares[i].style.backgroundImage;
			const isBlank = squares[i].style.backgroundImage === "";
			const notValid = [
				5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
				54, 55,
			];

			if (notValid.includes(i)) continue;

			if (
				rowOfFour.every(
					(index) =>
						squares[index].style.backgroundImage === decidedColor && !isBlank
				)
			) {
				score += 4;
				scoreDisplay.innerHTML = score;
				rowOfFour.forEach((index) => {
					squares[index].style.backgroundImage = "";
				});
			}
		}
	}

	checkRowForFour();

	function checkColumnForFour() {
		for (i = 0; i < 39; i++) {
			let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
			let decidedColor = squares[i].style.backgroundImage;
			const isBlank = squares[i].style.backgroundImage === "";

			if (
				columnOfFour.every(
					(index) =>
						squares[index].style.backgroundImage === decidedColor && !isBlank
				)
			) {
				score += 4;
				scoreDisplay.innerHTML = score;
				columnOfFour.forEach((index) => {
					squares[index].style.backgroundImage = "";
				});
			}
		}
	}

	checkColumnForFour();

	//чекаем на три в ряд
	function checkRowForThree() {
		for (
			i = 0;
			i < 61;
			i++ //61 потому что макс последний ряд из трех - 61,62,63
		) {
			let rowOfThree = [i, i + 1, i + 2];
			let decidedColor = squares[i].style.backgroundImage;
			const isBlank = squares[i].style.backgroundImage === "";
			const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]; //иначе он при расчете захватывает следующую строку
			if (notValid.includes(i)) continue; //скипаем невалидные
			if (
				rowOfThree.every(
					(index) =>
						squares[index].style.backgroundImage === decidedColor && !isBlank
				)
			) {
				score += 3;
				scoreDisplay.innerHTML = score;
				rowOfThree.forEach((index) => {
					squares[index].style.backgroundImage = "";
				});
			}
		}
	}
	checkRowForThree();

	//чекаем на три в колонку

	function checkColumnForThree() {
		for (i = 0; i < 47; i++) {
			let columnOfThree = [i, i + width, i + width * 2];
			let decidedColor = squares[i].style.backgroundImage;
			const isBlank = squares[i].style.backgroundImage === "";

			if (
				columnOfThree.every(
					(index) =>
						squares[index].style.backgroundImage === decidedColor && !isBlank
				)
			) {
				score += 3;
				scoreDisplay.innerHTML = score;
				columnOfThree.forEach((index) => {
					squares[index].style.backgroundImage = "";
				});
			}
		}
	}

	checkColumnForThree();

	window.setInterval(function () {
		moveDown();
		checkRowForFive();
		checkColumnForFive();
		checkRowForFour();
		checkColumnForFour();
		checkRowForThree();
		checkColumnForThree();
	}, 100); //функция срабатывает каждые 100 мсек, а не 1 раз при загрузке страницы
});
