cordova.define("jpushServerPlugin.JpushServerPlugin", function(require, exports, module) {
var exec = require('cordova/exec');

exports.coolMethod = function(arg0, success, error) {
    exec(success, error, "JpushServerPlugin", "coolMethod", [arg0]);
};

var jpushServerFunc = function(){};
// arg1：成功回调
// arg2：失败回调
// arg3：将要调用类配置的标识
// arg4：调用的原生方法名
// arg5：参数，json格式

//arg3会在plugin.xml中config-file节点引用
jpushServerFunc.prototype.sendJpushMsg=function(alert,success, error) {
    exec(success, error, "JpushMessage", "sendJpushMsg", [alert]);
};

var showt = new jpushServerFunc();
module.exports = showt;

});
