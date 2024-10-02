const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let theColor = '';
let lineW = 5;
let prevX = null;
let prevY = null;
let draw = false;

// Function to resize the canvas
function resizeCanvas() {
    const navHeight = document.querySelector('.nav').offsetHeight;
    canvas.width = window.innerWidth; // Set canvas width to window width
    canvas.height = window.innerHeight - navHeight; // Set canvas height to 90% of window height
    ctx.lineWidth = lineW; // Reset line width to maintain consistency
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Call on load to set initial size

const theInput = document.getElementById("favcolor");
theInput.addEventListener("input", function() {
    theColor = this.value;
    document.body.style.backgroundColor = theColor; // Change body background color
}, false);

document.getElementById("ageInputId").oninput = function() {
    lineW = this.value;
    document.getElementById("ageOutputId").innerHTML = lineW;
    ctx.lineWidth = lineW; // Update line width
};

let clrs = document.querySelectorAll(".clr");
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr; // Set stroke color
    });
});

document.querySelector(".clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});

document.querySelector(".save").addEventListener("click", () => {
    let data = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "sketch.png"; // Download as PNG
    a.click();
});

document.querySelector(".save-svg").addEventListener("click", () => {
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">`;
    const svgFooter = `</svg>`;
    const dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const imageTag = `<image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />`;
    const svg = `${svgHeader}${imageTag}${svgFooter}`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sketch.svg"; // Download as SVG
    a.click();
    URL.revokeObjectURL(url);
});

// Mouse and touch event handling
const getMousePos = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};

canvas.addEventListener("mousedown", (e) => {
    draw = true;
    const pos = getMousePos(canvas, e);
    prevX = pos.x;
    prevY = pos.y;
});

canvas.addEventListener("mouseup", () => draw = false); // Stop drawing on mouse up
canvas.addEventListener("mousemove", (e) => {
    if (!draw) return; // Only draw if mouse is down
    const pos = getMousePos(canvas, e);
    drawLine(pos);
});

canvas.addEventListener("touchstart", (e) => {
    draw = true;
    const pos = getMousePos(canvas, e.touches[0]);
    prevX = pos.x;
    prevY = pos.y;
    e.preventDefault(); // Prevent scrolling
});

canvas.addEventListener("touchend", () => draw = false); // Stop drawing on touch end
canvas.addEventListener("touchmove", (e) => {
    if (!draw) return; // Only draw if touch is active
    const pos = getMousePos(canvas, e.touches[0]);
    drawLine(pos);
    e.preventDefault(); // Prevent scrolling
});

// Helper function to draw the line
const drawLine = (currentPos) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY); // Move to previous coordinates
    ctx.lineTo(currentPos.x, currentPos.y); // Draw line to current coordinates
    ctx.stroke(); // Apply the stroke
    prevX = currentPos.x; // Update previous coordinates
    prevY = currentPos.y; // Update previous coordinates
};
