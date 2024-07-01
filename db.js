const db = require("./conn");
var schemaName = "sesi6";

// Query untuk menambahkan data pertama (semua data)
add = async (data) => {
  try {
    // console.log('data: ', data);
    const insertData = `INSERT INTO ${schemaName}.students (
            student_name, math, indonesian, natural_sciences, score, grade
        ) values (
            $1, $2, $3, $4, $5, $6
        ) returning *`;

    const values = [
      data.nama,
      data.matematika,
      data.bahasa_indonesia,
      data.ipa,
      data.score,
      data.grade,
    ];

    const { rows } = await db.query(insertData, values);
    // console.log(rows);
    return rows[0];
  } catch (error) {
    throw error;
  }
};
// query menambahkan data baru dengan variable baru
const addStudent = async (newData) => {
  try {
    const insertNewData = `INSERT INTO sesi6.students (
      student_name, math, indonesian, natural_sciences, score, grade
    ) values (
      $1, $2, $3, $4, $5, $6
    ) returning *`;

    const values = [
      newData.nama,
      newData.matematika,
      newData.bahasa_indonesia,
      newData.ipa,
      newData.score,
      newData.grade,
    ];

    const { rows } = await db.query(insertNewData, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};
// menampilkan seluruh data siswa
const getShowAllData = async () => {
  try {
    const selectQuery = `SELECT * FROM ${schemaName}.students`;
    const { rows } = await db.query(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};
// menampikkan siswa sesuai dengan urutan abjad
const getStudentsOrderByName = async () => {
  try {
    const selectQuery = `SELECT * FROM sesi6.students ORDER BY student_name;`;
    const { rows } = await db.query(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};
// query hanya menampilkan siswa dengan garde A
const getStudentsWithGradeA = async () => {
  try {
    const selectQuery = `SELECT * FROM sesi6.students WHERE grade = 'A'`;
    const { rows } = await db.query(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};
// query menampilkan sesuai dengan grade
const getStudentsOrderByGrade = async () => {
  try {
    const selectQuery = `SELECT * FROM sesi6.students ORDER BY grade;`;
    const { rows } = await db.query(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};

// hapus data siswa berdasarkan id (10)
const deleteDataStudents = async (data) => {
  try {
    const selectQuery = `DELETE FROM sesi6.students WHERE student_id = 10;`;
    const { rows } = await db.query(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};
// udpate nama siswa
const updateStudentName = async (studentId, newName) => {
  try {
    const updateQuery = `UPDATE sesi6.students SET student_name = $1 WHERE student_id = $2 returning *`;
    const { rows } = await db.query(updateQuery, [newName, studentId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};
const updateStudentScoreMath = async (studentId, newName) => {
  try {
    const updateQuery = `UPDATE sesi6.students SET student_name = $1 WHERE student_id = $2 returning *`;
    const { rows } = await db.query(updateQuery, [newName, studentId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// 1. Tugas : Tarik semua data students & order berdasarkan created_date
// Query untuk menampilkan semua data berdasarkan created date
const getAllDataByCratedDate = async () => {
  try {
    const selectQuery = `SELECT * FROM sesi6.students ORDER BY created_date `;
    const { rows } = await db.query(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};
// 2. Tarik data students berdasarkan student_id (/:param)
// Query untuk menampilkan data sesuai dengan request id pada postman
const getStudentById = async (studentId) => {
  try {
    const selectQuery = `SELECT * FROM ${schemaName}.students WHERE student_id = $1;`;
    const { rows } = await db.query(selectQuery, [studentId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  add,
  addStudent,
  getShowAllData,
  getStudentsWithGradeA,
  getStudentsOrderByName,
  getStudentsOrderByGrade,
  deleteDataStudents,
  updateStudentName,
  getAllDataByCratedDate,
  getStudentById,
};
