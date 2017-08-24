MPC.addEvent(window, 'load', function(W3CEvent) {
  function logit(W3CEvent) {
    switch(this.nodeType) {
      case MPC.node.DOCUMENT_NODE:
        MPC.log.write(W3CEvent.type + ' on document');
        break;
      case MPC.node.ELEMENT_NODE:
        MPC.log.write(W3CEvent.type + ' on box');
        break;
    }
  }

  MPC.addEvent(document, 'mousemove', logit);
  MPC.addEvent(document, 'mouseover', logit);
  MPC.addEvent(document, 'mouseout', logit);

  var box = document.getElementById('box');
  MPC.addEvent(box, 'mousemove', logit);
  MPC.addEvent(box, 'mouseover', logit);
  MPC.addEvent(box, 'mouseout', logit);
});