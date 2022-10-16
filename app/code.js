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
    else if (keyName.includes("Right")) keymapInverted[keyRaw] = keyName.replace("Right", "");
}
console.log(keymapInverted);

var keysPressed = {};

function displayKeys(keys=keysPressed) {
    var keysContainer = document.querySelector("#keysContainer");
    keysContainer.innerHTML = "";
    var lastPlus = null;
    for (var keyName in keys) {
        if (keys[keyName]) {
            var keyDiv = document.createElement("div");
            keyDiv.innerText = keyName;
            keyDiv.className = "keyDiv";
            keysContainer.appendChild(keyDiv);
            var plus = document.createElement("div");
            plus.innerText = "+";
            plus.className = "plus";
            keysContainer.appendChild(plus);
            lastPlus = plus;
        }
    }
    if (lastPlus) lastPlus.remove();
}

uIOhook.on("keydown", (e) => {
    var keyName = keymapInverted[e.keycode];
    keysPressed[keyName] = true;
    displayKeys();
});

uIOhook.on("keyup", (e) => {
    var keyName = keymapInverted[e.keycode];
    keysPressed[keyName] = false;
    displayKeys();
});

uIOhook.start();