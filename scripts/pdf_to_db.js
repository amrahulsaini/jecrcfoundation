require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const pdfParse = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');

const PDF_DIR = path.join(__dirname, '..', 'app', 'allpdfs');
const IMAGE_DIR = path.join(__dirname, '..', 'public', 'images');
const SIGN_DIR = path.join(__dirname, '..', 'public', 'signs');

async function extractDataFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractImagesFromPDF(pdfPath, fileBaseName) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const images = [];

  for (const page of pages) {
    const pageImages = page.node.Resources()?.XObject;
    if (pageImages) {
      for (const [key, value] of Object.entries(pageImages)) {
        if (value.constructor.name === 'PDFImage') {
          images.push(value);
        }
      }
    }
  }

  // Assume first image is photo, second is sign
  let imagePath = null;
  let signPath = null;
  if (images.length >= 1) {
    const imageBytes = await images[0].bytes();
    imagePath = path.join('public', 'images', `${fileBaseName}_photo.jpg`);
    fs.writeFileSync(path.join(__dirname, '..', imagePath), imageBytes);
  }
  if (images.length >= 2) {
    const signBytes = await images[1].bytes();
    signPath = path.join('public', 'signs', `${fileBaseName}_sign.jpg`);
    fs.writeFileSync(path.join(__dirname, '..', signPath), signBytes);
  }

  return { imagePath, signPath };
}

function parseStudentData(text) {
  const fields = {
    applicant_name: /Applicant Name:\s*(.+)/i,
    father_name: /Father Name:\s*(.+)/i,
    mother_name: /Mother Name:\s*(.+)/i,
    gender: /Gender:\s*(.+)/i,
    dob: /Date of Birth:\s*(.+)/i,
    status: /Status:\s*(.+)/i,
    caste: /Caste:\s*(.+)/i,
    category1: /Category1:\s*(.+)/i,
    category3: /Category3:\s*(.+)/i,
    specialization: /Specialization:\s*(.+)/i,
    admission_status: /Admission Status:\s*(.+)/i,
    permanent_address: /Permanent Address:\s*(.+)/i,
    earlier_enrollment_no: /Earlier Enrollment No:\s*(.+)/i,
    corr_address: /Correspondence Address:\s*(.+)/i,
    mobile_no: /Mobile No:\s*(.+)/i,
    parent_mobile_no: /Parent Mobile No:\s*(.+)/i,
    entrance_exam_roll_no: /Entrance Exam Roll No:\s*(.+)/i,
    entrance_exam_name: /Entrance Exam Name:\s*(.+)/i,
    merit_secured: /Merit Secured:\s*(.+)/i,
    email: /Email:\s*(.+)/i,
    adhar_no: /Aadhaar No:\s*(.+)/i,
    college_shift: /College Shift:\s*(.+)/i,
    ssc_roll_no: /SSC Roll No:\s*(.+)/i,
    ssc_year: /SSC Year:\s*(.+)/i,
    ssc_stream: /SSC Stream:\s*(.+)/i,
    ssc_board: /SSC Board:\s*(.+)/i,
    ssc_obt_marks: /SSC Obtained Marks:\s*(.+)/i,
    ssc_max_marks: /SSC Max Marks:\s*(.+)/i,
    ssc_percentage: /SSC Percentage:\s*(.+)/i,
    ssc_cgpa: /SSC CGPA:\s*(.+)/i,
    ssc_result: /SSC Result:\s*(.+)/i,
    hsc_roll_no: /HSC Roll No:\s*(.+)/i,
    hsc_year: /HSC Year:\s*(.+)/i,
    hsc_stream: /HSC Stream:\s*(.+)/i,
    hsc_board: /HSC Board:\s*(.+)/i,
    hsc_obt_marks: /HSC Obtained Marks:\s*(.+)/i,
    hsc_max_marks: /HSC Max Marks:\s*(.+)/i,
    hsc_percentage: /HSC Percentage:\s*(.+)/i,
    hsc_cgpa: /HSC CGPA:\s*(.+)/i,
    hsc_result: /HSC Result:\s*(.+)/i,
  };

  const parsed = {};
  for (const [key, regex] of Object.entries(fields)) {
    const match = text.match(regex);
    parsed[key] = match ? match[1].trim() : null;
  }
  return parsed;
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
    const text = await extractDataFromPDF(pdfPath);
    const studentData = parseStudentData(text);

    const fileBaseName = path.parse(file).name;
    const { imagePath, signPath } = await extractImagesFromPDF(pdfPath, fileBaseName);

    await db.execute(
      `INSERT INTO \`2529master\` VALUES (${Array(42).fill('?').join(',')})`,
      [
        null, // id
        studentData.applicant_name,
        studentData.father_name,
        studentData.mother_name,
        studentData.gender,
        studentData.dob,
        studentData.status,
        studentData.caste,
        studentData.category1,
        studentData.category3,
        studentData.specialization,
        studentData.admission_status,
        studentData.permanent_address,
        studentData.earlier_enrollment_no,
        studentData.corr_address,
        studentData.mobile_no,
        studentData.parent_mobile_no,
        studentData.entrance_exam_roll_no,
        studentData.entrance_exam_name,
        studentData.merit_secured,
        studentData.email,
        studentData.adhar_no,
        studentData.college_shift,
        studentData.ssc_roll_no,
        studentData.ssc_year,
        studentData.ssc_stream,
        studentData.ssc_board,
        studentData.ssc_obt_marks,
        studentData.ssc_max_marks,
        studentData.ssc_percentage,
        studentData.ssc_cgpa,
        studentData.ssc_result,
        studentData.hsc_roll_no,
        studentData.hsc_year,
        studentData.hsc_stream,
        studentData.hsc_board,
        studentData.hsc_obt_marks,
        studentData.hsc_max_marks,
        studentData.hsc_percentage,
        studentData.hsc_cgpa,
        studentData.hsc_result,
        imagePath,
        signPath
      ]
    );
  }
  await db.end();
}

main().catch(console.error);
