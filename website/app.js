import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FaceDetector, FilesetResolver, DrawingUtils, } = vision;
const videoStream = document.getElementById("videoStream");
const theButtonButton = document.getElementById("theButton");
const blockSound = document.getElementById("blockSound");
const writtenText = document.getElementById("writtenText");
const logMessage = document.getElementById("logMessage");
const eyesClosedCheckbox = document.getElementById("eyesClosedBox");

const potentialNextDuration = document.getElementById("potentialNextDuration");
const durationsForThisWord = document.getElementById("durationsForThisWord");
const charsForThisWord = document.getElementById("charsForThisWord");

const signalCanvas = document.getElementById("signalCanvas");
const charCanvas = document.getElementById("charCanvas");
const signalCtx = signalCanvas.getContext("2d");
const charCtx = charCanvas.getContext("2d");

let faceLandmarker;

let totalFramesThisDit = 0;
let closedFramesThisDit = 0;

class SIGNAL {
    static ON = 'signal-on';
    static OFF = 'signal-off';
}

class TICKSTATE {
    static ON = "tick-on";
    static OFF = "tick-off";
    static UNDETERMINED = "tick-undetermined";
}

function determineSignal(total, closed) {
    const ON_THRESHOLD = 0.6;
    const ratio = closed / total;
    if (ratio >= ON_THRESHOLD) {
        return SIGNAL.ON;
    } else {
        return SIGNAL.OFF;
    }
}

let onCount = 0;
let offCount = 0;
let currentDurations = "";
let currentWord = "";
let pastWords = [];

function addCharToText(c) {
    writtenText.textContent += c;
}

function addSpaceToText() {
    writtenText.textContent += " ";
}

function flashMessage(message) {
    logMessage.textContent = "";
    logMessage.classList.remove("flash-message");
    void logMessage.offsetWidth;
    logMessage.classList.add("flash-message");
    logMessage.textContent = message;
}

// nroyalty: WARN?
function flashLog(message) {
    console.log(message);
    flashMessage(message);
}

function readLastDuration(onCount) {
    if (onCount === 0) {
        return null;
    }

    let duration = ".";
    if (onCount >= 3) {
        duration = "-";
    }

    currentDurations += duration;
    potentialNextDuration.textContent = "";
    durationsForThisWord.textContent = currentDurations;
}

function attemptToDecodeDuration(duration) {
    const decoded = decodeMorse(duration);

    if (decoded) {
        currentWord += decoded;
        charsForThisWord.textContent += decoded;
    }

    currentDurations = "";
    durationsForThisWord.textContent = currentDurations;
}

function processSignal(total, closed) {
    const signal = determineSignal(total, closed);

    if (signal === SIGNAL.OFF) {
        console.log(`curD: ${currentDurations} | curW: ${currentWord}`);

        const oldOnCount = onCount;
        onCount = 0;
        offCount += 1;

        if (offCount === 1) {
            readLastDuration(oldOnCount);
        } else if (offCount === 3 && currentDurations) {
            attemptToDecodeDuration(currentDurations);
        } else if (offCount === 7 && currentWord) {
            writtenText.textContent += ` ${currentWord}`;
            currentDurations = "";
            currentWord = "";
            durationsForThisWord.textContent = "";
            charsForThisWord.textContent = "";
        }
    } else if (signal === SIGNAL.ON) {
        offCount = 0;
        onCount += 1;

        if (onCount >= 3) {
            potentialNextDuration.textContent = "-";
        } else {
            potentialNextDuration.textContent = ".".repeat(onCount);
        }
    } else {
        console.warn(`unexpected signal ${signal}`);
    }
}

function blockLoop() {
    const INTERVAL = 2000;
    const now = performance.now();

    blockSound.play();
    const body = document.getElementById("bodyNode");
    processTick();
    processSignal(totalFramesThisDit, closedFramesThisDit);
    totalFramesThisDit = 0;
    closedFramesThisDit = 0;
    const timeLeft = INTERVAL - (performance.now() - now);

    setTimeout(blockLoop, timeLeft);
}

function videoReady(video) {
    return video.readyState >= 3 && !video.paused && (video.src || video.srcObject)
}

function isBlinking(results) {
    if (eyesClosedCheckbox.checked) {
        return true;
    }

    const THRESHOLD = 0.5;
    
    if (results.faceBlendshapes && results.faceBlendshapes[0]) {
        const categories = results.faceBlendshapes[0].categories;
        const leftBlink = categories[9].score;
        const rightBlink = categories[10].score;
        const value = leftBlink + rightBlink / 2.0;
        return (value >= THRESHOLD)
    }
    return false;
}

function greyScale(whiteRatio) {
    const i = 255 * whiteRatio;
    return `rgb(${i},${i},${i})`;
}

function drawSignalState(onCount, currentRatio, howOff) {
    const width = signalCanvas.width;
    const blockSize = width / 3;

    signalCtx.clearRect(0, 0, width, signalCanvas.height);

    const targetWidth = Math.min(blockSize * onCount + currentRatio * blockSize, width);

    // nroyalty: think about naming??
    signalCtx.fillStyle = greyScale(1 - .95 * howOff);

    const startHeight = signalCanvas.height / 3;
    const fillHeight = startHeight;
    signalCtx.fillRect(0, startHeight, targetWidth, fillHeight);
}

let currentCharacter = [];
function drawCharacterState() {
    
}

const frameCounts = [0, 0, 0, 0, 0];
let curFrameCount = 0;
function addFrameCount(count) {
    frameCounts[curFrameCount] = count;
    curFrameCount = (curFrameCount + 1) % frameCounts.length;
}

// nroyalty: This won't play nicely if you tab out.
function estimatedFps() {
    let total = 0;
    let valid = 0;
    frameCounts.forEach(item => {
        if (item !== 0) {
            total += item;
            valid += 1;
        }
    });

    return total / valid;
}

function guessCurrentState(onFrames, totalFrames, fps) {
    const IDK_THRESHOLD = 0.1;
    const ON_THRESHOLD = 0.5;
    const FRAMES_TO_BE_ON = ON_THRESHOLD * fps;
    const offFrames = totalFrames - onFrames;

    if (totalFrames <= fps * IDK_THRESHOLD) {
        return [1.0, TICKSTATE.UNDETERMINED];
    } else if (onFrames >= offFrames) {
        const ratio = Math.min(1.0, onFrames / FRAMES_TO_BE_ON);
        return [ratio, TICKSTATE.ON];
    } else {
        const ratio = Math.min(1.0, offFrames / FRAMES_TO_BE_ON);
        return [ratio, TICKSTATE.OFF];
    }
}

let currentEstimatedFps = 0;
let priorOnCount = 0;
let currentOnConfidence = 0;
let priorOffCount = 0;
let onFramesThisDit = 0;
let tickState = TICKSTATE.UNDETERMINED;
let tookActionThisTick = false;
function processFrame(isOn) {
    if (isOn) {
        onFramesThisDit += 1;
    }

    const [confidence, guess] = guessCurrentState(onFramesThisDit, totalFramesThisDit, currentEstimatedFps);

    if (guess === TICKSTATE.UNDETERMINED) {
        // nothing to do yet
    } else if (guess === TICKSTATE.ON) {
        console.log(`draw: ${priorOnCount} ${confidence}`);
        currentOnConfidence = confidence;
        drawSignalState(priorOnCount, confidence, 0);
        if (!tookActionThisTick && confidence >= 1.0) {
            tookActionThisTick = true;
            tickState = TICKSTATE.ON;         
        }
    } else if (guess === TICKSTATE.OFF) {
        if (!tookActionThisTick && confidence >= 1.0) {
            tookActionThisTick = true;
            tickState = TICKSTATE.OFF;
        }

        drawSignalState(priorOnCount, currentOnConfidence, confidence);         
    }
}

function processTick() {
    // nroyalty: move this variable
    console.log(`fps: ${currentEstimatedFps} ${onFramesThisDit} ${totalFramesThisDit}`);
    addFrameCount(totalFramesThisDit);
    currentEstimatedFps = estimatedFps();

    if (tickState === TICKSTATE.ON) {
        // nroyalty: CONSTANT?
        priorOnCount = Math.min(priorOnCount + 1, 3);
        priorOffCount = 0;
    } else if (tickState === TICKSTATE.OFF) {
        priorOnCount = 0;
        priorOffCount = Math.min(priorOffCount + 1, 7);
    } else {
        console.log("No guess for this round!");
        priorOnCount = 0;
    }

    tickState = TICKSTATE.UNDETERMINED;
    tookActionThisTick = false;
    onFramesThisDit = 0;
    currentOnConfidence = 0;
}

async function handleAnimationFrame(frameTime) {
    const startTimeMs = performance.now();
    totalFramesThisDit += 1;
    if (videoReady(videoStream)) {
        const results = faceLandmarker.detectForVideo(videoStream, startTimeMs);
        const blinked = isBlinking(results);
        if (blinked) {
            closedFramesThisDit += 1;
        } 
        processFrame(blinked);
    }

    window.requestAnimationFrame(handleAnimationFrame);
}

function wireUpWebcam() {
    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
    if (hasGetUserMedia()) {
        theButtonButton.addEventListener("click", enableCam);
    } else {
        alert("Couldn't find your webcam. You need a webcam to use this site.");
    }
}

function clearWrittenText(event) {
    onCount = 0;
    offCount = 0;
    currentDurations = "";
    currentWord = "";
    writtenText.textContent = " "; 
    durationsForThisWord.textContent = "";
    potentialNextDuration.textContent = "";
    charsForThisWord.textContent = "";
}

async function enableCam(event) {
    theButton.textContent = "clear";

    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
            videoStream.srcObject = stream;
        })
        .catch((err) => {
            // nroyalty: Handle this error.
            console.error(err);
        });

    theButton.removeEventListener("click", enableCam);
    theButton.addEventListener("click", clearWrittenText);
    startGame();
}
async function createFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    async function getLandmarker() { 
        return FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "GPU"
            },
            outputFaceBlendshapes: true,
            runningMode : "VIDEO",
            numFaces: 1
        });
    }
    faceLandmarker = await getLandmarker();
}

async function startGame() {
    let prom = await createFaceLandmarker();
    blockLoop();
    window.requestAnimationFrame(handleAnimationFrame);
}


function initialize() {
    wireUpWebcam();
}

function decodeMorse(currentDurations) {
    var ref = {
        '.-':     'a',
        '-...':   'b',
        '-.-.':   'c',
        '-..':    'd',
        '.':      'e',
        '..-.':   'f',
        '--.':    'g',
        '....':   'h',
        '..':     'i',
        '.---':   'j',
        '-.-':    'k',
        '.-..':   'l',
        '--':     'm',
        '-.':     'n',
        '---':    'o',
        '.--.':   'p',
        '--.-':   'q',
        '.-.':    'r',
        '...':    's',
        '-':      't',
        '..-':    'u',
        '...-':   'v',
        '.--':    'w',
        '-..-':   'x',
        '-.--':   'y',
        '--..':   'z',
        '.----':  '1',
        '..---':  '2',
        '...--':  '3',
        '....-':  '4',
        '.....':  '5',
        '-....':  '6',
        '--...':  '7',
        '---..':  '8',
        '----.':  '9',
        '-----':  '0',
    };

    if (currentDurations in ref) {
        return ref[currentDurations];
    } else {
        console.warn(`no match for ${currentDurations}`);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", initialize);
