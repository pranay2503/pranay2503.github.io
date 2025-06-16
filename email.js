function toggleEmail() {
  const email = document.getElementById("email");
  if (email.innerHTML.includes("@")) {
    email.innerHTML = "Click to show email";
  } else {
    email.innerHTML = "gundus1@udayton.edu";
  }
}
