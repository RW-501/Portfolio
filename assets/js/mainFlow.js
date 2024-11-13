// script.js

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCsitF_YPDGnMwK0xIk2tUgQXJnxS2HN_o",
    authDomain: "ron-main.firebaseapp.com",
    projectId: "ron-main",
    storageBucket: "ron-main.firebasestorage.app",
    messagingSenderId: "885898378176",
    appId: "1:885898378176:web:ee850a5c980b4417a2a625",
    measurementId: "G-Y16GN7VL5Q"
  };
  
  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();
  let ipAddress = '';
  
  // Page View Log
  function logPageView(page) {
    const db = firestore;
    const currentDate = getCurrentDate();
    const logEntry = {
      page,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    };
  
    db.collection("portfolioAnalytics")
      .where("ipAddress", "==", ipAddress)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const docRef = db.collection("portfolioAnalytics").doc(querySnapshot.docs[0].id);
          docRef.update({ viewed: firebase.firestore.FieldValue.arrayUnion(logEntry) });
        } else {
          db.collection("portfolioAnalytics").add({
            ipAddress,
            currentDate,
            viewed: [logEntry]
          });
        }
      })
      .catch(error => console.error("Error logging page view:", error));
  }
  
  // Get Current Date in MM/DD/YYYY Format
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  }
  
  // Get User's IP Address
  async function getIPAddress() {
    if (!ipAddress) {
      try {
        ipAddress = await fetch('https://api.ipify.org').then(res => res.text());
        logPageView("Guest Exit");
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    }
    return ipAddress;
  }
  
  getIPAddress();
  
  // Contact Form Submission
  async function sendMessageFunc(event) { 
    event.preventDefault();

    // Get user input
    const contactName = sanitizeInput(document.getElementById("name").value);
    const contactEmail = sanitizeInput(document.getElementById("email").value);
    const contactMessage = sanitizeInput(document.getElementById("message").value);

    // Prepare the message object to send to Firestore
    const messageData = {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        // Save the message to Firestore (portfolioContact collection)
        const db = firebase.firestore();
        await db.collection("portfolioContact").add(messageData);

        // Show success message to the user
        const msgPop = document.getElementById("msgPop");
        const msgText = document.getElementById("msg-text_a");
        
        msgText.innerHTML = "Thank you for your message! I'll get back to you soon. Add me on LinkedIn.";
        msgPop.style.display = "block";

        // Reset the form and hide the message after a delay
        setTimeout(() => {
            msgPop.style.display = "none";
            document.getElementById("contactForm").reset();
        }, 10000);

    } catch (error) {
        console.error("Error sending message:", error);

        // Show error message to the user
        const msgPop = document.getElementById("msgPop");
        const msgText = document.getElementById("msg-text_a");
        
        msgText.innerHTML = "There was an error. Please try again later.";
        msgPop.style.display = "block";

        setTimeout(() => {
            msgPop.style.display = "none";
        }, 10000);
    }
}

// Sanitize input by removing dangerous content
function sanitizeInput(input) {
    const element = document.createElement("div");
    element.textContent = input;  // This ensures no HTML or script tags are injected
    return element.innerHTML;  // Returns the sanitized value
}



function removeContactMSGFunc() {
    const msg = document.getElementById("msgPop");
    msg.classList.remove('active');
    msg.style.display = "none";
    window.location.href = "https://rw-501.github.io/Portfolio/#";
}

// Scroll Button Functionality
const mybutton = document.getElementById("scrollBtn");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    mybutton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
}

function topFunc() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    getCurrentViewFunc("Scrolled to top");
}

// Image Modal Functionality
const modal = document.getElementById("myPhoto");
const modalGFX = document.getElementById("myPhotoGFX");

function viewImageFunc(img, type) {
    const modalImg = (type === "web") ? document.getElementById("img01") : document.getElementById("img02");
    if (type === "web") {
        modal.style.display = "block";
    } else if (type === "gfx") {
        modalGFX.style.display = "block";
    }
    modalImg.src = img.src;
}

function closePicFunc() {
    modal.style.display = "none";
    modalGFX.style.display = "none";
}

// Copy Text Functionality
function copyTextFunc(element) {
    const code = element.value;
    navigator.clipboard.writeText(code);
}

// Lazy Load Videos
document.addEventListener("DOMContentLoaded", function () {
    const lazyVideos = [].slice.call(document.querySelectorAll(".lazyload"));

    if ("IntersectionObserver" in window) {
        const lazyVideoObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (video) {
                if (video.isIntersecting) {
                    video.target.src = video.target.dataset.src;
                    video.target.classList.remove("lazy");
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        });

        lazyVideos.forEach(function (lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
});

// Scroll Trigger for Animation
function scrollTrigger(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => addObserver(el, options));
}

function addObserver(el, options) {
    if (!('IntersectionObserver' in window)) {
        if (options.cb) {
            options.cb(el);
        } else {
            entry.target.classList.add('active');
        }
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (options.cb) {
                    options.cb(el);
                } else {
                    entry.target.classList.add('active');
                }
                observer.unobserve(entry.target);
            }
        });
    }, options);
    observer.observe(el);
}

// Call scrollTrigger for elements
scrollTrigger('.Title-text-center');
scrollTrigger('.Title-text-left');
scrollTrigger('.Title-text-left-long');
scrollTrigger('.Title-text');
scrollTrigger('.box_inside');
scrollTrigger('.box_insideT');
scrollTrigger('.box_text');
scrollTrigger('.box_textT');
scrollTrigger('.scroll-reveal', { rootMargin: '-200px' });

// Typing Effect
let i = 0, ii = 0, iii = 0, iiii = 0;
const speed = 20;
const textSections = [
    "I'm Ron Wilson, a multi-disciplinary Project Coordinator, web developer, and video editor with experience in various industries. Originally from Conway, Arkansas, I moved to Dallas, Texas in 2007 to pursue my studies in computer graphics.",
    "My professional career began at a charter school where I worked in the business department as an Administrative Assistant. During my 10-year tenure, I wore many hats and implemented various systems, from setting up audiovisual to coordinating the operations of two cafeterias that fed over 1200 students daily.",
    "After the school closed, I ventured into e-commerce, initially selling phone accessories and expanding to curved computer monitors. Leveraging my skills in web development, video editing, and online marketing, I sold over 50 miles of elastic for mask-making during the pandemic. I am always on the lookout for opportunities to grow my business.",
    "I have a passion for web development that started with creating custom layouts for friends on Myspace using HTML and CSS. In this portfolio, I used my HTML, CSS, and JavaScript skills to create this presentation. If you'd like to learn more about my experience or have a project you'd like to discuss, please don't hesitate to reach out!"
];

function typeWriter(text, elementId, callback) {
    const element = document.getElementById(elementId);
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, elementId, callback), speed);
    } else {
        callback();
    }
}

function startTyping() {
    typeWriter(textSections[0], "text1", () => {
        setTimeout(() => {
            typeWriter(textSections[1], "text2", () => {
                setTimeout(() => {
                    typeWriter(textSections[2], "text3", () => {
                        setTimeout(() => {
                            typeWriter(textSections[3], "text4", () => {});
                        }, 500);
                    });
                }, 500);
            });
        }, 500);
    });
}

startTyping();

