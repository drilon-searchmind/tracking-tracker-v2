import detailedChangelog from '@/git_pr_export/detailed-changelog.json';

export const releases = detailedChangelog.map(weekRelease => {
    const allFeatures = [];

    if (weekRelease.changes.feature) {
        weekRelease.changes.feature.slice(0, 5).forEach(feature => {
            allFeatures.push({
                title: feature.title,
                description: feature.description
            });
        });
    }

    if (weekRelease.changes.bugfix) {
        weekRelease.changes.bugfix.slice(0, 3).forEach(bugfix => {
            allFeatures.push({
                title: bugfix.title,
                description: bugfix.description
            });
        });
    }

    ['refactor', 'ui', 'improvement'].forEach(changeType => {
        if (weekRelease.changes[changeType]) {
            weekRelease.changes[changeType].slice(0, 2).forEach(change => {
                allFeatures.push({
                    title: change.title,
                    description: change.description
                });
            });
        }
    });

    const isMajorRelease = weekRelease.changes.feature &&
        weekRelease.changes.feature.length >= 3;

    return {
        id: `v${weekRelease.version}`,
        version: weekRelease.version,
        date: weekRelease.week.split(' - ')[0],
        type: isMajorRelease ? "major" : "feature",
        title: weekRelease.version === "2.0.0"
            ? "PPC Dashboard Enhancements & Campaign Management"
            : weekRelease.version === "2.1.0"
                ? "Enhanced Security & User Management"
                : weekRelease.version === "2.2.0"
                    ? "Campaign Features & Database Improvements"
                    : "Platform Updates",
        description: `This release includes improvements from the week of ${weekRelease.week}.`,
        features: allFeatures.length > 0 ? allFeatures : [
            {
                title: "Various Improvements",
                description: "Several improvements and bug fixes included in this release."
            }
        ]
    };
});

export default releases;