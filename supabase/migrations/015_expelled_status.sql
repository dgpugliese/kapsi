-- Add 'expelled' and 'suspended' to member_status_changes check constraint
ALTER TABLE member_status_changes DROP CONSTRAINT IF EXISTS member_status_changes_status_type_check;
ALTER TABLE member_status_changes ADD CONSTRAINT member_status_changes_status_type_check
    CHECK (status_type IN ('invisible', 'deceased', 'reinstated', 'transferred', 'expelled', 'suspended'));
