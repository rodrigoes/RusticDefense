var canvas, ctx
var LARGURA
var ALTURA
var frames
var GAMEOVER

var animationFramID

function clique(event) {
    var dist = Math.hypot(target.x - enemy.posX, target.y - enemy.posY)

    if (dist < 1.5 * enemy.radius) {
        enemy.receiveDamage(weapon.damage)
    }
}

$(function () {
    createCanvas()
    drawInitialScreen()
})

function createCanvas() {
    
    //Atribui valores de altura e largura, caso a largura seja maior ou igual a 500,atribui valores definidos(550,600).
    ALTURA = window.innerHeight
    LARGURA = window.innerWidth
    
    
    if (LARGURA >= 500) {
        LARGURA = 600
        ALTURA = 550
    }


    canvas = document.createElement("canvas")
    canvas.width = LARGURA
    canvas.height = ALTURA 
 
    ctx = canvas.getContext("2d")//Elementos 2d.
    var jogoID = document.getElementById("jogo")
    jogoID.appendChild(canvas)

    document.addEventListener("mousedown", clique) //Clique.
}

function iniciar() {
    window.cancelAnimationFrame(animationFramID)
    inicializarVariaveis()

    run()
}

function inicializarVariaveis() {
    // Globais.
    frames = 0
    GAMEOVER = false

    // Locais.
    enemy.reset()
    towerLife.reset()

    cursor.start()
}

function run() {
    if (!GAMEOVER) {
        update()
        draw()
        animationFramID = window.requestAnimationFrame(run)
    }     
    else {
        drawGameOver()
        gameOver.saveData()
    }
}

function update() {
    frames++

    target.update()
    enemy.update()

    score.update()
}

function draw() {
    drawBrackground()

    tower.draw()
    enemy.draw()

    drawUI()
    target.draw()
}

var cursor = {
    x: -30,
    y: -30,

    start: function () {
        window.addEventListener('mousemove', function (e) {
            cursor.x = e.pageX
            cursor.y = e.pageY
        })
    }
}

var target = {
    x: -30,
    y: -30,
    radius: 2,

    update: function () {
        // Get the canvas position
        var rect = canvas.getBoundingClientRect()

        // Take the cursor relative position
        this.x = cursor.x - rect.left
        this.y = cursor.y - rect.top
    },

    //Cursor.
    draw: function () {
        // Desenha o circulo.
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)

        // Contorno.
        ctx.lineWidth = 5
        ctx.strokeStyle = '#ff6600'
        ctx.stroke()

        // Desenha o circulo
        ctx.beginPath()
        ctx.arc(this.x, this.y, 10 * this.radius, 0, 2 * Math.PI, false)

        // Contorno.
        ctx.lineWidth = 3
        ctx.strokeStyle = '#ff6600'
        ctx.stroke()
    }
}

var weapon = {
    damage: 5,
    cooldown: 0.25,
    bullets: 5,
    storage: 5,
    maxStorage: 15
}

//#region draws
function drawBrackground() {
    ctx.fillStyle = "#50beff"
    ctx.fillRect(0, 0, this.LARGURA, this.ALTURA)

    // Nuvem a implementar em outra função.
    //ctx.fillStyle = "white"
    //ctx.fillRect(200, 100, 100, 40)
    
    chao.draw()
}

var chao = {
    height: 150,
  //color: "#ffdf70",
    color: "#00cc66",
    draw: function () {
        ctx.fillStyle = this.color
        // X, Y, Largura, Altura.
        ctx.fillRect(0, ALTURA - this.height, LARGURA, this.height)
    }
} 

var enemy = {
    radius: 17,
    posX: 30,
    posY: 460,
    speed: 5,
    color: 'red',

    attack: 0.25,
    life: 15,

    update: function () {
        if (this.life <= 0) return

        if (this.posX - this.radius < tower.posX) {
            this.posX += this.speed
        }
        else {
            if (towerLife.currentLife > 0) {
                towerLife.currentLife -= this.attack
            }
            else {
                GAMEOVER = true
            }
        }
    },

    draw: function () {
        if (this.life <= 0) return
        // Desenha o circulo.
        ctx.beginPath()
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()

        // Contorno.
        ctx.lineWidth = 5
        ctx.strokeStyle = '#770000'
        ctx.stroke()
    },

    reset: function () {
        this.posX = 30
        this.life = 15
    },

    receiveDamage: function (damage) {
        if (this.life >= 0) {
            this.life -= damage
        }
    }
}

var tower = {
    height: 300,
    color: "gray",
    posX: 380,

    draw: function () {
        
        var image = new Image() //Porta.
        var image2 = new Image() //Andares.
        image.src = "img/peça1.png"
        image2.src = "img/peça2.png"
    
        /*
        image.height *= 0.8
        image.width *= 0.8
        */
               
       
      // ctx.drawImage(image2, this.posX , ALTURA - 1.15 *  image.height,  image.width,  image.height)
         ctx.drawImage(image,  this.posX, ALTURA  - 2.15 *  image2.height, image2.width, image2.height)
        
        for(var i=3.15;i<=9.15;i++){
        ctx.drawImage(image2, this.posX, ALTURA  - i *  image2.height, image2.width, image2.height)
        i
        }

        return

        /*
        ctx.fillStyle = this.color
        ctx.fillRect(this.posX, ALTURA - 1.1 * this.height, LARGURA - this.posX, this.height)

        // Contorno
        ctx.lineWidth = 7
        ctx.strokeStyle = '#050505'
        ctx.strokeRect(this.posX, ALTURA - 1.1 * this.height, LARGURA, this.height)
        */
    }
}

//#region UI
function drawInitialScreen() {
    initialScreen.draw()
}

var initialScreen = {
    colorBottom: '#1a1a1a',
    text: "BUILDING DEFENSE",
    colorText: '#00bfff',

    draw: function () {
        ctx.fillStyle = this.colorBottom
        ctx.fillRect(0, 0, LARGURA, ALTURA)

        ctx.font = '60px Impact'
        ctx.fillStyle = this.colorText
        ctx.fillText(this.text, 95, ALTURA / 2)
    }
}

function drawUI() {
    score.draw()
    towerLife.draw()
}

var score = {
    score: '0',
    colorText: 'black',

    update: function () {
        this.score = Math.round(frames / 10).toString()
    },

    draw: function () {
        ctx.font = '30px Impact'
        ctx.fillStyle = this.colorText
        ctx.fillText('PONTOS: ' + this.score, 15, 75)
    }
}

var towerLife = {
    totalLife: 100,
    currentLife: 100,
    colorStroke: 'black',
    colorFilled: '#00cc66', // Tom de verde.
    colorEmpty: '#ff4000',  // Tom de vermelho.
    posX: 15,

    draw: function () {
        // Vida vazia.
        ctx.fillStyle = this.colorEmpty
        ctx.fillRect(this.posX, 10, 350, 30)

        // Vida Cheia.
        ctx.fillStyle = this.colorFilled
        ctx.fillRect(this.posX, 10, this.currentLife / this.totalLife * 350, 30)

        // Contorno.
        ctx.lineWidth = 7
        ctx.strokeStyle = this.colorStroke
        ctx.strokeRect(this.posX, 10, 350, 30)
    },

    reset: function () {
        this.totalLife = 100
        this.currentLife = 100
    }
}

function drawGameOver() {
    gameOver.draw()
}

var gameOver = {
    colorBottom: 'black',
    text: "GAME OVER!",
    colorText: 'white',

    draw: function () {
        ctx.fillStyle = this.colorBottom
        ctx.fillRect(0, 0, LARGURA, ALTURA)

        ctx.font = '60px Impact'
        ctx.fillStyle = this.colorText
        ctx.fillText(this.text, 170, ALTURA / 2)
        ctx.fillStyle = this.colorText
        ctx.fillText('Pontos: ' + score, 170, ALTURA /4)
    },

}
//#endregion

//#endregion