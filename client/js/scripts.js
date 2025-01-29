$(document).ready(function() {
	getEvenet().then(data => {
		$('#event').text(data.text);
		$('#json-container').jsonViewer(data);
	});
});

async function getEvenet() {
	const month = getRandomInt(1, 12);
	const day = getRandomInt(1, 31);
	const response = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
	const data = await response.json();
	return data;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}