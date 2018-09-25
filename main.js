var canvas, ctx
var LARGURA
var ALTURA
var frames = 0

function clique(event) {
    alert("Clicou")
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
}

function draw() {
    drawBrackground()
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
        ctx.fillStyle = this.color;
        ctx.fillRect(0, ALTURA - this.height, LARGURA, this.height)
    }
}


//#endregion