ALTER TABLE events ADD COLUMN location VARCHAR(255);
UPDATE events SET location = '본사 대강당' WHERE location IS NULL;
