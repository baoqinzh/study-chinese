window.onload = init;
var data_result = "";
var data_text = "";
var index = 1;
var intervalId = 0;
var audio_num = 1;

var lesson_id = 1;
var lesson = "1 你几岁了";
var soundImg = "img/speaker.png"
var ifLoadSound = false;
var button_color = ['btn-primary', 'btn-success', 'btn-warning', 'btn-info', 'btn-default'];
var practice_num = 0;
var practice_max_num = 5;
var add_max_total = 10;
var sub_max_total = 10;
var real_math_oper = [];

function init() {
  document.getElementById("goToStudy").addEventListener("click", goToStudy);
  document.getElementById("goToPractice").addEventListener("click", goToPractice);
  document.getElementById("goToMath").addEventListener("click", goToMath);
  document.getElementById("getGroupList").addEventListener("click", getGroupList);
  document.getElementById("getDataList").addEventListener("click", getDataList);
  document.getElementById("getTextBook4").addEventListener("click", getTextBook4);

  getData();
}

function getData() {
  fetch("raw/book.json")
    .then(res => res.json())
    .then(data => {
      data_result = data;
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
  if (index >= data_result["book4"].length) {
    pauseStudy();
  } else {
    let item = data_result["book4"][index++];
    let prev_lesson = "";
    let next_lesson = "";
    if (item.lesson_id == lesson_id) {
      if (lesson_id >= 2) {
        prev_lesson = `<button class="btn btn-success mr-4" onclick="changeStudyGroup(${lesson_id -
          1})" id="prevGroup">上一课</button>`;
      }
      if (lesson_id < data_result["lesson4"].length) {
        next_lesson = `<button class="btn btn-success mr-4" onclick="changeStudyGroup(${lesson_id +
          1})" id="nextGroup">下一课</button>`;
      }
      output = `
              <h2 class="mb-4">${lesson}</h2>
              <div class = 'list-group-item'>
                  <h1 class="display-4 mb-4 text-center">${item.name}</h1>
                  <audio src = "audio/book4/${
        item.serverUrl
        }" id="audioPlayer"></audio>
                  <input type="button" class="btn btn-primary mr-4" id="pauseStudy" value="停止">
              </div>
              <h2 class="mb-4 text-right">${prev_lesson} ${next_lesson}</h2>
              `;
      document.getElementById("output").innerHTML = output;
      document.getElementById("pauseStudy").addEventListener("click", pauseStudy);
      playSound("audioPlayer");
    } else {
      study();
    }
  }
}

function changeStudyGroup(tmp_lesson_id) {
  changeGroup(tmp_lesson_id);
  goToStudy();
}
function changeGroup(tmp_lesson_id) {
  lesson_id = tmp_lesson_id;
  lesson = data_result["lesson4"][tmp_lesson_id - 1].lesson;
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

function getGroupList(group, groupName) {
  stopStudy();
  let output = "";
  data_result["lesson4"].forEach(function (item) {
    output += `
            <h2 class="btn-info mb-4" onclick = "changeStudyGroup(${item.lesson_id})">${item.lesson}</h2>
            `;
  });
  document.getElementById("output").innerHTML = output;
}

function getGroup(lesson, name) {
  let i = 1;
  let output = `
        <h2 class="mb-4">${name}</h2>
        <ul class="list-group mb-3">
    `;
  let id_beg = data_result["lesson4"][lesson - 1].id_beg;
  let id_range = data_result["lesson4"][lesson - 1].id_range;
  for (i = 1; i <= id_range;) {
    if (data_result["book4"][id_beg].lesson_id != 0) {
      output += `
      <li class="list-group-item" onclick="playSound('audioPlayer_${i}')" >${i}:  <b> ${
        data_result["book4"][id_beg].name
        }</b>
          <audio src = "audio/book4/${
        data_result["book4"][id_beg].serverUrl
        }" id="audioPlayer_${i}"></audio>
      </li>
  `;
      i++;
    } else {

    }
    id_beg++;
  }
  output += "</ul>";
  document.getElementById("output").innerHTML = output;
}

function getDataList() {
  stopStudy();
  audio_num = 1;
  let output = "";
  data_result["lesson4"].forEach(function (item) {
    output += `
            <h2 class="btn-info mb-4" onclick = "getGroup(${item.lesson_id}, '${
      item.lesson
      }')">${item.lesson}</h2>
            `;
    let output_item = displayItems(`${item.lesson_id}`);
    output += output_item;
  });
  document.getElementById("output").innerHTML = output;
}

function displayItems(lesson_id) {
  let tmp = 1;
  let output = `
        <ul class="list-group mb-3">
    `;
  data_result["book4"].forEach(function (item) {
    if (item.lesson_id == lesson_id) {
      output += `
      <li class="list-group-item" onclick="playSound('audioPlayer_${audio_num}')">${tmp++} : ${item.name}
      <audio src="audio/book4/${item.serverUrl}" id="audioPlayer_${audio_num++}"></audio>
      </li >
  `;
    }
  });
  output += "</ul>";
  return output;
}

function goToPractice() {
  loadSound();
  stopStudy();
  index = data_result["lesson4"][lesson_id - 1].id_beg;
  practice();
}

function changePracticeGroup(tmp_lesson_id) {
  changeGroup(tmp_lesson_id);
  goToPractice();
}

function practice() {
  let output = "";
  console.log("id_end:", data_result["lesson4"][lesson_id - 1].id_end);
  if (index >= data_result["lesson4"][lesson_id - 1].id_end) {
    complete();
    // let prev_lesson = "";
    // let next_lesson = "";
    // if (lesson_id >= 2) {
    //   prev_lesson = `< button class="btn btn-success mr-4" onclick = "changePracticeGroup(${lesson_id - 1})" id = "prevGroup" > 上一课</button > `;
    // }
    // if (lesson_id < data_result["book4"].length) {
    //   next_lesson = `< button class="btn btn-success mr-4" onclick = "changePracticeGroup(${lesson_id + 1})" id = "nextGroup" > 下一课</button > `;
    // }
    // output = `< h2 class="mb-4 text-right" >${prev_lesson} ${next_lesson}</h2 >`;
    // document.getElementById("output").innerHTML += output;
  } else {
    let study_item = data_result["book4"][index];
    if (study_item.lesson_id != lesson_id) {
      index++;
      return practice();
    } else {
      output = `
      <h2 class="mb-4"> ${lesson}</h2>
      <div class='list-group-item'>
        <h4 class="mb-4 text-right"><img src='${soundImg}' class='img-thumbnail' style="width:50px;height:50px;" onclick="playSound('audioPlayer')"></h4>
          `;

      let tmp_item_arry = [];
      for (let i = 1; i <= 20; i++) {
        if (data_result["book4"][index + i].lesson_id != 0) {
          console.log(data_result["book4"][index + i].lesson_id);
          tmp_item_arry.push(data_result["book4"][index + i]);
        }
      }

      let t = getRandomInt(5);
      tmp_item_arry[t] = data_result["book4"][index];

      for (let i = 0; i <= 4; i++) {
        let item = tmp_item_arry[i];
        output += `<input type="button" class="btn ${getButtonColor()} mr-4" id="${item.id}" onclick="checkStudyAnswer(${study_item.id}, ${item.id})" value="${item.name}">`;
      }
      output += `  <audio src="audio/book4/${study_item.serverUrl}" id="audioPlayer"></audio>
            </div>
              `;
      document.getElementById("output").innerHTML = output;
      playSound("audioPlayer");
    }
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
function checkStudyAnswer(lesson_id, id) {
  if (checkAnswer(lesson_id, id)) {
    setTimeout(function () {
      if (index < data_result["book4"].length) {
        index = index + 1;
        practice();
      }
    }, 2000);
  }
}

function getRandomInt(max, min = 0) {
  return Math.floor(min + Math.random() * Math.floor(max));
}

function loadSound() {
  if (ifLoadSound) {
  } else {
    ifLoadSound = true;
    let output = "";
    let rightSoundPool = [];
    let wrongSoundPool = [];
    for (let i = 0; i < data_result['rightSoundPool'].length; i++) {
      let sound = data_result['rightSoundPool'][i]['serverUrl'];
      let sound_id = data_result['rightSoundPool'][i]['id'];
      rightSoundPool[i] = sound;
      output += `
        <audio src='audio/${sound}' id='right${sound_id}'></audio>
              `;
    }
    for (let i = 0; i < data_result['wrongSoundPool'].length; i++) {
      let sound = data_result['wrongSoundPool'][i]['serverUrl'];
      let sound_id = data_result['wrongSoundPool'][i]['id'];
      wrongSoundPool[i] = sound;
      output += `
        <audio src='audio/${sound}' id='wrong${sound_id}'></audio>
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
      <div class='list-group-item'>
        <h3 class="mb-4 text-center">家长设置</h3>
        <h5 class="mb-4 text-left input-group-addon">题目总数:
          <input type='number' id='practice_max_num' class="form-control" style='width:100px' value='10'>
        </h5>
          <h5 class="mb-4 text-left input-group-addon"><input type="checkbox" name="mathOper" value="+" checked>加法，总和不超过:
        <input type='number' id='add_max_total' class="form-control" style='width:100px' value='10'>
        </h5>
        <h5 class="mb-4 text-left input-group-addon"><input type="checkbox" name="mathOper" value="-">减法，被减数不超过:
          <input type='number' id='sub_max_total' class="form-control" style='width:100px' value='10'>
        </h5>
        <h5 class="">
          <input type='button' class="btn btn-success mr-4" value='开始' onclick= mathOperation()>
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
  add_max_total = document.getElementById('add_max_total').value - 1;
  sub_max_total = document.getElementById('sub_max_total').value;
  real_math_oper = [];
  for (let i = 0; i < mathOper.length; i++) {
    if (mathOper[i].checked) {
      real_math_oper.push(mathOper[i].value);
    }
  }
  if (real_math_oper.length == 0) {
    alert("请选择加法或减法，操作不能为空！");
    return;
  }
  next_math_practice();
}

function next_math_practice() {
  let min = 1;
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
      num_1 = getRandomInt(add_max_total, min);
      num_2 = getRandomInt(add_max_total - num_1, min);
      output = math_out_put('+', num_1, num_2);
    } else if (tmp_oper == "-") {
      num_1 = getRandomInt(sub_max_total, min);
      num_2 = getRandomInt(num_1, min);
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
  <div class='list-group-item'>
      <h3 class="mb-4 text-right"><input type='number' id='num_1' style='display:none' value= ${num_1}>${num_1}</h3>
      <h3 class="mb-4 text-right"><input type='number' id='num_2' style='display:none' value= ${num_2}>${operater}${num_2}</h3>
      <h3 class="mb-4 text-right">______</h3>
      <h3 class="mb-4 text-right">
      <input type='number' id='num_total' style='width:100px' onChange='checkMathAnswer("${operater}")'></h3>
    </div>
  `;
}

function complete() {
  let output = `
    <div class='list-group-item'>
      <h2 class="mb-4 text-center">恭喜您完成任务！</h2>
      <h4 class="mb-4 text-center"><img src='img/fireworks.gif' ></h4>   
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

function getTextBook4() {
  var params = [
    'height=' + screen.height,
    'width=750' + //screen.width,
    'fullscreen=yes' + // only works in IE, but here for completeness
    'scrollbars=no' +
    'resizable=yes'
  ].join(',');

  var popup = window.open('book.html?book=book4', 'popup_window', params);
  popup.moveTo(0, 0);
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
  return button_color[getRandomInt(5)];
}