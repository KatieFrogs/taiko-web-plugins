export default class Plugin extends Patch {
    constructor(...args) {
        super(...args)
        this.name = "Ryota Custom Taiko Assets"
        this.version = "26.11.12"
        this.description = "本体リポジトリの画像を一括適用（iPhone/PC対応）"
        this.author = "ryota031554-bot"

        const base = "https://githubusercontent.com"

        this.urls = {
            bg:     base + "songbg.png.png",
            stage:  base + "stage.png.png",
            runner: base + "runner.png.png",
            mob:    base + "mob.png.png",
            d1:     base + "dancer.png.png",
            d2:     base + "dancer.png.png",
            d3:     base + "dancer.png.png"
        }

        this.imgs = {}
    }

    load() {
        for (const [k, u] of Object.entries(this.urls)) {
            const img = new Image()
            img.onload = () => { this.imgs[k] = img }
            img.onerror = () => { console.warn("画像読み込み失敗:", k, u) }
            img.src = u
        }

        this.addEdits(
            new EditFunction(View.prototype, "refresh").load(str =>
                str + `\n${this.getName()}.draw(this.ctx, this);`
            )
        )
    }

    draw(ctx, view) {
        if (!ctx || !ctx.canvas) return
        const dpr = window.devicePixelRatio || 1
        const w = view.width || (ctx.canvas.width / dpr) || 1280
        const h = view.height || (ctx.canvas.height / dpr) || 720
        const t = Math.floor(performance.now() / 150) % 4
        const s = Math.max(Math.min(w / 1280, h / 720), 0.35)

        this.slice(ctx, this.imgs.bg, 0, 2, 4, 12, 0, h * 0.4, w, h * 0.6, true)
        this.slice(ctx, this.imgs.stage, 1, 2, 13, 18, 0, 0, w, h * 0.25, true)

        const rx = ((performance.now() / 12) % (w + 200)) - 100
        this.slice(ctx, this.imgs.runner, t, 10, 0, 3, rx, h * 0.04, 150 * s, 150 * s, false)

        this.slice(ctx, this.imgs.d2, t, 8, 0, 12, w * 0.22, h * 0.50, 160 * s, 160 * s, false)
        this.slice(ctx, this.imgs.d1, t, 8, 0, 12, w * 0.44, h * 0.53, 160 * s, 160 * s, false)
        this.slice(ctx, this.imgs.d3, t, 8, 0, 12, w * 0.66, h * 0.50, 160 * s, 160 * s, false)

        const jy = (t % 2 === 1) ? -12 * s : 0
        for (let i = 0; i < 8; i++) {
            const mx = (w / 9) * (i + 1) - (50 * s)
            this.slice(ctx, this.imgs.mob, t, 8, 0, 50, mx, h * 0.78 + jy, 100 * s, 100 * s, false)
        }
    }

    slice(ctx, img, cx, tx, cy, ty, dx, dy, dw, dh, isBg) {
        if (!img || !img.complete || img.naturalWidth === 0) return
        const cw = img.naturalWidth / tx
        const ch = img.naturalHeight / ty
        const sx = (cx % tx) * cw
        const sy = (cy % ty) * ch
        if (sx + cw > img.naturalWidth || sy + ch > img.naturalHeight) return
        ctx.save()
        if (isBg) ctx.globalCompositeOperation = "destination-over"
        ctx.drawImage(img, sx, sy, cw, ch, dx, dy, dw, dh)
        ctx.restore()
    }
}
