var p = new p2pConnection("offer", function(offerer){
    offerer.addEventListener("datachannel", function(e) {
        console.log("hi")
        var channel = event.channel;
        
        var chunkLength = 45000;
        var url = "http://localhost:8000/media/test.webm"
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener("load", function(){
        	sliceAndDice(new Uint8Array(xhr.response));
        })
        xhr.send();
        
        

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
        			channel.send(data.slice(dataSent, slideEndIndex));
        			dataSent = slideEndIndex;
        			console.log(dataSent, file.size)
        			if (dataSent + 1 >= file.size) {
        				console.log("All data chunks sent.");
        				channel.send(0);
        				clearInterval(rateLimiter);
        			}
        		}, 10);
        	}
        	reader.readAsArrayBuffer(file);
        };
    });
});
