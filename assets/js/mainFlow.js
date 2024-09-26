// script.js

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8PYJV5-E6hIYbElsgb5e7MOS0faCiLM4",
    authDomain: "quizzatopia-bdfc9.firebaseapp.com",
    projectId: "quizzatopia-bdfc9",
    storageBucket: "quizzatopia-bdfc9.appspot.com",
    messagingSenderId: "828105067067",
    appId: "1:828105067102:web:76afb989ed7c03ebb542cf",
    measurementId: "G-J3QK9V5480"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
let ipAddress = '';

// Event Listener for Page Exit
window.addEventListener('beforeunload', function (event) {
    getCurrentViewFunc("Guest Exit");
});

// Get Current Date in MM/DD/YYYY Format
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
}

// Log User Actions
function getCurrentViewFunc(page) {
    const db = firebase.firestore();
    let currentDate = getCurrentDate();
    const currentURL = window.location.href;
    const referrerURL = document.referrer;

    if (!page) {
        page = "Home";
    }

    const logEntry = {
        page: page,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    };

    db.collection("ronPortfolio")
        .where("ipAddress", "==", ipAddress)
        .get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                const docRef = db.collection("ronPortfolio").doc(docId);

                docRef.get().then(doc => {
                    if (doc.exists) {
                        const existingViewed = doc.data().viewed || [];
                        existingViewed.push(logEntry);

                        docRef.update({ viewed: existingViewed })
                            .then(() => {
                                console.log("Page view logged successfully.");
                            })
                            .catch(error => {
                                console.error("Error logging page view:", error);
                            });
                    }
                }).catch(error => {
                    console.error("Error getting document:", error);
                });
            } else {
                const newUserLog = {
                    ipAddress,
                    currentDate,
                    currentURL,
                    referrerURL,
                    viewed: [logEntry]
                };

                db.collection("ronPortfolio").add(newUserLog)
                    .then(() => {
                        console.log("User log created successfully.");
                    })
                    .catch(error => {
                        console.error("Error creating user log:", error);
                    });
            }
        })
        .catch(error => {
            console.error("Error checking user existence:", error);
        });
}

// Fetch User's IP Address
async function getIPAddress() {
    if (ipAddress === '') {
        return fetch('https://api.ipify.org')
            .then(response => response.text())
            .then(data => {
                ipAddress = data.trim();
                console.log("IP Address:", ipAddress);
                getCurrentViewFunc("");
                return ipAddress;
            })
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
    } else {
        return ipAddress;
    }
}

getIPAddress();

// Contact Form Submission
function sendMessageFunc() {
    const contactName = document.getElementById("contactName").value;
    const contactSubject = document.getElementById("contactSubject").value;
    const contactMessage = document.getElementById("contactMessage").value;

    $.post("/ron-s_portfolio/sendContactme.php", {
        nameZZ: contactName,
        subjectZZ: contactSubject,
        msgZZ: contactMessage
    }, function (output) {
        console.log(output + "    output?????????  ");

        const contactForm = document.getElementById("contactForm");
        const msg = document.getElementById("msgPop");

        if (output.includes("Success")) {
            contactForm.innerHTML = "<br><br><br><br><br><br><br><br><br><br>";
            msg.style.display = "block";
            msg.classList.add('active');
            document.getElementById('msg-text_a').innerHTML = "Thank You,<br> Add Me On Linkedin.";
        } else {
            document.getElementById('msg-text_a').innerHTML = "There was an error.";
        }
        setTimeout(removeContactMSGFunc, 10000);
    });
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

