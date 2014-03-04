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

/*
var pc1, pc2, sendChannel, receiveChannel, pcConstraint, dataConstraint;

function createConnection() {
	var servers = null;
	pcConstraint = null;
	dataConstraint = null;

	console.log('Using SCTP based Data Channels');

	// pcConstraint = {optional: [{RtpDataChannels: true}]};

	pc1 = new webkitRTCPeerConnection(servers, pcConstraint);
	console.log('Created local peer connection object pc1');

	try {
		// Data Channel api supported from Chrome M25. 
		// You might need to start chrome with  --enable-data-channels flag.
		sendChannel = pc1.createDataChannel("sendDataChannel", dataConstraint);
		console.log('Created send data channel');
	} catch (e) {
		alert('Failed to create data channel. ' + 'You need Chrome M25 or later with --enable-data-channels flag');
		console.log('Create Data channel failed with exception: ' + e.message);
	}
	pc1.onicecandidate = iceCallback1;
	sendChannel.onopen = onSendChannelStateChange;
	sendChannel.onclose = onSendChannelStateChange;

	pc2 = new webkitRTCPeerConnection(servers, pcConstraint);
	console.log('Created remote peer connection object pc2');

	pc2.onicecandidate = iceCallback2;
	//pc2.ondatachannel = receiveChannelCallback;

	pc1.createOffer(gotDescription1, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
	console.log('Failed to create session description: ' + error.toString());
}


function closeDataChannels() {
	console.log('Closing data Channels');
	sendChannel.close();
	receiveChannel.close();
	pc1.close();
	pc2.close();
	pc1 = null;
	pc2 = null;
	console.log('Closed peer connections');

}

function gotDescription1(desc) {
	pc1.setLocalDescription(desc);
	console.log('Offer from pc1 \n' + desc.sdp);
	pc2.setRemoteDescription(desc);
	pc2.createAnswer(gotDescription2, onCreateSessionDescriptionError);
}

function gotDescription2(desc) {
	pc2.setLocalDescription(desc);
	console.log('Answer from pc2 \n' + desc.sdp);
	pc1.setRemoteDescription(desc);
}

function iceCallback1(event) {
	console.log('local ice callback');
	if (event.candidate) {
		pc2.addIceCandidate(event.candidate, onAddIceCandidateSuccess, onAddIceCandidateError);
		console.log('Local ICE candidate: \n' + event.candidate.candidate);
	}
}

function iceCallback2(event) {
	console.log('remote ice callback');
	if (event.candidate) {
		pc1.addIceCandidate(event.candidate, onAddIceCandidateSuccess, onAddIceCandidateError);
		console.log('Remote ICE candidate: \n ' + event.candidate.candidate);
	}
}

function onAddIceCandidateSuccess() {
	console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
	console.log('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
	console.log('Receive Channel Callback');
	receiveChannel = event.channel;
	//receiveChannel.onmessage = onReceiveMessageCallback;
	receiveChannel.onopen = onReceiveChannelStateChange;
	receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
	console.log('Received Message');
}

function onSendChannelStateChange() {
	var readyState = sendChannel.readyState;
	console.log('Send channel state is: ' + readyState);
}

function onReceiveChannelStateChange() {
	var readyState = receiveChannel.readyState;
	console.log('Receive channel state is: ' + readyState);
}

createConnection();*/
