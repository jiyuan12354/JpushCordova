cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
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
    "jpushServerPlugin": "1.0.0"
};
// BOTTOM OF METADATA
});