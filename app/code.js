const { uIOhook, UiohookKey } = require("uiohook-napi");
const fs = require("fs");

var keymapInverted = {};
for (var keyName in UiohookKey) {
    var keyRaw = UiohookKey[keyName];
    keymapInverted[keyRaw] = keyName;
}

var remapping = JSON.parse(fs.readFileSync(__dirname + "/remap.json", "utf-8"));
for (var keyRaw in keymapInverted) {
    var keyName = keymapInverted[keyRaw];
    if (remapping[keyName]) keymapInverted[keyRaw] = remapping[keyName];
}
console.log(keymapInverted);