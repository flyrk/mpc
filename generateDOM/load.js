MPC.addEvent(window, 'load', function () {
  MPC.addEvent('generate', 'click', function (W3CEvent) {
    var source = MPC.$('source').value;
    MPC.$('result').value = generateDOM(source);
  });
  
});
