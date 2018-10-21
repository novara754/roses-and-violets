let colors;

async function main() {
	colors = await fetch('colors.json').then(r => r.json()).then(process);
	regenerate();
}

function regenerate() {
	const randomRed = randomFrom(colors, 'red', 100, 50);
	const randomBlue = randomFrom(colors, 'blue', 100, 50);

	const redText = document.getElementById('red-text');
	redText.innerText = randomRed.name;
	redText.setAttribute('style', `color: rgb(${randomRed.rgb})`);
	const blueText = document.getElementById('blue-text');
	blueText.innerText = randomBlue.name;
	blueText.setAttribute('style', `color: rgb(${randomBlue.rgb})`);
}

function randomFrom(colors, colorName, maxRange, offset) {
	const color = colors[colorName];
	const newColor = addRandomVector(color, maxRange, offset);
	return findClosest(colors, newColor);
}

function findClosest(colors, color) {
	const names = Object.keys(colors);
	names.sort((a, b) => {
		const aDist = distance(color, colors[a]);
		const bDist = distance(color, colors[b]);

		return aDist - bDist;
	});
	const closestName = names[0];
	const closestHex = colors[closestName];

	return {
		name: closestName,
		rgb: closestHex,
	};
}

function distance(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}

function addRandomVector(vector, maxRange, offset) {
	const range = Math.random() * maxRange + offset;
	const theta = Math.random() * Math.PI * 2;
	const phi = Math.random() * Math.PI * 2;
	const r = range * Math.sin(phi) * Math.cos(theta);
	const g = range * Math.sin(phi) * Math.sin(theta);
	const b = range * Math.cos(phi);

	return [vector[0] + r, vector[1] + g, vector[2] + b];
}

function process(colorsJson) {
	const colors = {};
	for (const { color, hex } of colorsJson) {
		colors[color] = hex2rgb(hex);
	}

	return colors;
}

function hex2rgb(hex) {
	const num = parseInt(hex.slice(1), 16);
	const r = num >> 16;
	const g = (num >> 8) & 0xFF;
	const b = num & 0xFF;

	return [r, g, b];
}

main();
