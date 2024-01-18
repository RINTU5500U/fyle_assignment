// index.js

async function fetchRepositories() {
    const username = $('#username').val();
    const reposContainer = $('#repos');
    const loader = $('#loader');
    const profilePicture = $('#profile-picture');
    const profileUsername = $('#profile-username');
    const reposPerPage = $('#repos-per-page').val();

    // Show loader while API request is in progress
    loader.show();

    try {
        // Fetch user data from GitHub API
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();

        // Update profile section
        profilePicture.attr('src', userData.avatar_url);
        profileUsername.text(userData.login);

        // Fetch repositories from GitHub API (paginate through all pages)
        let page = 1;
        let allRepos = [];

        while (true) {
            const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${reposPerPage}`);
            const repos = await repoResponse.json();

            if (repos.length === 0) {
                break; // No more repositories
            }

            allRepos = [...allRepos, ...repos];
            page++;
        }

        // Display all repositories in two columns
        reposContainer.empty();
        for (let i = 0; i < allRepos.length; i += 2) {
            const repoCard1 = createRepoCard(allRepos[i]);
            const repoCard2 = i + 1 < allRepos.length ? createRepoCard(allRepos[i + 1]) : null;

            const row = $('<div class="row mb-4"></div>');
            row.append(repoCard1);
            if (repoCard2) {
                row.append(repoCard2);
            }

            reposContainer.append(row);
        }

        // Show "Repositories per page" dropdown and user's profile
        $('#repos-per-page').show();
        $('#profile').show();
    } catch (error) {
        console.error('Error fetching data:', error.message);
        reposContainer.html('<p>No data present in this name on gihub</p>');
    } finally {
        // Hide loader after API request is complete
        loader.hide();
    }
}

function createRepoCard(repo) {
    return $(`
        <div class="col-md-6">
            <div class="repo-box card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || 'No description'}</p>
                    <p class="card-text"><strong>Primary Language:</strong> ${repo.language || 'Not specified'}</p>
                    <a href="${repo.html_url}" class="btn btn-primary" target="_blank">View on GitHub</a>
                </div>
            </div>
        </div>
    `);
}

