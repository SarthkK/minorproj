let signUpBtn = document.querySelector(".signupbtn");
let signInBtn = document.querySelector(".signinbtn");
let nameField = document.querySelector(".namefield");
let title = document.querySelector(".title");
let underline = document.querySelector(".underline");
let text = document.querySelector(".text");
let form = document.querySelector("#loginform");

let checkSignUp = true;

function changeButtonType() {
  signUpBtn.setAttribute("type", checkSignUp ? "submit" : "button");
  signInBtn.setAttribute("type", checkSignUp ? "button" : "submit");
}

signInBtn.addEventListener("click", (e) => {
  e.preventDefault();
  nameField.style.maxHeight = "0";
  title.innerHTML = "Sign In";
  text.innerHTML = "Lost Password";
  signUpBtn.classList.add("disable");
  signInBtn.classList.remove("disable");
  underline.style.transform = "translateX(35px)";
  if (checkSignUp === false) {
    onSignIn();
  }
  checkSignUp = false;
  changeButtonType();
});
signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  nameField.style.maxHeight = "60px";
  title.innerHTML = "Sign Up";
  text.innerHTML = "Password Suggestions";
  signUpBtn.classList.remove("disable");
  signInBtn.classList.add("disable");
  underline.style.transform = "translateX(0)";
  if (checkSignUp === true) {
    console.log("here");
    onSignUp();
  }
  checkSignUp = true;
  changeButtonType();
});

async function onSignUp() {
  const formData = new FormData(form); // Collect form data

  // Convert formData to a JSON object
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(data);

  try {
    // Send the data to the backend
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function onSignIn() {
  const formData = new FormData(form); // Collect form data

  // Convert formData to a JSON object
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(data);

  // Send the data to the backend
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const finalData = await response.json();
  if (finalData.success) {
    localStorage.setItem("authToken", finalData.token);
    // fetch("http://localhost:3000/dashboard", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: finalData.token,
    //   },
    // });
    window.location.href = "/dashboard";
  } else {
    alert("Invalid Credentials");
  }
}
