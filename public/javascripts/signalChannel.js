function SignalingChannel(callback){
    this.signalingServer = new WebSocket("ws://the-messanger.herokuapp.com/negotiator/123");
    this.signalingServer.addEventListener("open", callback);
    this.signalingServer.addEventListener("message", function(e){
        if(this.onmessage) this.onmessage(e);
    }.bind(this));
}

SignalingChannel.prototype.send = function(data) {
    this.signalingServer.send(data)
}