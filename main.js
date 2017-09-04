MPC.log.writeRaw('This is a log message');

MPC.addEvent(document, 'keydown', function(W3CEvent) {
  var key = MPC.getKeyPressed(W3CEvent);
  MPC.log.write(key.code + ':' + key.value);
});
