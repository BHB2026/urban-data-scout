# Urban Data Scout – Step-by-Step Setup Guide

Follow these steps in order. Each step tells you exactly what to click.
Total estimated time: **45–60 minutes**.

---

## PART 1 – Create your free accounts

### Step 1 – GitHub (stores your code)

1. Open your browser and go to **https://github.com**
2. Click **Sign up** (top right)
3. Enter your email, create a password, pick a username
4. Verify your email when GitHub sends you a confirmation link
5. On the welcome screen, choose **"Skip personalization"** (or the free plan)

### Step 2 – Supabase (your database)

1. Go to **https://supabase.com**
2. Click **Start your project** → **Continue with GitHub** (sign in with the GitHub account you just made)
3. Once logged in, click **New project**
4. Fill in:
   - **Organization**: your username (already selected)
   - **Name**: `urban-data-scout`
   - **Database Password**: create a strong password and **save it somewhere safe**
   - **Region**: choose `US East` or whichever is closest to Texas
5. Click **Create new project** and wait ~2 minutes for it to initialize

### Step 3 – Vercel (hosts your website)

1. Go to **https://vercel.com**
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel to access your GitHub account
4. Choose the **Hobby (free)** plan when prompted

---

## PART 2 – Set up the database

### Step 4 – Run the database schema

1. In Supabase, open your `urban-data-scout` project
2. In the left sidebar, click **SQL Editor**
3. Click **New query** (top left of the editor)
4. Open the file `supabase/schema.sql` from this project folder on your computer
5. Copy ALL the text inside it
6. Paste it into the Supabase SQL Editor
7. Click the green **Run** button (or press Ctrl+Enter)
8. You should see: `Success. No rows returned.`

### Step 5 – Seed sample data (optional but recommended)

This loads 3 sample Texas county projects and about 30 sample reports so you have
something to show in the dashboard right away.

1. Still in Supabase SQL Editor, click **New query** again
2. Open `supabase/seed.sql` from your project folder
3. Copy ALL the text and paste it into the editor
4. Click **Run**
5. You should see: `Success. X rows affected.`

### Step 6 – Copy your Supabase credentials

1. In Supabase, click the **⚙️ Settings** gear icon in the left sidebar
2. Click **API**
3. You will see two important values — **copy them somewhere** (like Notepad):
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

---

## PART 3 – Upload your code to GitHub

### Step 7 – Create a GitHub repository

1. Go to **https://github.com** and click the **+** icon (top right) → **New repository**
2. Fill in:
   - **Repository name**: `urban-data-scout`
   - **Visibility**: Public (required for free Vercel hosting)
3. **Do NOT** check "Add a README" or any other checkboxes
4. Click **Create repository**
5. GitHub will show you a page with instructions — **leave this tab open**

### Step 8 – Install Node.js (if you don't have it)

1. Go to **https://nodejs.org**
2. Click the big green **"LTS"** download button
3. Run the installer with all default settings
4. After it finishes, restart your computer

### Step 9 – Create your .env file

1. In your project folder (`bhb`), find the file called `.env.example`
2. Make a **copy** of it in the same folder and name the copy exactly: `.env`
   - On Windows: right-click → Copy → Paste → rename to `.env`
3. Open `.env` in Notepad
4. Replace the placeholder values with your real Supabase credentials from Step 6:
   ```
   VITE_SUPABASE_URL=https://your-actual-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJyour-actual-anon-key
   ```
5. Save and close the file

### Step 10 – Open a terminal in your project folder

1. Open the **Start menu** and search for `Command Prompt` — open it
2. Type this command to go to your project folder (adjust the path if needed):
   ```
   cd "C:\Users\toddb\OneDrive\Documents\Desktop\bhb"
   ```
3. Press Enter

### Step 11 – Install dependencies and test locally

Run these commands one at a time (press Enter after each):

```
npm install
```

Wait for it to finish (may take 1–2 minutes), then:

```
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in 800 ms
  ➜  Local:   http://localhost:5173/
```

Open your browser and go to **http://localhost:5173** — you should see Urban Data Scout!

Press **Ctrl+C** in the terminal when you're done testing locally.

### Step 12 – Upload to GitHub

Run these commands in the terminal (in your project folder):

```
git init
git add .
git commit -m "Initial Urban Data Scout build"
```

Now run the commands shown on your GitHub repository page under **"push an existing repository"**. They look like:

```
git remote add origin https://github.com/YOUR-USERNAME/urban-data-scout.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

When prompted, enter your GitHub username and password (or personal access token if GitHub asks for one — go to GitHub Settings → Developer settings → Personal access tokens → Generate new token with "repo" scope).

---

## PART 4 – Deploy to Vercel

### Step 13 – Import your repository into Vercel

1. Go to **https://vercel.com/dashboard**
2. Click **Add New** → **Project**
3. You should see your `urban-data-scout` repository listed — click **Import**
4. On the configuration screen:
   - **Framework Preset**: Vercel should auto-detect `Vite` — confirm it says Vite
   - **Root Directory**: leave blank (`.`)
   - **Build Command**: `npm run build` (should be pre-filled)
   - **Output Directory**: `dist` (should be pre-filled)

### Step 14 – Add environment variables in Vercel

Still on the configuration screen, scroll down to **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | your Supabase Project URL from Step 6 |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon key from Step 6 |

Click **Add** after each one.

### Step 15 – Deploy

1. Click **Deploy**
2. Wait 1–2 minutes while Vercel builds your app
3. When finished, you'll see a green **Congratulations!** screen with a URL like:
   `https://urban-data-scout.vercel.app`
4. Click **Visit** to open your live app!

---

## PART 5 – Smoke test

Open your live Vercel URL and do the following to confirm everything works:

**Resident flow:**
1. You should see the 3 sample projects listed (or be sent directly to one)
2. Click **Report an Issue** on any project
3. Click anywhere on the map to drop a red pin
4. Select an issue type from the dropdown
5. Add an optional comment
6. Click **Submit Report**
7. You should see the confirmation ("Thank you for your report") page

**Dashboard flow:**
1. Click **Dashboard** in the top navigation
2. You should see all 3 projects with report counts
3. Click **View Dashboard** on any project
4. You should see: map with colored dots, bar chart, reports table
5. Try filtering by issue type
6. Click **Export CSV** — a file should download

If all of that works: **you're live!** 🎉

---

## Troubleshooting

**"Missing Supabase environment variables" error**
→ Make sure your `.env` file exists and has the correct values. Make sure you also added them in Vercel (Step 14).

**Map is blank or shows only gray tiles**
→ This usually resolves on refresh. It can happen if Leaflet loads before the container is ready.

**"Project not found" error on the resident form**
→ The seed data may not have run. Repeat Step 5.

**Vercel build fails**
→ Check the build log for errors. The most common issue is a typo in environment variable names — they must start with `VITE_`.

---

## Sharing with advisors / county staff

- **Resident link** (share this publicly): `https://your-app.vercel.app`
- **Dashboard link** (share with staff): `https://your-app.vercel.app/dashboard`
- For a QR code to the resident page, go to **https://www.qr-code-generator.com**, paste your URL, and download the QR image.

---

## Adding a real county project (after launch)

To add a new project, go to Supabase → SQL Editor and run:

```sql
INSERT INTO projects (name, description, latitude, longitude, radius_meters, hearing_date)
VALUES (
  'Your Project Name Here',
  'A brief description of the proposed development.',
  30.2672,    -- latitude (find this from Google Maps by right-clicking a location)
  -97.7431,   -- longitude
  1609,       -- radius in meters (1609 = 1 mile, 3218 = 2 miles)
  '2026-06-01' -- hearing date in YYYY-MM-DD format, or NULL if unknown
);
```

The project will appear immediately on the live site.
