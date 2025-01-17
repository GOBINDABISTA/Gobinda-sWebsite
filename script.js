$(document).ready(function () {
  // Sticky header
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      $(".header-area").addClass("sticky");
    } else {
      $(".header-area").removeClass("sticky");
    }

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

  // Google Sheets form submission
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxJE45_fVZWr9A_yiPzS2m_HBkqb-l8srB9YJtXE-grC3n6Utv-TXdy2SCRy6zxgfZJ/exec";
  const form = document.forms["submitToGoogleSheet"];
  const msg = document.getElementById("msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        msg.innerHTML = "Message sent successfully";
        setTimeout(() => {
          msg.innerHTML = "";
        }, 5000);
        form.reset();
      })
      .catch((error) => console.error("Error!", error.message));
  });

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
});
