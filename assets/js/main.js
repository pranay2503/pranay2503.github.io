// assets/js/main.js

$(document).ready(function() {
  // 1. Cookie-based greeting
  function friendlyGreeting() {
    const lastCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lastVisit='));
    const lastVisit = lastCookie && lastCookie.split('=')[1];

    if (!lastVisit) {
      alert('Welcome to my homepage for the first time!');
    } else {
      alert(`Welcome back! Your last visit was ${decodeURIComponent(lastVisit)}`);
    }

    document.cookie = `lastVisit=${encodeURIComponent(new Date())};path=/;max-age=${60*60*24*365}`;
  }
  friendlyGreeting();

  // 2. Show/hide email
  $('#toggle-email').click(function() {
    $('#email').toggle();
    $(this).text((_, t) => t === 'Show Email' ? 'Hide Email' : 'Show Email');
  });

  // 3. Digital clock
  function updateDigitalClock() {
    $('#digital-clock').text(new Date().toLocaleTimeString());
  }
  updateDigitalClock();
  setInterval(updateDigitalClock, 500);

  // 4. Analog clock
  const ctx = document.getElementById('analog-clock').getContext('2d');
  function drawAnalogClock() {
    const radius = ctx.canvas.width / 2;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(radius, radius);

    // Clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.9, 0, 2*Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();

    const now = new Date();
    // draw hands
    const drawHand = (angle, length, width, color='#000') => {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(0,0);
      ctx.rotate(angle);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-angle);
    };

    // Hour hand
    drawHand(((now.getHours()%12 + now.getMinutes()/60) * Math.PI/6), radius * 0.5, radius * 0.07);
    // Minute hand
    drawHand(((now.getMinutes() + now.getSeconds()/60) * Math.PI/30), radius * 0.8, radius * 0.05);
    // Second hand
    drawHand((now.getSeconds() * Math.PI/30), radius * 0.9, radius * 0.02, 'red');

    ctx.restore();
  }
  drawAnalogClock();
  setInterval(drawAnalogClock, 1000);

  // 5. Today’s date via Moment.js
  $('#today').text('Today is ' + moment().format('dddd, MMMM Do YYYY'));

  // 6. JokeAPI
  async function fetchJoke() {
    try {
      const res = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
      const { joke } = await res.json();
      $('#joke-text').text(joke);
    } catch {
      $('#joke-text').text('Failed to load joke.');
    }
  }
  fetchJoke();
  setInterval(fetchJoke, 60000);

  // 7. XKCD comic via xkcd.now.sh proxy
  const comicUrl = 'https://xkcd.now.sh/?comic=latest';
  async function fetchComic() {
    try {
      const res = await fetch(comicUrl);
      const { img, title } = await res.json();
      $('#comic-container').html(`
        <img src="${img}" alt="${title}" class="img-fluid mb-2" />
        <p>${title}</p>
      `);
    } catch (err) {
      console.error('Comic fetch error:', err);
      $('#comic-container').text('Could not load comic.');
    }
  }
  fetchComic();
});

