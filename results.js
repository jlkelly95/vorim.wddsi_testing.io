"use strict";

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
    let responses = [];
    for (let i = 1; i <= q_num; i++) {
        let response = getCookie("Q" + i);
        if (response) {
            // console.log("response at 0?: ", response[0]);
            responses.push(response.split(' ')[0]);
        }
    }
    $.get('answer_sheet.txt', function(data) {
        console.log(data);
        const answers = data.split("\n");
        total_answers = answers.length;
        console.log("answers are: ", answers);
        console.log("responses were: ", responses);
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            if (i >= responses.length) {
                wrong_answers += 1;
            } else {
                const response = responses[i];
                if (response.toLowerCase() == answer.toLowerCase()) {
                    correct_answers += 1;
                } else {
                    wrong_answers += 1;
                }
            }
        }
        console.log("correct: ", correct_answers);
        console.log("wrong: ", wrong_answers);
        console.log("total: ", total_answers);
        document.getElementById("results").innerHTML = "Your Results: " + correct_answers + '/' + total_answers;
    }, 'text');
}
