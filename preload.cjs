/**
 * preload.cjs — CommonJS bridge between main process and renderer.
 *
 * Exposes a minimal, typed API via contextBridge so the renderer never needs
 * direct access to Node or Electron internals.
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("iodispAPI", {
    /** Register a callback that fires whenever the pressed-key set changes. */
    onKeysUpdate(callback) {
        ipcRenderer.on("keys-update", (_event, keys) => callback(keys));
    },

    /** Register a callback that fires when the main process sets a theme. */
    onSetTheme(callback) {
        ipcRenderer.on("set-theme", (_event, theme) => callback(theme));
    },

    /** Ask the main process to show the context menu. */
    showContextMenu() {
        ipcRenderer.send("show-context-menu");
    },
});
