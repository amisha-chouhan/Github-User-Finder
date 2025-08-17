const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("userForm");
const search = document.getElementById("search");
const toggleBtn = document.getElementById("toggle");


function showLoader() {
  main.innerHTML = `<div class="loader"></div>`;
}


async function getUser(username) {
  try {
    showLoader();
    const resp = await fetch(APIURL + username);
    if (!resp.ok) throw new Error("User not found");

    const data = await resp.json();
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    main.innerHTML = `<h2>${err.message}</h2>`;
  }
}


async function getRepos(username) {
  try {
    const resp = await fetch(APIURL + username + "/repos?sort=created");
    const repos = await resp.json();
    addReposToCard(repos);
  } catch (err) {
    console.log("Error fetching repos");
  }
}


function createUserCard(user) {
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" />
      </div>
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || ""}</p>
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div class="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
}


function addReposToCard(repos) {
  const reposEl = document.querySelector(".repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}


toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = "";
  }
});
