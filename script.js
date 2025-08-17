const APIURL = "https://api.github.com/users/";

const TOKEN = null; 

const main = document.getElementById("main");
const form = document.getElementById("userForm");
const search = document.getElementById("search");
const toggleBtn = document.getElementById("toggle");

function showLoader() {
  main.innerHTML = `<div class="loader"></div>`;
}

function hideLoader() {
  const loader = document.querySelector(".loader");
  if (loader) loader.remove();
}

async function getUser(username) {
  try {
    showLoader();
    const resp = await fetch(APIURL + username, {
      headers: TOKEN ? { Authorization: `token ${TOKEN}` } : {},
    });

    if (!resp.ok) throw new Error("User not found");
    const data = await resp.json();

    createUserCard(data);
    await getRepos(username);
  } catch (err) {
    main.innerHTML = `<h2>${err.message}</h2>`;
  } finally {
    hideLoader();
  }
}

async function getRepos(username) {
  try {
    const resp = await fetch(`${APIURL}${username}/repos?sort=created`, {
      headers: TOKEN ? { Authorization: `token ${TOKEN}` } : {},
    });
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

// Dark mode toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// Search form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = "";
  }
});
