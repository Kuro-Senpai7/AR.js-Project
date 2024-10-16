// API and Randomizer Functionality

async function GetRandomMessages() {
    const urlPath = "/api/get-messages";
    try {
        const response = await fetch(urlPath);
        if (!response.ok) {
            throw new Error('HTTP error!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function SendMessage(message, svgData) {
    const urlPath = "/api/submit-message";
    const payload = {
        message: message,
        svgd: svgData
    };

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(urlPath, options);
        if (!response.ok) {
            throw new Error('HTTP error!');
        }
        await response.json();
    } catch (error) {
        throw error;
    }
}

function generateRandomCoords(cordAmount, minDistance, maxDistance, minDistanceFromOthers) {
    const coords = [];
    while (coords.length < cordAmount) {
        const r = Math.random() * (maxDistance - minDistance) + minDistance;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const z = r * Math.sin(phi) * Math.sin(theta);
        const y = Math.random() * 2;

        const newCoord = { x, y, z };
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
    const direction = new THREE.Vector3().subVectors(targetPosition, objectPosition).normalize();
    const yaw = Math.atan2(direction.x, direction.z);
    const pitch = Math.atan2(direction.y, Math.sqrt(direction.x ** 2 + direction.z ** 2));
    return { x: pitch, y: yaw, z: 0 };
}
