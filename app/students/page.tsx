'use client';

import { useEffect, useState } from 'react';

interface Student {
  id: number;
  unique_id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  gender: string;
  dob: string;
  status: string;
  caste: string;
  branch: string;
  permanent_address: string;
  correspondence_address: string;
  mobile: string;
  parent_mobile: string;
  email: string;
  aadhar: string;
  exam_10: string;
  roll_10: string;
  year_10: string;
  stream_10: string;
  board_10: string;
  obt_10: string;
  max_10: string;
  percent_10: string;
  cgpa_10: string;
  result_10: string;
  exam_12: string;
  roll_12: string;
  year_12: string;
  stream_12: string;
  board_12: string;
  obt_12: string;
  max_12: string;
  percent_12: string;
  cgpa_12: string;
  result_12: string;
  photo_path: string;
  sign_path: string;
  created_at: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setStudents(data);
          setFilteredStudents(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load students');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.unique_id.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile.includes(searchTerm)
      );
      setFilteredStudents(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, students]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          JECRC Foundation Students - Batch 2529
        </h1>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by name, ID, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2 text-center">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students (Page {currentPage} of {totalPages})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Header with photo and basic info */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    {student.photo_path ? (
                      <img
                        src={`/${student.photo_path}`}
                        alt={`${student.full_name} photo`}
                        className="w-20 h-24 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-avatar.svg'; // fallback
                        }}
                      />
                    ) : (
                      <div className="w-20 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{student.full_name}</h2>
                    <p className="text-sm text-gray-600">ID: {student.unique_id}</p>
                    <p className="text-sm text-blue-600 font-medium">{student.branch}</p>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Father:</span>
                      <p className="text-gray-900">{student.father_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Mother:</span>
                      <p className="text-gray-900">{student.mother_name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Gender:</span>
                      <p className="text-gray-900">{student.gender}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">DOB:</span>
                      <p className="text-gray-900">{student.dob}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900">{student.status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Caste:</span>
                      <p className="text-gray-900">{student.caste}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Mobile:</span>
                    <p className="text-gray-900 text-sm">{student.mobile}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Parent Mobile:</span>
                    <p className="text-gray-900 text-sm">{student.parent_mobile}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Email:</span>
                    <p className="text-gray-900 text-sm break-all">{student.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Aadhar:</span>
                    <p className="text-gray-900 text-sm">{student.aadhar}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Permanent Address:</span>
                    <p className="text-gray-900 text-sm leading-relaxed">{student.permanent_address}</p>
                  </div>
                  {student.correspondence_address !== student.permanent_address && (
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Correspondence Address:</span>
                      <p className="text-gray-900 text-sm leading-relaxed">{student.correspondence_address}</p>
                    </div>
                  )}
                </div>

                {/* Academic Details */}
                <div className="space-y-3 mb-4">
                  <div className="border-t pt-3">
                    <h3 className="font-medium text-gray-700 text-sm mb-2">Class 10th Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Exam: {student.exam_10}</div>
                      <div>Roll: {student.roll_10}</div>
                      <div>Year: {student.year_10}</div>
                      <div>Stream: {student.stream_10}</div>
                      <div>Board: {student.board_10}</div>
                      <div>Marks: {student.obt_10}/{student.max_10}</div>
                      <div>Percentage: {student.percent_10}%</div>
                      <div>CGPA: {student.cgpa_10}</div>
                      <div className="col-span-2">Result: {student.result_10}</div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="font-medium text-gray-700 text-sm mb-2">Class 12th Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Exam: {student.exam_12}</div>
                      <div>Roll: {student.roll_12}</div>
                      <div>Year: {student.year_12}</div>
                      <div>Stream: {student.stream_12}</div>
                      <div>Board: {student.board_12}</div>
                      <div>Marks: {student.obt_12}/{student.max_12}</div>
                      <div>Percentage: {student.percent_12}%</div>
                      <div>CGPA: {student.cgpa_12}</div>
                      <div className="col-span-2">Result: {student.result_12}</div>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="border-t pt-3">
                  <span className="font-medium text-gray-700 text-sm">Signature:</span>
                  <div className="mt-2">
                    {student.sign_path ? (
                      <img
                        src={`/${student.sign_path}`}
                        alt={`${student.full_name} signature`}
                        className="h-12 object-contain border border-gray-200 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Signature</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Created At */}
                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(student.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}