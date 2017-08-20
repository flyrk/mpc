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

  function processNode(tabCount, refParent) {
    // 根据树的深度级别重复制表符
    var tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');
    // 确定节点类型并处理元素和节点
    switch(this.nodeType) {
      case MPC.node.ELEMENT_NODE:
        // 计数器+1并创建一个使用标签和计数器的值表示的新变量
        if (nodeNameCounters[this.nodeName]) {
          ++nodeNameCounters[this.nodeName];
        } else {
          nodeNameCounters[this.nodeName] = 1;
        }

        var ref = this.nodeName.toLowerCase() + nodeNameCounters[this.nodeName];
        // 添加到dom
        domCode += tabs
          + 'var '
          + ref
          + ' = document.createElement(\''
          + this.nodeName + '\');\n';
        // 添加新变量到列表中
        newVariables += '' + ref + ';\n';

        // 检查是否存在属性，是则循环遍历属性
        // 并用processAttribute遍历DOM树
        if (this.attribute) {
          for (var i = 0, len = this.attributes.length; i < len; i++) {
            MPC.walkTheDOMRecursive(
              processAttribute,
              this.attributes[i],
              tabCount,
              ref
            );
          }
        }
        break;
      case MPC.node.TEXT_NODE:
        // 检测文本中除了空白符之外的值
        var value = (this.nodeValue ? encode(this.nodeValue.trim()) : '');
        if (value) {
          // 计数器+1并创建一个使用txt和计数器的值表示的新变量
          if (nodeNameCounters['txt']) {
            ++nodeNameCounters['txt'];
          } else {
            nodeNameCounters['txt'] = 1;
          }

          var ref = 'txt' + nodeNameCounters['txt'];
          // 检查是否是$var格式的值
          value = checkForVariable(value);
          // 添加到dom
          domCode += tabs +
            'var ' +
            ref +
            ' = document.createTextNode(' +
            value + ');\n';
          // 添加新变量到列表中
          newVariables += '' + ref + ';\n';
        } else {
          return;
        }
        break;
      default:
        break;
    }
    // 添加将这个节点添加到其父节点的代码
    if (refParent) {
      domCode += tabs + refParent + '.appendChild(' + ref + ');\n';
    }
    return ref;
  }

  window['generateDOM'] = generate;
})();
