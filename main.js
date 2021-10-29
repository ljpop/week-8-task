const container = document.querySelector(".video-container");
const video = document.querySelector(".video");
const playIcon = document.getElementById("play-icon");
const volumeIcon = document.getElementById("volume-icon");
const volumeLine = document.querySelector(".volume-line");
const volumeBar = document.querySelector(".volume-bar");
const speed = document.querySelector(".player-speed");
const currentTime = document.querySelector(".current-time");
const duration = document.querySelector(".end-time");
const progressBar = document.querySelector(".progress-bar");
const progressCurr = document.querySelector(".current-progress");
const fullscreenIcon = document.querySelector(".fullscreen");
const controls = document.querySelector('.controls')

function showPlay() {
    playIcon.classList.replace("fa-pause", "fa-play");
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playIcon.classList.replace("fa-play", "fa-pause");
    } else {
        video.pause();
        showPlay();
    }
}

function showTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}: ${seconds}`;
}

function updateProgress() {
    progressCurr.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${showTime(video.currentTime)} /`;
    duration.textContent = `${showTime(video.duration)}`;
}

function changeTime(e) {
    const newTime = e.offsetX / progressBar.offsetWidth;
    progressCurr.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}

function jump(newTime) {
    progressCurr.style.width = `${newTime * 100}%`;
    video.currentTime = newTime;
    updateProgress();
}

function back5sec() {
    const newTime = video.currentTime - 5;
    jump(newTime);
}

function jump5sec() {
    const newTime = video.currentTime + 5;
    jump(newTime);
}

let currVolume = 1;

function showMuted() {
    volumeIcon.classList.replace("fa-volume-up", "fa-volume-mute");
    video.muted = true;
    currVolume = 0;
    localStorage.setItem("muted", video.muted)
}

function showUnMutde() {
    volumeIcon.classList.replace("fa-volume-mute", "fa-volume-up");
    video.muted = false;
    localStorage.setItem("muted", video.muted)
}

function setVolume() {
    video.volume = currVolume;
    volumeBar.style.width = `${currVolume * 100}%`;
    localStorage.setItem('currVolume', currVolume);
}

function changeVolume(e) {
    currVolume = e.offsetX / volumeLine.offsetWidth;
    if (currVolume < 0.1) {
        showMuted();
    } else {
        showUnMutde();
    }
    if (currVolume > 0.9) {
        currVolume = 1;
    }
    setVolume();
}

function toggleMute(e) {
    video.muted = !video.muted;
    localStorage.setItem("muted", video.muted)
    if (video.muted) {
        showMuted();
    } else {
        showUnMutde();
        currVolume = e.offsetX / volumeLine.offsetWidth;
    }
    setVolume();
}

function changeSpeed() {
    video.playbackRate = speed.value;
    localStorage.setItem('speed', speed.value);
}

function speedUp() {
    let currSpeed = Number(speed.value);
    currSpeed += 0.5;
    video.playbackRate = Math.min(currSpeed, 2);
    speed.value = Number(video.playbackRate);
}

function speedDown() {
    let currSpeed = Number(speed.value);
    currSpeed -= 0.5;
    video.playbackRate = Math.max(currSpeed, 0.5);
    speed.value = Number(video.playbackRate);
}

function fullScreenMode() {
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function savedValues() {
    let mutedSave = localStorage.getItem('muted');
    if (mutedSave === null) {
        localStorage.setItem('muted', false)
    } else {
        if (mutedSave != `${video.muted}`) {
            toggleMute();
        }
    }

    let speedSave = localStorage.getItem('speed');
    if (speedSave === null) {
        localStorage.setItem('speed', 1)
    } else {
        if (Number(speedSave) != `${video.playbackRate}`) {
            video.playbackRate = Number(speedSave);
            speed.value = Number(speedSave);
        }
    }

    let currVolumeSave = localStorage.getItem('currVolume');
    if (currVolumeSave === null) {
        localStorage.setItem('currVolume', 1)
    } else {
        if (Number(currVolumeSave) != `${video.volume}`) {
            video.volume = Number(currVolumeSave);
            currVolume = Number(currVolumeSave);
            volumeBar.style.width = `${currVolume * 100}%`;
        }
    }
}

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        togglePlay();
    }
    if (e.code === "ArrowRight") {
        jump5sec();
    }
    if (e.code === "ArrowLeft") {
        back5sec();
    }
    if (e.code === "NumpadAdd" || e.code === "Plus") {
        speedUp();
    }
    if (e.code === "NumpadSubtract" || e.code === "Minus") {
        speedDown();
    }
});

playIcon.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("ended", showPlay);

video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressBar.addEventListener("click", changeTime);

volumeLine.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toggleMute);

speed.addEventListener("change", changeSpeed);

fullscreenIcon.addEventListener("click", fullScreenMode);

setTimeout(function() { controls.classList.remove('opacity'); }, 5000);

video.addEventListener("loadedmetadata", savedValues);