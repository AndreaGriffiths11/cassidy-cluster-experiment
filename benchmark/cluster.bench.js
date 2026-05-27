import { performance } from "node:perf_hooks";

import { cassidyCluster } from "../src/cassidyCluster.js";
import { countingSortCluster } from "../src/countingSortCluster.js";

const TILE_VALUES = ["b", "g", "o", "r"];
const SIZES = [1_000, 10_000, 100_000];

function seededRandom(seed) {
	let state = seed >>> 0;
	return function random() {
		state = (1664525 * state + 1013904223) >>> 0;
		return state / 0x100000000;
	};
}

function randomTileString(length, seed) {
	const random = seededRandom(seed);
	let result = "";

	for (let index = 0; index < length; index++) {
		result += TILE_VALUES[Math.floor(random() * TILE_VALUES.length)];
	}

	return result;
}

function time(label, input, fn) {
	const start = performance.now();
	fn(input);
	const duration = performance.now() - start;

	return { label, duration };
}

const rows = SIZES.flatMap((size) => {
	const input = randomTileString(size, size);

	return [
		{ n: size, ...time("cassidyCluster", input, cassidyCluster) },
		{ n: size, ...time("countingSort", input, countingSortCluster) },
	];
});

console.table(
	rows.map(({ n, label, duration }) => ({
		n,
		algorithm: label,
		"duration (ms)": duration.toFixed(3),
	})),
);
