const { uIOhook, UiohookKey } = require("uiohook-napi");

var keymapInverted = {};
for (var keyName in UiohookKey) {
    var keyRaw = UiohookKey[keyName];
    keymapInverted[keyRaw] = keyName;
}
console.log(keymapInverted);