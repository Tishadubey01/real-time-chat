// Firebase Authentication and Firestore instances
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
      toggleContainers(false);
      userName.textContent = result.user.displayName;
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
