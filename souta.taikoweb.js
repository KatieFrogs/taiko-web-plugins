/*
 * taikoweb.js — Taiko Web random performance asset selector
 * Target: Taiko Web fork represented by the supplied taiko-main.zip
 *
 * Selects one dancer (1-2), one runner (1-15), one mob (1), and one
 * background set (1-8) whenever a Game instance is initialized.
 * It deliberately uses the target game's existing AssetLoader and image
 * paths; it does not replace or bundle sprite sheets whose frame maps are
 * not present in the supplied archive.
 */

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default class TaikoWebRandomPerformanceAssets {
  constructor() {
    this.originalInit = null;
    this.patchedInit = null;
    this.lastSelection = null;
  }

  start() {
    if (typeof Game === "undefined" || !Game.prototype || typeof Game.prototype.init !== "function") {
      throw new Error("TaikoWebRandomPerformanceAssets: Game.prototype.init was not found. This plugin requires the matching Taiko Web source build.");
    }
    if (this.originalInit) return;

    this.originalInit = Game.prototype.init;
    const plugin = this;
    this.patchedInit = function(controller, selectedSong, songData) {
      if (songData) {
        if (!songData.attributes || typeof songData.attributes !== "object") {
          songData.attributes = {};
        }
        const selection = {
          dancer: String(randomInt(1, 2)),
          runner: String(randomInt(1, 15)),
          mob: "1",
          bg: String(randomInt(1, 8))
        };
        plugin.lastSelection = selection;
        Object.assign(songData.attributes, selection);
        console.info("[taikoweb.js] Selected performance assets:", selection);
      }
      return plugin.originalInit.apply(this, arguments);
    };

    Game.prototype.init = this.patchedInit;
  }

  stop() {
    if (this.originalInit && typeof Game !== "undefined" && Game.prototype.init === this.patchedInit) {
      Game.prototype.init = this.originalInit;
    }
    this.originalInit = null;
    this.patchedInit = null;
  }

  unload() {
    this.stop();
    this.lastSelection = null;
  }
}
