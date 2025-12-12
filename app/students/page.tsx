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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading students...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-lg">
          <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JECRC Foundation
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Students Directory</h1>
          <p className="text-lg text-gray-600">Batch 2529</p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          <input
            type="text"
            placeholder="Search by name, ID, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-lg"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-md">
              <span className="text-sm font-semibold text-gray-700">
                Showing <span className="text-indigo-600 font-bold">{startIndex + 1}-{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
                <span className="text-indigo-600 font-bold">{filteredStudents.length}</span> students
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentStudents.map((student, index) => (
            <div 
              key={student.id} 
              className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
                <div className="bg-white rounded-t-2xl p-6">
                {/* Header with photo and basic info */}
                <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    {student.photo_path ? (
                      <img
                        src={`/${student.photo_path}`}
                        alt={`${student.full_name} photo`}
                          className="relative w-24 h-28 object-cover rounded-xl border-4 border-white shadow-lg"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-avatar.svg';
                        }}
                      />
                    ) : (
                        <div className="relative w-24 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                          <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                      </div>
                    )}
                  </div>
                    <div className="flex-1 pt-2">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{student.full_name}</h2>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">ID: {student.unique_id}</span>
                      </div>
                      <div className="inline-block">
                        <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{student.branch}</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

              <div className="p-6 space-y-6">
                {/* Personal Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
                      <span className="text-xs font-semibold text-indigo-600 uppercase">Father</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{student.father_name}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                      <span className="text-xs font-semibold text-purple-600 uppercase">Mother</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{student.mother_name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600 uppercase">Gender</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{student.gender}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600 uppercase">DOB</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{student.dob}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600 uppercase">Status</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{student.status}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600 uppercase">Caste</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{student.caste}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Contact Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-blue-600 uppercase block mb-1">Mobile</span>
                        <p className="text-sm font-medium text-gray-900">{student.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-green-600 uppercase block mb-1">Parent Mobile</span>
                        <p className="text-sm font-medium text-gray-900">{student.parent_mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-purple-600 uppercase block mb-1">Email</span>
                        <p className="text-sm font-medium text-gray-900 break-all">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-orange-600 uppercase block mb-1">Aadhar</span>
                        <p className="text-sm font-medium text-gray-900">{student.aadhar}</p>
                  </div>
                  </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Address</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">Permanent Address</span>
                    <p className="text-sm text-gray-900 leading-relaxed">{student.permanent_address}</p>
                  </div>
                  {student.correspondence_address !== student.permanent_address && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <span className="text-xs font-semibold text-indigo-600 uppercase block mb-2">Correspondence Address</span>
                      <p className="text-sm text-gray-900 leading-relaxed">{student.correspondence_address}</p>
                    </div>
                  )}
                </div>

                {/* Academic Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Academic Records</h3>
                  </div>
                  
                  {/* Class 10th */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">10</span>
                      </div>
                      <h4 className="font-bold text-blue-700 text-sm uppercase">Class 10th Details</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Exam:</span>
                        <p className="text-gray-900 font-medium">{student.exam_10}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Roll:</span>
                        <p className="text-gray-900 font-medium">{student.roll_10}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Year:</span>
                        <p className="text-gray-900 font-medium">{student.year_10}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Stream:</span>
                        <p className="text-gray-900 font-medium">{student.stream_10}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Board:</span>
                        <p className="text-gray-900 font-medium">{student.board_10}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Marks:</span>
                        <p className="text-gray-900 font-medium">{student.obt_10}/{student.max_10}</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg text-white">
                        <span className="font-semibold">Percentage:</span>
                        <p className="font-bold text-sm">{student.percent_10}%</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">CGPA:</span>
                        <p className="text-gray-900 font-medium">{student.cgpa_10}</p>
                      </div>
                      <div className="col-span-2 bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Result:</span>
                        <p className="text-gray-900 font-medium">{student.result_10}</p>
                      </div>
                    </div>
                  </div>

                  {/* Class 12th */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">12</span>
                      </div>
                      <h4 className="font-bold text-purple-700 text-sm uppercase">Class 12th Details</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Exam:</span>
                        <p className="text-gray-900 font-medium">{student.exam_12}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Roll:</span>
                        <p className="text-gray-900 font-medium">{student.roll_12}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Year:</span>
                        <p className="text-gray-900 font-medium">{student.year_12}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Stream:</span>
                        <p className="text-gray-900 font-medium">{student.stream_12}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Board:</span>
                        <p className="text-gray-900 font-medium">{student.board_12}</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Marks:</span>
                        <p className="text-gray-900 font-medium">{student.obt_12}/{student.max_12}</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg text-white">
                        <span className="font-semibold">Percentage:</span>
                        <p className="font-bold text-sm">{student.percent_12}%</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">CGPA:</span>
                        <p className="text-gray-900 font-medium">{student.cgpa_12}</p>
                      </div>
                      <div className="col-span-2 bg-white/60 p-2 rounded-lg">
                        <span className="text-gray-600 font-semibold">Result:</span>
                        <p className="text-gray-900 font-medium">{student.result_12}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="font-semibold text-gray-700 text-sm uppercase">Signature</span>
                  </div>
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                    {student.sign_path ? (
                      <img
                        src={`/${student.sign_path}`}
                        alt={`${student.full_name} signature`}
                        className="h-14 object-contain mx-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-14 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-medium">No Signature Available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Created: {new Date(student.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    currentPage === page
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:scale-105'
                  }`}
                >
                  {page}
                </button>
              ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}