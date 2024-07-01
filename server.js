const Fastify = require("fastify");
const {
  add,
  getStudentsWithGradeA,
  getShowAllData,
  getStudentsOrderByName,
  getStudentsOrderByGrade,
  addStudent,
  deleteDataStudents,
  updateStudentName,
  getAllDataByCratedDate,
  getStudentById,
  getStudentByName,
  updateStudentScores,
} = require("./db");

const fastify = Fastify({
  logger: true,
  requestTimeout: 30000, // dengan satuan ms (milisecond) = artinya 30second
});

getRateSiswa = (nilaiMatematika, nilaiBahasaIndonesia, nilaiIPA) => {
  return (nilaiMatematika + nilaiBahasaIndonesia + nilaiIPA) / 3;
};

checkRateSiswa = (rataRataNilai) => {
  if (rataRataNilai >= 80 && rataRataNilai <= 100) {
    return "A";
  } else if (rataRataNilai >= 60 && rataRataNilai < 80) {
    return "B";
  } else {
    return "E";
  }
};
// Menambahkan Data siswa by postman
fastify.route({
  method: "POST",
  url: "/students",
  handler: async (request, reply) => {
    const dataSiswa = request.body.data;
    try {
      // console.log(dataSiswa);
      for (let index = 0; index < dataSiswa.length; index++) {
        const score = getRateSiswa(
          dataSiswa[index].matematika,
          dataSiswa[index].bahasa_indonesia,
          dataSiswa[index].ipa
        );
        const grade = checkRateSiswa(score);
        dataSiswa[index].score = score;
        dataSiswa[index].grade = grade;
        // console.log(dataSiswa[index]);
        const addStudent = await add(dataSiswa[index]);
        console.log("create student: ", addStudent);
      }
      reply.send({
        status: "ok",
        data: [],
      });
    } catch (error) {
      console.log("error create: ", error);
      reply.code(500).send({
        status: "error",
        message: "",
      });
    }
  },
});

// 1. Tugas : Tarik semua data students & order berdasarkan created_date
// Menampilkan data siswa mulali dari crated date
fastify.get("/students", async (request, reply) => {
  try {
    const students = await getAllDataByCratedDate();
    reply.send(students);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});
// 2. Tarik data students berdasarkan student_id (/:param)
// Menampilkan data sesuai dengan request id pada postman
fastify.get("/students/:id", async (request, reply) => {
  try {
    const studentId = request.params.id;
    const student = await getStudentById(studentId);
    if (student) {
      reply.send(student);
    } else {
      reply.status(404).send({ error: " Id Student not found" });
    }
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 3. tarik data students berdasarkan student_name (?queryParam)
// Menampilkan data sesuai dengan request name pada postman di key param
fastify.get("/students/name", async (request, reply) => {
  try {
    const studentName = request.query.name;
    const students = await getStudentByName(studentName);
    if (students.length > 0) {
      reply.send(students);
    } else {
      reply.status(404).send({ error: "Name Student not found" });
    }
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 4. update nilai matematika, bahasa indonesia & ipa students berdasarkan student_id
// mengupdate nilai mamtematika bahasa indonesia & ipa, beserta score and grade saat mengirim data pada request body
fastify.put("/students/:id", async (request, reply) => {
  try {
    const studentId = request.params.id;
    const { matematika, bahasa_indonesia, ipa } = request.body;
    const score = getRateSiswa(matematika, bahasa_indonesia, ipa);
    const grade = checkRateSiswa(score);
    const updatedStudent = await updateStudentScores(
      studentId,
      matematika,
      bahasa_indonesia,
      ipa,
      score,
      grade
    );
    reply.send(updatedStudent);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 5. Hapus data siswa berdasarkan id
// menghapus data jika input id di postman
fastify.delete("/students/:id", async (request, reply) => {
  try {
    const studentId = request.params.id;
    const deletedStudent = await deleteDataStudents(studentId);
    reply.send({
      status: "ok",
      data: [studentId],
    });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start();
