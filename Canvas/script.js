const canvas = document.getElementById("canvas");
const body = document.querySelector("body");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var theColor = '';
var lineW = 5;
let prevX = null;
let prevY = null;
let draw = false;

body.style.backgroundColor = "#FFFFF";
var theInput = document.getElementById("favcolor");

theInput.addEventListener("input", function() {
    theColor = theInput.value;
    body.style.backgroundColor = theColor;
}, false);

const ctx = canvas.getContext("2d");
ctx.lineWidth = lineW;

document.getElementById("ageInputId").oninput = function(){
    draw = null;
    lineW = document.getElementById("ageInputId").value;
    document.getElementById("ageOutputId").innerHTML = lineW;
    ctx.lineWidth = lineW;
};

let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr;
    })
})

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
});

let saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("imag/png")
    let a = document.createElement("a");
    a.href = data;
    a.download = "sketch.png"
    a.click();
})

let saveSvgBtn = document.querySelector(".save-svg");
saveSvgBtn.addEventListener("click", () => {
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">`;
    const svgFooter = `</svg>`;
    
    // Getting the canvas image data as a base64 string
    const dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    
    // Creating an image tag to embed in SVG
    const imageTag = `<image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />`;
    
    // Constructing the final SVG content
    const svg = `${svgHeader}${imageTag}${svgFooter}`;
    
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
   
    const a = document.createElement("a");
    a.href = url;
    a.download = "sketch.svg";
    a.click();
    URL.revokeObjectURL(url);
});

window.addEventListener("mousedown", (e) => draw = true);
window.addEventListener("mouseup", (e) => draw = false);

window.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw) {
        prevX = e.clientX;
        prevY = e.clientY;
        return
    }

    let currentX = e.clientX;
    let currentY = e.clientY;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
    // if comment these two out you can do cool shapes

})
