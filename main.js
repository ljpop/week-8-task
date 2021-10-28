const container = document.querySelector('.video-container');
const video = document.querySelector('.video');
const playIcon = document.getElementById('play-icon');
const volumeIcon = document.getElementById('volume-icon');
const volumeLine = document.querySelector('.volume-line');
const volumeBar = document.querySelector('.volume-bar');
const speed = document.querySelector('.player-speed');
const currentTime = document.querySelector('.current-time');
const duration = document.querySelector('.end-time');
const progressSpan = document.querySelector('.progress-span');
const progressBar = document.querySelector('.current-progress');
const fullscreenIcon = document.querySelector('.fullscreen');


/*FUNCTIONS*/
function showPlay() {
    playIcon.classList.replace('fa-pause', 'fa-play');
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
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

function spanUpdate() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${showTime(video.currentTime)} /`;
    duration.textContent = `${showTime(video.duration)}`;
}

function spanTime(e) {
    const newTime = e.offsetX / progressSpan.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}


let endVolume = 1;

function changeVolume(e) {
    let volume = e.offsetX / volumeLine.offsetWidth;
    if (volume < 0.1) {
        volume = 0;
    }
    if (volume > 0.9) {
        volume = 1;
    }
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;

    volumeIcon.className = '';
    if (volume > 0.7) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (volume < 0.7 && volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-off');
    }
    endVolume = volume;
}

//Mute
function toggleMute() {
    volumeIcon.className = '';
    if (video.volume) {
        endVolume = video.volume;
        video.volume = 0;
        volumeIcon.classList.add('fas', 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
        volumeBar.style.width = 0;
    } else {
        video.volume = endVolume;
        volumeIcon.classList.add('fas', 'fa-volume-up');
        volumeIcon.setAttribute('title', 'Mute');
        volumeBar.style.width = `${endVolume * 100}%`;
    }
}

function changeSpeed() {
    video.playbackRate = speed.value;
}

function fullScreenMode() {
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

playIcon.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', showPlay);

video.addEventListener('timeupdate', spanUpdate);
video.addEventListener('canplay', spanUpdate);
progressSpan.addEventListener('click', spanTime);
volumeLine.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenIcon.addEventListener('click', fullScreenMode);