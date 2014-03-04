var iceServers = {
    iceServers: [{
        url: 'stun:stun.l.google.com:19302'
    }]
};

//iceServers = null;

var dataConstrains = {
	reliable: false
};

var offerer = new webkitRTCPeerConnection(iceServers);
var answerer = new webkitRTCPeerConnection(iceServers),
answererDataChannel;

var offererDataChannel = offerer.createDataChannel('RTCDataChannel', dataConstrains);
offerer.onicecandidate = function (event) {
	// console.log(!event || !event.candidate, event)
    if (!event.candidate) return;
    answerer && answerer.addIceCandidate(event.candidate);
};
setChannelEvents(offererDataChannel, 'offerer');


offerer.createOffer(function (sessionDescription) {
	// console.log("offer", sessionDescription)
    offerer.setLocalDescription(sessionDescription);
	// create answer
    createAnswer(sessionDescription);
}, function(e){
	console.log("error", e)
});


function createAnswer(offerSDP) {
    
    answererDataChannel = answerer.createDataChannel('RTCDataChannel', dataConstrains);

    setChannelEvents(answererDataChannel, 'answerer');

    answerer.onicecandidate = function (event) {
       if (!event.candidate) return;
        offerer && offerer.addIceCandidate(event.candidate);
    };

    answerer.setRemoteDescription(offerSDP);
    answerer.createAnswer(function (sessionDescription) {
		//console.log("answer", sessionDescription)
        answerer.setLocalDescription(sessionDescription);
        offerer.setRemoteDescription(sessionDescription);
    }, function(e){
		console.log("error", e)
	});
}

function setChannelEvents(channel, channelNameForConsoleOutput) {
    channel.onmessage = function (event) {
        console.debug(channelNameForConsoleOutput, 'received a message:');
    };

    channel.onopen = function () {
        channel.send('first text message over RTP data ports');
    };
    channel.onclose = function (e) {
        console.error(e);
    };
    channel.onerror = function (e) {
        console.error(e);
    };
}