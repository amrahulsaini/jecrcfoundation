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
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    // Fallback to regex if not JSON
    const fields = {
      applicant_name: /applicant_name_in_english:\s*(.+)/i,
      father_name: /father_name_in_english:\s*(.+)/i,
      mother_name: /mother_name_in_english:\s*(.+)/i,
      gender: /gender:\s*(.+)/i,
      dob: /date_of_birth:\s*(.+)/i,
      status: /status:\s*(.+)/i,
      caste: /caste:\s*(.+)/i,
      category1: /category_i_and_ii:\s*(.+)/i,
      category3: /category_iii:\s*(.+)/i,
      specialization: /specialization_branch:\s*(.+)/i,
      admission_status: /admission_status:\s*(.+)/i,
      permanent_address: /permanent_address:\s*(.+)/i,
      earlier_enrollment_no: /earlier_enrollment_no:\s*(.+)/i,
      corr_address: /corr_address:\s*(.+)/i,
      mobile_no: /student_mobile_no:\s*(.+)/i,
      parent_mobile_no: /parent_mobile_no:\s*(.+)/i,
      entrance_exam_roll_no: /entrance_exam_roll_no:\s*(.+)/i,
      entrance_exam_name: /entrance_exam_name:\s*(.+)/i,
      merit_secured: /merit_secured:\s*(.+)/i,
      email: /student_email:\s*(.+)/i,
      adhar_no: /aadhar_no:\s*(.+)/i,
      college_shift: /college_shift:\s*(.+)/i,
    };

    data = {};
    for (const [key, regex] of Object.entries(fields)) {
      const match = text.match(regex);
      data[key] = match ? match[1].trim() : null;
    }

    // Parse education
    const educationMatch = text.match(/education:\s*\[([\s\S]*?)\]/i);
    if (educationMatch) {
      try {
        const education = JSON.parse(`[${educationMatch[1]}]`);
        if (education.length > 0) {
          const ssc = education[0];
          data.ssc_roll_no = ssc.roll_no;
          data.ssc_year = ssc.year;
          data.ssc_stream = ssc.stream;
          data.ssc_board = ssc.board;
          data.ssc_obt_marks = ssc.obtained_marks;
          data.ssc_max_marks = ssc.max_marks;
          data.ssc_percentage = ssc.percentage;
          data.ssc_cgpa = ssc.cgpa;
          data.ssc_result = ssc.result;
        }
        if (education.length > 1) {
          const hsc = education[1];
          data.hsc_roll_no = hsc.roll_no;
          data.hsc_year = hsc.year;
          data.hsc_stream = hsc.stream;
          data.hsc_board = hsc.board;
          data.hsc_obt_marks = hsc.obtained_marks;
          data.hsc_max_marks = hsc.max_marks;
          data.hsc_percentage = hsc.percentage;
          data.hsc_cgpa = hsc.cgpa;
          data.hsc_result = hsc.result;
        }
      } catch (e) {
        // Ignore
      }
    }
  }

  // Map to database fields
  const parsed = {
    applicant_name: data.applicant_name_in_english || data.applicant_name,
    father_name: data.father_name_in_english || data.father_name,
    mother_name: data.mother_name_in_english || data.mother_name,
    gender: data.gender,
    dob: data.date_of_birth || data.dob,
    status: data.status,
    caste: data.caste,
    category1: data.category_i_and_ii || data.category1,
    category3: data.category_iii || data.category3,
    specialization: data.specialization_branch || data.specialization,
    admission_status: data.admission_status,
    permanent_address: data.permanent_address,
    earlier_enrollment_no: data.earlier_enrollment_no,
    corr_address: data.corr_address,
    mobile_no: data.student_mobile_no || data.mobile_no,
    parent_mobile_no: data.parent_mobile_no,
    entrance_exam_roll_no: data.entrance_exam_roll_no,
    entrance_exam_name: data.entrance_exam_name,
    merit_secured: data.merit_secured,
    email: data.student_email || data.email,
    adhar_no: data.aadhar_no || data.adhar_no,
    college_shift: data.college_shift,
    ssc_roll_no: data.ssc_roll_no,
    ssc_year: data.ssc_year,
    ssc_stream: data.ssc_stream,
    ssc_board: data.ssc_board,
    ssc_obt_marks: data.ssc_obt_marks,
    ssc_max_marks: data.ssc_max_marks,
    ssc_percentage: data.ssc_percentage,
    ssc_cgpa: data.ssc_cgpa,
    ssc_result: data.ssc_result,
    hsc_roll_no: data.hsc_roll_no,
    hsc_year: data.hsc_year,
    hsc_stream: data.hsc_stream,
    hsc_board: data.hsc_board,
    hsc_obt_marks: data.hsc_obt_marks,
    hsc_max_marks: data.hsc_max_marks,
    hsc_percentage: data.hsc_percentage,
    hsc_cgpa: data.hsc_cgpa,
    hsc_result: data.hsc_result,
  };

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
