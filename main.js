"use strict";

function changeBackgroundColor() {
  var color = aboutJS.changeColor();
  storeCookie("background_color", color, 2);
}

function resetBackgroundColor() {
  var color = aboutJS.resetColor();
  storeCookie("background_color", color, 2);
}

function onNameChange() {
  if (document.getElementById("user_name").value !== "") {
    document.getElementById("start_button").disabled = false
  } else {
    document.getElementById("start_button").disabled = true
  }
  storeCookie("user_name", document.getElementById("user_name").value, 2)
}

function storeCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  localStorage.setItem(cname, cvalue)
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let local_return = localStorage.getItem(cname);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  if (local_return !== null && local_return.length !== 0) {
    return local_return;
  }
  return "";
}

function checkUserName() {
  let user_name = getCookie("user_name");
  if (user_name.length !== 0) {
    document.getElementById("start_button").disabled = false;
  }
  document.getElementById("user_name").value = user_name;
}

function checkBackgroundColor() {
  let background_color = getCookie("background_color");
  if (background_color) {
    var col = document.getElementById("body");
    col.style.backgroundColor = background_color;
  }
}

function resetCookies() {
  // Temp storage of user_name and color while we wipe cookies
  let name = getCookie("user_name");
  let background_color = getCookie("background_color")
  // Wipes local storage
  window.localStorage.clear();
  // Sets all cookies to expired (requires new entries)
  let allCookies = document.cookie.split(';');
  for (let i = 0; i < allCookies.length; i++) {
    document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
  }
  // restores the user_name and background color from temp variable
  storeCookie("user_name", name, 2);
  storeCookie("background_color", background_color, 2);
}

function checkQuestionNumber() {
  let q_num = getCookie("q_num");
  if (!q_num) {
    q_num = 1;
    storeCookie("q_num", 1, 2);
  }
  document.getElementById("question_header").innerHTML = "Question Number " + q_num;
}

function onResponseChange() {
  if (document.getElementById("response").value !== "") {
    document.getElementById("lock_in_button").disabled = false;
  } else {
    document.getElementById("lock_in_button").disabled = true;
  }
  // storeCookie("response", document.getElementById("response").value, 2)
}

function lockInResponse() {
  let time = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }).split(',')[1];
  document.getElementById("response").disabled = true;
  document.getElementById("lock_in_button").disabled = true;
  document.getElementById("next_question").disabled = false;
  // document.getElementById("done").disabled = false;
  let q_num = getCookie("q_num");
  let r_num = "Q" + q_num;
  let value = document.getElementById("response").value == "" ? "skip" : document.getElementById("response").value;
  let r_value = value + " " + time;
  storeCookie(r_num, r_value, 2);
}

function creepyBog() {
  // determine if bog face appears 0-10 roll
  let bog_chance = Math.floor(Math.random() * 101);
  if (bog_chance >= 85) {
    console.log("bog will appear now", bog_chance);
    document.getElementById("creepybog").src = "CREEPYBOG.jpg";
    // document.getElementById("bogsound").muted = 'false';
    // document.getElementById("bogsound").play();
    let audio = new Audio('./ena_pico_park_scream.mp3');
    audio.play();
  } else {
    console.log("bog will not appear: ", bog_chance);
    document.getElementById("creepybog").src = "";
    // document.getElementById("bogsound").src = "";
  }
}

function nextQuestion() {
  document.getElementById("response").disabled = false;
  document.getElementById("response").value = "";
  document.getElementById("lock_in_button").disabled = false;
  document.getElementById("next_question").disabled = true;
  // document.getElementById("done").disabled = true;
  let q_num = parseInt(getCookie("q_num"));
  q_num += 1;
  document.getElementById("question_header").innerHTML = "Question Number " + q_num;
  storeCookie("q_num", q_num, 2);
  creepyBog()
}

function download(file, text) {

  //creating an invisible element -> seems like this is making an anchor tag  and clicking it for the file download on a button

  let element = document.createElement('a');
  element.setAttribute('href',
    'data:text/plain;charset=utf-8, '
    + encodeURIComponent(text));
  element.setAttribute('download', file);
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

function sendEmail(subject, text) {
  let element = document.createElement('a');
  element.setAttribute('href',
    'mailto:jordan.l.kelly.95@gmail.com?subject=' + subject + '&body=' + text);
  // element.setAttribute('download', file);
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

function finishQuiz() {
  let q_num = parseInt(getCookie("q_num"));
  let name = getCookie("user_name");
  let answers = name + "\n";
  for (let i = 1; i <= q_num; i++) {
    let response = getCookie("Q" + i);
    if (response) {
      answers += "Q" + i + ": " + response + "\n"
    }
  }
  let filename = name + "_answers.txt";
  download(filename, answers);
  // sendEmail(filename, answers);
}

function calculateResults() {
    let q_num = parseInt(getCookie("q_num"));
    let name = getCookie("user_name");
    let correct_answers = 0;
    let wrong_answers = 0;
    let total_answers = 0;
    $.get('answer_sheet.txt', function(data) {
        console.log(data);
    }, 'text');
}