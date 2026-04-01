-- TechWatch AI: migrate existing database to EmailSetting architecture.
-- Back up techwatch_db before running. Adjust USE ... if your DB name differs.

USE techwatch_db;

CREATE TABLE IF NOT EXISTS email_setting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Remove hardcoded default on source.category (may warn if already NULL; safe to re-run)
ALTER TABLE source MODIFY COLUMN category VARCHAR(100) NULL;

DROP TABLE IF EXISTS user_request;

-- Optional data migration (run only if the legacy `setting` table exists):
-- INSERT INTO email_setting (recipient_email)
-- SELECT s.value FROM setting s
-- WHERE s.`key` = 'digest_email' AND s.value IS NOT NULL AND TRIM(s.value) <> ''
--   AND NOT EXISTS (SELECT 1 FROM email_setting LIMIT 1)
-- LIMIT 1;

-- Optional: remove legacy key/value table if nothing else uses it:
-- DROP TABLE IF EXISTS setting;
