import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getFirestore, serverTimestamp,orderBy,  collection, query, where, getDocs, doc, updateDoc, addDoc, arrayUnion 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js";

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

function showToast(message, type = "info", duration = 3000) {
  // Define icon types
  const icons = {
      success: "fa-check-circle",
      error: "fa-times-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle"
  };

  // Ensure type is valid, fallback to "info"
  const iconClass = icons[type] || icons.info;

  // Create toast container if not exists
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
      `;
      document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `
      <i class="fas ${iconClass}"></i> <div>${message}</div>
      <button class="toast-close">&times;</button>
  `;

  // Style toast
  toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 1rem;
      color: #fff;
      min-width: 250px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      position: relative;
      animation: fadeIn 0.3s ease-out;
  `;

  // Style by type
  const colors = {
      success: "#28a745",
      error: "#dc3545",
      warning: "#ffc107",
      info: "#007bff"
  };
  toast.style.backgroundColor = colors[type] || colors.info;

  // Close button styles
  const closeButton = toast.querySelector(".toast-close");
  closeButton.style.cssText = `
      border: none;
      background: transparent;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;

  `;

  // Close toast on button click
  closeButton.addEventListener("click", () => {
     toast.style.animation = "fadeOut 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
  });

  // Auto-remove toast after duration
  setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
  }, duration);

  // Append toast to container
  toastContainer.appendChild(toast);
}

// CSS Animations (can be moved to a CSS file)
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(10px); }
  }

  .toast-message {
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);
window.showToast = showToast;

let startTime = new Date().getTime();
let endTime = new Date().getTime();
// Track when the visitor leaves the page
function updateEndTime() {
  endTime = new Date().getTime();
}


// Capture when the page is hidden (switching tabs or closing)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
      updateEndTime();
  }
});

// Capture when the user closes or reloads the page
window.addEventListener("beforeunload", updateEndTime);

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
const userAgent = navigator.userAgent;
const deviceType = getDeviceType(userAgent);
const referral = document.referrer || 'direct';
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
startTime = new Date().getTime();
 // Wait until the user leaves before logging endTime
 window.addEventListener("beforeunload", async () => {
  endTime = new Date().getTime();
  const timeOnPage = ((endTime - startTime) / 1000).toFixed(2);

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
});
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
          currentDate: currentDate,
          status: "unread"
      };
  
      try {
          // Reference the portfolioContact collection
          const portfolioContactRef = collection(db, "portfolioContact");
          
          // Save the message to Firestore
          await addDoc(portfolioContactRef, messageData);
  
          // Show success message to the user
          const msgPop = document.getElementById("msgPop");
          const msgText = document.getElementById("msg-text_a");
          
          msgText.innerHTML = `
          <div style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
            <p style="font-size: 18px; font-weight: bold; color: #28a745;">Thank you for reaching out!</p>
            <p>I'll get back to you as soon as possible. In the meantime, feel free to connect with me on LinkedIn to stay in touch!</p>
            <p style="font-size: 14px; color: #0077b5;">
              <a href="https://www.linkedin.com/in/yourlinkedinprofile" target="_blank" style="text-decoration: none; color: #0077b5; font-weight: bold;">Add me on LinkedIn</a>
            </p>
          </div>
        `;
        msgPop.style.display = "block";
                  msgPop.style.display = "block";
          document.getElementById("contactForm").reset();
          // Reset the form and hide the message after a delay


          
          setTimeout(() => {

              removeContactMSGFunc();

          }, 1000);
  
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
          }, 300);
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






// Helper function to calculate time since post
function timeSincePost(timestamp) {
  const now = new Date();
  const postTime = timestamp.toDate(); // Assuming Firebase Timestamp object
  const seconds = Math.floor((now - postTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 365) return `${days} days ago`;
  return `${years} years ago`;
}
  // Function to load guestbook entries
// Function to load guestbook entries
async function loadEntries() {
  try {
    const entriesDiv = document.getElementById("guestbookEntries");
if(!entriesDiv){

  return;
}
    const guestbookRef = collection(db, `Guestbook`);
    const ipAddress = await getIPAddress();

    // Order by timestamp (most recent first)
    const querySnapshot = await getDocs(query(guestbookRef, orderBy("timestamp", "desc"))); 

    if (!entriesDiv) {
      console.error("Guestbook entries container not found.");
      return;
    }

    entriesDiv.innerHTML = ""; // Clear existing entries

    querySnapshot.forEach((doc) => {
      const entry = doc.data();
      const sanitizedMessage = sanitizeInput(entry.message);
      const sanitizedName = sanitizeInput(entry.name);
      const timestamp = entry.timestamp;
      const postID = doc.id;
      const timeAgo = timestamp ? timeSincePost(timestamp) : "Unknown time";

      let controlPanel = "";

      if (entry.userIP === ipAddress) {
        // Show controls for the user who posted the message
        controlPanel = `
          <div class="message-controls">
            <button onclick="makePrivate('${postID}')">Make Private</button>
            <button onclick="deleteMessage('${postID}')">Delete</button>
          </div>
        `;
      }

      if (entry.status === 'active' && (entry.private === undefined || entry.private === false)) {
        // Append guestbook entry
        entriesDiv.innerHTML += `
          <div class="entry" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 8px; background: #f9f9f9;">
            <div class="guestbook-content">
              <strong style="font-size: 1.1em; color: #333;">${sanitizedName}</strong>
              <span style="font-size: 0.9em; color: #777;">${timeAgo}</span>
            </div>
            <div class="guestbook-message">${sanitizedMessage}</div>
          ${controlPanel}
          </div>
          ${entry.giftType && entry.public ? `
            <div class='gifts'>
              <ul id="gifts-${postID}">
                <!-- Gifts for this post will be injected here -->
              </ul>
            </div>
          ` : ""}
        `;
      }
    });

    // Ensure elements exist before adding event listeners
    const giftAnonymousCheckbox = document.getElementById("gift-anonymousCheckbox");
    const giftGuestNameInput = document.getElementById("gift-guestName");

    if (giftAnonymousCheckbox && giftGuestNameInput) {
      giftAnonymousCheckbox.addEventListener("change", () => {
        giftGuestNameInput.value = giftAnonymousCheckbox.checked ? "Anonymous" : "";
      });
    } else {
      console.warn("Gift anonymous checkbox or guest name input not found.");
    }

  } catch (error) {
    console.error("Error loading guestbook entries:", error);
  }
}

window.loadEntries = loadEntries;

loadEntries();


// Function to make a message private
async function makePrivate(postID) {
  try {
    const postRef = doc(db, "Guestbook", postID);
    await updateDoc(postRef, {
      private: true
    });
    showToast("Your message is now private!", "success");
    loadEntries(); // Refresh guestbook
  } catch (error) {
    console.error("Error making message private:", error);
  }
}
window.makePrivate = makePrivate;


// Function to delete a message (change status to "deleted")
async function deleteMessage(postID) {
  if (!confirm("Are you sure you want to delete this message?")) return;
  
  try {
    const postRef = doc(db, "Guestbook", postID);
    await updateDoc(postRef, {
      status: "deleted"
    });
    showToast("Your message has been deleted.", "warning");
    loadEntries(); // Refresh guestbook
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}

window.deleteMessage = deleteMessage;












// Example of OAuth 2.0 response (you received this in the previous step)
const oauthAccessToken = "ya29.a0AXeO80SO4iW8MxvMweIXwzY1Ea8Zm82dc5lUxc0eI44504wdeuM90qPYTGzi97jSMM-jC7C0HIuSVoK4F5ObHi17mgdM1SFGFntEfJtD2HwGtw7kwVlU0Hvc8c9exzVVKYJBosfXgKk7P70jQfeuHxzc9kBbeANxGGeJy-vTaCgYKAcMSARMSFQHGX2Mi2I1EnIAYkFdiRkImm5xaiA0175";  // Use the actual access token you received
// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request permission to receive notifications
messaging.requestPermission()
  .then(() => {
    return messaging.getToken({ vapidKey: 'BLV92JFFuX1LChdVIGa4ZG49NpngM_Z7RRp-brP7ShmGbNDx9dW8EtdU69vDpM_C-JhMdIBGJyg2E9-R9e6oKSo' });  // Use your VAPID key here
  })
  .then((fcmDeviceToken) => {
    if (fcmDeviceToken) {
      console.log("FCM Device Token for you:", fcmDeviceToken);
      // Store your device token (you can store it in Firestore or a variable)
      localStorage.setItem('myFCMToken', fcmDeviceToken);  // Store in localStorage (for example)
    } else {
      console.log("No FCM token available.");
    }
  })
  .catch((err) => {
    console.error("Error getting FCM token:", err);
  });

// Send FCM Notification
function sendFCMNotification(message) {
  const fcmEndpoint = 'https://fcm.googleapis.com/v1/projects/ron-main/messages:send';
  
  const fcmDeviceToken = localStorage.getItem('myFCMToken');  // Retrieve your device token from localStorage
  
  const messageBody = {
    message: {
      token: fcmDeviceToken,  // Use the FCM device token for the target device
      notification: {
        title: 'New Guestbook Message!',
        body: `New message from ${message.name}: ${message.message}`,
      },
    },
  };

  fetch(fcmEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${oauthAccessToken}`,  // Use the OAuth access token for authentication
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageBody),
  })
    .then(response => response.json())
    .then(data => {
      console.log('FCM Response:', data);
      alert('Notification sent!');
    })
    .catch(error => {
      console.error('Error sending notification:', error);
    });
}

const submitbtn= document.getElementById("submit-btn");

// Handle form submission
if(submitbtn) submitbtn.addEventListener("click", async (e) => {
  console.log('Form submission triggered.');
  const anonymousCheckbox = document.getElementById("anonymousCheckbox");

  const nameInput = document.getElementById("guestName");
  const messageInput = document.getElementById("guestMessage");
  const guestbookArea = document.getElementById("guestbookArea");
  const name = sanitizeInput(anonymousCheckbox.checked ? "Anonymous" : nameInput.value.trim());
  const message = sanitizeInput(messageInput.value.trim());
  const userIP = await getIPAddress(); // Fetch user IP address
  const privateCheckbox = document.getElementById("privateCheckbox");



  let valid = true;

  
  // Check if name and message are filled
  if (!name) {
    nameInput.style.borderColor = 'red'; // Highlight input with red border
    valid = false;
  } else {
    nameInput.style.borderColor = ''; // Reset border color
  }

  if (!message) {
    messageInput.style.borderColor = 'red'; // Highlight input with red border
    valid = false;
  } else {
    messageInput.style.borderColor = ''; // Reset border color
  }

  // If both fields are valid, proceed with submission
  if (valid) {
    try {
      const guestbookRef = collection(db, `Guestbook`);
      await addDoc(guestbookRef, {
        name,
        message,
        userIP,
        status: "active",
        private: privateCheckbox.checked || false,
        timestamp: serverTimestamp(),
      });
      nameInput.value = ''; // Clear form inputs
      messageInput.value = ''; // Clear form inputs
      guestbookArea.innerHTML = ''; // Clear form inputs

      showToast("Thank you for signing my guestbook! ", "success");


          // New message added, send FCM notification
         /// const newMessage = `${name} singed your guestbook`;
          const newMessage = {
            message: `${message}`,
              name: `${name}`
                };

          sendFCMNotification(newMessage);
     
      anonymousCheckbox.checked = false; // Reset checkbox
      await loadEntries(); // Refresh guestbook entries
    } catch (error) {
      console.error("Error adding guestbook entry:", error);
    }
  } else {
    // Optionally, you can add a message to the user here
    showToast("Please fill in both the name and the message.");
  }
});



// Initialize FCM permissions
requestFCMPermission();



  // Add an event listener to the "Send Flowers" button
  const sendFlowersButton = document.getElementById("send-flowers");
 // sendFlowersButton.addEventListener("click", incrementFlowerCount);
  


const anonymousCheckbox = document.getElementById("anonymousCheckbox");
const guestNameInput = document.getElementById("guestName");

// Add event listener for checkbox change
if(anonymousCheckbox) anonymousCheckbox.addEventListener("change", () => {
  if (anonymousCheckbox.checked) {
    guestNameInput.value = "Anonymous"; // Set the value to "Anonymous" when checked
  } else {
    guestNameInput.value = ""; // Clear the value when unchecked
  }
});
