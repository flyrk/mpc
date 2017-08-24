MPC.addEvent(window, 'load', function() {
  function modifiedAddEvent(obj, type, fn) {
    if (obj.addEventListener) { // W3C
      obj.addEventListener(type, fn, true); // 启用捕获阶段而取消冒泡阶段
    } else if (obj.attachEvent) {  // IE
      obj['e'+type+fn] = fn;
      obj[type+fn] = function() { obj['e'+type+fn](window.event)};
      obj.attachEvent('on'+type, obj[type+fn]);
    } else {
      return false;
    }
  }

  var count = 0;
  var lists = document.getElementsByTagName('ul');
  for (var i = 0, len = lists.length; i < len; i++) {
    modifiedAddEvent(lists[i], 'click', function() {
      var append = document.createTextNode(':' + count++);
      this.getElementsByTagName('p')[0].appendChild(append);
      this.className = 'clicked';
    });
  }
});