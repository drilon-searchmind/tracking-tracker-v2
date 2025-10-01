const https = require('https');
const fs = require('fs');

// Replace these values with your repository details
const owner = 'drilon-searchmind';
const repo = 'tracking-tracker-v2';
const token = ''; // Replace with your token

// Function to make GitHub API requests
function makeGitHubRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            headers: {
                'User-Agent': 'PR-Export-Script',
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        https.get(options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`GitHub API request failed: ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (e) {
                    reject(new Error(`Failed to parse GitHub API response: ${e.message}`));
                }
            });
        }).on('error', (e) => {
            reject(new Error(`GitHub API request error: ${e.message}`));
        });
    });
}

// Function to fetch all pull requests (paginated)
async function fetchAllPullRequests() {
    console.log('Fetching pull requests...');
    let allPRs = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        const path = `/repos/${owner}/${repo}/pulls?state=closed&per_page=100&page=${page}`;
        const prs = await makeGitHubRequest(path);

        if (prs.length === 0) {
            hasMorePages = false;
        } else {
            allPRs = allPRs.concat(prs);
            console.log(`Fetched page ${page}, got ${prs.length} PRs`);
            page++;
        }
    }

    // Filter to only merged PRs
    return allPRs.filter(pr => pr.merged_at !== null);
}

// Function to get PR details with additional info
async function fetchPRDetails(prs) {
    console.log('Fetching PR details...');
    const detailedPRs = [];

    for (const pr of prs) {
        console.log(`Fetching details for PR #${pr.number}: ${pr.title}`);

        // Get PR details including labels
        const prDetails = await makeGitHubRequest(`/repos/${owner}/${repo}/pulls/${pr.number}`);

        // Get commits for this PR
        const commits = await makeGitHubRequest(`/repos/${owner}/${repo}/pulls/${pr.number}/commits`);

        detailedPRs.push({
            number: pr.number,
            title: pr.title,
            body: pr.body,
            merged_at: pr.merged_at,
            base_branch: pr.base.ref,
            head_branch: pr.head.ref,
            author: pr.user.login,
            labels: prDetails.labels.map(label => label.name),
            commits: commits.map(commit => ({
                message: commit.commit.message,
                sha: commit.sha
            }))
        });
    }

    return detailedPRs;
}

// Main function to fetch all PR data and save to file
async function main() {
    try {
        // Fetch all merged PRs
        const mergedPRs = await fetchAllPullRequests();
        console.log(`Found ${mergedPRs.length} merged PRs`);

        // Get detailed information for each PR
        const detailedPRs = await fetchPRDetails(mergedPRs);

        // Save raw PR data
        fs.writeFileSync('github_prs_raw.json', JSON.stringify(detailedPRs, null, 2));
        console.log('Raw PR data saved to github_prs_raw.json');

    } catch (error) {
        console.error('Error fetching PR data:', error);
    }
}

main();