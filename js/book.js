window.onload = init;
var data_book = "";
var opage = 1;
var book = 'book4';

function init() {
    let urlp = []; u = location.search.replace("?", "").split("&").forEach(function (d) { e = d.split("="); urlp[e[0]] = e[1]; });
    book = urlp['book'];
    getData();
}

function getData() {
    fetch("raw/book.json")
        .then(res => res.json())
        .then(data => {
            data_book = data;
            loadPage();
        })
        .catch(err => { console.log(err); });
}

function loadPage() {
    if (opage >= 67) {
        return;
    }
    let output = `
    <img src="img/${book}/img${opage}.jpg" usemap="#image-map" />
        <map name="image-map">`;
    data_book[book].forEach(function (item) {
        if (item.page == opage) {
            if (item.page == 3 && item.lesson_id == -1) {
                output += `
                <area shape="rect" alt="${item.name}" title="${item.name}" onclick="lessonPage(${item.serverUrl}); loadPage()" coords="${item.coords}">
                `;
            } else {
                output += `
                <area shape="rect" alt="${item.name}" title="${item.name}" onclick="playSound('audio_${item.id}')" coords="${item.coords}">
                <audio src = "audio/${book}/${item.serverUrl}" id="audio_${item.id}"></audio>
                `;
            }
        }
    });
    if (opage == 1) { } else {
        output += `
            <area shape="rect" alt="上一页" title="上一页" onclick="prePage(); loadPage()" coords="1,1,50,787">
        `;
    }
    output += `
    <area shape="rect" alt="下一页" title="下一页" onclick="nextPage(); loadPage()" coords="512,4,564,787">
    <area shape="rect" alt="返回目录" title="返回目录" onclick="indexPage(); loadPage()" coords="1,-1,564,71">
    </map>`;
    document.getElementById("output").innerHTML = output;
}

function prePage() {
    opage--;
}

function nextPage() {
    opage++;
}
function indexPage() {
    opage = 3;
}
function lessonPage(lesson) {
    opage = lesson;
    console.log('opage = ', opage);
}
function playSound(e) {
    var player = document.getElementById(e);
    player.play();
}
var previuosAudio;
document.addEventListener('play', function (e) {
    if (previuosAudio && previuosAudio != e.target) {
        previuosAudio.pause();
    }
    previuosAudio = e.target;
}, true);