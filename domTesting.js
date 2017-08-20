MPC.addEvent(window, 'load', function() {
  MPC.log.header('Get Safari href attribute');
  var safariAnchor = document.getElementById('safari');
  var href = safariAnchor.getAttribute('href');
  MPC.log.write(href);

  MPC.log.header('Get all browserList elements by tag name');
  var list = document.getElementById('browserList');
  var ancestors = list.getElementsByTagName('*');
  for (var i = 0; i < ancestors.length; i++) {
    MPC.log.write(ancestors.item(i).nodeName);
  }
});
