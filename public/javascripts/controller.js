var mediaSource = new MediaSource();

answerer.addEventListener("datachannel", function(e) {

	var video = document.getElementsByTagName("video")[0];
	video.src = window.URL.createObjectURL(mediaSource);
	video.addEventListener('play', function(e) {
		console.log("play from video")
	});
	video.addEventListener('canplay', function(e) {
		console.log("canplay from video")
	});

	var channel = event.channel
	var queue = [];

	mediaSource.addEventListener('sourceopen', function(e) {
		var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
		sourceBuffer.addEventListener('updateend', function() {
		  /*if (queue.length) {
			console.log("play next chunk")
		    sourceBuffer.appendBuffer(queue.shift());
			if (video.paused) {
				console.log("play")
				video.play();
			}
		  }*/
			video.play()
		}, false);
		
		
		channel.onmessage = function(event) {
			if (event.data == "done") {
				sourceBuffer.appendBuffer(new Uint8Array(event.data));
				return
			}
			//sourceBuffer.appendBuffer(new Uint8Array(event.data));
			queue.push(new Uint8Array(event.data))
		};

		var url = "http://localhost:8000/big-buck-bunny_trailer.webm"
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.addEventListener("load", function(){
			sliceAndDice(new Uint8Array(xhr.response));
		})
		xhr.send();
		/*xhr.onreadystatechange = function(e) {
			if (this.readyState === 4 && this.status === 200) {
				sliceAndDice(new Uint8Array(xhr.response));
			}
		};*/
		
	}, false);

})

var chunkLength = 45000;

function sliceAndDice(response) {
	var file = new Blob([response], {
		type: 'video/webm'
	})
	var reader = new FileReader();
	reader.onload = function(e) {
		/*var data = e.target.result
		var dataSent = 0;
		var charSlice = 1000;

		var intervalID = setInterval(function() {
			var slideEndIndex = dataSent + charSlice;
			if (slideEndIndex > file.size) {
				slideEndIndex = file.size;
			}
			offererDataChannel.send(data.slice(dataSent, slideEndIndex));
			dataSent = slideEndIndex;
			console.log(dataSent, file.size)
			if (dataSent + 1 >= file.size) {
				console.log("All data chunks sent.");
				offererDataChannel.send("done");
				//mediaSource.endOfStream();
				clearInterval(intervalID);
			}
		}, 20);*/
		mediaSource.sourceBuffers[0].appendBuffer(new Uint8Array(e.target.result))
		
	}
	reader.readAsArrayBuffer(file);
};
