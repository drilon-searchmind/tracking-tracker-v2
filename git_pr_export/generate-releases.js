const fs = require('fs');

// Read the raw PR data
const rawData = JSON.parse(fs.readFileSync('github_prs_raw.json'));

// Function to get the start of the week (Sunday) for a given date
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day;
    d.setUTCDate(diff);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// Function to format date as YYYY-MM-DD
function formatDateYMD(date) {
    return date.toISOString().split('T')[0];
}

// Function to format date for display
function formatDateForDisplay(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to clean emoji from commit message
function cleanEmoji(message) {
    return message.replace(/^:([\w-]+):\s*/, '');
}

// Function to extract emoji type from commit message
function extractEmojiType(message) {
    const emojiMatch = message.match(/^:([\w-]+):/);
    if (!emojiMatch) return null;

    const emoji = emojiMatch[1];

    // Map emoji to type
    const emojiTypeMap = {
        'hammer': 'feature',
        'sparkles': 'feature',
        'zap': 'feature',
        'rocket': 'feature',
        'construction': 'wip',
        'wrench': 'improvement',
        'recycle': 'refactor',
        'lipstick': 'ui',
        'art': 'ui',
        'iphone': 'responsive',
        'bug': 'bugfix',
        'fire': 'removal'
    };

    return emojiTypeMap[emoji] || 'other';
}

// Function to generate a professional title from commit message
function generateTitle(message) {
    // Clean the message
    let cleanMessage = cleanEmoji(message).trim();

    // Handle special case for very short messages
    if (cleanMessage.length < 15) {
        return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
    }

    // Split by common delimiters to find the main subject
    let title;
    if (cleanMessage.includes(';')) {
        title = cleanMessage.split(';')[0].trim();
    } else if (cleanMessage.includes(':')) {
        title = cleanMessage.split(':')[0].trim();
    } else if (cleanMessage.includes('.')) {
        title = cleanMessage.split('.')[0].trim();
    } else {
        // Extract first 50 chars or first sentence
        title = cleanMessage.length > 200
            ? cleanMessage.substring(0, 200).trim() + '...'
            : cleanMessage;
    }

    // Capitalize first letter
    return title.charAt(0).toUpperCase() + title.slice(1);
}

// Function to generate a professional description from commit message
function generateDescription(message, type) {
    // Clean the message
    let cleanMessage = cleanEmoji(message).trim();

    // Enhance description based on type
    switch (type) {
        case 'feature':
            if (!cleanMessage.includes('functionality') &&
                !cleanMessage.includes('feature') &&
                !cleanMessage.includes('capability')) {
                cleanMessage = `Added ${cleanMessage}`;
            }
            break;

        case 'bugfix':
            if (!cleanMessage.includes('fix') &&
                !cleanMessage.includes('resolv') &&
                !cleanMessage.includes('correct')) {
                cleanMessage = `Fixed an issue where ${cleanMessage}`;
            }
            break;

        case 'refactor':
            if (!cleanMessage.includes('refactor') &&
                !cleanMessage.includes('restructur') &&
                !cleanMessage.includes('reorganiz')) {
                cleanMessage = `Refactored ${cleanMessage} for improved performance and maintainability`;
            }
            break;

        case 'ui':
            if (!cleanMessage.includes('UI') &&
                !cleanMessage.includes('interface') &&
                !cleanMessage.includes('design')) {
                cleanMessage = `Enhanced user interface with ${cleanMessage}`;
            }
            break;
    }

    // Make sure it ends with a period
    if (!cleanMessage.endsWith('.') &&
        !cleanMessage.endsWith('!') &&
        !cleanMessage.endsWith('?')) {
        cleanMessage += '.';
    }

    // Capitalize first letter
    return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
}

// Extract all commits from PRs
let allCommits = [];
rawData.forEach(pr => {
    if (!pr.commits || !pr.commits.length) return;

    pr.commits.forEach(commit => {
        if (commit.message.startsWith('Merge')) return; // Skip merge commits

        allCommits.push({
            message: commit.message,
            sha: commit.sha,
            prNumber: pr.number,
            prTitle: pr.title,
            mergedAt: pr.merged_at
        });
    });
});

// Sort commits by merged date (newest first)
allCommits.sort((a, b) => new Date(b.mergedAt) - new Date(a.mergedAt));

// Group commits by week
const weekGroups = new Map();
allCommits.forEach(commit => {
    const weekStart = getWeekStart(commit.mergedAt);
    const weekKey = formatDateYMD(weekStart);

    if (!weekGroups.has(weekKey)) {
        weekGroups.set(weekKey, []);
    }

    weekGroups.get(weekKey).push(commit);
});

// Generate version numbers based on weeks
// We'll use a semantic versioning scheme: 2.WEEK.0 where WEEK increments for each week
const sortedWeeks = Array.from(weekGroups.keys()).sort().reverse();
let majorVersion = 2;
let weekCounter = 0;

// Map to store week -> version mapping
const weekVersionMap = new Map();

sortedWeeks.forEach((weekKey) => {
    const version = `${majorVersion}.${weekCounter}.0`;
    weekVersionMap.set(weekKey, version);
    weekCounter++;
});

// Convert to releases format
const releases = Array.from(weekGroups.entries()).map(([weekKey, commits]) => {
    // Get week dates for display
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formattedDateRange = `${formatDateForDisplay(weekStart)} - ${formatDateForDisplay(weekEnd)}`;
    const version = weekVersionMap.get(weekKey);

    // Organize commits by type
    const commitsByType = {
        feature: [],
        bugfix: [],
        refactor: [],
        ui: [],
        wip: [],
        improvement: [], // Added this
        responsive: [],  // Added this
        removal: [],     // Added this
        other: []
    };

    // Process each commit
    commits.forEach(commit => {
        const type = extractEmojiType(commit.message) || 'other';
        // Make sure the type exists in commitsByType, otherwise use 'other'
        const safeType = commitsByType[type] ? type : 'other';

        const title = generateTitle(commit.message);
        const description = generateDescription(commit.message, type);

        commitsByType[safeType].push({
            title,
            description,
            sha: commit.sha.substring(0, 8) // Short SHA for reference
        });
    });

    // Determine major features for this week's release
    const majorFeatures = [
        ...commitsByType.feature,
        ...commitsByType.ui
    ].slice(0, 5); // Take top 5 features/UI changes

    const bugfixes = [
        ...commitsByType.bugfix
    ].slice(0, 3); // Take top 3 bugfixes

    // Generate a title for this week's release based on major commits
    let releaseTitle = '';
    if (majorFeatures.length > 0) {
        // Use the first major feature as the title basis
        const mainFeature = majorFeatures[0].title;
        releaseTitle = `${mainFeature} and More`;
    } else if (bugfixes.length > 0) {
        releaseTitle = "Bug Fixes and Improvements";
    } else if (commitsByType.refactor.length > 0) {
        releaseTitle = "Platform Refinements";
    } else {
        releaseTitle = `Weekly Update ${version}`;
    }

    // Determine if this is a major release based on significant features
    const isMajorRelease = majorFeatures.length >= 3;

    // Generate a description
    let releaseDescription = `This release includes ${commits.length} improvements`;
    if (majorFeatures.length > 0) {
        releaseDescription += ` with ${majorFeatures.length} new features`;
    }
    if (bugfixes.length > 0) {
        releaseDescription += ` and ${bugfixes.length} bug fixes`;
    }
    releaseDescription += '.';

    // Format all features for the release
    const features = [];

    // Add major features first
    majorFeatures.forEach(feature => {
        features.push({
            title: feature.title,
            description: feature.description
        });
    });

    // Add bugfixes
    bugfixes.forEach(bugfix => {
        features.push({
            title: bugfix.title,
            description: bugfix.description
        });
    });

    // Add other notable changes
    const otherChanges = [
        ...commitsByType.refactor,
        ...commitsByType.other
    ].slice(0, 2);

    otherChanges.forEach(change => {
        features.push({
            title: change.title,
            description: change.description
        });
    });

    // If we have no features, add a generic one
    if (features.length === 0) {
        features.push({
            title: "Various Improvements",
            description: "Several improvements and optimizations to enhance platform performance."
        });
    }

    // Build the release object
    return {
        id: `v${version}`,
        version: version,
        date: formattedDateRange,
        type: isMajorRelease ? "major" : "feature",
        title: releaseTitle,
        description: releaseDescription,
        features: features
    };
});

// Sort releases by version number (newest first)
releases.sort((a, b) => {
    const partsA = a.version.split('.').map(Number);
    const partsB = b.version.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (partsA[i] !== partsB[i]) {
            return partsB[i] - partsA[i]; // Descending order
        }
    }

    return 0;
});

// Write to a JSON file
fs.writeFileSync('releases.json', JSON.stringify(releases, null, 2));
console.log(`Generated ${releases.length} releases in releases.json, grouped by week`);

// Also generate a detailed weekly changelog with all commits
const detailedChangelog = Array.from(weekGroups.entries()).map(([weekKey, commits]) => {
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formattedDateRange = `${formatDateForDisplay(weekStart)} - ${formatDateForDisplay(weekEnd)}`;
    const version = weekVersionMap.get(weekKey);

    // Group commits by type
    const commitDetails = {};

    commits.forEach(commit => {
        const type = extractEmojiType(commit.message) || 'other';
        if (!commitDetails[type]) {
            commitDetails[type] = [];
        }

        commitDetails[type].push({
            title: generateTitle(commit.message),
            description: generateDescription(commit.message, type),
            sha: commit.sha.substring(0, 8),
            prNumber: commit.prNumber
        });
    });

    return {
        week: formattedDateRange,
        version: version,
        changes: commitDetails
    };
});

// Write to a JSON file
fs.writeFileSync('detailed-changelog.json', JSON.stringify(detailedChangelog, null, 2));
console.log(`Generated detailed changelog in detailed-changelog.json`);