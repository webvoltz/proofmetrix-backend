const FormatTime = (seconds)=> {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	let result = "";
	if (minutes > 0) {
		result += `${minutes} min `;
	}
	if (remainingSeconds > 0) {
		result += `${remainingSeconds} sec`;
	}

	return result.trim();
}

module.exports = {
    FormatTime
}
