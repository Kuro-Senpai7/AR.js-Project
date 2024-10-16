const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let theColor = '#000000'; 
let prevX = null;
let prevY = null;
let draw = false;
let history = [];


// Save current canvas state
function saveState() {
    history.push(canvas.toDataURL());
    if (history.length > 10) {
        history.shift(); // Remove the oldest state if too many
    }
    if (history.lenght > 0){
    }
}


// Undo last action
function undo() {
    if (history.length > 0) {
        const lastState = history.pop();
        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            console.log("problem");
        };
    }
}

// Color input handling
const theInput = document.getElementById("favcolor");
theInput.addEventListener("input", function() {
    theColor = this.value; // Change drawing color
});

// Line width input handling
document.getElementById("ageInputId").oninput = function() {
    ctx.lineWidth = this.value; // Update line width
    document.getElementById("ageOutputId").innerHTML = this.value;
};

// Clear canvas
document.querySelector(".clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save canvas as PNG
document.querySelector(".save").addEventListener("click", () => {
    let data = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "sketch.png"; // Download as PNG
    a.click();
});

// Save canvas as SVG
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
};


canvas.addEventListener("mousedown", (e) => {
    saveState();
    draw = true;
    const pos = getMousePos(canvas, e);
    prevX = pos.x;
    prevY = pos.y;
    ctx.strokeStyle = theColor;
});

canvas.addEventListener("mouseup", () => draw = false);
canvas.addEventListener("mousemove", (e) => {
    if (!draw) return;
    const pos = getMousePos(canvas, e);
    drawLine(pos);
});

canvas.addEventListener("touchstart", (e) => {
    saveState();
    draw = true;
    const pos = getMousePos(canvas, e.touches[0]);
    prevX = pos.x;
    prevY = pos.y;
    ctx.strokeStyle = theColor;
    e.preventDefault();
});

canvas.addEventListener("touchend", () => draw = false);
canvas.addEventListener("touchmove", (e) => {
    if (!draw) return;
    const pos = getMousePos(canvas, e.touches[0]);
    drawLine(pos);
    e.preventDefault();
});

// Helper function to draw lines
const drawLine = (currentPos) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();
    prevX = currentPos.x;
    prevY = currentPos.y;
};

// window.addEventListener("resize", resizeCanvas);


// Drawer toggle functionality
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const toggleButton = document.getElementById('toggleButton');
let isOpen = false;

toggleButton.addEventListener('click', toggleDrawer);
overlay.addEventListener('click', toggleDrawer);

function toggleDrawer() {
    isOpen = !isOpen;
    if (isOpen) {
        drawer.classList.add("open");
        overlay.classList.add("active");
    } else {
        drawer.classList.remove("open");
        overlay.classList.remove("active");
    }
}

// Content switch functionality
let contentBox = document.querySelector('#contentTypeSwitch');
contentBox.addEventListener('change', function() {
    if (contentBox.checked) {
        document.querySelector('#text-con').style.display = 'block';
        document.querySelector('#drawCon').style.display = 'none';
    } else {
        document.querySelector('#text-con').style.display = 'none';
        document.querySelector('#drawCon').style.display = 'block';
    }
});

// Character limit check
const maxCharacters = 100;
function checkCharacterLimit() {
    const textarea = document.getElementById('paragraph');
    const countDisplay = document.getElementById('charCount');

    if (textarea.value.length > maxCharacters) {
        textarea.value = textarea.value.substring(0, maxCharacters);
    }
    countDisplay.textContent = textarea.value.length;
}
