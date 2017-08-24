MPC.addEvent(window, 'load', function (W3CEvent) {
  function logit(W3CEvent) {
    switch (this.nodeType) {
      case MPC.node.DOCUMENT_NODE:
        MPC.log.write(W3CEvent.type + ' on document');
        break;
      case MPC.node.ELEMENT_NODE:
        MPC.log.write(W3CEvent.type + ' on box');
        break;
    }
  }
  // 如果单击和释放鼠标之间拖动了鼠标指针，则不会触发click事件
  MPC.addEvent(document, 'mousedown', logit);
  MPC.addEvent(document, 'mouseup', logit);
  MPC.addEvent(document, 'click', logit);
  MPC.addEvent(document, 'dblclick', logit);

  var box = document.getElementById('box');
  MPC.addEvent(box, 'mousedown', logit);
  MPC.addEvent(box, 'mouseup', logit);
  MPC.addEvent(box, 'click', logit);
  MPC.addEvent(box, 'dblclick', logit);
});