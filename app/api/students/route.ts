import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT * FROM `2529_master` ORDER BY id');
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}