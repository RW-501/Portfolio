import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";

// Firebase configuration



        // Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyCsitF_YPDGnMwK0xIk2tUgQXJnxS2HN_o",
          authDomain: "ron-main.firebaseapp.com",
          projectId: "ron-main",
          storageBucket: "ron-main.appspot.com",
          messagingSenderId: "885898378176",
          appId: "1:885898378176:web:ee850a5c980b4417a2a625",
          measurementId: "G-Y16GN7VL5Q"
      };
  






// Initialize Firebase and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);



  let ipAddress = '';
  
  // Page View Log
// Firestore Analytics Function
export async function logPageView(page) {
    const currentDate = getCurrentDate();
    const ipAddress = await getIPAddress(); // Ensure IP is fetched asynchronously
    
    // Calculate time on page by storing timestamp when the page loads
    const startTime = new Date().getTime();
  
    // Get user's device, browser info, and referral data
    const userAgent = navigator.userAgent;
    const deviceType = getDeviceType(userAgent); // Device detection (mobile, tablet, desktop)
    const referral = document.referrer || 'direct'; // Referral URL
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  
    // Wait for the page unload or interval to capture time on page
    const endTime = new Date().getTime();
    const timeOnPage = (endTime - startTime) / 1000; // Time in seconds
  
    const logEntry = {
      page,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      userAgent,
      currentDate,
      referral,
      deviceType,
      timeOnPage,
      screenWidth,
      screenHeight,
      browser: getBrowser(userAgent), // Get browser info
      operatingSystem: getOS(userAgent), // Get OS info
    };
    console.log("logEntry ",logEntry);

    try {
      // Try to find a record with the IP address
      const querySnapshot = await db.collection("portfolioAnalytics")
        .where("ipAddress", "==", ipAddress)
        .get();
  
      if (!querySnapshot.empty) {
        const docRef = db.collection("portfolioAnalytics").doc(querySnapshot.docs[0].id);
        // Append the log entry to the viewed array
        await docRef.update({
          viewed: firebase.firestore.FieldValue.arrayUnion(logEntry)
        });
      } else {
        // If no document found, create a new record
        await db.collection("portfolioAnalytics").add({
          ipAddress,
          currentDate,
          viewed: [logEntry],
          sessions: [] // Adding session tracking (this can be enhanced further later)
        });
      }
    } catch (error) {
      console.error("Error logging page view:", error);
    }
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
        return ipAddress;
      } catch (error) {
        console.error('Error fetching IP:', error);
        return 'unknown'; // Fallback in case of error
      }
    }
    return ipAddress;
  }
  
  // Function to detect device type (mobile, tablet, desktop)
  function getDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
  
  // Function to detect the browser from the user agent
  function getBrowser(userAgent) {
    if (userAgent.includes("Chrome")) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Safari")) {
      return "Safari";
    } else if (userAgent.includes("Edge")) {
      return "Edge";
    } else {
      return "Unknown";
    }
  }
  
  // Function to detect the OS from the user agent
  function getOS(userAgent) {
    if (userAgent.includes("Windows NT")) {
      return "Windows";
    } else if (userAgent.includes("Macintosh")) {
      return "Mac OS";
    } else if (userAgent.includes("Linux")) {
      return "Linux";
    } else if (userAgent.includes("Android")) {
      return "Android";
    } else if (userAgent.includes("iOS")) {
      return "iOS";
    } else {
      return "Unknown";
    }
  }
  
  // Call the analytics logging function whenever a page view occurs
  //logPageView("HomePage");  // Replace with dynamic page name as needed
  
  
  // Contact Form Submission
  export async  function sendMessageFunc(event) { 
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
        ipAddress: ipAddress,
        currentDate, currentDate,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        // Save the message to Firestore (portfolioContact collection)
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
            removeContactMSGFunc();
        }, 10000);
    }
}

// Sanitize input by removing dangerous content
function sanitizeInput(input) {
    // Check for null or undefined inputs
    if (input == null) {
        return '';
    }

    // Create a temporary div element
    const element = document.createElement("div");
    
    // Use textContent to ensure input is sanitized by encoding special characters
    element.textContent = input;
    
    // Return the sanitized content as a string
    return element.innerHTML;
}



function removeContactMSGFunc() {
    const msg = document.getElementById("msgPop");
    msg.classList.remove('active');
    msg.style.display = "none";
    window.location.href = "https://rw-501.github.io/Portfolio/#";
}
