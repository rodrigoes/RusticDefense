var canvas, ctx
var LARGURA
var ALTURA
var frames = 0

function clique(event) {

}

function main() {
    ALTURA = window.innerHeight
    LARGURA = window.innerWidth

    if (LARGURA >= 500) {
        LARGURA = 600
        ALTURA = 600
    }

    canvas = document.createElement("canvas")
    canvas.width = LARGURA
    canvas.height = ALTURA

    ctx = canvas.getContext("2d")
    document.body.appendChild(canvas)
    document.addEventListener("mousedown", clique)

    run();
}

function run() {
    update();
    draw();

    window.requestAnimationFrame(run)
}

function update() {
    frames++

    enemy.update()
}

function draw() {
    drawBrackground()

    tower.draw()
    enemy.draw()
}

//#region draws

function drawBrackground() {
    ctx.fillStyle = "#50beff"
    ctx.fillRect(0, 0, this.LARGURA, this.ALTURA)
    chao.draw()

}

var chao = {
    height: 150,
    color: "#ffdf70",

    draw: function () {
        ctx.fillStyle = this.color
        ctx.fillRect(0, ALTURA - this.height, LARGURA, this.height)
    }
}

var enemy = {
    radius: 25,
    posX: 30,
    posY: 460,
    speed: 5,
    color: 'red',

    update: function () {
        if (this.posX + 2 * this.radius < tower.posX) {
            this.posX += this.speed
        }
    },

    draw: function () {
        // Desenha circulo
        ctx.beginPath()
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()

        // Contorno
        ctx.lineWidth = 7
        ctx.strokeStyle = '#770000'
        ctx.stroke()
    }
}

var tower = {
    height: 250,
    color: "gray",
    posX: 450,

    draw: function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.posX, ALTURA - 1.1 * this.height, LARGURA, this.height)

        // Contorno
        ctx.lineWidth = 7
        ctx.strokeStyle = '#050505'
        ctx.strokeRect(this.posX, ALTURA - 1.1 * this.height, LARGURA, this.height)
    }
}

//#endregion