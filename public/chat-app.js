// // // Firebase Authentication and Firestore instances
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM elements
const loginContainer = document.getElementById("login-container");
const chatContainer = document.getElementById("chat-container");
const loginButton = document.getElementById("login-button");
const createRoomButton = document.getElementById("create-room-button");
const viewRoomsButton = document.getElementById("view-rooms-button");
const roomsList = document.getElementById("rooms-list");
const userName = document.getElementById("user-name");

// Function to toggle visibility of login and chat containers
function toggleContainers(showLogin) {
  if (showLogin) {
    loginContainer.style.display = "block";
    chatContainer.style.display = "none";
  } else {
    loginContainer.style.display = "none";
    chatContainer.style.display = "block";
  }
}
// Signout button click event
const signoutButton = document.getElementById("signout-button");
signoutButton.addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      console.log("User signed out");
      toggleContainers(true);
    })
    .catch((error) => {
      console.error("Signout error:", error);
    });
});

// Function to display rooms
// Function to display rooms
function displayRooms(rooms) {
    roomsList.innerHTML = ""; // Clear existing list
  
    rooms.forEach((room) => {
      const roomDiv = document.createElement("div");
      roomDiv.classList.add("room");
  
      const roomName = document.createElement("span");
      roomName.textContent = room.name;
      roomDiv.appendChild(roomName);
  
      const joinButton = document.createElement("button");
      joinButton.textContent = "Join Room";
      joinButton.addEventListener("click", () => {
        // Navigate to the chat page for the selected room
        window.location.href = "chat.html?roomId=" + room.id;
      });
      roomDiv.appendChild(joinButton);
  
      roomsList.appendChild(roomDiv);
    });
  }
  

// Login with Google button click event
loginButton.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("Login successful");
      console.log("Display Name:", auth.currentUser.displayName);
console.log("Email Address:", auth.currentUser.email);

      toggleContainers(false);
      userName.textContent = result.user.displayName;
     
      // Save user information to Firestore
      const userRef = firestore.collection("users").doc(result.user.uid);

      userRef.set({
        userId: result.user.uid,
        username: result.user.displayName,
        email: result.user.email,
        profilePicture: result.user.photoURL
      })
      .then(() => {
        console.log("User information saved successfully");
      })
      
      .catch((error) => {
        console.error("Error saving user information:", error);
      });
     
    })
    .catch((error) => {
      console.error("Login error:", error);
    });
});



// Create room button click event
createRoomButton.addEventListener("click", () => {
    const roomName = prompt("Enter the name of the room:");
    if (roomName) {
      // Create a new document in the "rooms" collection with the room name
      firestore.collection("rooms")
        .add({ name: roomName })
        .then(() => {
          console.log("Room created successfully");
         alert("Room created successfully");
        })
        .catch((error) => {
          console.error("Error creating room:", error);
        });
    } else {
      console.log("Invalid room name");
    }
  });
  
  

// View rooms button click event
viewRoomsButton.addEventListener("click", () => {
  // Add your code here to fetch and display the list of rooms
  firestore.collection("rooms")
    .get()
    .then((querySnapshot) => {
      const rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      displayRooms(rooms);
    })
    .catch((error) => {
      console.error("Error fetching rooms:", error);
    });
});

// Check if a user is already logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user);
    toggleContainers(false);
    userName.textContent = user.displayName;
  } else {
    console.log("No user logged in");
    toggleContainers(true);
    userName.textContent = "";
  }
});
const directMessageButton = document.getElementById("direct-message-button");
directMessageButton.addEventListener("click", () => {
  // Fetch the list of available users (excluding the logged-in user)
  firestore.collection("users")
    .where("userId", "!=", auth.currentUser.uid)
    .get()
    .then((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          username: doc.data().username
        });
      });
      displayUsers(users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
});

function displayUsers(users) {
  // Clear existing user list
  const usersList = document.getElementById("users-list");
  usersList.innerHTML = "";

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");

    const username = document.createElement("span");
    username.textContent = user.username;
    userDiv.appendChild(username);

    const chatButton = document.createElement("button");
    chatButton.textContent = "Chat";
    chatButton.addEventListener("click", () => {
      // Navigate to the direct messaging page with the selected user
      window.location.href = "chat.html?userId=" + user.id;
    });
    userDiv.appendChild(chatButton);

    usersList.appendChild(userDiv);
  });
}

// const auth = firebase.auth();
// const firestore = firebase.firestore();

// // DOM elements
// const loginContainer = document.getElementById("login-container");
// const chatContainer = document.getElementById("chat-container");
// const loginButton = document.getElementById("login-button");
// const createRoomButton = document.getElementById("create-room-button");
// const viewRoomsButton = document.getElementById("view-rooms-button");
// const directMessageButton = document.getElementById("direct-message-button");
// const roomsList = document.getElementById("rooms-list");
// const usersList = document.getElementById("users-list");
// const userName = document.getElementById("user-name");

// // Function to toggle visibility of login and chat containers
// function toggleContainers(showLogin) {
//   if (showLogin) {
//     loginContainer.style.display = "block";
//     chatContainer.style.display = "none";
//   } else {
//     loginContainer.style.display = "none";
//     chatContainer.style.display = "block";
//   }
// }

// // Signout button click event
// const signoutButton = document.getElementById("signout-button");
// signoutButton.addEventListener("click", () => {
//   auth.signOut()
//     .then(() => {
//       console.log("User signed out");
//       toggleContainers(true);
//     })
//     .catch((error) => {
//       console.error("Signout error:", error);
//     });
// });

// // Function to display rooms
// function displayRooms(rooms) {
//   roomsList.innerHTML = ""; // Clear existing list

//   rooms.forEach((room) => {
//     const roomDiv = document.createElement("div");
//     roomDiv.classList.add("room");

//     const roomName = document.createElement("span");
//     roomName.textContent = room.name;
//     roomDiv.appendChild(roomName);

//     const joinButton = document.createElement("button");
//     joinButton.textContent = "Join Room";
//     joinButton.addEventListener("click", () => {
//       // Navigate to the chat page for the selected room
//       window.location.href = "chat.html?roomId=" + room.id;
//     });
//     roomDiv.appendChild(joinButton);

//     roomsList.appendChild(roomDiv);
//   });
// }
// function displayUsers(users) {
//   usersList.innerHTML = ""; // Clear existing users

//   users.forEach((user) => {
//     const userDiv = document.createElement("div");
//     userDiv.classList.add("user");

//     const usernameSpan = document.createElement("span");
//     usernameSpan.textContent = user.username;
//     userDiv.appendChild(usernameSpan);

//     const chatButton = document.createElement("button");
//     chatButton.textContent = "Chat";
//     chatButton.addEventListener("click", () => {
//       // Navigate to the direct messaging page for the selected user
//       window.location.href = "direct.html?userId=" + user.userId;
//     });
//     userDiv.appendChild(chatButton);

//     usersList.appendChild(userDiv);
//   });
// }
// // Function to display users
// // function displayUsers(users) {
// //   usersList.innerHTML = ""; // Clear existing list

// //   users.forEach((user) => {
// //     const userDiv = document.createElement("div");
// //     userDiv.classList.add("user");

// //     const userName = document.createElement("span");
// //     userName.textContent = user.username;
// //     userDiv.appendChild(userName);

// //     const chatButton = document.createElement("button");
// //     chatButton.textContent = "Chat";
// //     chatButton.addEventListener("click", () => {
// //       // Navigate to the chat page for the selected user
// //       window.location.href = "direct.html?userId=" + user.userId;
// //     });
// //     userDiv.appendChild(chatButton);

// //     //usersList.appendChild(userDiv);
// //   });
// // }

// // Login with Google button click event
// loginButton.addEventListener("click", () => {
//   const provider = new firebase.auth.GoogleAuthProvider();

//   auth.signInWithPopup(provider)
//     .then((result) => {
//       console.log("Login successful");
//       toggleContainers(false);
//       userName.textContent = result.user.displayName;

//       // Save user information to Firestore
//       const userRef = firestore.collection("users").doc(result.user.uid);

//       userRef.set({
//         userId: result.user.uid,
//         username: result.user.displayName,
//         email: result.user.email
//       })
//         .then(() => {
//           console.log("User information saved successfully");
//         })
//         .catch((error) => {
//           console.error("Error saving user information:", error);
//         });
//     })
//     .catch((error) => {
//       console.error("Login error:", error);
//     });
// });

// // Create Room button click event
// createRoomButton.addEventListener("click", () => {
//   const roomName = prompt("Enter room name:");
//   if (roomName) {
//     const roomRef = firestore.collection("rooms").doc();
//     roomRef.set({
//       id: roomRef.id,
//       name: roomName
//     })
//       .then(() => {
//         console.log("Room created successfully");
//       })
//       .catch((error) => {
//         console.error("Error creating room:", error);
//       });
//   }
// });

// // View Rooms button click event
// viewRoomsButton.addEventListener("click", () => {
//   firestore.collection("rooms")
//     .get()
//     .then((querySnapshot) => {
//       const rooms = [];
//       querySnapshot.forEach((doc) => {
//         rooms.push(doc.data());
//       });
//       displayRooms(rooms);
//     })
//     .catch((error) => {
//       console.error("Error fetching rooms:", error);
//     });
// });

// // Direct Message button click event
// directMessageButton.addEventListener("click", () => {
//   firestore.collection("users")
//     .get()
//     .then((querySnapshot) => {
//       const users = [];
//       querySnapshot.forEach((doc) => {
//         const user = doc.data();
//         if (user.userId !== auth.currentUser.uid) {
//           users.push(user);
//         }
//       });
//       displayUsers(users);
//     })
//     .catch((error) => {
//       console.error("Error fetching users:", error);
//     });
// });

// // Check if a user is already logged in
// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log("User is logged in:", user);
//     toggleContainers(false);
//     userName.textContent = user.displayName;
//   } else {
//     console.log("No user logged in");
//     toggleContainers(true);
//     userName.textContent = "";
//   }
// });

