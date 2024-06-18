const Fastify = require("fastify");
const {
  add,
  // getStudentsWithGradeA,
  // getShowAllData,
  // getStudentsOrderByName,
  // getStudentsOrderByGrade,
  // addStudent,
  // deleteDataStudents,
  // updateStudentName,
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

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
