/**
 * script.js — Prestige Auction Group
 *
 * This file contains all of the interactive JavaScript for the demo site.
 * Each feature is clearly commented so it's easy to explain in a classroom.
 *
 * Features covered:
 *  1. Smooth-scroll navigation (polyfill)
 *  2. Sticky navbar scroll effect
 *  3. Mobile navigation toggle
 *  4. Countdown timers
 *  5. Live bid demo with animated feedback
 *  6. Registration form submission
 *  7. Active nav link on scroll (Intersection Observer)
 */

/* ============================================================
   1. COUNTDOWN TIMERS
   We look for every element with class "countdown" and update
   it every second to show how much time remains.
   ============================================================ */

/**
 * formatTime(seconds)
 * Converts a raw number of seconds into "HH:MM:SS" format.
 * e.g., 3661 → "01:01:01"
 */
function formatTime(seconds) {
  // Math.max(0, ...) prevents negative numbers
  const s = Math.max(0, Math.floor(seconds));

  const hours   = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const secs    = s % 60;

  // padStart(2, '0') ensures two digits: 5 → "05"
  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(secs).padStart(2, '0'),
  ].join(':');
}

/**
 * startCountdowns()
 * Finds all .countdown elements, reads their data-end-offset attribute
 * (seconds from NOW that the auction ends), and starts ticking.
 */
function startCountdowns() {
  // Select every element that has the "countdown" class
  const countdownEls = document.querySelectorAll('.countdown');

  countdownEls.forEach(function(el) {
    // data-end-offset is the number of seconds until auction end
    const offsetSeconds = parseInt(el.dataset.endOffset, 10);

    // Calculate the actual end time (current time + offset)
    const endTime = Date.now() + offsetSeconds * 1000;

    // Update the display once immediately so there's no blank flash
    el.textContent = formatTime(offsetSeconds);

    // setInterval calls the function every 1000ms (1 second)
    const timer = setInterval(function() {
      const remaining = (endTime - Date.now()) / 1000;

      if (remaining <= 0) {
        // Auction ended!
        el.textContent = 'CLOSED';
        el.style.color = '#6b7280'; // gray it out
        clearInterval(timer);       // stop the timer
      } else {
        el.textContent = formatTime(remaining);
      }
    }, 1000);
  });
}


/* ============================================================
   2. LIVE BID DEMO
   Tracks a current bid amount and updates the display when
   the user clicks an increment button.
   ============================================================ */

// We store the current bid in a plain JavaScript variable.
// Starting value matches what's shown in the HTML.
let currentBid = 1850000;

// Keep a reference to the message timeout so we can cancel it
let bidMessageTimeout = null;

/**
 * formatCurrency(amount)
 * Turns a plain number like 1850000 into "$1,850,000".
 */
function formatCurrency(amount) {
  // toLocaleString formats numbers nicely for the current locale
  return '$' + amount.toLocaleString('en-US');
}

/**
 * placeBid(increment)
 * Called when a bid increment button is clicked.
 * @param {number} increment - How much to add to the current bid.
 */
function placeBid(increment) {
  // Add the increment to the running total
  currentBid += increment;

  // --- Update the large bid display in the demo panel ---
  const bidAmountEl = document.getElementById('liveBidAmount');
  if (bidAmountEl) {
    bidAmountEl.textContent = formatCurrency(currentBid);

    // Add the "bump" CSS class to trigger the scale animation,
    // then remove it after 300ms so it can trigger again next click.
    bidAmountEl.classList.add('bump');
    setTimeout(function() {
      bidAmountEl.classList.remove('bump');
    }, 300);
  }

  // --- Update the "Next min. bid" line ---
  const minBidEl = document.getElementById('minBid');
  if (minBidEl) {
    minBidEl.textContent = formatCurrency(currentBid + 100);
  }

  // --- Show the animated "New bid placed!" message ---
  const msgEl = document.getElementById('bidMessage');
  if (msgEl) {
    msgEl.textContent = '✅ New bid placed! — ' + formatCurrency(currentBid);
    msgEl.style.opacity = '1';

    // Clear any existing fade-out timer, then start a new one
    if (bidMessageTimeout) clearTimeout(bidMessageTimeout);
    bidMessageTimeout = setTimeout(function() {
      msgEl.style.opacity = '0';
    }, 3000); // message fades after 3 seconds
  }

  // --- Add an entry to the bid history list ---
  addBidHistoryEntry(currentBid);

  // Also sync the bid displayed on the first auction card
  syncCardBid(currentBid);
}

/**
 * addBidHistoryEntry(amount)
 * Prepends a new item to the bid history list so newest is on top.
 */
function addBidHistoryEntry(amount) {
  const historyEl = document.getElementById('bidHistory');
  if (!historyEl) return;

  // Create the new list item
  const li = document.createElement('li');
  li.innerHTML =
    '<span class="hist-time">just now</span> ' +
    'Bidder #' + randomBidderId() + ' — ' + formatCurrency(amount);

  // Insert at the top of the list (before any existing items)
  historyEl.insertBefore(li, historyEl.firstChild);

  // Keep the list tidy — only show the 5 most recent bids
  while (historyEl.children.length > 5) {
    historyEl.removeChild(historyEl.lastChild);
  }
}

/**
 * randomBidderId()
 * Returns a random 4-digit number between 1000 and 9999
 * to simulate different bidders.
 */
function randomBidderId() {
  return Math.floor(1000 + Math.random() * 9000);
}

/**
 * syncCardBid(amount)
 * Keeps the bid value on the featured auction card in sync
 * with the live demo panel.
 */
function syncCardBid(amount) {
  const cardBidEl = document.getElementById('card1-bid');
  if (cardBidEl) {
    cardBidEl.textContent = formatCurrency(amount);
  }
}

/**
 * openBidDemo()
 * Smoothly scrolls to the live bid demo section when a card's
 * "Bid Now" button is clicked.
 */
function openBidDemo() {
  const demoSection = document.getElementById('bid-demo');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


/* ============================================================
   3. REGISTRATION FORM
   Prevents the default form submission (which would reload the
   page), validates required fields, then shows a success message.
   ============================================================ */

function setupRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    // Prevent the browser from reloading the page
    event.preventDefault();

    // Simple validation: check that name and email are filled in
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();

    if (!name || !email) {
      // Shake the form to indicate an error (add/remove a CSS class)
      alert('Please fill in your name and email address.');
      return;
    }

    // If valid: hide the form fields (optional), show success message
    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      successEl.style.display = 'block';
    }

    // Reset the form so the fields go blank
    form.reset();

    // Scroll the success message into view
    if (successEl) {
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}


/* ============================================================
   4. STICKY NAVBAR SCROLL EFFECT
   Adds a "scrolled" CSS class to the navbar when the user
   scrolls past the hero section, making it slightly more opaque.
   ============================================================ */

function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}


/* ============================================================
   5. MOBILE NAVIGATION TOGGLE
   Toggles the "open" class on the nav links list when the
   hamburger button is clicked.
   ============================================================ */

function setupMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', function() {
    const isOpen = navLinks.classList.toggle('open');
    // Update aria-expanded for accessibility
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ============================================================
   6. ACTIVE NAV LINK ON SCROLL
   Uses IntersectionObserver to highlight the nav link that
   corresponds to the section currently in the viewport.
   ============================================================ */

function setupActiveNavLinks() {
  // The sections we want to track
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Remove "active" from all nav links
          navLinks.forEach(function(link) {
            link.classList.remove('active');
          });

          // Add "active" to the matching nav link
          const id = entry.target.id;
          const activeLink = document.querySelector('.nav-links a[href="#' + id + '"]');
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    },
    {
      // Trigger when the section is at least 40% visible
      threshold: 0.2,
      // Slightly offset the trigger point so the nav updates at the right time
      rootMargin: '-64px 0px 0px 0px',
    }
  );

  sections.forEach(function(section) {
    observer.observe(section);
  });
}


/* ============================================================
   7. INITIALISATION
   We wait for the HTML document to be fully loaded and parsed
   before running our setup functions.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Start all countdown timers
  startCountdowns();

  // Set up the registration form handler
  setupRegistrationForm();

  // Set up the sticky navbar scroll effect
  setupNavbarScroll();

  // Set up the mobile hamburger toggle
  setupMobileNav();

  // Highlight the active nav link as the user scrolls
  setupActiveNavLinks();

  // Log a friendly note to the browser console for class demos
  console.log('%c🏆 Prestige Auction Group — Demo Site Loaded!',
    'color: #c9a84c; font-size: 14px; font-weight: bold;');
  console.log('Try calling placeBid(5000) in the console to place a bid!');
});
