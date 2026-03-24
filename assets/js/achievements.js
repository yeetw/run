function parseAchievementNo(value) {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isNaN(parsedValue) ? Number.NEGATIVE_INFINITY : parsedValue;
}

export function prepareAchievementsForDisplay(races = [], limit = 0) {
    const raceList = Array.isArray(races) ? [...races] : [];

    raceList.sort((raceA = {}, raceB = {}) => (
        parseAchievementNo(raceB.no) - parseAchievementNo(raceA.no)
    ));

    if (!Number.isInteger(limit) || limit <= 0) {
        return raceList;
    }

    return raceList.slice(0, limit);
}
