function p2pConnection(type, callback){
    this.signalingChannel = new SignalingChannel(function(){
        this.create(type, callback)
    }.bind(this));
}

p2pConnection.prototype.create = function(type, callback) {
    var self = this;
    var pc = new webkitRTCPeerConnection({
        iceServers: [{
            url: 'stun:stun.l.google.com:19302'
        }]
    });
    pc.channel = pc.createDataChannel('RTCDataChannel', {reliable: false});
    callback.call(this, pc);
    
    function gotDescription(sessionDescription){
        pc.setLocalDescription(sessionDescription, function() {
            self.signalingChannel.send(JSON.stringify({
                'sdp': pc.localDescription
            }));
        });
    }

    pc.onicecandidate = function(event) {
        if (!event.candidate) return;
        self.signalingChannel.send(JSON.stringify({
            'candidate': event.candidate
        }));
    };
    
    if (type == "answer") pc.createAnswer(gotDescription);
    else pc.createOffer(gotDescription);

    this.signalingChannel.onmessage = function(event) {
        var message = JSON.parse(event.data);
        // console.log(message)
        if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp), function() {
                if (pc.remoteDescription.type == 'offer') 
                    pc.createAnswer(gotDescription.bind(this))
            });
        }

        if (message.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    };
    

}



