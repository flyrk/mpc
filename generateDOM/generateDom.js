/* generateDOM对象命名空间 */
(function () {
  var domCode = '';
  var nodeNameCounters = [];
  var requireVariables = '';
  var newVariables = '';

  function encode(str) {
    if (!str) return null;
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/';'/g, "\\'");
    str = str.replace(/\s+^/mg, "\\n");
    return str;
  }

  function checkForVariable(v) {
    if (!~v.indexOf('$')) {
      v = '\'' + v + '\'';
    } else {
      v = v.substring(v.indexOf('$') + 1);
      requireVariables += 'var ' + v + ';\n';
    }
    return v;
  }

  function generate(strHTML, strRoot) {
    var domRoot = document.createElement('DIV');
    domRoot.innerHTML = strHTML;
    // 重制变量
    domCode = '';
    nodeNameCounters = [];
    requireVariables = '';
    newVariables = '';
    // 使用processNode处理domRoot中所有子节点
    var node = domRoot.firstChild;
    while(node) {
      MPC.walkTheDOMRecursive(processNode, node, 0, strRoot);
      node = node.nextSibling;
    }
    // 输出生成的代码
    domCode = '/* requireVariables in this code\n' + requireVariables + '*/\n\n'
      + domCode + '\n\n'
      + '/* new objects in this code\n' + newVariables + '*/\n\n';
    return domCode;
  }

  function processAttribute(tabCount, refParent) {}

  function processNode(tabCount, refParent) {}

  window['generateDOM'] = generate;
})();
