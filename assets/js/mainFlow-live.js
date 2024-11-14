import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc, arrayUnion 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Initialize Firebase and Firestore
const firebaseConfig = {
  apiKey: "AIzaSyCsitF_YPDGnMwK0xIk2tUgQXJnxS2HN_o",
  authDomain: "ron-main.firebaseapp.com",
  projectId: "ron-main",
  storageBucket: "ron-main.appspot.com",
  messagingSenderId: "885898378176",
  appId: "1:885898378176:web:ee850a5c980b4417a2a625",
  measurementId: "G-Y16GN7VL5Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const ipAPI = 'https://api.ipify.org?format=json';
const locationAPI = 'https://ipapi.co';
// Update logPageView function
const getUserLocationByIP = async (ip) => { 
  try {
      const response = await fetch(`${locationAPI}/${ip}/json/`);
      const data = await response.json();
      return {
          city: data.city || 'N/A',
          state: data.region || 'N/A',
          zip: data.postal || 'N/A',
          country: data.country_name || 'N/A'
      };
  } catch (error) {
      console.error('Error fetching location by IP:', error);
      return null;
  }
};

// Update logPageView function
export async function logPageView(page) {
const currentDate = getCurrentDate();
const ipAddress = await getIPAddress();
const startTime = new Date().getTime();
const userAgent = navigator.userAgent;
const deviceType = getDeviceType(userAgent);
const referral = document.referrer || 'direct';
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
const endTime = new Date().getTime();
const timeOnPage = (endTime - startTime) / 1000;

// Get location data based on IP address
const locationData = await getUserLocationByIP(ipAddress);

const logEntry = {
  page,
  userAgent,
  currentDate,
  referral,
  deviceType,
  timeOnPage,
  screenWidth,
  screenHeight,
  browser: getBrowser(userAgent),
  operatingSystem: getOS(userAgent),
  ipAddress,           // Log IP address directly
  location: locationData  // Include location data in the log entry
};

//console.log("logEntry ", logEntry);

try {
  // Query to find a document with the same IP address
  const portfolioAnalyticsRef = collection(db, "portfolioAnalytics");
  const q = query(portfolioAnalyticsRef, where("ipAddress", "==", ipAddress));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // If an entry with this IP address exists, update it
    const docRef = doc(db, "portfolioAnalytics", querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      viewed: arrayUnion(logEntry)
    });
  } else {
    // If no matching entry, create a new one
    await addDoc(portfolioAnalyticsRef, {
      ipAddress,
      currentDate,
      viewed: [logEntry],
      sessions: []
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
  let ipAddress;
  
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
  
  
 
  // Function to send message and save to Firestore
  export async function sendMessageFunc(event) { 
      event.preventDefault();
      const currentDate = getCurrentDate();
  
      // Get user input
      const contactName = sanitizeInput(document.getElementById("contactName").value);
      const contactSubject = sanitizeInput(document.getElementById("contactSubject").value);
      const contactMessage = sanitizeInput(document.getElementById("contactMessage").value);
      const ipAddress = await getIPAddress();
  
      // Get location data based on IP address
      const locationData = await getUserLocationByIP(ipAddress);
  
      // Prepare the message object to send to Firestore
      const messageData = {
          name: contactName,
          contactSubject: contactSubject,
          message: contactMessage,
          ipAddress: ipAddress,
          location: locationData,
          currentDate: currentDate
      };
  
      try {
          // Reference the portfolioContact collection
          const portfolioContactRef = collection(db, "portfolioContact");
          
          // Save the message to Firestore
          await addDoc(portfolioContactRef, messageData);
  
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
