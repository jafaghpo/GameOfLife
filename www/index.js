import { init, Universe } from "wasm-game-of-life";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// console.log("before init");
init();
// console.log("after init");
let iteration = 0;
let prev_map = null;
const pre = document.getElementById("game-of-life-canvas");
const universe = Universe.new(10, 10);

const renderLoop = async () =>
{
	console.log("iteration: ", iteration++);
	let map = universe.render();

	console.log("prev");
	console.log(prev_map);
	console.log("map");
	console.log(map);

	pre.textContent = map
	prev_map = map;
	universe.tick();

	await sleep(200);
	if (iteration < 100)
	{
		requestAnimationFrame(renderLoop);
	}
};

requestAnimationFrame(renderLoop);