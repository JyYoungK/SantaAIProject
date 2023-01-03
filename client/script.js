import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  //Shows when thinking
  element.textContent = "Santa is thinking";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent.length > 20) {
      element.textContent = "Santa is thinking";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    element.textContent += text[index];

    index++;

    if (index > text.length - 1) {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
   <div class="wrapper ${isAi && "ai"}">
    <div class="chat">
      <div className="profile">
       <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
      </div>
      <div class="message" id=${uniqueId}> ${value}</div>
    </div>
   </div>
   `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  //scrolls down
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  //submit on enter
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});