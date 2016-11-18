cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "jpush-phonegap-plugin.JPushPlugin",
        "file": "plugins/jpush-phonegap-plugin/www/JPushPlugin.js",
        "pluginId": "jpush-phonegap-plugin",
        "clobbers": [
            "JPush"
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "pluginId": "cordova-sqlite-storage",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "id": "jpushServerPlugin.JpushServerPlugin",
        "file": "plugins/jpushServerPlugin/www/JpushServerPlugin.js",
        "pluginId": "jpushServerPlugin",
        "clobbers": [
            "JpushServer"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "1.1.3",
    "jpush-phonegap-plugin": "2.2.5",
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-sqlite-storage": "1.4.8",
    "cordova-plugin-console": "1.0.4",
    "jpushServerPlugin": "1.0.0"
};
// BOTTOM OF METADATA
});