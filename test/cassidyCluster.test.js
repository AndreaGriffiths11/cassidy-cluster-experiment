import assert from "node:assert/strict";
import { test } from "node:test";

import { cassidyCluster } from "../src/cassidyCluster.js";

const TILE_VALUES = ["b", "g", "o", "r"];

function seededRandom(seed) {
	let state = seed >>> 0;
	return function random() {
		state = (1664525 * state + 1013904223) >>> 0;
		return state / 0x100000000;
	};
}

function randomTileString(random, length) {
	let result = "";
	for (let index = 0; index < length; index++) {
		result += TILE_VALUES[Math.floor(random() * TILE_VALUES.length)];
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

	assert.deepEqual(cassidyCluster(input), "bbbbbrrrrrrggggggooooo".split(""));
});

test("accepts arrays without mutating the input", () => {
	const input = "bgogbrbroorrgbgorrbggo".split("");
	const copy = [...input];

	assert.deepEqual(cassidyCluster(input), "bbbbbrrrrrrggggggooooo".split(""));
	assert.deepEqual(input, copy);
});

test("clusters 2000 random fuzz cases", () => {
	const random = seededRandom(0xc4551d7);

	for (let caseIndex = 0; caseIndex < 2000; caseIndex++) {
		const length = Math.floor(random() * 200);
		const input = randomTileString(random, length);
		const clustered = cassidyCluster(input);

		assert.equal(clustered.length, input.length, `case ${caseIndex} length changed`);
		assertSameCounts(clustered, input);
		assertClustered(clustered);
	}
});
