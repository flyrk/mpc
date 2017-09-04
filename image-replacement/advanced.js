MPC.addEvent(window, 'load', function() {
  // achive title
  var header = MPC.$('advancedHeader');
  // create image element
  var image = document.createElement('IMG');
  // Add span and classname when image is loaded
  MPC.addEvent(image, 'load', function() {
    var s = document.createElement('SPAN');
    MPC.prependChild(header, s);
    
    if (!header.getAttribute('title')) {
      var i, child;
      var title = '';
      for (i = 0; child = header.childNodes[i]; i++) {
        if (child.nodeValue) {
          title += child.nodeValue;
        }
      }
      header.setAttribute('title', title);
    }
    header.className = 'advancED';
  });

  image.src = 'http://advanceddomscripting.com/images/advancED-replace.png';
});