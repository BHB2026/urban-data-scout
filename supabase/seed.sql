-- ============================================================
-- Urban Data Scout – Sample Texas County Projects + Reports
-- Run this AFTER schema.sql in Supabase → SQL Editor
-- ============================================================

-- ── Sample Projects ─────────────────────────────────────────
-- We use fixed UUIDs so the report inserts can reference them.

INSERT INTO projects (id, name, description, latitude, longitude, radius_meters, hearing_date, is_active)
VALUES

  (
    'a1b2c3d4-0001-0001-0001-a1b2c3d40001',
    'Barton Springs Watershed Mixed-Use Development',
    'Proposed 8-story mixed-use development including 400 residential units and 32,000 sq ft of '
    'commercial space adjacent to the Barton Springs Watershed and Zilker Park greenbelt. '
    'Concerns have been raised regarding stormwater runoff, traffic on Barton Springs Rd, '
    'and impact on the Edwards Aquifer recharge zone.',
    30.2633,
    -97.7700,
    1609,           -- ~1 mile radius
    '2026-04-15',
    true
  ),

  (
    'a1b2c3d4-0002-0002-0002-a1b2c3d40002',
    'FM 1093 Corridor Commercial Expansion',
    'Planned rezoning of 48 acres along FM 1093 in Fort Bend County to accommodate a regional '
    'distribution warehouse, a retail strip center, and fast-food establishments. '
    'Proximity to two elementary schools and existing residential subdivisions has prompted '
    'community input on traffic, noise, and school safety.',
    29.5519,
    -95.7974,
    2000,           -- ~1.25 mile radius
    '2026-03-28',
    true
  ),

  (
    'a1b2c3d4-0003-0003-0003-a1b2c3d40003',
    'Prairie View Industrial District – Phase 1',
    'Proposed 200-acre industrial park near Prairie View, Waller County, including logistics '
    'facilities and light manufacturing with primary access from US-290. The project sits '
    'within 0.5 miles of Prairie View A&M University and several residential areas along '
    'Business US-290.',
    30.0938,
    -95.9813,
    3000,           -- ~1.85 mile radius
    '2026-05-02',
    true
  );


-- ── Sample Reports – Project 1: Barton Springs ──────────────
INSERT INTO reports (project_id, latitude, longitude, issue_type, comment, created_at)
VALUES
  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2641, -97.7715, 'flooding',
   'The drainage ditch behind my house on Barton Skyway floods every time we get 2+ inches of rain. Adding 400 units will make it far worse.',
   now() - interval '12 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2618, -97.7688, 'traffic',
   'Barton Springs Road is already at a standstill during evening rush. I sit in traffic for 25 minutes just to get out of my neighborhood.',
   now() - interval '10 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2650, -97.7725, 'flooding',
   'This area is directly over the Edwards Aquifer recharge zone. More impervious cover means more contamination risk.',
   now() - interval '9 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2628, -97.7695, 'noise',
   'Construction noise from the current clearing work starts at 6:30am. My kids cannot sleep.',
   now() - interval '8 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2645, -97.7710, 'access',
   'Emergency vehicles already struggle to get through on Barton Springs Rd. More residents will make it worse.',
   now() - interval '7 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2620, -97.7705, 'traffic',
   NULL,
   now() - interval '7 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2635, -97.7680, 'schools',
   'Zilker Elementary is one block away. Drop-off traffic is already dangerous. 400 new units will make it unsafe for kids walking to school.',
   now() - interval '6 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2655, -97.7720, 'flooding',
   'My backyard flooded three times last year after Barton Creek overflowed. Please do not make this worse.',
   now() - interval '5 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2612, -97.7692, 'noise',
   'The planned rooftop bar will create nighttime noise issues for the entire adjacent neighborhood.',
   now() - interval '4 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2660, -97.7700, 'other',
   'The proposed building height will block views and sunlight for dozens of existing homes.',
   now() - interval '3 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2630, -97.7712, 'flooding',
   NULL,
   now() - interval '2 days'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2638, -97.7698, 'traffic',
   'The traffic impact study used pre-COVID data. Current traffic volumes are significantly higher.',
   now() - interval '1 day'),

  ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 30.2624, -97.7718, 'access',
   'The single access road shown in the site plan is inadequate for 400 units.',
   now() - interval '18 hours');


-- ── Sample Reports – Project 2: FM 1093 ─────────────────────
INSERT INTO reports (project_id, latitude, longitude, issue_type, comment, created_at)
VALUES
  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5530, -95.7985, 'traffic',
   'FM 1093 already backs up half a mile at Hwy 99 every morning. A warehouse with truck traffic will make it unbearable.',
   now() - interval '15 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5508, -95.7965, 'schools',
   'My daughter walks to Settlers Way Elementary. Warehouse truck traffic on FM 1093 is a serious safety hazard.',
   now() - interval '13 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5525, -95.7980, 'noise',
   'Loading dock operations will run 24 hours. The noise will travel directly into our subdivision.',
   now() - interval '11 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5515, -95.7970, 'traffic',
   'No traffic signal is planned at the new entrance, yet this is a stretch with no crosswalks.',
   now() - interval '10 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5535, -95.7990, 'flooding',
   'This area floods every time we get a heavy rain. Adding impervious cover from a warehouse roof and parking lot will worsen drainage.',
   now() - interval '8 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5510, -95.7960, 'noise',
   NULL,
   now() - interval '6 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5522, -95.7978, 'access',
   'The proposed truck ingress is directly across from a subdivision entrance. There will be frequent blind-spot conflicts.',
   now() - interval '4 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5500, -95.7955, 'traffic',
   'Three school buses use this stretch of FM 1093 twice a day. Mixing with 18-wheelers is dangerous.',
   now() - interval '2 days'),

  ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 29.5540, -95.7995, 'other',
   'Property values in Telfair and Riverstone will be negatively impacted. We were not notified of this project until 10 days before the hearing.',
   now() - interval '1 day');


-- ── Sample Reports – Project 3: Prairie View Industrial ──────
INSERT INTO reports (project_id, latitude, longitude, issue_type, comment, created_at)
VALUES
  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0950, -95.9830, 'noise',
   'Students at PVAMU live in dorms within 0.4 miles of this site. Industrial operations 24/7 will disrupt academic life.',
   now() - interval '20 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0925, -95.9800, 'traffic',
   'US-290 already has serious congestion during peak hours. Industrial truck traffic will add hundreds of heavy vehicles daily.',
   now() - interval '17 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0960, -95.9840, 'flooding',
   'The low-lying area near the creek floods every spring. Paving 200 acres will send runoff directly into residential areas downhill.',
   now() - interval '14 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0915, -95.9790, 'access',
   'Business US-290 through town is narrow. Trucks rerouting through downtown Prairie View will be dangerous.',
   now() - interval '12 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0945, -95.9820, 'other',
   'No community meeting was held in Prairie View itself. All public notices were posted in Hempstead, which is 12 miles away.',
   now() - interval '9 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0930, -95.9810, 'noise',
   NULL,
   now() - interval '6 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0955, -95.9845, 'flooding',
   'I have lived here 22 years. The drainage in this area cannot handle what is already there.',
   now() - interval '3 days'),

  ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 30.0920, -95.9798, 'traffic',
   'The railroad crossing on Business 290 is already a major backup point. Truck traffic will make it a daily gridlock.',
   now() - interval '1 day');
