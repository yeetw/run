import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const styles = fs.readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const achievementsHtml = fs.readFileSync(new URL('../achievements.html', import.meta.url), 'utf8');

test('achievements table keeps cells on one line and gives race column more width', () => {
    assert.match(styles, /#achievements-table\s*\{[\s\S]*width:\s*100%;[\s\S]*table-layout:\s*fixed;/);
    assert.match(styles, /#achievements-table col\.col-no\s*\{[\s\S]*width:\s*5%;/);
    assert.match(styles, /#achievements-table col\.col-race\s*\{[\s\S]*width:\s*22%;/);
    assert.match(styles, /#achievements-table col\.col-date\s*\{[\s\S]*width:\s*14%;/);
    assert.match(styles, /#achievements-table col\.col-distance,\s*#achievements-table col\.col-duration,\s*#achievements-table col\.col-heart-rate,\s*#achievements-table col\.col-cadence\s*\{[\s\S]*width:\s*12%;/);
    assert.match(styles, /#achievements-table th:nth-child\(2\)\s*\{[\s\S]*white-space:\s*nowrap;/);
    assert.match(styles, /#achievements-table td:nth-child\(2\)\s*\{[\s\S]*white-space:\s*normal;/);
    assert.match(styles, /#achievements-table td:first-child,[\s\S]*#achievements-table td:nth-child\(8\)\s*\{[\s\S]*white-space:\s*nowrap;/);
    assert.match(styles, /#achievements-table th,\s*#achievements-table td\s*\{[\s\S]*text-align:\s*center;[\s\S]*vertical-align:\s*middle;/);
    assert.match(styles, /#achievements-table th\s*\{[\s\S]*white-space:\s*normal;/);
});

test('achievements tables declare the same column structure on home and detail pages', () => {
    assert.match(indexHtml, /<table class="data-table" id="achievements-table">[\s\S]*<colgroup>[\s\S]*class="col-race"/);
    assert.match(achievementsHtml, /<table class="data-table" id="achievements-table">[\s\S]*<colgroup>[\s\S]*class="col-race"/);
});
