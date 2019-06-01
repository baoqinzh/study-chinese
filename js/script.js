window.onload = init;
var data_result = "";
var data_text = "";
var index = 0;
var intervalId = 0;
var audio_num = 1;

var study_id = 0;
var study_group = "youerhanyu1Gp1";
var study_group_name = "第一组";
var soundImg = "img/speaker.png"
var ifLoadSound = false;
var button_color = ['btn-primary', 'btn-success', 'btn-warning'];
var practice_num = 0;
var practice_max_num = 5;
var add_max_total = 10;
var sub_max_total = 10;
var real_math_oper = [];

function init() {
  document.getElementById("goToStudy").addEventListener("click", goToStudy);
  document.getElementById("getText").addEventListener("click", getText);
  document.getElementById("goToPractice").addEventListener("click", goToPractice);
  document.getElementById("goToMath").addEventListener("click", goToMath);
  document.getElementById("getGroupList").addEventListener("click", getGroupList);
  document.getElementById("getDataList").addEventListener("click", getDataList);
  document.getElementById("getTextBook4").addEventListener("click", getTextBook4);

  getData();
}

function getTextBook4() {
  var params = [
    'height=' + screen.height,
    'width=750' + //screen.width,
    'fullscreen=yes' + // only works in IE, but here for completeness
    'scrollbars=no' +
    'resizable=yes'
  ].join(',');

  var popup = window.open('youerhanyu4.html', 'popup_window', params);
  popup.moveTo(0, 0);
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
  let output = "";
  if (index >= data_result[study_group].length) {
    pauseStudy();
  } else {
    let item = data_result[study_group][index++];
    let prev_group = "";
    let next_group = "";
    if (study_id >= 1) {
      prev_group = `<button class="btn btn-success mr-4" onclick="changeStudyGroup(${study_id -
        1})" id="prevGroup">上一组</button>`;
    }
    if (study_id < data_result["groups"].length - 1) {
      next_group = `<button class="btn btn-success mr-4" onclick="changeStudyGroup(${study_id +
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
            <h2 class="mb-4 text-right">${prev_group} ${next_group}</h2>
            `;
    document.getElementById("output").innerHTML = output;
    document.getElementById("pauseStudy").addEventListener("click", pauseStudy);
    playSound("audioPlayer");
  }
}

function changeStudyGroup(tmp_study_id) {
  changeGroup(tmp_study_id);
  goToStudy();
}
function changeGroup(tmp_study_id) {
  study_id = tmp_study_id;
  study_group = data_result["groups"][study_id]["group"];
  study_group_name = data_result["groups"][study_id]["name"];
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
            <h2 class="btn-info mb-4" onclick = "changeStudyGroup(${item.id})">${item.name}</h2>
            `;
  });
  document.getElementById("output").innerHTML = output;
}

function getGroup(group, groupName) {
  let i = 1;
  let output = `
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
  let output = `
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

function goToPractice() {
  loadSound();
  stopStudy();
  index = 0;
  practice();
}

function changePracticeGroup(tmp_study_id) {
  changeGroup(tmp_study_id);
  goToPractice();
}

function practice() {
  let tmp_id_arry = [];
  let output = "";
  if (index >= data_result[study_group].length) {
    let prev_group = "";
    let next_group = "";
    if (study_id >= 1) {
      prev_group = `<button class="btn btn-success mr-4" onclick="changePracticeGroup(${study_id - 1})" id="prevGroup">上一组</button>`;
    }
    if (study_id < data_result["groups"].length - 1) {
      next_group = `<button class="btn btn-success mr-4" onclick="changePracticeGroup(${study_id + 1})" id="nextGroup">下一组</button>`;
    }
    output = `
      <h2 class="mb-4 text-right">${prev_group} ${next_group}</h2>
    `;
    document.getElementById("output").innerHTML += output;
  } else {
    let study_item = data_result[study_group][index];
    let study_id = study_item.id;
    let item;
    output = `
            <h2 class="mb-4">${study_group_name}</h2>
            <div class = 'list-group-item'>
                <h4 class="mb-4 text-right"><img src = '${soundImg}' class = 'img-thumbnail' style="width:50px;height:50px;" onclick = "playSound('audioPlayer')"></h4>                
            `;
    for (let i = 0; i < data_result[study_group].length - 1; i++) {
      let item = data_result[study_group][getRandomInt(data_result[study_group].length)];
      tmp_id_arry[i] = item.id;
      output += `<input type="button" class="btn ${getButtonColor()} mr-4" id="${item.id}" onclick="checkStudyAnswer(${study_id}, ${item.id})" value="${item.displayName}">`;
    }
    //append the last item; if cannot get the study_item in tmp_id_arry, then add it, else append a random item
    if (!tmp_id_arry.includes(study_id)) {
      tmp_id_arry[data_result[study_group].length - 1] = study_id;
      output += `<input type="button" class="btn ${getButtonColor()} mr-4" id="${study_id}" onclick="checkStudyAnswer(${study_id}, ${study_id})" value="${study_item.displayName}">`;
    } else {
      item = data_result[study_group][getRandomInt(data_result[study_group].length)];
      output += `<input type="button" class="btn ${getButtonColor()} mr-4" id="${item.id}" onclick="checkStudyAnswer(${study_id}, ${item.id})" value="${item.displayName}">`;
    }
    output += `  <audio src = "audio/${study_item.soundUrl}.mp3" id="audioPlayer"></audio>
            </div>
            `;
    document.getElementById("output").innerHTML = output;
    playSound("audioPlayer");
  }
}

function checkAnswer(item_1, item_2) {
  let random_right_num = getRandomInt(data_result['rightSoundPool'].length);
  let random_wrong_num = getRandomInt(data_result['wrongSoundPool'].length);
  if (item_1 != item_2) {
    playSound('wrong' + random_wrong_num);
    return false;
  } else {
    playSound('right' + random_right_num);
    return true;
  }
}
function checkStudyAnswer(study_id, id) {
  if (checkAnswer(study_id, id)) {
    setTimeout(function () {
      if (index < data_result[study_group].length) {
        index = index + 1;
        practice();
      }
    }, 2000);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function loadSound() {
  if (ifLoadSound) {
  } else {
    ifLoadSound = true;
    let output = "";
    let rightSoundPool = [];
    let wrongSoundPool = [];
    for (let i = 0; i < data_result['rightSoundPool'].length; i++) {
      let sound = data_result['rightSoundPool'][i]['soundUrl'];
      let sound_id = data_result['rightSoundPool'][i]['id'];
      rightSoundPool[i] = sound;
      output += `
        <audio src = 'audio/${sound}.mp3' id = 'right${sound_id}'></audio>
        `;
    }
    for (let i = 0; i < data_result['wrongSoundPool'].length; i++) {
      let sound = data_result['wrongSoundPool'][i]['soundUrl'];
      let sound_id = data_result['wrongSoundPool'][i]['id'];
      wrongSoundPool[i] = sound;
      output += `
        <audio src = 'audio/${sound}.mp3' id = 'wrong${sound_id}'></audio>
        `;
    }
    document.getElementById("autoplay").innerHTML = output;
  }
}

function goToMath() {
  stopStudy();
  loadSound();
  let output = `
    <form>
      <div class = 'list-group-item'>
        <h3 class="mb-4 text-center">家长设置</h3>
        <h5 class="mb-4 text-left">题目总数:
          <input type = 'number' id = 'practice_max_num' style='width:100px' value='5'>
        </h5>
        <h5 class="mb-4 text-left"><input type="checkbox" name="mathOper" value="+" checked>加法，总和不超过:
        <input type = 'number' id = 'add_max_total' style='width:100px' value='10'>
        </h5>
        <h5 class="mb-4 text-left"><input type="checkbox" name="mathOper" value="-">减法，被减数不超过:
          <input type = 'number' id = 'sub_max_total' style='width:100px' value='10'>
        </h5>
        <h5 class="">
        <input type = 'button' class="btn btn-success mr-4" value='开始' onclick = mathOperation()>
        </h5>
      </div>
    </form>
  `;
  document.getElementById("output").innerHTML = output;
}

function mathOperation() {
  var mathOper = document.forms[0];
  checkPracticeMaxNum();
  practice_num = 0;
  add_max_total = document.getElementById('add_max_total').value;
  sub_max_total = document.getElementById('sub_max_total').value;
  real_math_oper = [];
  for (let i = 0; i < mathOper.length; i++) {
    if (mathOper[i].checked) {
      real_math_oper.push(mathOper[i].value);
    }
  }
  next_math_practice();
}

function next_math_practice() {
  if (practice_num < practice_max_num) {
    practice_num = practice_num + 1;
    let tmp_oper = "";
    if (real_math_oper.length <= 1) {
      tmp_oper = real_math_oper;
    } else {
      tmp_oper = real_math_oper[getRandomInt(real_math_oper.length)];
    }
    let output = "";
    let num_1 = 0;
    let num_2 = 0;
    if (tmp_oper == "+") {
      num_1 = getRandomInt(add_max_total);
      num_2 = getRandomInt(add_max_total - num_1);
      output = math_out_put('+', num_1, num_2);
    } else if (tmp_oper == "-") {
      num_1 = getRandomInt(sub_max_total);
      num_2 = getRandomInt(num_1);
      output = math_out_put('-', num_1, num_2);
    }

    document.getElementById("output").innerHTML = output;
    document.getElementById("num_total").focus();
  } else {
    complete();
  }
}

function math_out_put(operater, num_1, num_2) {
  return `
  <div class = 'list-group-item'>
      <h3 class="mb-4 text-right"><input type = 'number' id='num_1' style='display:none' value = ${num_1}>${num_1}</h3>
      <h3 class="mb-4 text-right"><input type = 'number' id='num_2' style='display:none' value = ${num_2}>${operater}${num_2}</h3>
      <h3 class="mb-4 text-right">______</h3>
      <h3 class="mb-4 text-right">
      <input type = 'number' id = 'num_total' style='width:100px' onChange='checkMathAnswer("${operater}")'></h3>
    </div>
  `;
}

function complete() {
  let output = `
  <div class = 'list-group-item'>
      <h2 class="mb-4 text-center">恭喜您完成任务！</h2>
      <h4 class="mb-4 text-center"><img src = 'img/fireworks.gif' ></h4>   
      </h3>
  </div>
  `;
  document.getElementById("output").innerHTML = output;
}

function checkPracticeMaxNum() {
  practice_max_num = document.getElementById('practice_max_num').value;
  if (practice_max_num <= 0) {
    alert('题目总数不能小于等于0！');
    document.getElementById('practice_max_num').value = 5;
    document.getElementById('practice_max_num').focus();
    return false;
  } else if (practice_max_num > 20) {
    alert('题目总数太多了，宝宝会累到的。请减少题目数量到20！');
    document.getElementById('practice_max_num').value = 20;
    document.getElementById('practice_max_num').focus();
    return false;
  }
  return true;
}

function checkMathAnswer(operater) {
  let num_total = document.getElementById('num_total').value;
  let num_1 = Number(document.getElementById('num_1').value);
  let num_2 = Number(document.getElementById('num_2').value);
  let tmp_num_total = 0;
  if (operater == '+') {
    tmp_num_total = num_1 + num_2;
  } else if (operater == '-') {
    tmp_num_total = num_1 - num_2;
  }
  if (checkAnswer(num_total, tmp_num_total)) {
    next_math_practice();
  } else {
    document.getElementById('num_total').focus();
  }
}
function playSound(e) {
  var player = document.getElementById(e);
  player.play();
}

function stopSound(e) {
  var player = document.getElementById(e);
  player.pause();
}

function getButtonColor() {
  return button_color[getRandomInt(3)];
}