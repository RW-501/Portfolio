import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getFirestore, serverTimestamp,orderBy,  collection, query, where, getDocs, doc, updateDoc, addDoc, arrayUnion 
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
    const guestbookRef = collection(db, `Guestbook`);
    
    // Order by timestamp (most recent first)
    const querySnapshot = await getDocs(query(guestbookRef, orderBy("timestamp", "desc"))); 
    const entriesDiv = document.getElementById("guestbookEntries");

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

      if (entry.status === 'active') {
        // Append guestbook entry
        entriesDiv.innerHTML += `
          <div class="entry" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 8px; background: #f9f9f9;">
            <div class="guestbook-content">
              <strong style="font-size: 1.1em; color: #333;">${sanitizedName}</strong>
              <span style="font-size: 0.9em; color: #777;">${timeAgo}</span>
            </div>
            <div class="guestbook-message">${sanitizedMessage}</div>
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











const submitbtn = document.getElementById("submit-btn");

// Handle form submission
submitbtn.addEventListener("click", async (e) => {
  console.log('Form submission triggered.');
  const anonymousCheckbox = document.getElementById("anonymousCheckbox");

  const nameInput = document.getElementById("guestName");
  const messageInput = document.getElementById("guestMessage");
  const name = sanitizeInput(anonymousCheckbox.checked ? "Anonymous" : nameInput.value.trim());
  const message = sanitizeInput(messageInput.value.trim());
  const userIP = await getIPAddress(); // Fetch user IP address

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
        timestamp: serverTimestamp(),
      });
      nameInput.value = ''; // Clear form inputs
      messageInput.value = ''; // Clear form inputs
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



  // Add an event listener to the "Send Flowers" button
  const sendFlowersButton = document.getElementById("send-flowers");
 // sendFlowersButton.addEventListener("click", incrementFlowerCount);
  


const anonymousCheckbox = document.getElementById("anonymousCheckbox");
const guestNameInput = document.getElementById("guestName");

// Add event listener for checkbox change
anonymousCheckbox.addEventListener("change", () => {
  if (anonymousCheckbox.checked) {
    guestNameInput.value = "Anonymous"; // Set the value to "Anonymous" when checked
  } else {
    guestNameInput.value = ""; // Clear the value when unchecked
  }
});
