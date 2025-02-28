-- First, remove duplicates keeping the first occurrence
DELETE FROM exercises a USING (
  SELECT MIN(ctid) as ctid, name
  FROM exercises 
  GROUP BY name
  HAVING COUNT(*) > 1
) b
WHERE a.name = b.name 
AND a.ctid <> b.ctid;

-- Then add unique constraint
ALTER TABLE exercises ADD CONSTRAINT exercises_name_unique UNIQUE (name); 