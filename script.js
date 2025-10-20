const greeting = document.getElementById("greeting");
const hour = new Date().getHours();
let greetMessage = "";

switch (true) {
  case (hour < 12):
    greetMessage = "Good morning!";
    break;
  case (hour < 18):
    greetMessage = "Good afternoon!";
    break;
  default:
    greetMessage = "Good evening!";
}
greeting.textContent = greetMessage;

const modeBtn = document.getElementById("modeBtn");
let isDay = true;
modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  isDay = !isDay;
  modeBtn.textContent = isDay ? "Switch to Night Mode" : "Switch to Day Mode";
});

const pets = [
  { name: "Buddy", type: "Dog", desc: "Friendly and loyal.", rating: 0 },
  { name: "Misty", type: "Cat", desc: "Loves to sleep all day.", rating: 0 },
  { name: "Coco", type: "Parrot", desc: "Talkative and colorful.", rating: 0 },
  { name: "Nibbles", type: "Hamster", desc: "Cute and playful.", rating: 0 }
];

const petList = document.getElementById("petList");
pets.forEach((pet, index) => {
  const div = document.createElement("div");
  div.className = "col-md-3";
  div.innerHTML = `
  <div class="card p-3 text-center">
  <h4>${pet.name}</h4>
  <p>${pet.type}</p>
  <p>${pet.desc}</p>
  <p class="hidden-text" id="extra${index}">More info about ${pet.name}!</p>
  <button class="btn btn-outline-primary readBtn" data-id="${index}">Read More</button>
  <div class="rating mt-2" data-id="${index}">
    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
    </div>
    <button class="btn btn-success mt-2 adoptBtn">Adopt Me</button>
    </div>
    `;
  petList.appendChild(div);
});

document.querySelectorAll(".readBtn").forEach(btn => {
  btn.addEventListener("click", e => {
    const id = e.target.getAttribute("data-id");
    const extra = document.getElementById(`extra${id}`);
    extra.classList.toggle("hidden-text");
  });
});

document.querySelectorAll(".rating").forEach((ratingDiv, index) => {
  const stars = ratingDiv.querySelectorAll("span");
  stars.forEach((star, i) => {
    star.addEventListener("click", () => {
      stars.forEach(s => s.classList.remove("active"));
      for (let j = 0; j <= i; j++) {
        stars[j].classList.add("active");
      }
      pets[index].rating = i + 1;
      alert(`${pets[index].name} rated ${pets[index].rating} stars!`);
    });
  });
});

document.querySelectorAll(".adoptBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_78f79e6eb4.mp3?filename=ding-36029.mp3");
    audio.play();
    alert("Thank you for adopting a pet!");
  });
});

document.getElementById("showTimeBtn").addEventListener("click", () => {
  document.getElementById("timeDisplay").textContent = new Date().toLocaleTimeString();
});

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("formMsg").textContent = "Message sent successfully!";
  e.target.reset();
});