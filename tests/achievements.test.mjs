import test from 'node:test';
import assert from 'node:assert/strict';

import { prepareAchievementsForDisplay } from '../assets/js/achievements.js';

test('sorts achievements by no descending and limits to five rows', () => {
    const rows = [
        { no: '1', race: 'A' },
        { no: '6', race: 'F' },
        { no: '3', race: 'C' },
        { no: '2', race: 'B' },
        { no: '5', race: 'E' },
        { no: '4', race: 'D' }
    ];

    const result = prepareAchievementsForDisplay(rows, 5);

    assert.deepEqual(
        result.map(row => row.no),
        ['6', '5', '4', '3', '2']
    );
});
