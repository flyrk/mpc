(function () {
  // MPC命名空间
  if (!window.MPC) {
    window['MPC'] = {};
  }

  function isCompatible(other) { // 确定当前浏览器是否与整个库兼容
    // 使用能力检测来检查必要条件
    if (other === false ||
      !Array.prototype.push ||
      !Object.hasOwnProperty ||
      !document.createElement ||
      !document.getElementsByTagName
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
        element = document.getElementById(element);
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
    if (!isCompatible()) {
      return false;
    } // 检查兼容性，保证平稳退化

    if (!(node = $(node))) {
      return false;
    }

    if (node.addEventListener) { // W3C方法
      node.addEventListener(type, listener, false);
      return true;
    } else if (node.attachEvent) { // IE方法
      node['e' + type + listener] = listener;
      node[type + listener] = function () {
        node['e' + type + listener](window.event);
      };
      node.attachEvent('on' + type, node[type + listener]);
      return true;
    }
    return false;
  }
  window['MPC']['addEvent'] = addEvent;

  function removeEvent(node, type, listener) {
    if (!(node = $(node))) {
      return false;
    }

    if (node.removeEventListener) {
      node.removeEventListener(type, listener, false);
      return true;
    } else if (node.detachEvent) {
      node.detachEvent('on' + type, node[type + listener]);
      node[type + listener] = null;
      return true;
    }
    return false;
  }
  window['MPC']['removeEvent'] = removeEvent;

  function addLoadEvent(loadEvent, waitForImages) {
    if (!isCompatible()) { return false; }
    // waitForImages标记是否要等待嵌入的图片全部载入完成
    // 如果为true则用常规方法添加事件
    if (waitForImages) {
      return addEvent(window, 'load', loadEvent);
    }
    // 否则包装loadEvent方法，为this关键字指定正确的内容
    // 确保事件不会被执行两次
    var init = function () {
      // 函数已经被调用过了则直接返回
      if (arguments.callee.done) return;
      // 标记是否运行过该函数
      arguments.callee.done = true;
      // 在document环境中运行loadEvent
      loadEvent.apply(document, arguments);
    };
    // 为DOMContentLoaded事件注册监听器
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', init, false);
    }
    // 对于Safari使用setInterval检测document是否载入完成
    if (/WebKit/i.test(navigator.userAgent)) {
      var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(_timer);
          init();
        }
      }, 10);
    }
    // 对于IE附加一个在载入过程最后执行的脚本
    // 并检测该脚本是否载入完成
    /*@cc_on @*/
    /*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = funciton() {
      if (this.readystate == "complete") {
        init();
      }
    };
    /*@end @*/
    return true;
  }
  window['MPC']['addLoadEvent'] = addLoadEvent;

  function getEventObject(W3CEvent) {
    return W3CEvent || window.event;
  }
  window['MPC']['getEventObject'] = getEventObject;

  function getTarget(eventObject) {
    eventObject = eventObject || getEventObject(eventObject);
    // W3C或MSIE模型
    var target = eventObject.target || eventObject.srcElement;
    // 如果像Safari中一样是一个文本节点
    // 则重新将目标对象指定为父元素
    if (target.nodeType === MPC.node.TEXT_NODE) {
      target = target.parentNode;
    }
    return target;
  }
  window['MPC']['getTarget'] = getTarget;

  function getMouseButton(eventObject) {
    eventObject = eventObject || getEventObject(eventObject);
    // 初始化buttons对象变量
    var buttons = {
      'left': false,
      'middle': false,
      'right': false
    };
    // 检查eventObject对象的toString方法的值
    // W3C DOM对象有toString方法且返回值是MouseEvent
    if (eventObject.toString && ~eventObject.toString().indexOf('MouseEvent')) {
      // W3C方法
      switch(eventObject.button) {
        case 0: 
          buttons.left = true;
          break;
        case 1:
          buttons.middle = true;
          break;
        case 2:
          buttons.right = true;
          break;
        default: 
          break;
      }
    } else if (eventObject.button) {
      // IE方法
      switch(eventObject.button) {
        case 1:
          buttons.left = true;
          break;
        case 2:
          buttons.right = true;
          break;
        case 3:
          buttons.left = true;
          buttons.right = true;
          break;
        case 4:
          buttons.middle = true;
          break;
        case 5:
          buttons.left = true;
          buttons.middle = true;
          break;
        case 6:
          buttons.middle = true;
          buttons.right = true;
          break;
        case 7:
          buttons.left = true;
          buttons.middle = true;
          buttons.right = true;
          break;
        default:
          break;
      }
    } else {
      return false;
    }
    return buttons;
  }
  window['MPC']['getMouseButton'] = getMouseButton;

  function getPointerPositionInDocument(eventObject) {
    eventObject = eventObject || getEventObject(eventObject);
    // 针对浏览器滚动后的位移属性
    // W3C使用document.documentElement.scrollTop
    // IE使用document.body.scrollTop
    // Safari把位置信息放在了pageX和pageY属性中
    var x = eventObject.pageX || (eventObject.clientX + 
        (document.documentElement.scrollLeft || document.body.scrollLeft));
    
    var y = eventObject.pageY || (eventObject.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop));
    
    return {'x': x, 'y': y};
  }
  window['MPC']['getPointerPositionInDocument'] = getPointerPositionInDocument;

  function getKeyPressed(eventObject) {
    eventObject = eventObject || getEventObject(eventObject);
    var code = eventObject.keyCode;
    var value = String.fromCharCode(code);
    return {'code': code, 'value': value};
  }
  window['MPC']['getKeyPressed'] = getKeyPressed;

  function getElementsByClassName(className, tag, parent) {
    parent = parent || document;
    if (!(parent = $(parent))) {
      return false;
    } // 检查是否是DOM对象
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

  function getClassNames(element) { // 取得包含元素类名的数组
    if (!(element = $(element))) {
      return false;
    }
    // 用一个空格替换多个空格，然后基于空格分割类名
    return element.className.replace(/\s+/, ' ').trim().split(' ');
  }
  window['MPC']['getClassNames'] = getClassNames;

  function hasClassName(element, className) { // 检查元素中是否存在某个类
    if (!(element = $(element))) {
      return false;
    }
    var classes = getClassNames(element);
    for (var i = 0, len = classes.length; i < len; i++) {
      if (classes[i] === className) {
        return true;
      }
    }
    return false;
  }
  window['MPC']['hasClassName'] = hasClassName;

  function addClassName(element, className) { // 给元素添加类
    if (!(element = $(element))) {
      return false;
    }
    // 将类名添加到当前className的末尾
    // 如果没有className，则不包含空格
    element.className += (element.className ? ' ' : '') + className;
    return true;
  }
  window['MPC']['addClassName'] = addClassName;

  function removeClassName(element, className) {  // 给元素删除类
    if (!(element = $(element))) {
      return false;
    }
    var classes = getClassNames(element);
    var len = classes.length;
    // 遍历数组删除匹配的classname
    // 因为数组长度会变化所以反向循环
    for (var i = len - 1; i >= 0; i--) {
      if (classes[i] === className) {
        classes.splice(i, 1);
      }
    }
    element.className = classes.join(' ');
    return (len === classes.length ? false : true);
  }
  window['MPC']['removeClassName'] = removeClassName;

  function setStyleById(element, styles) {
    if (!(element = $(element))) {
      return false;
    }

    for (property in styles) {
      if (!styles.hasOwnProperty(property)) continue;
      if (element.style.setProperty) {
        // DOM2样式规范方法
        element.style.setProperty(uncamelize(property, '-'), styles[property], null);
      } else {
        element.style[camelize(property)] = styles[property];
      }
    }
    return true;
  }
  window['MPC']['setStyle'] = setStyleById;
  window['MPC']['setStyleById'] = setStyleById;

  function setStylesByClassName(parent, tag, className, styles) {
    if (!(parent = $(parent))) {
      return false;
    }
    var elements = getElementsByClassName(className, tag, parent);
    for (var e = 0, len = elements.length; e < len; e++) {
      setStyleById(elements[e], styles);
    }
    return true;
  }
  window['MPC']['setStylesByClassName'] = setStylesByClassName;

  function setStylesByTagName(tagname, styles, parent) {
    parent = $(parent) || document;
    var elements = parent.getElementsByTagName(tagname);
    for (var e = 0, len = elements.length; e < len; e++) {
      setStyleById(elements[e], styles);
    }
  }
  window['MPC']['setStylesByTagName'] = setStylesByTagName;

  function toggleDisplay(node, value) {
    if (!(node = $(node))) {
      return false;
    }

    if (node.style.display !== 'none') {
      node.style.display = 'none';
    } else {
      node.style.display = value || '';
    }
    return true;
  }
  window['MPC']['toggleDisplay'] = toggleDisplay;

  function insertAfter(node, referenceNode) {
    if (!(node = $(node))) {
      return false;
    }
    if (!(referenceNode = $(referenceNode))) {
      return false;
    }
    return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
  }
  window['MPC']['insertAfter'] = insertAfter;

  function removeChildren(parent) { // 删除所有子元素
    if (!(parent = $(parent))) {
      return false;
    }
    // 当存在子节点时删除该子节点
    while (parent.firstChild) {
      parent.firstChild.parentNode.removeChild(parent.firstChild);
    }
    return parent;
  }
  window['MPC']['removeChildren'] = removeChildren;

  function prependChild(parent, newChild) { // 在队头插入子元素
    if (!(parent = $(parent))) {
      return false;
    }
    if (!(newChild = $(newChild))) {
      return false;
    }

    if (parent.firstChild) { // 如果存在第一个子节点，则在这个子节点之前插入
      parent.insertBefore(newChild, parent.firstChild);
    } else { // 如果没有子节点则直接添加
      parent.appendChild(newChild);
    }
    return parent;
  }
  window['MPC']['prependChild'] = prependChild;

  function bindFunction(obj, func) { // 修改func的作用域为obj
    return function () {
      func.apply(obj, arguments);
    };
  }
  window['MPC']['bindFunction'] = bindFunction;

  function getBrowserWindowSize() { // 获取浏览器窗口大小
    var de = document.documentElement;
    return {
      'width': (
        window.innerWidth ||
        (de && de.clientWidth) ||
        document.body.clientWidth
      ),
      'height': (
        window.innerHeight ||
        (de && de.clientHeight) ||
        document.body.clientHeight
      )
    };
  }
  window['MPC']['getBrowserWindowSize'] = getBrowserWindowSize;

  function stopPropagation(eventObj) {
    eventObject = eventObj || getEventObject(eventObject);
    if (eventObject.stopPropagation) {
      eventObject.stopPropagation();
    } else {
      eventObject.cancelBubble = true;
    }
  }
  window['MPC']['stopPropagation'] = stopPropagation;

  function preventDefault(eventObj) {
    eventObject = eventObj || getEventObject(eventObject);
    if (eventObject.preventDefault) {
      eventObject.preventDefault();
    } else {
      eventObject.returnValue = false;
    }
  }
  window['MPC']['preventDefault'] = preventDefault;

  function walkElementsLinear(func, node) {
    var root = node || window.document;
    var nodes = root.getElementsByTagName('*');
    for (var i = 0; i < nodes.length; i++) {
      func.call(nodes[i]);
    }
  }

  window['MPC']['walkElementsLinear'] = walkElementsLinear;

  function walkTheDOMRecursive(func, node, depth, returnedFromParent) {
    var root = node || window.document;
    var returnedFromParent = func.call(root, depth++, returnedFromParent);
    var node = root.firstChild;
    while (node) {
      walkTheDOMRecursive(func, node, depth, returnedFromParent);
      node = node.nextSibling;
    }
  }
  window['MPC']['walkTheDOMRecursive'] = walkTheDOMRecursive;

  function walkTheDOMWithAttributes(node, func, depth, returnedFromParent) {
    var root = node || window.document;
    returnedFromParent = func(root, depth++, returnedFromParent);
    if (root.attributes) {
      for (var i = 0; i < root.attributes.length; i++) {
        walkTheDOMWithAttributes(root, attributes[i], func, depth - 1, returnedFromParent);
      }
    }
    if (root.nodeType !== MPC.node.ATTRIBUTE_NODE) {
      node = root.firstChild;
      while (node) {
        walkTheDOMWithAttributes(node, func, depth, returnedFromParent);
        node = node.nextSibling;
      }
    }
  }

  window['MPC']['walkTheDOMWithAttributes'] = walkTheDOMWithAttributes;

  function camelize(s) { // 把word-word转换为worldWorld
    return s.replace(/-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
  }
  window['MPC']['camelize'] = camelize;

  function uncamelize(s, padding) {
    return s.replace(/[a-z]([A-Z])/g, function(strMatch, p1) {
      return '-' + p1.toLowerCase();
    });
  }
  window['MPC']['uncamelize'] = uncamelize;

  window['MPC']['node'] = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  };
})();

if (!String.repeat) {
  String.prototype.repeat = function (l) {
    return new Array(l + 1).join(this);
  };
}

if (!String.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}