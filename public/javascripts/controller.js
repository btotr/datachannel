var mediaSource = new MediaSource();

answerer.addEventListener("datachannel", function(e) {

	var video = document.getElementsByTagName("video")[0];
	video.src = window.URL.createObjectURL(mediaSource);

	var channel = event.channel

	mediaSource.addEventListener('sourceopen', function(e) {
		var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
		sourceBuffer.addEventListener('updateend', function() {
		  	if (video.paused) {
				console.log("play")
				video.play();
			}
		});

		channel.onmessage = function(event) {
			if (!event.data) return
			sourceBuffer.appendBuffer(new Uint8Array(event.data));
		};

		var url = "http://localhost:8000/media/test.webm"
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.addEventListener("load", function(){
			sliceAndDice(new Uint8Array(xhr.response));
		})
		xhr.send();
	}, false);

})

var chunkLength = 45000;

function sliceAndDice(response) {
	var file = new Blob([response], {
		type: 'video/webm'
	})
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result
		var dataSent = 0;
		var charSlice = 1000;

		var rateLimiter = setInterval(function() {
			var slideEndIndex = dataSent + charSlice;
			if (slideEndIndex > file.size) {
				slideEndIndex = file.size;
			}
			offererDataChannel.send(data.slice(dataSent, slideEndIndex));
			dataSent = slideEndIndex;
			console.log(dataSent, file.size)
			if (dataSent + 1 >= file.size) {
				console.log("All data chunks sent.");
				offererDataChannel.send(0);
				clearInterval(rateLimiter);
			}
		}, 10);
	
	}
	reader.readAsArrayBuffer(file);
};
