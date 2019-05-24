window.onload = init;
var data_result = "";
var data_text = "";
var index = 0;
var intervalId = 0;
var audio_num = 1;

var study_id = 1;
var study_group = "youerhanyu1Gp1";
var study_group_name = "第一组";

function init() {
  document.getElementById("goToStudy").addEventListener("click", goToStudy);
  document.getElementById("getText").addEventListener("click", getText);
  document
    .getElementById("getGroupList")
    .addEventListener("click", getGroupList);
  document.getElementById("getDataList").addEventListener("click", getDataList);
  getData();
}

function getData() {
  fetch("raw/db.json")
    .then(res => res.json())
    .then(data => {
      data_result = data;
    })
    .catch(err => console.log(err));

  fetch("raw/introduction.txt")
    .then(res => res.text())
    .then(data => {
      data_text = data;
    })
    .catch(err => console.log(err));
}

function prepareToStudy(id, group, groupName) {
  study_id = id;
  study_group = group;
  study_group_name = groupName;
  goToStudy();
}

function goToStudy() {
  stopStudy();
  study();
  intervalId = setInterval(
    function () {
      study();
    },
    2000,
    5
  );
}

function study() {
  if (index >= data_result[study_group].length) {
    pauseStudy();
  } else {
    let item = data_result[study_group][index++];
    let prev_item = "";
    let next_item = "";
    if (study_id >= 1) {
      prev_item = `<button class="btn btn-success mr-4" onclick="changeGroup(${study_id -
        1})" id="prevGroup">上一组</button>`;
    }
    if (study_id < data_result["groups"].length - 1) {
      next_item = `<button class="btn btn-success mr-4" onclick="changeGroup(${study_id +
        1})" id="nextGroup">下一组</button>`;
    }
    output = `
            <h2 class="mb-4">${study_group_name}</h2>
            <div class = 'list-group-item'>
                <h1 class="display-4 mb-4 text-center">${item.displayName}</h1>
                <audio src = "audio/${
                  item.soundUrl
                }.mp3" id="audioPlayer"></audio>
                <input type="button" class="btn btn-primary mr-4" id="pauseStudy" value="停止">
            </div>
            <h2 class="mb-4 text-right">${prev_item} ${next_item}</h2>
            `;
    document.getElementById("output").innerHTML = output;
    document.getElementById("pauseStudy").addEventListener("click", pauseStudy);
    playSound("audioPlayer");
  }
}

function changeGroup(study_id) {
  let tmp_group = data_result["groups"][study_id]["group"];
  let tmp_group_name = data_result["groups"][study_id]["name"];
  prepareToStudy(study_id, tmp_group, tmp_group_name);
}

function stopStudy() {
  index = 0;
  clearInterval(intervalId);
  if (document.getElementById("audioPlayer") != null) {
    stopSound("audioPlayer");
  }
}

function pauseStudy() {
  stopStudy();
  document.getElementById("pauseStudy").value = "开始";
  document.getElementById("pauseStudy").addEventListener("click", goToStudy);
}

function getText() {
  stopStudy();
  data_text = data_text.replace(/(?:\r\n|\r|\n)/g, "<br>");
  let output = "<div class = 'list-group-item'>" + data_text + "</div>";
  document.getElementById("output").innerHTML = output;
}

function getGroupList(group, groupName) {
  stopStudy();
  let output = "";
  data_result["groups"].forEach(function (item) {
    output += `
            <h2 class="btn-info mb-4" onclick = "prepareToStudy(${item.id}, '${
      item.group
    }', '${item.name}')">${item.name}</h2>
            `;
  });
  document.getElementById("output").innerHTML = output;
}

function getGroup(group, groupName) {
  let i = 1;
  output = `
        <h2 class="mb-4">${groupName}</h2>
        <ul class="list-group mb-3">
    `;
  data_result[group].forEach(function (item) {
    output += `
            <li class="list-group-item" onclick="playSound('audioPlayer_${i}')" >${i}:  <b> ${
      item.displayName
    }</b>
                <audio src = "audio/${
                  item.soundUrl
                }.mp3" id="audioPlayer_${i++}"></audio>
            </li>
        `;
  });
  output += "</ul>";
  document.getElementById("output").innerHTML = output;
}

function getDataList() {
  stopStudy();
  audio_num = 1;
  let output = "";
  data_result["groups"].forEach(function (item) {
    output += `
            <h2 class="btn-info mb-4" onclick = "getGroup('${item.group}', '${
      item.name
    }')">${item.name}</h2>
            `;
    let output_item = displayItems(`${item.group}`);
    output += output_item;
  });
  document.getElementById("output").innerHTML = output;
}

function displayItems(group) {
  output = `
        <ul class="list-group mb-3">
    `;
  data_result[group].forEach(function (item) {
    output += `
            <li class="list-group-item" onclick="playSound('audioPlayer_${audio_num}')">${
      item.id
    }: ${item.displayName}
                <audio src = "audio/${
                  item.soundUrl
                }.mp3" id="audioPlayer_${audio_num++}"></audio>
            </li>
        `;
  });
  output += "</ul>";
  return output;
}

function playSound(e) {
  var player = document.getElementById(e);
  player.play();
}

function stopSound(e) {
  var player = document.getElementById(e);
  player.pause();
}