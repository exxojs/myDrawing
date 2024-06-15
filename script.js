const canvas  = document.querySelector("canvas"),
ctx = canvas.getContext("2d")
toolBtns = document.querySelectorAll(".tool")
fillColor = document.querySelector("#fill-color")
sizeSlider = document.querySelector("#size-slider")
colorsBtn = document.querySelectorAll(".colors .option")
colorsBtn = document.querySelectorAll(".colors .option")
colorPick =document.querySelector("#color-picker")
clearCanvas = document.querySelector(".clear-canvas")
saveImg = document.querySelector(".save-img")

let prevMouseX, prevMouseY, snapshot
let isDrawing = false
selectedTool = "brush"
brushWith = 5
selectedColor = '#000'

const setCanvasBG = () => {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle =  selectedColor
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBG()
})

const drawRect = (e) => {
    if(!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetX), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo (e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const startDrawing = (e) => {
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = brushWith ;
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}
const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)
    if(selectedTool === "brush" || selectedTool === "eraser") {
    
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
    ctx.lineTo(e.offsetX, e.offsetY); //this creates a line with the live position of the user's mouse
    ctx.stroke(); //draws or fill lines with a color
    
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e); 
    } else if(selectedTool === "triangle"){
        drawTriangle(e); 
    }
    
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})

sizeSlider.addEventListener("change", () => brushWith = sizeSlider.value)

colorsBtn.forEach(btn => {
    btn.addEventListener("click", ()=> {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    } )
})

colorPick.addEventListener("change", () => {
    colorPick.parentElement.style.background = colorPick.value
    colorPick.parentElement.click();
})

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBG()
})

saveImg.addEventListener("click", () => {
   const link = document.createElement("a");
   link.download = `${Date.now()}.jpg`;
   link.href = canvas.toDataURL();
   link.click()
})


canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mousedown", startDrawing)
canvas.addEventListener("mouseup", () => isDrawing = false)

