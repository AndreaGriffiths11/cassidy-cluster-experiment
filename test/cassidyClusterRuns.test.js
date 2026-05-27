import assert from "node:assert/strict";
import { test } from "node:test";

import { cassidyCluster } from "../src/cassidyCluster.js";
import { cassidyClusterRuns } from "../src/cassidyClusterRuns.js";

const TILE_VALUES = ["b", "g", "o", "r"];

function seededRandom(seed) {
	let state = seed >>> 0;
	return function random() {
		state = (1664525 * state + 1013904223) >>> 0;
		return state / 0x100000000;
	};
}

function randomTileString(random, length, alphabet) {
	let result = "";
	for (let index = 0; index < length; index++) {
		result += alphabet[Math.floor(random() * alphabet.length)];
	}
	return result;
}

function countsFor(values) {
	const counts = new Map();
	for (const value of values) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	return counts;
}

function assertSameCounts(actual, expected) {
	assert.deepEqual(countsFor(actual), countsFor(expected));
}

function assertClustered(values) {
	const seen = new Set();
	let previous;

	for (const value of values) {
		if (value !== previous) {
			assert.equal(seen.has(value), false, `value ${value} appears in more than one cluster`);
			seen.add(value);
			previous = value;
		}
	}
}

test("matches the blog example", () => {
	const input = "bgogbrbroorrgbgorrbggo";

	assert.deepEqual(cassidyClusterRuns(input), "bbbbbrrrrrrggggggooooo".split(""));
});

test("handles empty and single-element inputs", () => {
	assert.deepEqual(cassidyClusterRuns(""), []);
	assert.deepEqual(cassidyClusterRuns("a"), ["a"]);
	assert.deepEqual(cassidyClusterRuns("aa"), ["a", "a"]);
});

test("accepts arrays without mutating the input", () => {
	const input = "bgogbrbroorrgbgorrbggo".split("");
	const copy = [...input];

	assert.deepEqual(cassidyClusterRuns(input), "bbbbbrrrrrrggggggooooo".split(""));
	assert.deepEqual(input, copy);
});

test("produces bit-identical output to cassidyCluster on 5000 fuzz cases", () => {
	const random = seededRandom(0xb01ba11);

	for (let caseIndex = 0; caseIndex < 5000; caseIndex++) {
		const length = Math.floor(random() * 200);
		const alphabetSize = 2 + Math.floor(random() * 6);
		const alphabet = TILE_VALUES.concat("aeiosrtuvw".split("")).slice(0, alphabetSize);
		const input = randomTileString(random, length, alphabet);

		const fromArray = cassidyCluster(input);
		const fromRuns = cassidyClusterRuns(input);

		assert.deepEqual(fromRuns, fromArray, `case ${caseIndex} diverged for input "${input}"`);
		assertSameCounts(fromRuns, input);
		assertClustered(fromRuns);
	}
});
