import { memory } from "wasm-game-of-life/game_of_life_bg";
import { init, Universe, Cell } from "wasm-game-of-life";

// Initialize console error panic
init();

// Constants
const height = 145;
const width = 310;
const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const universe = Universe.new(width, height);

// Utils functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getIndex = (row, column) => row * width + column;

// Render canvas
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width =  (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const drawGrid = () =>
{
	ctx.beginPath();
	ctx.strokeStyle = GRID_COLOR;

	// Vertical lines.
	for (let i = 0; i <= width; i++)
	{
		ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
		ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
	}

	// Horizontal lines.
	for (let j = 0; j <= height; j++)
	{
		ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
		ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
	}

	ctx.stroke();
};

const drawCells = () =>
{
	const cellsPtr = universe.cells();
	const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

	ctx.beginPath();

	for (let row = 0; row < height; row++)
	{
		for (let col = 0; col < width; col++)
		{
			const idx = getIndex(row, col);

			ctx.fillStyle = cells[idx] === Cell.Dead
				? DEAD_COLOR
				: ALIVE_COLOR;

			ctx.fillRect(
				col * (CELL_SIZE + 1) + 1,
				row * (CELL_SIZE + 1) + 1,
				CELL_SIZE,
				CELL_SIZE
			);
		}
	}

	ctx.stroke();
};

let iteration = 0;
const renderLoop = async () =>
{
	console.log("iteration: ", iteration++);
	// console.log(universe.render());
	// console.log(universe.display_neighbor());

	universe.tick();

	// await sleep(40);
	if (iteration < 1000)
	{
		drawGrid();
		drawCells();
		requestAnimationFrame(renderLoop);
	}
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);