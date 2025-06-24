$(document).ready(function() {
  'use strict';

  // --- Preloader ---
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // --- Back to top button ---
  const backtotop = $('.back-to-top');
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      backtotop.addClass('active');
    } else {
      backtotop.removeClass('active');
    }
  });
  backtotop.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // --- Typed.js for hero section ---
  if ($('.typed').length) {
    let typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // --- Smooth scroll for the navigation menu ---
  $('a.scrollto').on('click', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      e.preventDefault();
      let target = $(this.hash);
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 60 // Adjust for fixed header
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.navbar').length) {
          $('.navbar .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('navbar-mobile')) {
          $('body').removeClass('navbar-mobile');
          $('.mobile-nav-toggle').toggleClass('bi-list bi-x');
        }
        return false;
      }
    }
  });

  // --- Activate scrollspy to add active class to navbar items on scroll ---
  $('body').scrollspy({
    target: '#navbar',
    offset: 80
  });

  // --- Smooth scroll for header navigation ---
  $('.navbar a[href^="#"]').on('click', function(e) {
    const target = $(this.hash);
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 60 // Adjust offset for fixed header
      }, 800, 'swing');
      // Optionally update active class
      $('.navbar .active').removeClass('active');
      $(this).closest('li').addClass('active');
    }
  });

  // --- Cookie-based Welcome Greeting ---
  function friendlyGreeting() {
    const welcomeBanner = $('#welcome-banner');
    if (!welcomeBanner.length) return;

    const lastVisitCookie = document.cookie.split('; ').find(row => row.startsWith('lastVisit='));
    let message = 'Welcome to my portfolio!';
    if (lastVisitCookie) {
      const lastVisitDate = new Date(decodeURIComponent(lastVisitCookie.split('=')[1]));
      message = `Welcome back! Last visit: ${lastVisitDate.toLocaleString()}`;
    }

    welcomeBanner.text(message);
    document.cookie = `lastVisit=${encodeURIComponent(new Date().toISOString())};path=/;max-age=31536000`; // 1 year expiry
  }
  friendlyGreeting();

  // --- Live Clocks ---
  function initializeClocks() {
    const digitalClock = $('#digital-clock');
    const analogClockCanvas = document.getElementById('analog-clock');

    if (digitalClock.length) {
      const updateDigitalClock = () => digitalClock.text(new Date().toLocaleTimeString());
      updateDigitalClock();
      setInterval(updateDigitalClock, 1000);
    }

    if (analogClockCanvas) {
      const ctx = analogClockCanvas.getContext('2d');
      const radius = analogClockCanvas.height / 2;
      ctx.translate(radius, radius);

      const drawHand = (pos, length, width, color) => {
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.strokeStyle = color;
          ctx.moveTo(0,0);
          ctx.rotate(pos);
          ctx.lineTo(0, -length);
          ctx.stroke();
          ctx.rotate(-pos);
      }

      const drawClock = () => {
          ctx.clearRect(-radius, -radius, analogClockCanvas.width, analogClockCanvas.height);
          // Draw face
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
          ctx.fillStyle = '#f4f4f4';
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = radius * 0.05;
          ctx.stroke();

          // Draw hands
          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const second = now.getSeconds();
          
          // Hour
          let hourAngle = (hour*Math.PI/6) + (minute*Math.PI/(6*60)) + (second*Math.PI/(360*60));
          drawHand(hourAngle, radius*0.5, radius*0.07, '#333');
          // Minute
          let minuteAngle = (minute*Math.PI/30) + (second*Math.PI/(30*60));
          drawHand(minuteAngle, radius*0.75, radius*0.05, '#333');
          // Second
          let secondAngle = (second*Math.PI/30);
          drawHand(secondAngle, radius*0.8, radius*0.02, 'red');
      }
      drawClock();
      setInterval(drawClock, 1000);
    }
  }
  initializeClocks();

  // --- Joke of the Minute (from JokeAPI) ---
  async function fetchJoke() {
    const jokeContainer = $('#joke-text');
    if (!jokeContainer.length) return;

    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Programming,Pun?type=single');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      jokeContainer.text(data.joke || 'No joke found, but that\'s the real joke!');
    } catch (error) {
      console.error("Failed to fetch joke:", error);
      jokeContainer.text('Could not load joke. Please try again later.');
    }
  }
  fetchJoke();
  setInterval(fetchJoke, 60000);

  // --- Random XKCD Comic ---
  async function fetchComic() {
    const comicContainer = $('#comic-container');
    if (!comicContainer.length) return;

    // Using a reliable proxy to bypass CORS issues
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://xkcd.com/info.0.json';
    const randomComicId = Math.floor(Math.random() * 2500) + 1;
    const randomUrl = `https://cors-anywhere.herokuapp.com/https://xkcd.com/${randomComicId}/info.0.json`;


    try {
      const response = await fetch(randomUrl);
      if (!response.ok) throw new Error('Failed to load comic data');
      const data = await response.json();
      comicContainer.html(`
        <strong class="d-block mb-2">${data.title}</strong>
        <img src="${data.img}" alt="${data.alt}" title="${data.alt}" class="img-fluid rounded">
      `);
    } catch (error) {
      console.error("Failed to fetch XKCD comic:", error);
      comicContainer.html('<p>Could not load a random comic. Enjoy a classic instead!</p><img src="https://imgs.xkcd.com/comics/compiling.png" alt="Compiling" class="img-fluid rounded">');
    }
  }
  fetchComic();

});