-- Fix organization_members INSERT policy
-- The previous policy had issues with self-referencing

DROP POLICY IF EXISTS "Owners and admins can add members" ON organization_members;

-- Simpler policy: users can add themselves as owner to a new org, 
-- or admins/owners can add others
CREATE POLICY "Users can join or be added to orgs"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Case 1: User adding themselves as owner (creating new org)
    (
      user_id = auth.uid()
      AND role = 'owner'
    )
    OR
    -- Case 2: Existing owner/admin adding someone else
    (
      EXISTS (
        SELECT 1 FROM organization_members existing
        WHERE existing.organization_id = organization_members.organization_id
        AND existing.user_id = auth.uid()
        AND existing.role IN ('owner', 'admin')
      )
    )
  );
