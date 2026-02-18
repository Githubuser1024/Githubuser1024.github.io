// =============================
// Counter Functions
// =============================

function getCounterValue() {
    return parseInt(document.getElementById("counter").textContent);
}

function setCounterValue(value) {
    document.getElementById("counter").textContent = value;
}

function tickUp() {
    let current = getCounterValue();
    setCounterValue(current + 1);
}

function tickDown() {
    let current = getCounterValue();
    setCounterValue(current - 1);
}


// =============================
// Simple For Loop
// =============================

function runForLoop() {
    let counter = getCounterValue();
    let output = "";

    for (let i = 0; i <= counter; i++) {
        output += i + " ";
    }

    document.getElementById("forLoopResult").textContent = output;
}


// =============================
// Repetition with Condition
// =============================

function showOddNumbers() {
    let counter = getCounterValue();
    let output = "";

    for (let i = 1; i <= counter; i++) {
        if (i % 2 !== 0) {
            output += i + " ";
        }
    }

    document.getElementById("oddNumberResult").textContent = output;
}


// =============================
// Arrays - Reverse Multiples of 5
// =============================

function addMultiplesToArray() {
    let counter = getCounterValue();
    let multiples = [];

    for (let i = 5; i <= counter; i += 5) {
        multiples.unshift(i); // add to beginning (reverse order)
    }

    console.log(multiples);
}


// =============================
// Objects and Form Fields
// =============================

function printCarObject() {
    let type = document.getElementById("carType").value;
    let mpg = document.getElementById("carMPG").value;
    let color = document.getElementById("carColor").value;

    let car = {
        cType: type,
        cMPG: mpg,
        cColor: color
    };

    console.log(car);
}


// =============================
// Load Car Objects from Footer
// =============================

function loadCar(carNumber) {

    let car;

    if (carNumber === 1) {
        car = carObject1;
    } else if (carNumber === 2) {
        car = carObject2;
    } else if (carNumber === 3) {
        car = carObject3;
    }

    document.getElementById("carType").value = car.cType;
    document.getElementById("carMPG").value = car.cMPG;
    document.getElementById("carColor").value = car.cColor;
}


// =============================
// Changing Styles
// =============================

function changeColor(colorNumber) {

    let paragraph = document.getElementById("styleParagraph");

    if (colorNumber === 1) {
        paragraph.style.color = "red";
    } else if (colorNumber === 2) {
        paragraph.style.color = "green";
    } else if (colorNumber === 3) {
        paragraph.style.color = "blue";
    }
}
