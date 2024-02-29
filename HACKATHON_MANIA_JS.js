document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    const undoStack = [];
    const redoStack = [];
    let currentTool = "pen";
    let drawing = false;
    let textInput; // Added textInput variable

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle window resize
    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        redrawCanvas();
    });

    // Tool selection
    document.getElementById("penTool").addEventListener("click", function () {
        currentTool = "pen";
    });
    document.getElementById("lineTool").addEventListener("click", function () {
        currentTool = "line";
    });
    document.getElementById("rectangleTool").addEventListener("click", function () {
        currentTool = "rectangle";
    });
    document.getElementById("circleTool").addEventListener("click", function () {
        currentTool = "circle";
    });
    document.getElementById("textTool").addEventListener("click", function () {
        currentTool = "text";
        textInput = prompt("Enter text:");
    });
    document.getElementById("eraserTool").addEventListener("click", function () {
        currentTool = "eraser";
    });

    // Reset button
    document.getElementById("resetBtn").addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack.length = 0;
        redoStack.length = 0;
        updateLayers();
    });

    // Mouse event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    function startDrawing(e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    function draw(e) {
        if (!drawing) return;

        if (currentTool === "pen" || currentTool === "eraser") {
            drawPen(e);
        } else if (currentTool === "line") {
            drawLine(e);
        } else if (currentTool === "rectangle") {
            drawRectangle(e);
        } else if (currentTool === "circle") {
            drawCircle(e);
        } else if (currentTool === "text") {
            drawText(e);
        }
    }

    function drawPen(e) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = document.getElementById("brushSize").value;
        ctx.strokeStyle = currentTool === "pen" ? document.getElementById("colorPicker").value : "#ffffff";

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    }

    function drawLine(e) {
        redrawCanvas();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = document.getElementById("brushSize").value;
        ctx.strokeStyle = document.getElementById("colorPicker").value;

        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    }

    function drawRectangle(e) {
        redrawCanvas();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = document.getElementById("brushSize").value;
        ctx.strokeStyle = document.getElementById("colorPicker").value;

        const startX = e.clientX;
        const startY = e.clientY;

        const width = 50; // Change as needed
        const height = 50; // Change as needed

        ctx.strokeRect(startX, startY, width, height);
    }

    function drawCircle(e) {
        redrawCanvas();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = document.getElementById("brushSize").value;
        ctx.strokeStyle = document.getElementById("colorPicker").value;

        const centerX = e.clientX;
        const centerY = e.clientY;

        const radius = 25; // Change as needed

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function drawText(e) {
        ctx.font = `${document.getElementById("brushSize").value}px Arial`;
        ctx.fillStyle = document.getElementById("colorPicker").value;
        ctx.fillText(textInput, e.clientX, e.clientY);
    }

    function stopDrawing() {
        if (drawing) {
            undoStack.push(canvas.toDataURL());
            redoStack.length = 0;
        }
        drawing = false;
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
    }

    // Undo and Redo buttons
    document.getElementById("undoBtn").addEventListener("click", function () {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            redrawCanvas();
        }
    });

    document.getElementById("redoBtn").addEventListener("click", function () {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            redrawCanvas();
        }
    });

    // Layer management
    const layersContainer = document.getElementById("layers");

    function updateLayers() {
        layersContainer.innerHTML = "";
        for (let i = 0; i < undoStack.length; i++) {
            const layer = document.createElement("div");
            layer.textContent = `Layer ${i + 1}`;
            layer.addEventListener("click", function () {
                redrawCanvasFromLayer(i);
            });
            layersContainer.appendChild(layer);
        }
    }

    function redrawCanvasFromLayer(index) {
        undoStack.push(undoStack[index]);
        redoStack.length = 0;
        redrawCanvas();
    }

    // Initial setup
    updateLayers();
});