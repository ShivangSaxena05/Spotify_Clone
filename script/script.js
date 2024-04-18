let currentsong = new Audio();
let songs;
let currentfolder;
function secondsToMinutes(seconds) {
    // Ensure we have a valid number
    if (isNaN(seconds)) {
        return "0:00"
    }
    seconds = Math.max(0, Math.floor(Math.abs(seconds)));

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad seconds with a leading zero if necessary
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${minutes}:${paddedSeconds}`;
}
async function getsong(folder) {
    currentfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    let songul = document.querySelector(".list").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML += `<li><img class="invert" src="assets/musicicon.svg" alt="">
                  <div class="song-details">
                    <div class="songname"> ${song.replaceAll("%20", " ")}</div>
                    <div>Song details</div>
                  </div>
                  <div class="playing">
                    <span>Play Now</span>
                    <img src="assets/play2.svg" alt="">
                  </div></li>`
    }
    Array.from(document.querySelector(".list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".song-details").firstElementChild.innerHTML.trim())
            document.querySelector(".circle").style.left = "0%"
        })
    })
    return songs
}
const playmusic = ((track, pause) => {
    currentsong.src = `${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "assets/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ")
})

async function albums() {
    let cardcontainer = document.querySelector(".card-container")
    let a = await fetch(`songs`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if (e.href.includes("songs/") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0]
                let a = await fetch(`/songs/${folder}/info.json`)
                let response = await a.json()
                cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div  class="play">
                <button class="playbutton">
                    <img src="assets/play.svg" alt="" />
                </button>
                </div>
                
                <img
                src="/songs/${folder}/cover.jpg"
                alt=""
                />
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>`
            }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async element => {
            songs = await getsong(((`songs/${element.currentTarget.dataset.folder}`)))
            playmusic(songs[0])
})
})
}

async function main() {
    await getsong("songs/Arjit-Singh-Album")
    playmusic(songs[0], true)
    await albums()


    let play = document.getElementById("play")
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "assets/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "assets/play2.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    document.querySelector(".slidebar").addEventListener("click", e => {
        let time = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = time + "%"
        currentsong.currentTime = (currentsong.duration * time) / 100
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })
    let previous = document.getElementById("prev")
    let next = document.getElementById("next")
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
        else {
            previous.removeEventListener
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        let volume = e.target.value
        currentsong.volume = parseInt(volume) / 100
        document.querySelector(".volimg").src="assets/volume.svg"
    })
    document.querySelector(".volimg").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            currentsong.volume = 0
           e.target.src = e.target.src.replace("volume.svg","mute.svg")
           document.querySelector(".range").getElementsByTagName("input")[0].value = 0
}
        else{
            currentsong.volume = .1
           e.target.src = e.target.src.replace("mute.svg","volume.svg")
           document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
         
    })

}
main()
