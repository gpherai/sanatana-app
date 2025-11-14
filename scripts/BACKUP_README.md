# 🗜️ Backup Script

Quick backup utility for the Sanatana Kalender project without node_modules and build artifacts.

## 📦 What Gets Backed Up

✅ **Included:**

- All source code (`src/`)
- Configuration files
- Documentation (`DOCS/`, `PROGRESS/`)
- Prisma schema
- Public assets and themes
- Package.json and lock files

❌ **Excluded:**

- `node_modules/` (can be reinstalled with `npm install`)
- `.next/` (build output)
- `prisma/dev.db` (database file)
- Build artifacts and cache folders
- Log files
- `.env` file (contains secrets)

## 🚀 Usage

### Option 1: Double-click (Easy)

1. Double-click `backup.bat`
2. Backup will be created in `C:\projects\`

### Option 2: PowerShell (Advanced)

```powershell
cd C:\projects\sanatana-kalender
.\backup.ps1
```

### Option 3: Command Prompt

```cmd
cd C:\projects\sanatana-kalender
backup.bat
```

## 📁 Output

Backup is saved as:

```
C:\projects\sanatana-kalender_backup_YYYY-MM-DD_HHMM.zip
```

Example: `sanatana-kalender_backup_2025-10-02_1430.zip`

## 🔄 Restoring from Backup

1. Extract ZIP to desired location
2. Navigate to folder
3. Run `npm install` to restore node_modules
4. Run `npm run db:push` to recreate database
5. Run `npm run db:seed` to add example data
6. Run `npm run dev` to start

## 💡 Tips

- Run backup before major changes
- Backup size: ~2-5 MB (without node_modules ~200+ MB)
- Keep multiple backups with different dates
- Store backups in cloud/external drive for safety

## ⚠️ Important

The `.env` file is **not included** in backups for security.
Remember to backup your `.env` separately if needed (contains DATABASE_URL, API keys).
