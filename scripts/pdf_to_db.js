require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const pdfjsLib = require('pdfjs-dist');

const PDF_DIR = path.join(__dirname, 'app', 'allpdfs');
const IMAGE_DIR = path.join(__dirname, 'public', 'images');
const SIGN_DIR = path.join(__dirname, 'public', 'signs');

async function extractTextFromPage(page) {
  const content = await page.getTextContent();
  return content.items.map(item => item.str).join(' ');
}


async function extractImagesFromPage(page, pdfDoc, pageIndex, fileBaseName) {
  // Get operator list and resources
  const opList = await page.getOperatorList();
  const images = [];
  const objs = pdfDoc.objs;
  // pdfjs-dist does not provide a direct way to extract images, so we use hacky access
  // We'll look for image XObject references in the operator list
  for (let i = 0; i < opList.fnArray.length; i++) {
    if (opList.fnArray[i] === pdfjsLib.OPS.paintImageXObject || opList.fnArray[i] === pdfjsLib.OPS.paintJpegXObject) {
      const imgName = opList.argsArray[i][0];
      // pdfjs-dist does not expose image data directly, so this is a placeholder for real extraction
      // In production, use a library like pdf-image-extract or pdf2pic for robust image extraction
      images.push(imgName);
    }
  }
  // This only gives us the image names, not the image data. Real extraction is more complex.
  // For now, return the image names as placeholders.
  return images;
}

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
  if (!fs.existsSync(SIGN_DIR)) fs.mkdirSync(SIGN_DIR, { recursive: true });

  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
  for (const file of files) {
    const pdfPath = path.join(PDF_DIR, file);
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await extractTextFromPage(page);
      // Extract image and sign (2nd and 3rd images on the page)
      const fileBaseName = path.parse(file).name + `_page${i}`;
      const imageNames = await extractImagesFromPage(page, pdf, i, fileBaseName);
      let imagePath = null;
      let signPath = null;
      // Save image and sign if possible (placeholder logic)
      if (imageNames.length >= 3) {
        // In real extraction, you would get the image data and write to file
        imagePath = path.join('public', 'images', `${fileBaseName}_photo.jpg`);
        signPath = path.join('public', 'signs', `${fileBaseName}_sign.jpg`);
        // fs.writeFileSync(imagePath, imageData2);
        // fs.writeFileSync(signPath, imageData3);
      }
      // TODO: Parse text to extract student fields using regex or string splitting
      // Example insert (replace with actual parsed data):
      await db.execute(
        `INSERT INTO 2529master (applicant_name, father_name, mother_name, gender, dob, status, caste, category1, category3, specialization, admission_status, permanent_address, earlier_enrollment_no, corr_address, mobile_no, parent_mobile_no, entrance_exam_roll_no, entrance_exam_name, merit_secured, email, adhar_no, college_shift, ssc_roll_no, ssc_year, ssc_stream, ssc_board, ssc_obt_marks, ssc_max_marks, ssc_percentage, ssc_cgpa, ssc_result, hsc_roll_no, hsc_year, hsc_stream, hsc_board, hsc_obt_marks, hsc_max_marks, hsc_percentage, hsc_cgpa, hsc_result, image_path, sign_path) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          /* Fill with parsed values from text and image/sign paths */
          null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,imagePath,signPath
        ]
      );
    }
  }
  await db.end();
}

main().catch(console.error);
