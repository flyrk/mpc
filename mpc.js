(function() {
  // MPC命名空间
  if (!window.MPC) {
    window['MPC'] = {};
  }
  function isCompatible(other) {  // 确定当前浏览器是否与整个库兼容
    // 使用能力检测来检查必要条件
    if (other === false
        || !Array.prototype.push
        || !Object.hasOwnProperty
        || !document.createElement
        || !document.getElementsByTagName
    ) {
      return false;
    }
    return true;
  }
  window['MPC']['isCompatible'] = isCompatible;

  function $() {
    var elements = new Array();
    // 查找作为参数提供的所有元素
    for (var i = 0; i < arguments.length; i++) {
      var element = arguments[i];
      // 如果该参数是一个字符串就假设它是一个id
      if (typeof element === 'string') {
        element = document.geElementById(element);
      }
      // 如果只有一个参数，
      // 则立即返回这个元素
      if (arguments.length === 1) {
        return element;
      }
      // 否则将它添加到数组中
      elements.push(element);
    }
    return elements;
  }
  window['MPC']['$'] = $;

  function addEvent(node, type, listener) {
    if (!isCompatible()) { return false; }    // 检查兼容性，保证平稳退化

    if (!(node = $(node))) { return false; }

    if (node.addEventListener) {  // W3C方法
      node.addEventListener( type, listener, false );
      return true;
    } else if (node.attachEvent) {    // IE方法
      node['e'+type+listener] = listener;
      node[type+listener] = function() {
        node['e'+type+listener](window.event);
      };
      node.attachEvent( 'on'+type, node[type+listener] );
      return true;
    }
    return false;
  }
  window['MPC']['addEvent'] = addEvent;

  function removeEvent(node, type, listener) {
    if (!(node = $(node))) { return false; }

    if (node.removeEventListener) {
      node.removeEventListener( type, listener, false );
      return true;
    } else if (node.detachEvent) {
      node.detachEvent( 'on'+type, node[type+listener] );
      node[type+listener] = null;
      return true;
    }
    return false;
  }
  window['MPC']['removeEvent'] = removeEvent;

  function getElementsByClassName(className, tag, parent) {
    parent = parent || document;
    if (!(parent = $(parent))) { return false; }  // 检查是否是DOM对象
    // 查找所有匹配的标签
    var allTags = (tag == '*' && parent.all) ? parent.all : parent.getElementsByTagName(tag);
    var matchingElements = new Array();
    // 正则表达式判断className是否正确
    className = className.replace(/\-/g, "\\-");
    var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");

    var element;
    for (var i = 0; i < allTags.length; i++) {
      element = allTags[i];
      if (regex.test(element.className)) {
        matchingElements.push(element);
      }
    }
    return matchingElements;
  }
  window['MPC']['getElementsByClassName'] = getElementsByClassName;

  function toggleDisplay(node, value) {
    if (!(node = $(node))) { return false; }

    if (node.style.display !== 'none') {
      node.style.display = 'none';
    } else {
      node.style.display = value || '';
    }
    return true;
  }
  window['MPC']['toggleDisplay'] = toggleDisplay;

  function insertAfter(node, referenceNode) {
    if (!(node = $(node))) { return false; }
    if (!(referenceNode = $(referenceNode))) { return false; }
    return referenceNode.parentNode.insertBefore( node, referenceNode.nextSibling);
  }
  window['MPC']['insertAfter'] = insertAfter;

  function removeChildren(parent) { // 删除所有子元素
    if (!(parent = $(parent))) { return false; }
    // 当存在子节点时删除该子节点
    while (parent.firstChild) {
      parent.firstChild.parentNode.removeChild(parent.firstChild);
    }
    return parent;
  }
  window['MPC']['removeChildren'] = removeChildren;

  function prependChild(parent, newChild) {   // 在队头插入子元素
    if (!(parent = $(parent))) { return false; }
    if (!(newChild = $(newChild))) { return false; }

    if (parent.firstChild) {    // 如果存在第一个子节点，则在这个子节点之前插入
      parent.insertBefore(newChild, parent.firstChild);
    } else {    // 如果没有子节点则直接添加
      parent.appendChild(newChild);
    }
    return parent;
  }
  window['MPC']['prependChild'] = prependChild;

  function bindFunction(obj, func) {    // 修改func的作用域为obj
    return function() {
      func.apply(obj, arguments);
    };
  }
  window['MPC']['bindFunction'] = bindFunction;

  function getBrowserWindowSize() {   // 获取浏览器窗口大小
    var de = document.documentElement;
    return {
      'width': (
        window.innerWidth
        || (de && de.clientWidth)
        || document.body.clientWidth
      ),
      'height': (
        window.innerHeight
        || (de && de.clientHeight)
        || document.body.clientHeight
      )
    };
  }
  window['MPC']['getBrowserWindowSize'] = getBrowserWindowSize;

})();
