// `cassidyClusterRuns` runs the same greedy reversal heuristic as
// `cassidyCluster`, but operates on a doubly-linked list of runs
// (run-length encoded). Each "reverse" becomes a handful of pointer
// flips on run boundaries instead of n element swaps in an array.
//
// Output is bit-identical to `cassidyCluster` — only the representation
// changes. See the README for the head-to-head benchmark.

function buildRuns(list) {
	let head = null;
	let tail = null;

	for (const value of list) {
		if (tail && tail.value === value) {
			tail.count++;
		} else {
			const node = { value, count: 1, prev: tail, next: null };
			if (tail) tail.next = node;
			else head = node;
			tail = node;
		}
	}

	return { head, tail };
}

function materialize(head) {
	const out = [];
	let node = head;

	while (node) {
		for (let index = 0; index < node.count; index++) out.push(node.value);
		node = node.next;
	}

	return out;
}

function reverseSegmentPointers(startNode) {
	let node = startNode;

	while (node) {
		const originalNext = node.next;
		node.next = node.prev;
		node.prev = originalNext;
		node = originalNext;
	}
}

function cassidyClusterRuns(input) {
	const list = typeof input === "string" ? input.split("") : [...input];
	if (list.length === 0) return [];

	let { head, tail } = buildRuns(list);

	while (true) {
		// Walk from the tail leftward looking for a run whose value also
		// appears further to the left. That pair is the next reversal target.
		let rightRun = tail;
		let leftRun = null;
		let rightIsTail = true;

		while (rightRun) {
			let candidate = rightRun.prev;
			while (candidate && candidate.value !== rightRun.value) {
				candidate = candidate.prev;
			}

			if (candidate) {
				leftRun = candidate;
				break;
			}

			rightRun = rightRun.prev;
			rightIsTail = false;
		}

		if (!rightRun || !leftRun) break;

		if (rightIsTail) {
			// Merge the rightmost cluster into its matching left run and
			// reverse the middle section in place via pointer flips.
			const lastMiddle = rightRun.prev;
			leftRun.count += rightRun.count;
			lastMiddle.next = null;

			const firstMiddle = leftRun.next;
			reverseSegmentPointers(firstMiddle);

			leftRun.next = lastMiddle;
			lastMiddle.prev = leftRun;
			firstMiddle.next = null;
			tail = firstMiddle;
		} else {
			// The rightmost cluster sits before already-completed clusters.
			// Reverse from `rightRun` through `tail` so the next iteration
			// can merge it cleanly.
			const previous = rightRun.prev;
			const oldTail = tail;

			reverseSegmentPointers(rightRun);

			previous.next = oldTail;
			oldTail.prev = previous;
			rightRun.next = null;
			tail = rightRun;
		}
	}

	return materialize(head);
}

export { cassidyClusterRuns };
