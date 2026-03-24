# Running Achievements Home Limit Design

**Problem:** The home page currently renders all running achievement rows. It should instead show only the first five achievements after sorting by `No.` descending, while the dedicated achievements page should continue showing the full list.

**Scope:** Home page `RUNNING ACHIEVEMENTS` table only. The three-dot link behavior and the dedicated achievements page remain unchanged.

## Design

Use a small pure helper to prepare the achievements rows for rendering. The helper will:

1. Accept the raw achievements array.
2. Sort rows by numeric `no` descending.
3. Apply an optional display limit.

`assets/js/app.js` will use this helper when rendering achievements. The index page will pass `5` as the limit. The dedicated achievements page will pass no limit so it continues to show the full dataset.

## Error Handling

- Non-array input falls back to an empty list.
- Non-numeric `no` values sort after valid numeric values.

## Testing

- Add a small Node test that verifies sorting by `no` descending and limiting to five rows.
- Verify the dedicated page path still receives the full list by leaving its code path unlimited.
