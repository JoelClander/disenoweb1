const canvas = document.getElementById('presentationCanvas');
const context = canvas.getContext('2d');
let actions = [];
let undoneActions = [];

// Función para establecer el fondo por defecto del canvas
function setupCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

setupCanvas();

function saveAction() {
    actions.push(context.getImageData(0, 0, canvas.width, canvas.height));
    document.getElementById('undoButton').disabled = false;
}

function restoreAction(imageData) {
    context.putImageData(imageData, 0, 0);
}

// Añadir texto al canvas
document.getElementById('addText').addEventListener('click', () => {
    const text = prompt('Introduce el texto que quieres añadir:');
    if (text) {
        saveAction();
        context.fillStyle = '#000';
        context.font = '30px Arial';
        context.fillText(text, 50, 100);
    }
});

// Añadir imagen al canvas
document.getElementById('addImage').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                saveAction();
                context.drawImage(img, 100, 100, 300, 200);
            };
        };
        reader.readAsDataURL(file);
    };
    input.click();
});

// Añadir forma al canvas
document.getElementById('addShape').addEventListener('click', () => {
    const shape = prompt('Escribe "rectángulo" o "círculo" para agregar la forma:');
    if (shape === 'rectángulo') {
        saveAction();
        context.fillStyle = '#0073e6';
        context.fillRect(200, 200, 150, 100);
    } else if (shape === 'círculo') {
        saveAction();
        context.beginPath();
        context.arc(400, 300, 50, 0, 2 * Math.PI);
        context.fillStyle = '#0073e6';
        context.fill();
    } else {
        alert('Forma no válida.');
    }
});

// Función de deshacer
document.getElementById('undoButton').addEventListener('click', () => {
    if (actions.length > 0) {
        undoneActions.push(actions.pop());
        if (actions.length > 0) {
            restoreAction(actions[actions.length - 1]);
        } else {
            setupCanvas();
        }
        document.getElementById('redoButton').disabled = false;
    }
    if (actions.length === 0) {
        document.getElementById('undoButton').disabled = true;
    }
});

// Función de rehacer
document.getElementById('redoButton').addEventListener('click', () => {
    if (undoneActions.length > 0) {
        const redoAction = undoneActions.pop();
        restoreAction(redoAction);
        actions.push(redoAction);
        document.getElementById('undoButton').disabled = false;
    }
    if (undoneActions.length === 0) {
        document.getElementById('redoButton').disabled = true;
    }
});

// Exportar contenido del canvas como imagen
document.getElementById('exportButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'presentation.png';
    link.href = canvas.toDataURL();
    link.click();
});
