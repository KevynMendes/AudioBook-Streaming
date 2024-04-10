const audioCapitulo = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");
const quantidadeCapitulos = 10;
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

    audioCapitulo.src = "./src/books/dom-casmurro/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Capítulo " + capitulo;
    tocarFaixa();
}

function capituloAnterior() {
    if (capitulo === 1) {
        capitulo = quantidadeCapitulos;
    } else {
        capitulo -= 1;
    }

    audioCapitulo.src = "./src/books/dom-casmurro/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Capítulo " + capitulo;
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
    option.textContent = "Capítulo " + i;
    selectCapitulo.appendChild(option);
}

selectCapitulo.addEventListener("change", function() {
    capitulo = parseInt(selectCapitulo.value);
    audioCapitulo.src = `./src/books/dom-casmurro/${capitulo}.mp3`;
    nomeCapitulo.innerText = "Capítulo " + capitulo;
    tocarFaixa();
});

function selectBook(bookId) {
    localStorage.setItem('selectedBook', bookId);
    window.location.href = 'audiobook.html';
}


function selectBook(bookId) {
    let bookInfoModal = document.getElementById('bookInfoModal');
    let bookTitle = document.getElementById('bookTitle');
    let bookAuthor = document.getElementById('bookAuthor');
    let bookGenre = document.getElementById('bookGenre');
    let bookDescription = document.getElementById('bookDescription');
    let bookCapitulos = document.getElementById('bookCapitulos');
    let bookImage = document.getElementById('bookImage');

    switch (bookId) {
        case 'a-noite-na-taverna':
            bookTitle.textContent = "A Noite na Taverna";
            bookAuthor.textContent = "Autor: Álvares de Azevedo";
            bookGenre.textContent = "Genero: Contos";
            bookCapitulos.textContent = "7 Capítulos"
            bookDescription.textContent = "A Noite na Taverna é uma coleção de contos escrita por Álvares de Azevedo e publicada postumamente em 1855. A obra é composta por narrativas que exploram temas como amor, morte, traição e os limites da condição humana.";
            bookImage.src = "src/images/anoitenataverna.jpg";
            document.getElementById('redirectLink').href = 'a-noite-na-taverna.html';
            break;
        case 'a-reliquia':
            bookTitle.textContent = "A Relíquia";
            bookAuthor.textContent = "Autor: Eça de Queirós";
            bookGenre.textContent = "Genero: Romance";
            bookCapitulos.textContent = "25 Capítulos"
            bookDescription.textContent = "A Relíquia é um romance de Eça de Queirós, publicado em 1887. A obra narra a história de um jovem que herda uma relíquia religiosa e parte em uma viagem por Portugal em busca de sua identidade e espiritualidade.";
            bookImage.src = "src/images/a-reliquia.jpg";
            document.getElementById('redirectLink').href = 'a-noite-na-taverna.html';
            break;
        case 'contos-do-norte':
            bookTitle.textContent = "Contos do Norte";
            bookAuthor.textContent = "Autor: Marques de Carvalho";
            bookGenre.textContent = "Genero: Contos de Fadas";
            bookCapitulos.textContent = "8 Capítulos"
            bookDescription.textContent = "Contos do Norte é uma coleção de contos ambientados na região norte do Brasil. As histórias são, em geral, curtas e melancólicas, com os elementos da floresta, dos rios amazônicos e das populações ribeirinhas em destaque.";
            bookImage.src = "src/images/contos-do-norte.jpg";
            document.getElementById('redirectLink').href = 'a-reliquia.html';
            break;
        case 'dom-casmurro':
            bookTitle.textContent = "Dom Casmurro";
            bookAuthor.textContent = "Autor: Machado de Assis";
            bookGenre.textContent = "Genero: Romance";
            bookCapitulos.textContent = "10 Capítulos"
            bookDescription.textContent = "Dom Casmurro é um dos romances mais famosos do escritor brasileiro Machado de Assis, publicado originalmente em 1899. A obra narra a história de Bentinho, um jovem atormentado pela dúvida sobre a fidelidade de sua esposa Capitu.";
            bookImage.src = "src/images/dom-casmurro.jpg";
            document.getElementById('redirectLink').href = 'dom-casmurro.html';
            break;
        case 'memorias-postumas-de-bras-cubas':
            bookTitle.textContent = "Memórias Póstumas de Brás Cubas";
            bookAuthor.textContent = "Autor: Machado de Assis";
            bookGenre.textContent = "Genero: Romance";
            bookCapitulos.textContent = "32 Capítulos"
            bookDescription.textContent = "Memórias Póstumas de Brás Cubas é um romance de Machado de Assis, publicado em 1881. Considerado uma das obras-primas da literatura brasileira, o livro é narrado pelo próprio defunto Brás Cubas após sua morte.";
            bookImage.src = "src/images/memorias-postumas-de-bras-cubas.jpg";
            document.getElementById('redirectLink').href = 'memorias-postumas.html';
            break;
        case 'o-cortico':
            bookTitle.textContent = "O Cortiço";
            bookAuthor.textContent = "Autor: Aluísio Azevedo";
            bookGenre.textContent = "Genero: Romance Naturalista";
            bookCapitulos.textContent = "23 Capítulos"
            bookDescription.textContent = "O Cortiço é um romance do escritor brasileiro Aluísio Azevedo, publicado em 1890. A obra retrata a vida em um cortiço no Rio de Janeiro durante o século XIX, explorando temas como a luta de classes, a miscigenação e o determinismo social.";
            bookImage.src = "src/images/o-cortico.jpg";
            document.getElementById('redirectLink').href = 'o-cortico.html';
            break;
        case 'o-mandarim':
            bookTitle.textContent = "O Mandarim";
            bookAuthor.textContent = "Autor: Eça de Queirós";
            bookGenre.textContent = "Genero: Romance";
            bookCapitulos.textContent = "8 Capítulos"
            bookDescription.textContent = "O Mandarim é um romance satírico de Eça de Queirós, publicado em 1880. A obra critica a sociedade portuguesa da época, abordando temas como a corrupção, o fanatismo religioso e a hipocrisia.";
            bookImage.src = "src/images/o-mandarim.jpg";
            document.getElementById('redirectLink').href = 'o-mandarim.html';
            break;
        case 'paginas-recolhidas':
            bookTitle.textContent = "Páginas Recolhidas";
            bookAuthor.textContent = "Autor: Machado de Assis";
            bookGenre.textContent = "Genero: Contos";
            bookCapitulos.textContent = "17 Capítulos"
            bookDescription.textContent = "Páginas Recolhidas é uma coletânea de contos de Machado de Assis, publicada em 1899. Os contos presentes nesta obra exploram uma variedade de temas, desde o cotidiano até questões existenciais.";
            bookImage.src = "src/images/paginas-recolhidas.jpg";
            document.getElementById('redirectLink').href = 'paginas-recolidas.html';
            break;
        default:
            console.error('Livro não encontrado.');
            return;
    }

    bookInfoModal.style.display = 'block';
}

function hideBookInfoModal() {
    document.getElementById("bookInfoModal").style.display = "none";
}


