const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('github_prs_raw.json'));

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day;
    d.setUTCDate(diff);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function formatDateYMD(date) {
    return date.toISOString().split('T')[0];
}

function formatDateForDisplay(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function cleanEmoji(message) {
    return message.replace(/^:([\w-]+):\s*/, '');
}

function extractEmojiType(message) {
    const emojiMatch = message.match(/^:([\w-]+):/);
    if (!emojiMatch) return null;

    const emoji = emojiMatch[1];

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

function generateTitle(message) {
    let cleanMessage = cleanEmoji(message).trim();

    if (cleanMessage.length < 15) {
        return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
    }

    let title;
    if (cleanMessage.includes(';')) {
        title = cleanMessage.split(';')[0].trim();
    } else if (cleanMessage.includes(':')) {
        title = cleanMessage.split(':')[0].trim();
    } else if (cleanMessage.includes('.')) {
        title = cleanMessage.split('.')[0].trim();
    } else {
        title = cleanMessage.length > 200
            ? cleanMessage.substring(0, 200).trim() + '...'
            : cleanMessage;
    }

    return title.charAt(0).toUpperCase() + title.slice(1);
}

function generateDescription(message, type) {
    let cleanMessage = cleanEmoji(message).trim();

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

    if (!cleanMessage.endsWith('.') &&
        !cleanMessage.endsWith('!') &&
        !cleanMessage.endsWith('?')) {
        cleanMessage += '.';
    }

    return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
}

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

allCommits.sort((a, b) => new Date(b.mergedAt) - new Date(a.mergedAt));

const weekGroups = new Map();
allCommits.forEach(commit => {
    const weekStart = getWeekStart(commit.mergedAt);
    const weekKey = formatDateYMD(weekStart);

    if (!weekGroups.has(weekKey)) {
        weekGroups.set(weekKey, []);
    }

    weekGroups.get(weekKey).push(commit);
});

const sortedWeeks = Array.from(weekGroups.keys()).sort().reverse();
let majorVersion = 2;
let weekCounter = 0;

const weekVersionMap = new Map();

sortedWeeks.forEach((weekKey) => {
    const version = `${majorVersion}.${weekCounter}.0`;
    weekVersionMap.set(weekKey, version);
    weekCounter++;
});

const releases = Array.from(weekGroups.entries()).map(([weekKey, commits]) => {
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formattedDateRange = `${formatDateForDisplay(weekStart)} - ${formatDateForDisplay(weekEnd)}`;
    const version = weekVersionMap.get(weekKey);

    const commitsByType = {
        feature: [],
        bugfix: [],
        refactor: [],
        ui: [],
        wip: [],
        improvement: [],
        responsive: [], 
        removal: [],    
        other: []
    };

    commits.forEach(commit => {
        const type = extractEmojiType(commit.message) || 'other';
        const safeType = commitsByType[type] ? type : 'other';

        const title = generateTitle(commit.message);
        const description = generateDescription(commit.message, type);

        commitsByType[safeType].push({
            title,
            description,
            sha: commit.sha.substring(0, 8)
        });
    });

    const majorFeatures = [
        ...commitsByType.feature,
        ...commitsByType.ui
    ].slice(0, 5);

    const bugfixes = [
        ...commitsByType.bugfix
    ].slice(0, 3);

    let releaseTitle = '';
    if (majorFeatures.length > 0) {
        const mainFeature = majorFeatures[0].title;
        releaseTitle = `${mainFeature} and More`;
    } else if (bugfixes.length > 0) {
        releaseTitle = "Bug Fixes and Improvements";
    } else if (commitsByType.refactor.length > 0) {
        releaseTitle = "Platform Refinements";
    } else {
        releaseTitle = `Weekly Update ${version}`;
    }

    const isMajorRelease = majorFeatures.length >= 3;

    let releaseDescription = `This release includes ${commits.length} improvements`;
    if (majorFeatures.length > 0) {
        releaseDescription += ` with ${majorFeatures.length} new features`;
    }
    if (bugfixes.length > 0) {
        releaseDescription += ` and ${bugfixes.length} bug fixes`;
    }
    releaseDescription += '.';

    const features = [];

    majorFeatures.forEach(feature => {
        features.push({
            title: feature.title,
            description: feature.description
        });
    });

    bugfixes.forEach(bugfix => {
        features.push({
            title: bugfix.title,
            description: bugfix.description
        });
    });

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

    if (features.length === 0) {
        features.push({
            title: "Various Improvements",
            description: "Several improvements and optimizations to enhance platform performance."
        });
    }

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

releases.sort((a, b) => {
    const partsA = a.version.split('.').map(Number);
    const partsB = b.version.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (partsA[i] !== partsB[i]) {
            return partsB[i] - partsA[i];
        }
    }

    return 0;
});

fs.writeFileSync('releases.json', JSON.stringify(releases, null, 2));
console.log(`Generated ${releases.length} releases in releases.json, grouped by week`);

const detailedChangelog = Array.from(weekGroups.entries()).map(([weekKey, commits]) => {
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formattedDateRange = `${formatDateForDisplay(weekStart)} - ${formatDateForDisplay(weekEnd)}`;
    const version = weekVersionMap.get(weekKey);

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

fs.writeFileSync('detailed-changelog.json', JSON.stringify(detailedChangelog, null, 2));
console.log(`Generated detailed changelog in detailed-changelog.json`);