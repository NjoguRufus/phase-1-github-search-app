// script.js
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const userList = document.getElementById('userList');
const repoList = document.getElementById('repoList');

searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
        const users = await searchUsers(query);
        displayUsers(users);
    } catch (error) {
        console.error('Error searching users:', error);
    }
});

async function searchUsers(query) {
    const url = `https://api.github.com/search/users?q=${query}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    return data.items;
}

function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        const avatar = document.createElement('img');
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login} avatar`;
        const username = document.createElement('a');
        username.href = user.html_url;
        username.textContent = user.login;
        li.appendChild(avatar);
        li.appendChild(username);
        userList.appendChild(li);

        // Add click event listener for each user
        li.addEventListener('click', async () => {
            try {
                const repos = await getUserRepos(user.login);
                displayRepos(repos);
            } catch (error) {
                console.error('Error fetching user repos:', error);
            }
        });
    });
}

async function getUserRepos(username) {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const repos = await response.json();
    return repos;
}

function displayRepos(repos) {
    repoList.innerHTML = '';
    repos.forEach(repo => {
        const li = document.createElement('li');
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.textContent = repo.name;
        li.appendChild(repoLink);
        repoList.appendChild(li);
    });
}
