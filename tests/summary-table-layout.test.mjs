import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const styles = fs.readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');

test('monthly summary and weekly overview share the same full-width fixed table layout', () => {
    assert.match(styles, /#weekly-overview-table\s*\{[\s\S]*table-layout:\s*fixed;[\s\S]*width:\s*100%;/);
    assert.match(styles, /#monthly-summary-table\s*\{\s*width:\s*100%;\s*\}/);
});
