$(document).ready(function() {
	uploadImage();
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

function uploadImage() {
	const $fileUploadArea = $('#file-upload-area');
	const $fileInput = $('#file-input');

	$fileUploadArea.on('click', function() {
		$fileInput.click();
	});

	$fileInput.on('change', function() {
		const files = $fileInput[0].files;
		$('#chosen-file-name').text(files[0].name);
		const formData = new FormData();
		formData.append('image', files[0]);

		fetch('http://localhost:3000/upload', {
			method: 'POST',
			body: formData,

		})
		.then(response => response.json())
		.then(data => {
			$('#image-container').html(`<img src="${data.url}" alt="Uploaded image" />`);
		})
		.catch(error => {
			alert('Error uploading image');
			console.error('Error:', error)
		});
	});
}