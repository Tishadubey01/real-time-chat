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

// Function to display messages in the chat
function displayMessage(message) {
  const p = document.createElement("p");
  p.textContent = message;
  messagesDiv.appendChild(p);
}

// Send message button click event
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  messageInput.value = "";

  // Add your code here to send the message to the chat room
  firestore.collection("rooms").doc(roomId).collection("messages")
    .add({
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: auth.currentUser.uid
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
firestore.collection("rooms").doc(roomId).collection("messages")
  .orderBy("timestamp")
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const message = change.doc.data();
        displayMessage(message.text);
      }
    });
  });

// Check if a user is already logged in
auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log("No user logged in");
    window.location.href = "index.html";
  }
});
