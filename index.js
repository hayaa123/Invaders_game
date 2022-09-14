const canvus = document.querySelector('canvas')
let c = canvus.getContext("2d")

canvus.width = innerWidth -10
canvus.height = innerHeight -10

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
         }


        this.rotation = 0 

        const image = new Image()
        image.src = "./assets/spaceship.png"
        image.onload = () => {

            let scale = 0.15
            this.image = image
            this.width = image.width *scale
            this.height = image.height *scale

            this.position = {
                x: canvus.width/2 -this.width/2,
                y: canvus.height-this.height -30
            }
        } // this function run when the image is loaded


    }
    draw() {

        
        // c.fillStyle = "red",
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)
        if (this.image) { // we put this if statment because when we do onload this will run before the attributes get added 
            c.save()
            c.translate(
                this.position.x +this.width /2,
                this.position.y +this.height/2      
                )
            c.rotate(this.rotation)
            c.translate(
                -this.position.x -this.width /2,
                -this.position.y -this.height/2      
                ) 
            c.drawImage(
                this.image,
                this.position.x, 
                this.position.y, 
                this.width, 
                this.height
                )
            c.restore()
        }
    }
    update(){
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
      
    }
}

class Projectile {
    constructor(position , velocity){
        this.position = position,
        this.velocity =velocity,


        this.raduis = 3
    }
    draw (){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.raduis,0, Math.PI*2)
        c.fillStyle = "red"
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
         }

        const image = new Image()
        image.src = "./assets/invader.png"
        image.onload = () => {

            let scale = 1
            this.image = image
            this.width = image.width *scale
            this.height = image.height *scale

            this.position = {
                x: canvus.width/2 -this.width/2,
                y: canvus.height /2
            }
        } // this function run when the image is loaded


    }
    draw() {

        
        // c.fillStyle = "red",
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)
        if (this.image) { // we put this if statment because when we do onload this will run before the attributes get added 
            c.drawImage(
                this.image,
                this.position.x, 
                this.position.y, 
                this.width, 
                this.height
                )
        }
    }
    update(){
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
      
    }
}

class Grid {
    constructor (){
       this.position = {
        x:0 , 
        y:0
       } 
       this.velocity = {
        x:0,
        y:0
       }
       this.invaders =[
        new Invader()
       ]
    }
}


let player1 = new Player()
let projectiles = []
let grid = [new Grid()]

// let invader = 

player1.draw()

// when we try to render the player in this way the image will not appear 
// because the draw function is runing before the image get loaded 
// so to solve this problem we can use animation
// we need the keys object to make sure that buttons are pressed or not 
const keys ={
    ArrowRight:{
        pressed :false
    },
    ArrowDown:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    space : {
        pressed:false
    }
    }

function animate() { // this do somthing like infinite loopp but without affecting memory 
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvus.width, canvus.height)
    player1.update()

    projectiles.forEach((projectile,index) =>{
        if (projectile.position.y+ projectile.raduis<=0){ // this called garbage collection so when projectile go out of the screen we will delete it 
            setTimeout(()=>{
                projectiles.splice(index,1)
            },0)
        }else{
            projectile.update() 
 
        }
    })
    

    if (keys.ArrowLeft.pressed && player1.position.x>=0){
        player1.velocity.x = -5 
        player1.rotation = - 0.5
    } 
    else if (keys.ArrowRight.pressed && player1.position.x <=canvus.width-player1.width){
        player1.velocity.x = 5
        player1.rotation =  0.5

    }
    
    
    else {
        player1.velocity.x= 0
        player1.rotation = 0

    }

}
animate()




// ArrowRight
// ArrowDown
// ArrowUp
// ArrowLeft
addEventListener("keydown",(e)=>{
    switch (e.key){
        case "ArrowLeft" :
            keys.ArrowLeft.pressed = true
            break
        case "ArrowRight" :
            keys.ArrowRight.pressed = true
            break
        case " ":
            projectiles.push(new Projectile({x:player1.position.x+ 0.5*player1.width ,y:player1.position.y},{x:0,y:-5}))

            break
    }
})

addEventListener("keyup",(e)=>{
    switch (e.key){
        case "ArrowLeft" :
            keys.ArrowLeft.pressed = false
            break
        case "ArrowRight" :
            keys.ArrowRight.pressed = false
            break
        case " ":
            console.log('space');
            break
    }
})

