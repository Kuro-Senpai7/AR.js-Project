const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const toggleButton = document.getElementById('toggleButton');

let isOpen = false;
let startY, currentY, initialY, yOffset = 0;
let isDragging = false;

toggleButton.addEventListener('click', toggleDrawer);
overlay.addEventListener('click', toggleDrawer)

toggleButton.addEventListener("touchstart", touchStart);
toggleButton.addEventListener("touchmove", touchMove);
toggleButton.addEventListener("touchend", touchEnd);

function touchStart(event) {
    startY = event.touches[0].clientY;
    initialY = yOffset;
    isDragging = true
}

function touchMove(event) {
    if (!isDragging) return;

    currentY = event.touches[0].clientY;
    const distanceY = currentY - startY;
    if (!isOpen && initialY + distanceY < 0 && initialY + distanceY > (window.innerHeight * 0.85 * -1)) {
        yOffset = Math.min(initialY + distanceY, window.innerHeight * 0.85)
        drawer.style.transform = `translateY(${yOffset}px)`
    }
    if(isOpen) {
        yOffset = Math.min(initialY + distanceY, window.innerHeight * 0.85)
        drawer.style.transform = `translateY(${yOffset}px)`
    }
}

function touchEnd(event) {
    isDragging = false;

    if(yOffset < -150) {
        isOpen = true;
        drawer.classList.add("open")
        overlay.classList.add("active")
    } else {
        isOpen = false;
        drawer.classList.remove("open");
        overlay.classList.remove("active")
    }
    yOffset = 0;
    drawer.style.transform = '';
}

function toggleDrawer() {
    isOpen = !isOpen
    if (isOpen) {
        drawer.classList.add("open")
        overlay.classList.add("active")
    } else {
        drawer.classList.remove("open");
        overlay.classList.remove("active")
    }
}
