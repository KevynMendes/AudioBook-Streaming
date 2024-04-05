const audioCapitulo = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");
const quantidadeCapitulos = 17;
const nomeCapitulo = document.getElementById("capitulo");
let taTocando = false;
let capitulo = 1;

botaoPlayPause.addEventListener("click", tocarOuPausarFaixa);
botaoProximoCapitulo.addEventListener("click", proximoCapitulo);
botaoCapituloAnterior.addEventListener("click", capituloAnterior);
audioCapitulo.addEventListener("ended", proximoCapitulo);

function tocarFaixa() {
    botaoPlayPause.classList.remove("bi-play-circle");
    botaoPlayPause.classList.add("bi-pause-circle");
    audioCapitulo.play();
    taTocando = true;
}

function pausarFaixa() {
    botaoPlayPause.classList.add("bi-play-circle");
    botaoPlayPause.classList.remove("bi-pause-circle");
    audioCapitulo.pause();
    taTocando = false;
}

function tocarOuPausarFaixa() {
    if (taTocando === true) {
        pausarFaixa();
    } else {
        tocarFaixa();
    }
}

function proximoCapitulo() {
    if (capitulo < quantidadeCapitulos) {
        capitulo += 1;
    } else {
        capitulo = 1;
    }

    audioCapitulo.src = "./src/books/paginas-recolidas/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Sessão " + capitulo;
    tocarFaixa();
}

function capituloAnterior() {
    if (capitulo === 1) {
        capitulo = quantidadeCapitulos;
    } else {
        capitulo -= 1;
    }

    audioCapitulo.src = "src/books/paginas-recolidas/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Sessão " + capitulo;
    tocarFaixa();
}

const botaoVoltar15 = document.getElementById("voltar15");
const botaoAvancar15 = document.getElementById("avancar15");

botaoVoltar15.addEventListener("click", voltar15Segundos);

botaoAvancar15.addEventListener("click", avancar15Segundos);

function avancar15Segundos() {
    audioCapitulo.currentTime += 15;
}

function voltar15Segundos() {
    audioCapitulo.currentTime -= 15;
}


function adjustVolume(volume) {
    audioCapitulo.volume = volume;
}

var volumeControl = document.getElementById("volumeControl");
var volume = 0.5; 

audioCapitulo.volume = volume;


function updateVolume(newVolume) {
    volume = newVolume;
    audioCapitulo.volume = volume;
}

function toggleMute() {
    if (audioCapitulo.muted) {
        audioCapitulo.muted = false; // Desmutar o áudio
        document.getElementById("vol").classList.remove("bi-volume-mute-fill");
        document.getElementById("vol").classList.add("bi-volume-up-fill");
    } else {
        audioCapitulo.muted = true; // Mutar o áudio
        document.getElementById("vol").classList.remove("bi-volume-up-fill");
        document.getElementById("vol").classList.add("bi-volume-mute-fill");
    }
}
volumeControl.addEventListener("wheel", function(event) {
    event.preventDefault(); 

    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    var newVolume = Math.max(0, Math.min(1, volume + (delta * 0.05)));

    updateVolume(newVolume);
    updateVolumeSliderPosition();
});

var isDragging = false;

volumeControl.addEventListener("mousedown", function(event) {
    isDragging = true;
    updateVolumeOnClick(event);
});

document.addEventListener("mousemove", function(event) {
    if (isDragging) {
        updateVolumeOnClick(event);
    }
});

document.addEventListener("mouseup", function() {
    isDragging = false;
});

function updateVolumeOnClick(event) {
    var boundingRect = volumeControl.getBoundingClientRect();
    var offsetX = event.clientX - boundingRect.left;
    var width = boundingRect.width;
    var newVolume = Math.max(0, Math.min(1, offsetX / width));

    updateVolume(newVolume);
    updateVolumeSliderPosition();
}
function updateVolumeSliderPosition() {
    var thumbWidth = volumeControl.offsetWidth * volume;
    volumeControl.style.setProperty("--thumb-position", thumbWidth + "px");
}

window.addEventListener("load", updateVolumeSliderPosition)

function updateProgressSlider() {
    var progressSlider = document.getElementById("progressSlider");
    var progress = (audioCapitulo.currentTime / audioCapitulo.duration) * 100;
    progressSlider.value = progress;
}

function seekTo(progress) {
    var seekToTime = (progress / 100) * audioCapitulo.duration;
    audioCapitulo.currentTime = seekToTime;
}
audioCapitulo.addEventListener("timeupdate", function() {
    updateProgressSlider();
    updateCurrentTime();
});

function updateCurrentTime() {
    var currentTimeElement = document.getElementById("currentTime");
    currentTimeElement.textContent = formatTime(audioCapitulo.currentTime);
}

progressSlider.addEventListener("input", function() {
    updateCurrentTime();
});

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

progressSlider.addEventListener("input", function() {
    updateCurrentTime();
});

function updateRemainingTime() {
    var remainingTimeElement = document.getElementById("remainingTime");
    var remainingTime = audioCapitulo.duration - audioCapitulo.currentTime;
    remainingTimeElement.textContent = "-" + formatTime(remainingTime);
}
audioCapitulo.addEventListener("timeupdate", function() {
    updateRemainingTime();
});

progressSlider.addEventListener("input", function() {
    updateRemainingTime();
});

progressSlider.addEventListener("input", function(event) {

    var progress = event.target.value;

    seekTo(progress);
});

const selectCapitulo = document.getElementById("selectCapitulo");

for (let i = 1; i <= quantidadeCapitulos; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = "Sessão " + i;
    selectCapitulo.appendChild(option);
}

selectCapitulo.addEventListener("change", function() {
    capitulo = parseInt(selectCapitulo.value);
    audioCapitulo.src = `./src/books/paginas-recolidas/${capitulo}.mp3`;
    nomeCapitulo.innerText = "Sessão " + capitulo;
    tocarFaixa();
});