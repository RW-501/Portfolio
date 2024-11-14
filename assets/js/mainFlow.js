// script.js

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
    logPageView("Scrolled to top");
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



function typeWriter(text, elementId, callback) {
    const element = document.getElementById(elementId);
    console.log("Page element ",element);

    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;  // If the element is not found, stop the function.
    }
    
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, elementId, callback), speed);
    } else {
        callback();
        i = 0;  // Call the callback function after typing is finished.
    }
}
const textSections = [
    "I'm Ron Wilson, a multi-disciplinary Project Coordinator, web developer, and video editor with experience in various industries. Originally from Conway, Arkansas, I moved to Dallas, Texas in 2007 to pursue my studies in computer graphics.","My professional career began at a charter school where I worked in the business department as an Administrative Assistant. During my 10-year tenure, I wore many hats and implemented various systems, from setting up audiovisual to coordinating the operations of two cafeterias that fed over 1200 students daily.","After the school closed, I ventured into e-commerce, initially selling phone accessories and expanding to curved computer monitors. Leveraging my skills in web development, video editing, and online marketing, I sold over 50 miles of elastic for mask-making during the pandemic. I am always on the lookout for opportunities to grow my business.","I have a passion for web development that started with creating custom layouts for friends on Myspace using HTML and CSS. In this portfolio, I used my HTML, CSS, and JavaScript skills to create this presentation. If you'd like to learn more about my experience or have a project you'd like to discuss, please don't hesitate to reach out!"
];



function startTyping() {
    if (Array.isArray(textSections) && textSections.length > 0) {
        const remove = document.getElementById("remove");
        remove.style.display = "none";

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
    } else {
        console.error("textSections array is invalid or empty.");
    }
}
/*
// Assuming textSections is an array of text you want to type out
const textSections = [
    "This is the first section of text.",
    "Here's the second section of text.",
    "And now the third section appears.",
    "Finally, the fourth section finishes."
];

startTyping();
*/