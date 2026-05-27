import { performance } from "node:perf_hooks";

import { cassidyCluster } from "../src/cassidyCluster.js";
import { cassidyClusterRuns } from "../src/cassidyClusterRuns.js";
import { countingSortCluster } from "../src/countingSortCluster.js";

const ALPHABETS = {
	"4 (tiles: b g o r)": ["b", "g", "o", "r"],
	"26 (a-z)": "abcdefghijklmnopqrstuvwxyz".split(""),
};
const SIZES = [1_000, 10_000, 100_000];

function seededRandom(seed) {
	let state = seed >>> 0;
	return function random() {
		state = (1664525 * state + 1013904223) >>> 0;
		return state / 0x100000000;
	};
}

function randomString(length, alphabet, seed) {
	const random = seededRandom(seed);
	let result = "";

	for (let index = 0; index < length; index++) {
		result += alphabet[Math.floor(random() * alphabet.length)];
	}

	return result;
}

function time(label, input, fn) {
	const start = performance.now();
	fn(input);
	const duration = performance.now() - start;

	return { label, duration };
}

for (const [alphabetLabel, alphabet] of Object.entries(ALPHABETS)) {
	console.log(`\nAlphabet size ${alphabetLabel}`);

	const rows = SIZES.flatMap((size) => {
		const input = randomString(size, alphabet, size);

		return [
			{ n: size, ...time("cassidyCluster (array)", input, cassidyCluster) },
			{ n: size, ...time("cassidyClusterRuns (RLE)", input, cassidyClusterRuns) },
			{ n: size, ...time("countingSortCluster", input, countingSortCluster) },
		];
	});

	console.table(
		rows.map(({ n, label, duration }) => ({
			n,
			algorithm: label,
			"duration (ms)": duration.toFixed(3),
		})),
	);
}
