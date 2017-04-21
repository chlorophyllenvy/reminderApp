cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-battery-status/www/battery.js",
        "id": "cordova-plugin-battery-status.battery",
        "clobbers": [
            "navigator.battery"
        ]
    },
    {
        "file": "plugins/cordova-plugin-battery-status/src/windows/BatteryProxy.js",
        "id": "cordova-plugin-battery-status.Battery",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/windows/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/src/windows/NotificationProxy.js",
        "id": "cordova-plugin-dialogs.NotificationProxy",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-app-event": "1.2.0",
    "cordova-plugin-battery-status": "1.2.3",
    "cordova-plugin-device": "1.1.5",
    "cordova-plugin-dialogs": "1.3.2",
    "cordova-plugin-whitelist": "1.3.2"
}
// BOTTOM OF METADATA
});