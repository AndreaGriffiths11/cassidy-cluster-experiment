const BLOG_EXAMPLE = "bgogbrbroorrgbgorrbggo";

function instrumentedCassidyCluster(input) {
	const list = typeof input === "string" ? input.split("") : [...input];
	const listLength = list.length;
	const trace = [];

	function reverse(arr, left, right) {
		const segment = arr.slice(left, right + 1).join("");

		while (left < right) {
			[arr[left], arr[right]] = [arr[right], arr[left]];
			left++;
			right--;
		}

		return segment;
	}

	while (true) {
		let right = listLength - 1;
		let clusterStartingIndex;
		let frontOfReversingSection;

		while (right > 0) {
			const target = list[right];
			clusterStartingIndex = right;

			while (
				clusterStartingIndex > 0 &&
				list[clusterStartingIndex - 1] === target
			) {
				clusterStartingIndex--;
			}
			frontOfReversingSection = clusterStartingIndex - 1;
			while (
				frontOfReversingSection >= 0 &&
				list[frontOfReversingSection] !== target
			) {
				frontOfReversingSection--;
			}

			if (frontOfReversingSection >= 0) break;

			right = clusterStartingIndex - 1;
		}

		if (right <= 0) break;

		let left;
		let segment;
		if (right < listLength - 1) {
			left = clusterStartingIndex;
			segment = reverse(list, clusterStartingIndex, listLength - 1);
		} else {
			left = frontOfReversingSection + 1;
			segment = reverse(list, frontOfReversingSection + 1, listLength - 1);
		}

		trace.push({
			iteration: trace.length + 1,
			reverseSegment: `${left}-${listLength - 1}: \`${segment}\``,
			resultingState: `\`${list.join("")}\``,
		});
	}

	return trace;
}

function toMarkdownTable(rows) {
	const lines = [
		"| Iteration | Reverse segment | Resulting state |",
		"| ---: | --- | --- |",
	];

	for (const row of rows) {
		lines.push(
			`| ${row.iteration} | ${row.reverseSegment} | ${row.resultingState} |`,
		);
	}

	return lines.join("\n");
}

console.log(toMarkdownTable(instrumentedCassidyCluster(BLOG_EXAMPLE)));
