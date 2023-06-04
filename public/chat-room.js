







// // Get the room ID or user ID from the query string
// const urlParams = new URLSearchParams(window.location.search);
// const roomId = urlParams.get("roomId");
// const userId = urlParams.get("userId");

// // Firebase Authentication and Firestore instances
// const auth = firebase.auth();
// const firestore = firebase.firestore();

// // DOM elements
// const messagesDiv = document.getElementById("messages");
// const messageInput = document.getElementById("message-input");
// const sendButton = document.getElementById("send-button");
// const leaveButton = document.getElementById("leave-button");
// const chatHeading = document.getElementById("chat-heading");

// function displayMessage(message) {
//   const { text, senderName, senderProfilePicture } = message;

//   const messageDiv = document.createElement("div");
//   messageDiv.classList.add("message");

//   // Create an element for the profile picture
//   const profilePicture = document.createElement("img");
//   profilePicture.classList.add("profile-picture");
//   profilePicture.src = senderProfilePicture;
//   messageDiv.appendChild(profilePicture);

//   // Create an element for the sender's name
//   const senderNameElement = document.createElement("span");
//   senderNameElement.classList.add("sender-name");
//   senderNameElement.textContent = senderName;
//   messageDiv.appendChild(senderNameElement);

//   // Create an element for the message text
//   const messageText = document.createElement("p");
//   messageText.classList.add("message-text");
//   messageText.textContent = text;
//   messageDiv.appendChild(messageText);

//   messagesDiv.appendChild(messageDiv);
// }

// // Real-time message updates
// if (roomId) {
//   firestore
//     .collection("rooms")
//     .doc(roomId)
//     .collection("messages")
//     .orderBy("timestamp")
//     .onSnapshot((snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           const message = change.doc.data();
//           displayMessage(message);
//         }
//       });
//     });

//   // Display previous messages
//   firestore
//     .collection("rooms")
//     .doc(roomId)
//     .collection("messages")
//     .orderBy("timestamp")
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const message = doc.data();
//         displayMessage(message);
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching previous messages:", error);
//     });

//   // Send message button click event
//   sendButton.addEventListener("click", () => {
//     const message = messageInput.value;
//     messageInput.value = "";

//     const user = auth.currentUser;
//     const { displayName, photoURL, uid } = user;

//     firestore
//       .collection("rooms")
//       .doc(roomId)
//       .collection("messages")
//       .add({
//         text: message,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//         userId: uid,
//         senderName: displayName,
//         senderProfilePicture: photoURL,
//       })
//       .then(() => {
//         console.log("Message sent successfully");
//       })
//       .catch((error) => {
//         console.error("Message send error:", error);
//       });
//   });
// } else if (userId) {
//   // Fetch the user information for direct messaging
//   firestore
//     .collection("users")
//     .doc(userId)
//     .get()
//     .then((doc) => {
//       const user = doc.data();
//       if (user) {
//         const { username, profilePicture } = user;
//         chatHeading.textContent = "Chatting with " + username;

//         firestore
//           .collection("users")
//           .doc(userId)
//           .collection("messages")
//           .orderBy("timestamp")
//           .onSnapshot((snapshot) => {
//             snapshot.docChanges().forEach((change) => {
//               if (change.type === "added") {
//                 const message = change.doc.data();
//                 displayMessage(message);
//               }
//             });
//           });

//         // Display previous messages
//         firestore
//           .collection("users")
//           .doc(userId)
//           .collection("messages")
//           .orderBy("timestamp")
//           .get()
//           .then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//               const message = doc.data();
//               displayMessage(message);
//             });
//           })
//           .catch((error) => {
//             console.error("Error fetching previous messages:", error);
//           });

//         // Send message button click event
//         sendButton.addEventListener("click", () => {
//           const message = messageInput.value;
//           messageInput.value = "";

//           const user = auth.currentUser;
//           const { displayName, photoURL, uid } = user;

//           firestore
//             .collection("users")
//             .doc(userId)
//             .collection("messages")
//             .add({
//               text: message,
//               timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//               senderId: uid,
//               senderName: displayName,
//               senderProfilePicture: photoURL,
//             })
//             .then(() => {
//               console.log("Message sent successfully");
//             })
//             .catch((error) => {
//               console.error("Message send error:", error);
//             });
//         });
//       } else {
//         console.error("User information not found");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching user information:", error);
//     });
// }

// function getDirectMessageId(userId1, userId2) {
//   const ids = [userId1, userId2];
//   ids.sort();
//   return ids.join("-");
// }

// // Leave button click event
// leaveButton.addEventListener("click", () => {
//   window.history.back();
// });



// Get the room ID or user ID from the query string
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const userId = urlParams.get("userId");

// Firebase Authentication and Firestore instances
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM elements
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const leaveButton = document.getElementById("leave-button");
const chatHeading = document.getElementById("chat-heading");

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
  senderNameElement.textContent = senderName + ":";
  messageDiv.appendChild(senderNameElement);

  // Create an element for the message text
  const messageText = document.createElement("p");
  messageText.classList.add("message-text");
  messageText.textContent = text;
  messageDiv.appendChild(messageText);

  messagesDiv.appendChild(messageDiv);
}

// Real-time message updates
if (roomId) {
  firestore
    .collection("rooms")
    .doc(roomId)
    .collection("messages")
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
  firestore
    .collection("rooms")
    .doc(roomId)
    .collection("messages")
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
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
} else if (userId) {
  // Fetch the user information for direct messaging
  firestore
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      const user = doc.data();
      if (user) {
        const { username, profilePicture } = user;
        chatHeading.textContent = "Chatting with " + username;

        const currentUser = auth.currentUser;
        const { uid } = currentUser;

        const directMessageId = getDirectMessageId(uid, userId);

        firestore
          .collection("direct_messages")
          .doc(directMessageId)
          .collection("messages")
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
        firestore
          .collection("direct_messages")
          .doc(directMessageId)
          .collection("messages")
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
            .collection("direct_messages")
            .doc(directMessageId)
            .collection("messages")
            .add({
              text: message,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              senderId: uid,
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
      } else {
        console.error("User information not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

function getDirectMessageId(userId1, userId2) {
  const ids = [userId1, userId2];
  ids.sort();
  return ids.join("-");
}

// Leave button click event
leaveButton.addEventListener("click", () => {
  window.history.back();
});

