new p2pConnection("answer", function(answerer){

    answerer.addEventListener("datachannel", function(e) {
        
        var mediaSource = new MediaSource();
    	var video = document.getElementsByTagName("video")[0];
    	video.src = window.URL.createObjectURL(mediaSource);
    	mediaSource.addEventListener('sourceopen', function(e) {
    		var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    		sourceBuffer.addEventListener('updateend', function() {
    		  	if (video.paused) {
    				console.log("play")
    				video.play();
    			}
    		});
    		
            console.log("datachannel onmessage")
            // play video on datachannel message
    		answerer.channel.onmessage = function(event) {
    			if (!event.data) return
    			console.log("received")
    			sourceBuffer.appendBuffer(new Uint8Array(event.data));
    		};
    	}, false);
    });
});