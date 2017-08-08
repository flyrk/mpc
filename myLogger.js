function myLogger(id) {
  id = id || 'MPCLogWindow';
  var logWindow = null;
  var createWindow = function () {
    // 获得新窗口在浏览器中居中放置的左上角位置
    var browserWindowSize = MPC.getBrowserWindowSize();
    var top = ((browserWindowSize.height - 200) / 2) || 0;
    var left = ((browserWindowSize.width - 200) / 2) || 0;
    // 创建作为日志窗口的DOM点
    // 使用受保护的logWindow属性维护引用
    logWindow = document.createElement('ul');
    // 指定ID
    logWindow.setAttribute('id', id);
    // 在屏幕中居中定位日志窗口
    logWindow.style.position = 'absolute';
    logWindow.style.top = top + 'px';
    logWindow.style.left = left + 'px';
    // 设置固定大小，允许窗口内容滚动
    logWindow.style.width = '200px';
    logWindow.style.height = '200px';
    logWindow.style.overflow = 'scroll';
    // 添加样式
    logWindow.style.padding = '0';
    logWindow.style.margin = '0';
    logWindow.style.border = '1px solid black';
    logWindow.style.backgroundColor = 'white';
    logWindow.style.listStyle = 'none';
    logWindow.style.font = '10px/10px Verdana, Tahoma, Sans';

    document.body.appendChild(logWindow);
  };
  this.writeRaw = function (message) {
    if (!logWindow) {
      createWindow();
    }
    // 创建列表项
    var li = document.createElement('li');
    li.style.padding = '2px';
    li.style.border = '0';
    li.style.borderBottom = '1px dotted black';
    li.style.margin = '0';
    li.style.color = '#000';
    li.style.font = '9px/9px Verdana, Tahoma, Sans';
    // 为日志节点添加信息
    if (typeof message === 'undefined') {
      li.appendChild(document.createTextNode('Message was undefined'));
    } else if (typeof li.innerHTML !== undefined) {
      li.innerHTML = message;
    } else {
      li.appendChild(document.createTextNode(message));
    }

    logWindow.appendChild(li);
    return true;
  };
}

myLogger.prototype = {
  write: function (message) {
    // message为空则发出警告
    if (typeof message === 'string' && message === '') {
      return this.writeRaw('MPC.log: null message');
    }
    // 如果message不是字符串，则尝试调用toString()方法
    // 如果不存在则记录对象类型
    if (typeof message !== 'string') {
      if (message.toString) {
        return this.writeRaw(message.toString());
      } else {
        return this.writeRaw(typeof message);
      }
    }
    // 转换<和>以便innerHTML不会将message作为HTML解析
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return this.writeRaw(message);
  },
  header: function (message) {  // 向日志中写入一个标题
    message = '<span style="color: white; background-color: #15e1ee; font-weight: bold; padding: 0px 5px;">'
      + message + '</span>';
    return this.writeRaw(message);
  }
};

if (!window.MPC) {
  window.MPC = {};
}
window['MPC']['log'] = new myLogger();
