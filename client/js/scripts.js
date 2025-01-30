$(document).ready(function() {
	let images = [];
	uploadImage();
	viewAllUploads(images);
	getEvenet().then(data => {
		$('#event').text(data.text);
		$('#json-container').jsonViewer(data);
	});
	getAllUplaods().then(data => {
		images = data.images
		console.log(images);
		viewAllUploads(images);
	}).catch(error => {
		console.error('Error:', error)
	});
	drag();
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
			alert('Image uploaded successfully');
		})
		.catch(error => {
			alert('Error uploading image');
			console.error('Error:', error)
		}).finally(() => {
			$fileInput.val('');
			$('#chosen-file-name').text('');
		});
	});
}

async function getAllUplaods() {
	const response = await fetch('http://localhost:3000/uploads');
	const data = await response.json();
	return data;
}

function viewAllUploads(uploads) {
	const $uploadsContainer = $('#uploads-container');
	$uploadsContainer.empty();
	uploads.forEach(upload => {
		const $img = $('<img>')
			.attr('src', upload)
			.addClass('col-lg-3 col-md-4 col-sm-6 col-12 cursor-pointer');
		$uploadsContainer.append($img);
	});
}

function drag() {
	$("#uploads-container img").draggable({
		revert: true,
		cursor: "move",
	});
	$("#uploads-container").sortable({
		items: "img"
	});
	$("#uploads-container").disableSelection();

}
