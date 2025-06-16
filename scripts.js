// Digital Clock
function updateClock() {
  const now = new Date();
  document.getElementById("digit-clock").innerHTML = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// Joke API
function fetchJoke() {
  fetch("https://v2.jokeapi.dev/joke/Any?type=single")
    .then(response => response.json())
    .then(data => {
      document.getElementById("joke").innerHTML = data.joke;
    });
}
setInterval(fetchJoke, 60000); // 1 minute
fetchJoke();

// XKCD Image API
fetch("https://xkcd.com/info.0.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("comic").innerHTML = `<img src="${data.img}" alt="XKCD" style="max-width:100%">`;
  });

// Cookies - Welcome Message
function checkCookie() {
  let last = getCookie("lastvisit");
  let now = new Date();
  if (!last) {
    document.getElementById("welcome-msg").innerHTML = "Welcome to my homepage for the first time!";
  } else {
    document.getElementById("welcome-msg").innerHTML = "Welcome back! Your last visit was " + last;
  }
  document.cookie = "lastvisit=" + now.toString();
}
function getCookie(name) {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}
checkCookie();