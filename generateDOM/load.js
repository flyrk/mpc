MPC.addEvent(window, 'load', function (W3CEvent) {
  var source = MPC.$('source').value;
  MPC.$('result').value = generateDOM(source);
});
