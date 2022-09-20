const canvus = document.querySelector('canvas')
let c = canvus.getContext("2d")
let scoreEl = document.getElementById("score-el")
let powerElFill = document.getElementById('power-el-fill')

canvus.width = 1024
canvus.height = 576

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
         }


        this.rotation = 0 
        this.opacity = 1
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
            c.globalAlpha = this.opacity
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
            this.position.y += this.velocity.y
        }
      
    }
}

class Projectile {
    constructor(position , velocity,raduis=3,type="normal"){
        this.position = position,
        this.velocity =velocity,

        this.type = type
        this.raduis = raduis
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

class Particle {
    constructor(position , velocity,raduis,color,fade=true){
        this.position = position,
        this.velocity =velocity,


        this.raduis =raduis
        this.color = color 
        this.opacity = 1
        this.fade = fade
    }
    draw (){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.raduis,0, Math.PI*2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fade){
            this.opacity  -= 0.01
        }
    }
}

class InvaderProjectile {
    constructor(position , velocity){
        this.position = position,
        this.velocity =velocity,
        this.width = 3
        this.height = 10
        
    }
    draw (){
       c.fillStyle="white"
       c.fillRect(this.position.x , this.position.y , this.width,this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    
}

class Invader {
    constructor(position) {
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
                x: position.x,
                y: position.y
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
    update(velocity){
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
      
    }

    shoot(InvaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile (
            {
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            {
                x:0,
                y:5
            }
        ))
    }
}

class Grid {
    constructor (){
       this.position = {
        x:0 , 
        y:0
       } 
       this.velocity = {
        x:3,
        y:0
       }
       this.invaders =[]
       const rows = Math.floor(Math.random() *5+2)
       const col = Math.floor(Math.random() *5+5)

        this.width = col*30
       for(let i=0; i<col ;i++ ){
        for(let j=0; j<rows ;j++ ){

            this.invaders.push(new Invader({
                x:i*30,
                y:j*30
            }))
        }
       }
    }
    update(){
        this.position.x += this.velocity.x,
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if (this.position.x +this.width >= canvus.width){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
        if (this.position.x <= 0){
            this.velocity.y = 30
            this.velocity.x = -this.velocity.x
        }
    
    }

}


let player1 = new Player()
let projectiles = []
let grid = []
let invaderProjectiles =[]
let particles =[]
let game = {
    over :false ,
    active :true 
}

let score = 0
let power = 0





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
    },
    alt:{
        pressed:false

    }
    }


let frames = 0

for (let i =0; i<30; i++){

    particles.push(new Particle(
        {
            x: Math.random()*canvus.width,
            y: Math.random()*canvus.height
        },
        {
            x:0,
            y:0.3 
        },
        Math.random()*2,
        'white',
        false
    ))

}


let createParticles =(obj,color)=>{
    for (let i =0; i<15; i++){

        particles.push(new Particle(
            {
                x: obj.position.x + obj.width/2,
                y: obj.position.y + obj.height/2
            },
            {
                x:(Math.random()*-0.5)*2,
                y:(Math.random()-0.5)*2 // gives a value from -1 to 1 
            },
            Math.random()*3,
            color||'#BAA0DE'
        ))

    }
}


function animate() { // this do somthing like infinite loopp but without affecting memory 
    if (!game.active) {
        c.save()
        c.globalAlpha = 0.7
        c.fillStyle="black"
        c.fillRect(0,0,canvus.width,canvus.height)
        c.restore()
        
        c.font = "50px Arial";
        c.fillText("Game Over", canvus.width/2 -150  , canvus.height/2 -30 );        
        return 
    }    
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvus.width, canvus.height)
    player1.update()
    particles.forEach((particle,par_index) =>{
        if (particle.position.y - particle.raduis >=canvus.height){
            particle.position.y = -particle.raduis
            particle.position.x = Math.random()*canvus.width
        }
        
        
        if (particle.opacity <= 0){
            particles.splice(par_index,1)
        }else{
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile,ip_index)=>{
        if (invaderProjectile.position.y +invaderProjectile.height >= canvus.height){
            setTimeout(
                ()=>invaderProjectiles.splice(ip_index,1)
            ,0)

        }
        else(
            invaderProjectile.update()
        )

        if (
            invaderProjectile.position.x <= player1.position.x+player1.width
            &&
            invaderProjectile.position.x + invaderProjectile.width >= player1.position.x
            &&
            invaderProjectile.position.y +invaderProjectile.height >= player1.position.y
            && 
            invaderProjectile.position.y< player1.position.y +player1.height
            ){
                setTimeout(()=>{
                    invaderProjectiles.splice(ip_index,1)
                    player1.opacity = 0
                    game.over = true
                },0)
                setTimeout(() => {
                    game.active = false
                },2000);
                console.log("you lose");
                createParticles(player1,'white')
            }
    })

    projectiles.forEach((projectile,index) =>{
        if (projectile.position.y+ projectile.raduis<=0){ // this called garbage collection so when projectile go out of the screen we will delete it 
            setTimeout(()=>{
                projectiles.splice(index,1)
            },0)
        }else{
            projectile.update() 
 
        }
    }
    
    
    )
    


    grid.forEach((grid,g_index)=>{
        grid.update()
        // spawning Invader shoots  
        if (frames %100 ==0 && grid.invaders.length>0){
           
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader,i_index) => {
            invader.update(grid.velocity)

            projectiles.forEach((projectile, p_index) =>{
                if (projectile.position.y - projectile.raduis <= invader.position.y+invader.height
                    &&
                    projectile.position.x - projectile.raduis >= invader.position.x 
                    && 
                    projectile.position.x +projectile.raduis <= invader.position.x + invader.width
                    && 
                    projectile.position.y +projectile.raduis >= invader.position.y  
                    ){

                    
                    setTimeout(()=>{
                        const invaderFound = grid.invaders.find(
                            invader2 => invader2 == invader
                        )
                        const projectileFound = projectiles.find(
                            projectile2 => projectile2 == projectile
                        )
                        if (invaderFound && projectileFound){
                            createParticles(invader)
                            score +=100
                            power +=10
                            scoreEl.innerHTML = score
                            if (power <= 100){
                                powerElFill.style.width = `${power}px`
                            }
                            if (power>=100)  {
                                powerElFill.style.boxShadow = "0px 0px 20px yellow"
                            }
                            grid.invaders. splice(i_index,1)
                            if (projectile.type =="normal"){
                                projectiles.splice(p_index,1)
                            }
                            if (grid.invaders.length >0 ){
                                let firstInvader = grid.invaders[0]
                                let lastInvader = grid.invaders[grid.invaders.length -1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + invader.width
                                grid.position.x = firstInvader.position.x
                            }
                            else{
                                grid.splice(g_index,1)
                            }
                        } 
                        // grid.invaders. splice(i_index,1)
                        // projectiles.splice(p_index,1)
                    })
                }

            })
        });
    })

    if (keys.ArrowLeft.pressed && player1.position.x>=0){
        player1.velocity.x = -5 
        player1.rotation = - 0.5
    } 
    else if (keys.ArrowRight.pressed && player1.position.x <=canvus.width-player1.width){
        player1.velocity.x = 5
        player1.rotation =  0.5

    }

    else if (keys.ArrowUp.pressed && player1.position.y >= 0){
        player1.velocity.y = -5
    }
    else if (keys.ArrowDown.pressed && player1.position.y + player1.height <= canvus.height){
        console.log(
           "hi" 
        );
        player1.velocity.y = +5
    }
    
    
    else {
        player1.velocity.x= 0
        player1.rotation = 0
        player1.velocity.y =0
    }
    let randomInterval = Math.floor(Math.random() *500) + 500

    //  spawning monesters 
    if (frames % randomInterval===0){
        grid.push(new Grid())
        let randomInterval = Math.floor(Math.random() *500) + 500
    }



    frames++
}
animate()




// ArrowRight
// ArrowDown
// ArrowUp
// ArrowLeft
addEventListener("keydown",(e)=>{
    if (game.over) return
    console.log(e.key);
    switch (e.key){
        case "ArrowLeft" :
            keys.ArrowLeft.pressed = true
            break
        case "ArrowRight" :
            keys.ArrowRight.pressed = true
            break

        case "ArrowUp" :
                keys.ArrowUp.pressed = true
                break
        case "ArrowDown" :
                keys.ArrowDown.pressed = true
                break
        case " ":
                projectiles.push(new Projectile({x:player1.position.x+ 0.5*player1.width ,y:player1.position.y},{x:0,y:-10}))

            break
        case "Shift":
                if (power >= 100 ){
                    projectiles.push(new Projectile({x:player1.position.x+ 0.5*player1.width ,y:player1.position.y},{x:0,y:-10},10,"powerUp"))
                    power = 0
                    powerElFill.style.width = 0
                    powerElFill.style.boxShadow = "0px 0px 10px red"
                }

        
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
        case "ArrowUp" :
                keys.ArrowUp.pressed = false
                break
        case "ArrowDown" :
                keys.ArrowDown.pressed = false
                break
        case " ":
            break
        case "Shift":
            break
    }
})

