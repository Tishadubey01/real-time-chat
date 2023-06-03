// Get the room ID from the query string
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

// Firebase Authentication and Firestore instances
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM elements
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const leaveButton = document.getElementById("leave-button");

function displayMessage(message) {
    const { text, senderName, senderProfilePicture } = message;
  
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
  
    // Create an element for the profile picture
    const profilePicture = document.createElement("img");
    profilePicture.classList.add("profile-picture");
    profilePicture.src = senderProfilePicture;
    messageDiv.appendChild(profilePicture);
  
    // Create an element for the sender's name
    const senderNameElement = document.createElement("span");
    senderNameElement.classList.add("sender-name");
    senderNameElement.textContent = senderName;
    messageDiv.appendChild(senderNameElement);
  
    // Create an element for the message text
    const messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.textContent = text;
    messageDiv.appendChild(messageText);
  
    messagesDiv.appendChild(messageDiv);
  }
  
  
  // Real-time message updates
  firestore.collection("rooms").doc(roomId).collection("messages")
    .orderBy("timestamp")
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const message = change.doc.data();
          displayMessage(message);
        }
      });
    });
  
  // Display previous messages
  firestore.collection("rooms").doc(roomId).collection("messages")
    .orderBy("timestamp")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        displayMessage(message);
      });
    })
    .catch((error) => {
      console.error("Error fetching previous messages:", error);
    });
  
  
  
  
  

// Send message button click event
sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    messageInput.value = "";
  
    const user = auth.currentUser;
    const { displayName, photoURL, uid } = user;
  
    firestore
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: uid,
        senderName: displayName,
        senderProfilePicture: photoURL,
      })
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Message send error:", error);
      });
  });
  


// Leave room button click event
leaveButton.addEventListener("click", () => {
    
    // Add your code here to leave the chat room
    auth.signOut()
      .then(() => {
        console.log("User logged out");
        window.location.href = "index.html"; // Navigate to homepage.html
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  });
  
  

// Real-time message updates
// firestore.collection("rooms").doc(roomId).collection("messages")
//   .orderBy("timestamp")
//   .onSnapshot((snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         const message = change.doc.data();
//         displayMessage(message.text);
//       }
//     });
//   });

// Check if a user is already logged in
auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log("No user logged in");
    window.location.href = "index.html";
  }
});
