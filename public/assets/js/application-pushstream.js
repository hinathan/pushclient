
$(function(){

	PushStream.LOG_LEVEL = 'error';
	var pushstream = new PushStream({
		host: window.location.hostname,
		port: window.location.port,
		//	modes: "websockets|eventsource|stream",
		modes: "eventsource|longpolling",
	});
	pushstream.onrawmessage = function(event) {
		window.rawmessage(event)
	}
	pushstream.onstatuschange = _statuschanged;
	function _statuschanged(state) {}

	function _connect(channel) {
		pushstream.removeAllChannels();
		try {
			pushstream.addChannel(channel);
			pushstream.connect();
		} catch(e) {
			alert(e)
		};
	}
	window.pushstream = pushstream

	function guidGenerator() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	window.ref = guidGenerator()
	_connect(window.ref)
})