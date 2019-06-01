window.onload = init;
var data_book = "";
var opage = 1;

function init() {
    getData();
}

function getData() {
    fetch("raw/book4.json")
        .then(res => res.json())
        .then(data => {
            data_book = data;
            loadPage();
        })
        .catch(err => { console.log(err); });
}

function loadPage() {
    if (opage >= 66) {
        return;
    }
    let output = `
    <img src="img/youerhanyu4/img${opage}.jpg" usemap="#image-map" />
        <map name="image-map">`;
    data_book["book4"].forEach(function (item) {
        if (item.page == opage) {
            output += `
            <area shape="rect" alt="${item.name}" title="${item.name}" onclick="playSound('audio_${item.id}')" coords="${item.coords}">
            <audio src = "audio/book4/${item.serverUrl}" id="audio_${item.id}"></audio>
            `;
        }
    });
    if (opage == 1) { } else {
        output += `
            <area shape="rect" alt="上一页" title="上一页" onclick="prePage(); loadPage()" coords="1,1,50,787">
        `;
    }
    output += `
    <area shape="rect" alt="下一页" title="下一页" onclick="nextPage(); loadPage()" coords="512,4,564,787">
    </map>`;
    console.log(output);
    console.log('opage = ', opage);
    document.getElementById("output").innerHTML = output;
}

function prePage() {
    opage--;
}

function nextPage() {
    opage++;
}
function playSound(e) {
    var player = document.getElementById(e);
    player.play();
}