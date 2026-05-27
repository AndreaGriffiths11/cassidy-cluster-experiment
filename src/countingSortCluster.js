function countingSortCluster(input) {
	const list = typeof input === "string" ? input.split("") : [...input];
	const counts = new Map();

	for (const value of list) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}

	return [...counts.keys()]
		.sort()
		.flatMap((value) => Array(counts.get(value)).fill(value));
}

export { countingSortCluster };
