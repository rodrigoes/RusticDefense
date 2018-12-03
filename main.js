var canvas, ctx
var LARGURA
var ALTURA
var frames
var GAMEOVER
var animationFramID
var record

var enemies = []
var enemyID

var spawnEnemyIntervalID

var colors = ["red", "blue", "yellow", "green", "orange", "black"]

function clique(event) {
    enemies.forEach(enemy => {
        var dist = Math.hypot(target.x - enemy.posX, target.y - enemy.posY)
        
        if (dist < 1.5 * enemy.radius) {
            enemy.receiveDamage(weapon.damage)
           
        }
    });

    if (target.x >= tower.posX && target.x <= (tower.posX + (enemyStack.enemyRadius * 2)) &&
        target.y <= 480 && target.y > (460 - enemyStack.enemies.length * enemyStack.enemyRadius * 2)) {
        enemyStack.receiveDamage(weapon.damage)
        
    }
}

$(function () {
    createCanvas()
    drawInitialScreen()
})

function spawnEnemy() {
    enemies.push(new enemy(enemyID))

    enemyID++;
}

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

    clearInterval(spawnEnemyIntervalID)
    spawnEnemyIntervalID = setInterval(spawnEnemy, 1000) //1 segundos.

    //record = localStorage.getItem("record");
    /*
    if (record = null) {
        record = 0;
    }
    */
    run()
   
}

function inicializarVariaveis() {
    // Globais.
    frames = 0
    GAMEOVER = false

    enemyStack.reset();

    // Locais.
    enemies = []
    enemyID = 0;

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
    
    }
}

function update() {

    frames++
    target.update()
    enemies.forEach(enemy => enemy.update())
    enemyStack.update()
    score.update()

}

function draw() {

    drawBrackground()
    tower.draw()
    enemies.forEach(enemy => enemy.draw());
    enemyStack.draw()
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
        // Pega a posição do canvas
        var rect = canvas.getBoundingClientRect()

        // Posição relativa do cursor
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
    chao.draw()
}


var chao = {
    height: 150,
    //color: "#ffdf70",
    color: "#00cc66",
    draw: function () {

        var arvore = new Image() //Arvore.
        var nuvem  = new Image() //Nuvem.
        var sol    = new Image() //Sol.

        arvore.src = "img/arvore.png"
        nuvem.src  = "img/nuvem.png"
        sol.src    = "img/sol.png"

        ctx.fillStyle = this.color
                  // X, Y, Largura, Altura.
        ctx.fillRect(0, ALTURA - this.height, LARGURA, this.height)

        for (var i = 10; i <= 550; i += 110) {
            ctx.drawImage(arvore, i, 300, arvore.width * 0.2, arvore.height * 0.2)
        }

        ctx.drawImage(nuvem,100,100, nuvem.width * 0.09, nuvem.height * 0.09)
        ctx.drawImage(nuvem,300,30, nuvem.width * 0.09, nuvem.height * 0.09)
        ctx.drawImage(nuvem,400,160, nuvem.width * 0.09, nuvem.height * 0.09)
        ctx.drawImage(sol,440,5, sol.width * 0.8, sol.height * 0.8)
    }
}

class enemy {

    constructor(id) {
        this.id = id;
        this.radius = 17;
        this.posX = 30;
        this.posY = 460;
        this.speed = 13 + enemyStack.enemies.length;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 5;
        //Cores = ["red", "blue", "yellow", "green", "orange", "black"]
        if (this.color == "red") {
            this.life += 5;
        } else if (this.color === "blue") {
            this.life += 10;
        } else if (this.color == "yellow") {
            this.life += 15;
        } else if (this.color == "green") {
            this.life += 20;
        } else if (this.color == "orange") {
            this.life += 25;
        } else if (this.color == "black") {
            this.life += 35;
        }
    }


    update() {
        if (this.posX - this.radius < tower.posX) {
            this.posX += this.speed;
        }
        else {
            enemyStack.add(this)
            enemies = enemies.filter(e => e.id != this.id);
        }
    }

    draw() {
        // Desenha o circulo.
        ctx.beginPath()
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()

        // Contorno.
        ctx.lineWidth = 5
        ctx.strokeStyle = '#770000'
        ctx.stroke()
    }

    reset() {
        this.posX = 30
        this.life = 15// TODO atualizar vida
    }

    receiveDamage(damage) {
        if (this.life >= 0) {
            this.life -= damage
            return
        }

        enemies = enemies.filter(e => e.id != this.id);
    }
}

var enemyStack = {
    enemies: [],
    life: 0,
    attackValue: 1,
    enemyRadius: 17,

    update: function () {
        this.attack()
    },

    draw: function () {
        for (i = 0; i < this.enemies.length; i++) {
            // Desenha o circulo.
            ctx.beginPath()
            ctx.arc(tower.posX + this.enemyRadius, (460 - (i * this.enemyRadius * 2)), this.enemyRadius, 0, 2 * Math.PI, false)
            ctx.fillStyle = this.enemies[i].color;
            ctx.fill()

            // Contorno.
            ctx.lineWidth = 5
            ctx.strokeStyle = '#770000'
            ctx.stroke()
        }
    },

    add: function (enemy) {
        this.enemies.push(enemy)
        this.life += enemy.life
    },

    remove: function () {
        this.enemies.pop()
        
        },

    receiveDamage: function (damage) {
        this.life -= damage

        if (this.life < this.enemies.length * 15) {
            this.remove();
        }

        if (this.life < 0) this.life = 0;
    },

    attack: function () {
        if (towerLife.currentLife > 0) {
            towerLife.currentLife -= this.attackValue * this.enemies.length
        }
        else {
            GAMEOVER = true
        }
    },

    reset: function () {
        this.enemies = [];
        this.life = 0;
    }
}

var tower = {
    height: 300,
    color: "gray",
    posX: 380,

    draw: function () {

        var image = new Image() //Porta.
        var image2 = new Image() //Andares.
        var image3 = new Image() //escada.
       
        image.src = "img/peça1.png"
        image2.src = "img/peça2.png"
        image3.src = "img/escada-cutout.png"
        /*
        image.height *= 0.8
        image.width *= 0.8
        */


        // ctx.drawImage(image2, this.posX , ALTURA - 1.15 *  image.height,  image.width,  image.height)
        
        ctx.drawImage(image, this.posX, ALTURA - 2.15 * image2.height, image2.width, image2.height)

        var test = towerLife.currentLife / towerLife.totalLife;

        for (var i = 3.15; i <= 9.15 * test; i++) {
            ctx.drawImage(image2, this.posX, ALTURA - i * image2.height, image2.width, image2.height)
            
        }


        ctx.drawImage(image3, this.posX - 10, ALTURA - 1.13 * image3.height * 0.9, image3.width * 0.8, image3.height * 0.9)


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
    //Antes de fazer img de menu;.    // colorBottom: '#f3f3f3',
    // text: "BUILDING DEFENSE",
    // colorText: '#00bfff',

    draw: function () {
        // ctx.fillStyle = this.colorBottom
        // ctx.fillRect(0, 0, LARGURA, ALTURA)

        // ctx.font = '60px Impact'
        // ctx.fillStyle = this.colorText
        // ctx.fillText(this.text, 95, ALTURA / 2)

        var inicio = new Image()
        inicio.onload = function () {
            ctx.drawImage(inicio, 0, 0)
        }
        inicio.src = "img/inicio.png"
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
    },//Chamada no jogo.
    drawhite: function () {
        ctx.font = '60px Impact'
        ctx.fillStyle = "white"
        ctx.fillText('PONTOS: ' + this.score, 150, 180)
    }//Chamada no game over.


}

var towerLife = {
    totalLife: 10000,
    currentLife: 10000,
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
        
        this.totalLife = 10000
        this.currentLife = 10000

        if (this.score > record) {
            localStorage.setItem("record", this.score);
        }
        this.score = 0
    }

}

function drawGameOver() {
    gameOver.draw()
}

var gameOver = {
    colorBottom: '#4169E1', //tom de azul
    text: "GAME OVER!",
    colorText: '#EE4000',

    draw: function () {
        ctx.fillStyle = this.colorBottom
        ctx.fillRect(0, 0, LARGURA, ALTURA)
        var fim = new Image()
        fim.src = "img/gameoverpng.png"
        fim.onload = function () {
            ctx.drawImage(fim, 0, 150)
        }
        
    
    
        ctx.font = '100px Impact'
        ctx.fillStyle = this.colorText
        ctx.fillText(this.text, 65, 100)
        ctx.fillStyle = this.colorText
        score.drawhite();
    }

}
//#endregion

//#endregion