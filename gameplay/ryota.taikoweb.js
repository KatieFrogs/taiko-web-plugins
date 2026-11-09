export default class Plugin extends Patch {
    name = "Custom All Skin & Background (vRAINBOW)"
    version = "3.1"
    description = "Loads multiple custom dancer sheets and Taiko backgrounds"

    load() {
        window.customAssets = {
            dancer: [],
            runner: [],
            mob: [],
            loading: null,
            songbg: null,
            stage: null,
            donbg: null,
            drumroll: null
        };

        window.customAssetSelection = {
            dancer: null,
            runner: null,
            mob: null
        };

        this.originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        const plugin = this;

        // Load image files selected through the game's file picker.
        // Extract the supplied ZIP first, then select the PNG files.
        document.addEventListener("change", (e) => {
            const input = e.target;
            if (!input || !input.files || !input.files.length) return;

            for (const file of input.files) {
                const fname = file.name.toLowerCase();
                if (!/\.(png|jpe?g|webp)$/i.test(fname)) continue;

                if (fname.includes("dancer")) {
                    plugin.registerImage("dancer", file);
                } else if (fname.includes("runner")) {
                    plugin.registerImage("runner", file);
                } else if (fname.includes("mob")) {
                    plugin.registerImage("mob", file);
                } else if (fname.includes("loading")) {
                    plugin.registerImage("loading", file);
                } else if (fname.includes("top backgrounds") || fname.includes("songbg")) {
                    plugin.registerImage("songbg", file);
                } else if (fname.includes("bottom backgrounds") || fname.includes("stage")) {
                    plugin.registerImage("stage", file);
                } else if (fname.includes("donbg")) {
                    plugin.registerImage("donbg", file);
                } else if (fname.includes("drumroll effects") || fname.includes("drumroll")) {
                    plugin.registerImage("drumroll", file);
                } else if (fname.includes("fever characters") || fname.includes("chibi characters")) {
                    // These are character/background sheets, not confirmed as a
                    // drop-in replacement for the game's dancer/runner/mob sheets.
                    console.info("[Custom All Skin] Unassigned character sheet:", file.name);
                }
            }
        });

        // Replace the image argument as well as the source crop coordinates.
        // Crop coordinates are normalized to the replacement sheet dimensions.
        CanvasRenderingContext2D.prototype.drawImage = function (...args) {
            const original = args[0];
            if (original && (original.src || original.id)) {
                const key = String(original.id || original.src).toLowerCase();
                let type = null;

                if (key.includes("dancer")) type = "dancer";
                else if (key.includes("runner")) type = "runner";
                else if (key.includes("mob")) type = "mob";

                const replacement = type && window.customAssetSelection[type];
                if (replacement && replacement.img && original !== replacement.img) {
                    const oldW = original.naturalWidth || original.width;
                    const oldH = original.naturalHeight || original.height;
                    const newW = replacement.img.naturalWidth || replacement.img.width;
                    const newH = replacement.img.naturalHeight || replacement.img.height;

                    if (args.length >= 9 && oldW && oldH && newW && newH) {
                        args[1] = args[1] * newW / oldW;
                        args[2] = args[2] * newH / oldH;
                        args[3] = args[3] * newW / oldW;
                        args[4] = args[4] * newH / oldH;
                    }
                    args[0] = replacement.img;
                }
            }
            return plugin.originalDrawImage.apply(this, args);
        };

        // Apply page backgrounds when the corresponding elements appear.
        this.observer = new MutationObserver(() => {
            const loadSongDiv = document.getElementById("load-song");
            if (loadSongDiv && window.customAssets.loading) {
                this.applyDivBg(loadSongDiv, window.customAssets.loading.url);
            }

            const songBgDiv = document.getElementById("songbg");
            if (songBgDiv && window.customAssets.songbg) {
                this.applyDivBg(songBgDiv, window.customAssets.songbg.url);
                const l1 = document.getElementById("layer1");
                const l2 = document.getElementById("layer2");
                if (l1) l1.style.backgroundImage = "none";
                if (l2) l2.style.backgroundImage = "none";
            }

            const songStageDiv = document.getElementById("song-stage");
            if (songStageDiv && window.customAssets.stage) {
                this.applyDivBg(songStageDiv, window.customAssets.stage.url);
            }

            const donBgDiv = document.querySelector(".donbg");
            if (donBgDiv && window.customAssets.donbg) {
                this.applyDivBg(donBgDiv, window.customAssets.donbg.url);
                donBgDiv.querySelectorAll("div").forEach(d => d.style.backgroundImage = "none");
            }
        });

        if (document.body) {
            this.observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    registerImage(type, file) {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const entry = { img, url, name: file.name };

            if (type === "dancer" || type === "runner" || type === "mob") {
                window.customAssets[type].push(entry);
                // Select one at random now. The selected sheet remains active
                // until another file selection/reload changes the selection.
                window.customAssetSelection[type] =
                    window.customAssets[type][Math.floor(Math.random() * window.customAssets[type].length)];
            } else {
                if (window.customAssets[type] && window.customAssets[type].url) {
                    URL.revokeObjectURL(window.customAssets[type].url);
                }
                window.customAssets[type] = entry;
            }

            if (typeof assets !== "undefined" && assets.image &&
                (type === "dancer" || type === "runner" || type === "mob")) {
                for (const assetKey in assets.image) {
                    if (assetKey.toLowerCase().includes(type)) {
                        assets.image[assetKey] = img;
                    }
                }
            }

            console.info(`[Custom All Skin] Loaded ${type}: ${file.name}`);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.warn(`[Custom All Skin] Could not load image: ${file.name}`);
        };

        img.src = url;
    }

    applyDivBg(div, url) {
        const targetBg = `url("${url}")`;
        if (div.style.backgroundImage !== targetBg) {
            div.style.backgroundImage = targetBg;
            div.style.backgroundSize = "cover";
            div.style.backgroundPosition = "center";
            div.style.backgroundRepeat = "no-repeat";
        }
    }
}
