let array = [];
let delay = 200;
let comparisons = 0;
let swaps = 0;
let isPaused = false;

// Generate new array
function generateArray(size = 20) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray();
    comparisons = 0;
    swaps = 0;
    updateStats();
}

// Display the array bars
function displayArray() {
    const container = document.getElementById("array-container");
    container.innerHTML = '';
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 3}px`;
        container.appendChild(bar);
    });
}

// Update statistics (comparisons, swaps)
function updateStats() {
    document.getElementById("comparisonsCount").innerText = `Comparisons: ${comparisons}`;
    document.getElementById("swapsCount").innerText = `Swaps: ${swaps}`;
}

// Swap function with color coding
async function swap(i, j) {
    swaps++;
    updateStats();
    let bars = document.getElementsByClassName("bar");

    // Color the elements being swapped
    bars[i].style.backgroundColor = "yellow";
    bars[j].style.backgroundColor = "yellow";

    await sleep(delay);

    // Swap in array
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    // Swap visually
    bars[i].style.height = `${array[i] * 3}px`;
    bars[j].style.height = `${array[j] * 3}px`;

    bars[i].style.backgroundColor = "green";
    bars[j].style.backgroundColor = "green";

    await sleep(delay);
}

// Sleep function with pause and resume functionality
async function sleep(ms) {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pauseSorting() {
    isPaused = true;
}

function resumeSorting() {
    isPaused = false;
}

// Bubble Sort
async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            comparisons++;
            updateStats();

            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
}

// Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    let index = await partition(start, end);
    await quickSort(start, index - 1);
    await quickSort(index + 1, end);
}

async function partition(start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    let bars = document.getElementsByClassName("bar");

    for (let i = start; i < end; i++) {
        comparisons++;
        updateStats();

        bars[i].style.backgroundColor = "yellow";

        if (array[i] < pivotValue) {
            await swap(i, pivotIndex);
            pivotIndex++;
        }

        bars[i].style.backgroundColor = "green";
    }
    await swap(pivotIndex, end);
    return pivotIndex;
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let bars = document.getElementsByClassName("bar");
    let i = start;

    while (left.length && right.length) {
        comparisons++;
        updateStats();

        if (left[0] < right[0]) {
            array[i] = left.shift();
        } else {
            array[i] = right.shift();
        }

        bars[i].style.height = `${array[i] * 3}px`;
        bars[i].style.backgroundColor = "yellow";
        await sleep(delay);
        bars[i].style.backgroundColor = "green";
        i++;
    }

    while (left.length) {
        array[i] = left.shift();
        bars[i].style.height = `${array[i] * 3}px`;
        bars[i].style.backgroundColor = "green";
        i++;
    }

    while (right.length) {
        array[i] = right.shift();
        bars[i].style.height = `${array[i] * 3}px`;
        bars[i].style.backgroundColor = "green";
        i++;
    }
}

// Start the sorting process based on algorithm selection
function startSort() {
    const algorithm = document.getElementById('algorithmSelector').value;
    delay = document.getElementById('speed').value;

    if (algorithm === "bubble") {
        bubbleSort();
    } else if (algorithm === "quick") {
        quickSort();
    } else if (algorithm === "merge") {
        mergeSort();
    }

    displayComplexity(algorithm);
}

// Set custom array input
function setCustomArray() {
    const input = document.getElementById("customArrayInput").value;
    array = input.split(',').map(Number);
    displayArray();
}

// Display time complexity based on algorithm
function displayComplexity(algorithm) {
    let complexity = "";
    if (algorithm === "bubble") {
        complexity = "Best: O(n), Average: O(n^2), Worst: O(n^2)";
    } else if (algorithm === "quick") {
        complexity = "Best: O(n log n), Average: O(n log n), Worst: O(n^2)";
    } else if (algorithm === "merge") {
        complexity = "Best: O(n log n), Average: O(n log n), Worst: O(n log n)";
    }
    document.getElementById("complexityInfo").innerText = `Time Complexity: ${complexity}`;
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

generateArray();
