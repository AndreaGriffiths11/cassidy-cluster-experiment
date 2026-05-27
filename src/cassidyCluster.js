function cassidyCluster(input) {
	// It's more "proper" to input an actual array here
	// but this is for accepting a string as well
	const list = typeof input === "string" ? input.split("") : [...input];
	const listLength = list.length;

	// Helper to reverse a portion of the list
	function reverse(arr, left, right) {
		while (left < right) {
			[arr[left], arr[right]] = [arr[right], arr[left]];
			left++;
			right--;
		}
	}

	while (true) {
		let right = listLength - 1;
		let clusterStartingIndex;
		let frontOfReversingSection;

		// Get the rightmost cluster of identical elements
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

		// If no more clusters need to be completed, break
		if (right <= 0) break;

		if (right < listLength - 1) {
			// When the rightmost cluster is "done", reverse the section
			// of the list that includes the next cluster to be completed
			reverse(list, clusterStartingIndex, listLength - 1);
		} else {
			// Base case: reverse the section of the list that matches
			// the rightmost cluster
			reverse(list, frontOfReversingSection + 1, listLength - 1);
		}
	}
	return list;
}

export { cassidyCluster };
