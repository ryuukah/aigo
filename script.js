const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const backwardButton = document.getElementById("backward");
const forwardButton = document.getElementById("forward");

const volumeUpButton = document.getElementById("volumeUp");
const volumeDownButton = document.getElementById("volumeDown");

const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressKnob = document.getElementById("progressKnob");

const currentTimeDisplay = document.getElementById("currentTime");

const shuffleButton = document.getElementById("shuffleButton");
const repeatButton = document.getElementById("repeatButton");


/* =========================
   INITIAL SETTINGS
========================= */

audio.volume = 0.8;

let repeatEnabled = false;


/* =========================
   PLAY / PAUSE
========================= */

playButton.addEventListener("click", () => {

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }

});


/* Change the button between PLAY and PAUSE */

audio.addEventListener("play", () => {

    playButton.classList.add("playing");

    playButton.setAttribute("aria-label", "Pause");

});


audio.addEventListener("pause", () => {

    playButton.classList.remove("playing");

    playButton.setAttribute("aria-label", "Play");

});


/* =========================
   BACKWARD 10 SECONDS
========================= */

backwardButton.addEventListener("click", () => {

    audio.currentTime = Math.max(
        0,
        audio.currentTime - 10
    );

});


/* =========================
   FORWARD 10 SECONDS
========================= */

forwardButton.addEventListener("click", () => {

    audio.currentTime = Math.min(
        audio.duration || 0,
        audio.currentTime + 10
    );

});


/* =========================
   PROGRESS BAR
========================= */

audio.addEventListener("timeupdate", updateProgress);


function updateProgress() {

    if (!audio.duration || !isFinite(audio.duration)) {
        return;
    }

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = `${percentage}%`;

    progressKnob.style.left = `${percentage}%`;

    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);

}


/* =========================
   CLICK PROGRESS BAR
========================= */

progressContainer.addEventListener("click", (event) => {

    if (!audio.duration || !isFinite(audio.duration)) {
        return;
    }

    const rect =
        progressContainer.getBoundingClientRect();

    const clickPosition =
        event.clientX - rect.left;

    const percentage =
        clickPosition / rect.width;

    audio.currentTime =
        percentage * audio.duration;

});


/* =========================
   DRAG PROGRESS KNOB
========================= */

let dragging = false;


progressContainer.addEventListener("mousedown", () => {
    dragging = true;
});


document.addEventListener("mouseup", () => {
    dragging = false;
});


document.addEventListener("mousemove", (event) => {

    if (!dragging || !audio.duration) {
        return;
    }

    const rect =
        progressContainer.getBoundingClientRect();

    let percentage =
        (event.clientX - rect.left) / rect.width;

    percentage =
        Math.max(0, Math.min(1, percentage));

    audio.currentTime =
        percentage * audio.duration;

});


/* =========================
   VOLUME UP
========================= */

volumeUpButton.addEventListener("click", () => {

    audio.volume =
        Math.min(1, audio.volume + 0.1);

});


/* =========================
   VOLUME DOWN
========================= */

volumeDownButton.addEventListener("click", () => {

    audio.volume =
        Math.max(0, audio.volume - 0.1);

});


/* =========================
   REPEAT
========================= */

repeatButton.addEventListener("click", () => {

    repeatEnabled = !repeatEnabled;

    if (repeatEnabled) {
        repeatButton.classList.add("active");
    } else {
        repeatButton.classList.remove("active");
    }

});


/* =========================
   SHUFFLE
========================= */

shuffleButton.addEventListener("click", () => {

    /*
       This example only has one song,
       so shuffle doesn't have another
       song to switch to.

       The button still gives visual feedback.
    */

    shuffleButton.classList.toggle("active");

});


/* =========================
   WHEN AUDIO ENDS
========================= */

audio.addEventListener("ended", () => {

    if (repeatEnabled) {

        audio.currentTime = 0;
        audio.play();

    } else {

        audio.currentTime = 0;

        progressBar.style.width = "0%";
        progressKnob.style.left = "0%";

        currentTimeDisplay.textContent = "0:00";

    }

});


/* =========================
   FORMAT TIME
========================= */

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;

}
