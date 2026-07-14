const { uIOhook, UiohookKey } = require("uiohook-napi");
const fs = require("fs");
const { Menu } = require("@electron/remote");

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

let keysPressed = new Set();

function displayKeys(keys=keysPressed) {
    console.log(keys)
    var keysContainer = document.querySelector("#keysContainer");
    keysContainer.innerHTML = "";
    var lastPlus = null;
    for (const keyName of keys) {
        var keyDiv = document.createElement("div");
        keyDiv.innerText = keyName;
        keyDiv.className = "keyDiv";
        if (keyName.length <= 1) keyDiv.style.width = "34px";
        else {
            keyDiv.style.width = "auto";
            keyDiv.style.padding = "0 10px";
        }
        keysContainer.appendChild(keyDiv);
        var plus = document.createElement("div");
        plus.innerText = "+";
        plus.className = "plus";
        keysContainer.appendChild(plus);
        lastPlus = plus;
    }
    if (lastPlus) lastPlus.remove();
}

uIOhook.on("keydown", (e) => {
    var keyName = keymapInverted[e.keycode];
    keysPressed.add(keyName);
    displayKeys();
});

uIOhook.on("keyup", (e) => {
    var keyName = keymapInverted[e.keycode];
    keysPressed.delete(keyName);
    displayKeys();
});

uIOhook.start();

window.addEventListener("contextmenu", (e) => {
    let menu = Menu.buildFromTemplate([
        {
            type: "submenu",
            label: "Theme",
            submenu: [
                {
                    label: "Default",
                    type: "radio",
                    checked: true,
                    click: () => {
                        document.querySelector("#keysContainer").setAttribute("data-theme", "default");
                    }
                },
                {
                    label: "Dark Slick",
                    type: "radio",
                    click: () => {
                        document.querySelector("#keysContainer").setAttribute("data-theme", "dark-slick");
                    }
                },
            ]
        }
    ]);
    menu.popup();
})