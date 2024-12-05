async function GetRandomMessages(count = 20) {
    urlPath = `/api/get-messages?count=${count}`
    try {
        const response = await fetch(urlPath)

        if (!response.ok) {
            throw new Error('HTTP error!')
        }

        const data = await response.json()
        return data;
    } catch (error){
        throw error
    }
}

async function SendMessage(message, svgData) {
    urlPath = "/api/submit-message"
    const payload = {
        message: message,
        svgd: svgData
    }

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    try {
        const response = await fetch(urlPath, options)
        if (!response.ok) {
            throw new Error('HTTP error!')
        }

        const data = await response.json()
    } catch (error){
        throw error
    }
}

function addTextToScene(textContent, position, rawCord) {
    // Create a new A-Frame entity for the text
    const textEntity = document.createElement('a-entity');
    console.log(rawCord)
    // Set text properties
    textEntity.setAttribute('text', {
        value: textContent,
        align: 'center',
        color: 'white',
        "look-at": "#marker",
        'visible': 'false',
        'rotation': getRotationToFace(rawCord, { x: 0, y: 0, z: 0 }),
        width: 1.5 // Adjust width as necessary
    });

    // textEntity.setAttribute('visible', true);

    // textEntity.addEventListener('click', () => {
    //     console.log("press")
    //   });

    // Set position of the text in the scene
    textEntity.setAttribute('position', position); // position should be a string like "x y z"
    rot = getRotationToFace(rawCord, { x: 0, y: 0, z: 0 })
    textEntity.setAttribute('rotation', `${rot.pitch} ${-rot.pitch} 0`)

    console.log(textEntity)
    // Append the text entity to the scene
    document.querySelector('a-scene').appendChild(textEntity);
}

function addImageToScene(src, position, rawCord) {
    const scene = document.querySelector('a-scene')
    let entity = document.createElement('a-entity');
    const template = document.createElement('div');
    template.innerHTML = `<a-entity position="0 2 -3"></a-entity>`;
    src = src.replace(/['"`]/g, '')
    
    // Return the first child (or the first element) of the temporary element
    let baseHTML = template.firstChild;
    baseHTML.setAttribute("position", position)
    rot = getRotationToFace(rawCord, { x: 0, y: 0, z: 0 })
    baseHTML.setAttribute('rotation', `${rot.pitch} ${-rot.pitch} 0`)

    let template2 = document.createElement('div');
    template2.innerHTML = `<a-entity geometry="primitive: plane; width: 0.5; height: 0.5;" material="src: url(${src});"></a-entity>`;
    
    // Return the first child (or the first element) of the temporary element
    baseHTML.appendChild(template2.firstChild);
    console.log(baseHTML)

    entity.setAttribute('geometry', 'primitive: plane; width: 0.5; height: 0.5;');

    // Set the material attribute
    entity.setAttribute('material', `src: url(${src});`);
    entity.setAttribute('material', {"sdf": "sdfdsf"});

    // Set the position attribute
    entity.setAttribute('position', "0 1 0");
    scene.appendChild(baseHTML)
}

function generateRandomCoords(cordAmount, minDistance, maxDistance, minDistanceFromOthers) {
    const coords = [];

    while (coords.length < cordAmount) {
        // Generate random spherical coordinates
        const r = Math.random() * (maxDistance - minDistance) + minDistance;
        const theta = Math.random() * 2 * Math.PI;  // Azimuthal angle
        const phi = Math.random() * Math.PI;         // Polar angle

        // Convert spherical coordinates to Cartesian coordinates
        const x = r * Math.sin(phi) * Math.cos(theta);
        const z = r * Math.sin(phi) * Math.sin(theta);
        
        // Ensure y stays within 0 and 2
        const y = Math.random() * 2; // y will be in the range [0, 2]

        const newCoord = { x, y, z };
        
        // Check if the new coordinate is far enough from existing coordinates
        if (coords.every(coord => {
            const distance = Math.sqrt(
                Math.pow(newCoord.x - coord.x, 2) +
                Math.pow(newCoord.y - coord.y, 2) +
                Math.pow(newCoord.z - coord.z, 2)
            );
            return distance >= minDistanceFromOthers;
        })) {
            coords.push(newCoord);
        }
    }
    
    return coords;
}

function lookAtTarget(objectPosition, targetPosition) {
    // Calculate direction vector from object to target
    const direction = new THREE.Vector3().subVectors(targetPosition, objectPosition).normalize();
  
    // Calculate the rotation needed
    const yaw = Math.atan2(direction.x, direction.z); // Y-axis rotation
    const pitch = Math.atan2(direction.y, Math.sqrt(direction.x ** 2 + direction.z ** 2)); // X-axis rotation
  
    // Set the object's rotation
    // object.rotation.set(pitch, yaw, 0); // Set roll to 0
    return { x: pitch, y: yaw, z: 0 }; // Roll is set to 0
  }

  function getRotationToFace(pos, target) {
    // Calculate the direction vector from the object to the target
    const direction = {
        x: target.x - pos.x,
        y: target.y - pos.y,
        z: target.z - pos.z
    };

    // Calculate the yaw (rotation around the Y-axis)
    const yaw = Math.atan2(direction.x, direction.z);

    // Calculate the pitch (rotation around the X-axis)
    const hypotenuse = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
    const pitch = Math.atan2(direction.y, hypotenuse);

    // Convert radians to degrees if needed
    const yawDegrees = yaw * (180 / Math.PI);
    const pitchDegrees = pitch * (180 / Math.PI);

    return {
        yaw: yawDegrees,
        pitch: pitchDegrees
    };
}








  let contentBox = document.querySelector('#contentTypeSwitch')
  if (contentBox.checked) {
    console.log('Checkbox is checked!');
    document.querySelector('#text-con').style.display = 'block';
    document.querySelector('#drawCon').style.display = 'none';
} else {
    console.log('Checkbox is unchecked!');
    document.querySelector('#text-con').style.display = 'none';
    document.querySelector('#drawCon').style.display = 'block';
}
  contentBox.addEventListener('change', function() {
      if (contentBox.checked) {
          console.log('Checkbox is checked!');
          document.querySelector('#text-con').style.display = 'block';
          document.querySelector('#drawCon').style.display = 'none';
      } else {
          console.log('Checkbox is unchecked!');
          document.querySelector('#text-con').style.display = 'none';
          document.querySelector('#drawCon').style.display = 'block';
      }
  });






  const maxCharacters = 100;

  function checkCharacterLimit() {
      const textarea = document.getElementById('paragraph');
      const countDisplay = document.getElementById('charCount');

      if (textarea.value.length > maxCharacters) {
          // Trim to maxCharacters
          textarea.value = textarea.value.substring(0, maxCharacters);
      }

      // Update character count display
      countDisplay.textContent = textarea.value.length;
  }


















const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let theColor = '#000000'; // Default color
let prevX = null;
let prevY = null;
let draw = false;
let history = [];

// Function to resize the canvas
function resizeCanvas() {
    canvas.width = 400; // Set canvas width to window width
    canvas.height = 400; // Set canvas height
}

function saveState() {
    history.push(canvas.toDataURL());
}

function undo() {
    if (history.length > 0) {
        const lastState = history.pop();
        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait').catch(err => {
        console.error('Error locking orientation: ${err}');
    });
}

//window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Call on load to set initial size

const theInput = document.getElementById("favcolor");
theInput.addEventListener("input", function() {
    theColor = this.value; // Change drawing color
});

document.getElementById("ageInputId").oninput = function() {
    ctx.lineWidth = this.value; // Update line width
    document.getElementById("ageOutputId").innerHTML = this.value;
};

document.querySelector(".clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});

// document.querySelector(".save").addEventListener("click", () => {
//     let data = canvas.toDataURL("image/png");
//     let a = document.createElement("a");
//     a.href = data;
//     a.download = "sketch.png"; // Download as PNG
//     a.click();
// });

// document.querySelector(".save-svg").addEventListener("click", () => {
//     const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">`;
//     const svgFooter = `</svg>`;
//     const dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//     const imageTag = `<image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />`;
//     const svg = `${svgHeader}${imageTag}${svgFooter}`;
//     const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "sketch.svg"; // Download as SVG
//     a.click();
//     URL.revokeObjectURL(url);
// });

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
    ctx.strokeStyle = theColor; // Set stroke color
});

canvas.addEventListener("mouseup", () => draw = false); // Stop drawing on mouse up
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
    ctx.strokeStyle = theColor; // Set stroke color
    e.preventDefault(); // Prevent scrolling
});

canvas.addEventListener("touchend", () => draw = false); // Stop drawing on touch end
canvas.addEventListener("touchmove", (e) => {
    if (!draw) return;
    const pos = getMousePos(canvas, e.touches[0]);
    drawLine(pos);
    e.preventDefault(); // Prevent scrolling
});

// Helper function to draw the line
const drawLine = (currentPos) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke(); // Apply the stroke
    prevX = currentPos.x;
    prevY = currentPos.y;
};

//document.querySelector(".undo").addEventListener("click", undo);


let submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
    const textarea = document.getElementById('paragraph');
    console.log("dsfsdfds")
    if (contentBox.checked) {
        //Send Message
        SendMessage(textarea.value, "")
    } else {
        // Send Art
        const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">`;
        const svgFooter = `</svg>`;
        const dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const imageTag = `<image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />`;
        const svg = `${svgHeader}${imageTag}${svgFooter}`;
        SendMessage("", svg)
        console.log(svg)
        //console.log(svg)
    }
})