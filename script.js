$(document).ready(function () {
  // Sticky header
  var lastScroll = 0;
  var scrollThreshold = 50; // pixels before hiding header
  $(window).on('scroll', function () {
    var st = $(this).scrollTop();

    // sticky behavior
    if (st > 1) {
      $(".header-area").addClass("sticky");
    } else {
      $(".header-area").removeClass("sticky");
    }

    // hide on scroll down, show on scroll up
    var navOpen = $('#primary-navigation').hasClass('open');
    if (!navOpen) {
      if (Math.abs(st - lastScroll) > 5) {
        if (st > lastScroll && st > scrollThreshold) {
          // scrolling down
          $('.header-area').addClass('hidden');
        } else if (st + 10 < lastScroll) {
          // scrolling up
          $('.header-area').removeClass('hidden');
        }
      }
    } else {
      // if nav is open, ensure header is visible
      $('.header-area').removeClass('hidden');
    }

    lastScroll = st;

    updateActiveSection(); // Update active section highlighting
  });

  // Smooth scrolling for navigation and custom elements
  $(".header ul li a, .skills__box").click(function (e) {
    e.preventDefault();

    // Get target section from href or data-target
    var target = $(this).attr("href") || $(this).data("target");
    if (!target || target === "#") return;

    // Smooth scroll to target section
    var offset = $(target).offset().top - 40; // Adjust for sticky header height
    $("html, body").animate(
      {
        scrollTop: offset,
      },
      500
    );

    // Update active class for navigation links
    if ($(this).attr("href")) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='" + target + "']").addClass("active");
    }
  });

  // ScrollReveal animations
  ScrollReveal({
    distance: "100px",
    duration: 2000,
    delay: 200,
  });
  ScrollReveal().reveal(".header a, .profile-photo, .about-content, .education", {
    origin: "left",
  });
  ScrollReveal().reveal(".header ul, .profile-text, .about-skills, .internship", {
    origin: "right",
  });
  ScrollReveal().reveal(".project-title, .contact-title", {
    origin: "top",
  });
  ScrollReveal().reveal(".projects, .contact", {
    origin: "bottom",
  });

  // Contact form - EmailJS integration
  // 1) Go to https://www.emailjs.com and create an account
  // 2) Create an email service and an email template matching the field names used below (from_name, reply_to, subject, message)
  // 3) Set your Service ID and Template ID below and your User ID in emailjs.init() call
  const msg = document.getElementById("msg");
  const contactForm = document.getElementById('contact-form');

  if (typeof emailjs !== 'undefined') {
    // Replace 'YOUR_USER_ID' with your EmailJS user ID (emailjs.init)
    // You can also call emailjs.init in your dashboard — keep commented for now
    // emailjs.init('YOUR_USER_ID');

    contactForm && contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('input[type=submit]');
      if (btn) btn.disabled = true;

      // Replace these with your own EmailJS service ID and template ID
      const serviceID = 'service_1xm5zj8';
      const templateID = 'template_riv3h7p';

      // emailjs.sendForm returns a Promise
      emailjs.sendForm(serviceID, templateID, '#contact-form')
        .then(function (response) {
          msg.innerHTML = 'Message sent successfully';
          setTimeout(function () { msg.innerHTML = ''; }, 40);
          contactForm.reset();
        }, function (error) {
          console.error('EmailJS error:', error);
          msg.innerHTML = 'Failed to send message. Try again later.';
        }).finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  } else {
    // Fallback: show message and keep default behaviour disabled
    contactForm && contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.innerHTML = 'EmailJS not loaded. Check your configuration.';
    });
  }

  // Update active section in header navigation
  function updateActiveSection() {
    var scrollPosition = $(window).scrollTop();

    if (scrollPosition === 0) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='#home']").addClass("active");
      return;
    }

    $("section").each(function () {
      var target = $(this).attr("id");
      var offset = $(this).offset().top;
      var height = $(this).outerHeight();

      if (
        scrollPosition >= offset - 40 &&
        scrollPosition < offset + height - 40
      ) {
        $(".header ul li a").removeClass("active");
        $(".header ul li a[href='#" + target + "']").addClass("active");
      }
    });
  }

  // Mobile menu toggle
  $('.menu_icon').on('click', function () {
    var $nav = $('#primary-navigation');
    var isOpen = $nav.hasClass('open');
    if (isOpen) {
      $nav.removeClass('open');
      $('body').removeClass('nav-open');
      $('.nav-backdrop').remove();
      $nav.attr('aria-hidden', 'true');
      $(this).attr('aria-expanded', 'false');
    } else {
      $nav.addClass('open');
      $('body').addClass('nav-open');
      // add backdrop to capture outside clicks and dim background
      if ($('.nav-backdrop').length === 0) {
        $('<div class="nav-backdrop" />').appendTo('body').on('click', function () {
          $nav.removeClass('open');
          $('body').removeClass('nav-open');
          $('.menu_icon').attr('aria-expanded', 'false');
          $(this).remove();
          $nav.attr('aria-hidden','true');
        });
      }
      $(this).attr('aria-expanded', 'true');
      $nav.attr('aria-hidden','false');
      // ensure header remains visible while nav is open
      $('.header-area').removeClass('hidden');
    }
  });

  // Close mobile nav when a link is clicked
  $('#primary-navigation li a').on('click', function () {
    var $nav = $('#primary-navigation');
    if ($nav.hasClass('open')) {
      $nav.removeClass('open');
      $('body').removeClass('nav-open');
      $('.menu_icon').attr('aria-expanded', 'false');
      $nav.attr('aria-hidden','true');
      $('.nav-backdrop').remove();
    }
  });

  // Ensure nav state on resize
  $(window).on('resize', function () {
    if ($(window).width() > 767) {
      var $nav = $('#primary-navigation');
      $nav.removeClass('open');
      // remove inline styles if any and ensure desktop layout
      $nav.css('max-height', '');
      $('.menu_icon').attr('aria-expanded', 'false');
      $nav.attr('aria-hidden','false');
      // remove backdrop and body lock when switching to desktop
      $('.nav-backdrop').remove();
      $('body').removeClass('nav-open');
    } else {
      // on mobile, keep nav closed by default
      $('#primary-navigation').removeClass('open');
      $('#primary-navigation').attr('aria-hidden','true');
    }
  }).trigger('resize');
  // initialize nav visibility on load (in case trigger/responsive didn't run yet)
  (function initNav(){
    if ($(window).width() > 767) {
      $('#primary-navigation').removeClass('open');
      $('#primary-navigation').css('max-height','');
      $('.menu_icon').attr('aria-expanded','false');
    } else {
      $('#primary-navigation').removeClass('open');
      $('#primary-navigation').css('max-height','0');
      $('.menu_icon').attr('aria-expanded','false');
    }
  })();

  /** WhatsApp widget handlers **/
  var $waToggle = $('#wa-toggle');
  var $waWidget = $('#wa-widget');
  var $waClose = $('#wa-close');
  var $waForm = $('#wa-form');
  var $waContainer = $('#whatsapp-chat');

  function openWa(){
    $waWidget.slideDown(180).attr('aria-hidden','false');
    $waToggle.setAttribute?.('aria-expanded','true');
    $waToggle.attr && $waToggle.attr('aria-expanded','true');
  }
  function closeWa(){
    $waWidget.slideUp(120).attr('aria-hidden','true');
    $waToggle.attr && $waToggle.attr('aria-expanded','false');
  }

  $waToggle.on('click', function(){
    if($waWidget.is(':visible')) closeWa(); else openWa();
  });
  $waClose.on('click', function(e){ e.preventDefault(); closeWa(); });

  $waForm.on('submit', function(e){
    e.preventDefault();
    var phone = $waContainer.data('phone') || $waContainer.attr('data-phone') || '+977XXXXXXXX';
    // normalize phone: remove spaces, + and dashes
    var normalized = String(phone).replace(/[^0-9]/g, '');
    var name = $('#wa-name').val() || '';
    var message = $('#wa-message').val() || '';
    var full = (name? (name + ' — '): '') + message;
    if(!message.trim()){
      alert('Please enter a message before sending.');
      return;
    }
    var encoded = encodeURIComponent(full);
    var url = 'https://wa.me/' + normalized + '?text=' + encoded;
    // open in new tab/window
    window.open(url, '_blank');
    // optionally close widget and reset
    closeWa();
    $waForm[0].reset();
  });

  // Close mobile nav when clicking outside or pressing Escape
  $(document).on('click', function (e) {
    var $nav = $('#primary-navigation');
    var $btn = $('.menu_icon');
    if ($nav.hasClass('open')) {
      // if click is outside header (and not on the button), close
      if ($(e.target).closest('.header').length === 0) {
        $nav.removeClass('open');
        $('body').removeClass('nav-open');
        $btn.attr('aria-expanded', 'false');
      }
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      var $nav = $('#primary-navigation');
      if ($nav.hasClass('open')) {
        $nav.removeClass('open');
        $('body').removeClass('nav-open');
        $('.menu_icon').attr('aria-expanded', 'false');
      }
    }
  });
});
