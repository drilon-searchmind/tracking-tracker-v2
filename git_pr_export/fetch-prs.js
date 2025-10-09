const https = require('https');
const fs = require('fs');

const owner = 'drilon-searchmind';
const repo = 'tracking-tracker-v2';
const token = ''; 

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

    return allPRs.filter(pr => pr.merged_at !== null);
}

async function fetchPRDetails(prs) {
    console.log('Fetching PR details...');
    const detailedPRs = [];

    for (const pr of prs) {
        console.log(`Fetching details for PR #${pr.number}: ${pr.title}`);

        const prDetails = await makeGitHubRequest(`/repos/${owner}/${repo}/pulls/${pr.number}`);

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

async function main() {
    try {
        const mergedPRs = await fetchAllPullRequests();
        console.log(`Found ${mergedPRs.length} merged PRs`);

        const detailedPRs = await fetchPRDetails(mergedPRs);

        fs.writeFileSync('github_prs_raw.json', JSON.stringify(detailedPRs, null, 2));
        console.log('Raw PR data saved to github_prs_raw.json');

    } catch (error) {
        console.error('Error fetching PR data:', error);
    }
}

main();