# Copilot Instructions for jecrcfoundation

## Project Overview
- This is a Next.js (React) web application with custom scripts for PDF data extraction and MySQL integration.
- The main app code is in the root and `app/` directories. PDF processing scripts are in `scripts/`.
- Student data is extracted from PDFs and inserted into a MySQL table (`2529master`).

## Key Directories & Files
- `app/` — Next.js app pages/components. Static assets in `public/`.
- `app/allpdfs/` — (Ignored in git) Directory for input PDF files for data extraction.
- `scripts/pdf_to_db.js` — Node.js script to extract student data from PDFs and insert into MySQL.
- `.env` — Database credentials (never commit to git).
- `.gitignore` — Ensures PDFs and sensitive files are not tracked.
- `README_DEPLOY.md` — Deployment and server setup instructions.

## Developer Workflows
- **Install dependencies:** `npm install`
- **Build app:** `npm run build`
- **Start app:** `npm start` (production) or `npm run dev` (development)
- **Extract PDF data:** `node scripts/pdf_to_db.js` (requires MySQL and PDFs in `app/allpdfs/`)
- **Deploy:** Use `deploy.sh` or manual steps in `README_DEPLOY.md`.
- **Push code:** Never push PDFs; always check `.gitignore`.

## Patterns & Conventions
- All PDF extraction logic is in `scripts/pdf_to_db.js`. Update this script for new data fields or table changes.
- Database credentials are loaded from `.env` using `dotenv`.
- Images and signatures are referenced by file path in the database, not stored as blobs.
- Use PM2 for production process management (see `README_DEPLOY.md`).
- All large files (PDFs, images) must be ignored in git.

## Integration Points
- MySQL: All student data is inserted into the `2529master` table. Update schema as needed for new fields.
- PDF parsing: Uses `pdfjs-dist`. If image extraction is needed, consider a specialized library.

## Examples
- To add a new data field, update both the MySQL table and the extraction logic in `scripts/pdf_to_db.js`.
- To deploy, follow the steps in `README_DEPLOY.md` and use the provided shell scripts.

---
For any new automation or integration, follow the patterns in `scripts/` and keep all sensitive data out of git.
