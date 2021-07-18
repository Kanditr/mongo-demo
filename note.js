const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "Gun",
    tags: ["angular", "frontend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // Comparison operation
  // .find({ price: { $gte: 10, $lte: 20 } }) - >10 and <20
  // .find({ price: { $in: [10, 15, 20] } }) -  either 10,15, or 20

  // Logical operation
  // .find().or([{ author: 'Gun }, { isPublished: true}])
  // .find().and([  ])

  // Regular expressions - Start with Gun
  // .find({ author: /^Gun/ })

  // Regular expressions - End with Rodwong
  // add "i" to make it non-case-sensitive
  // .find({ author: /Rodwong$/i })

  // Regular expressions - Contains Gun
  // .find({ author: /.*Gun.*/ })

  // /api/courses?pageNumber=2&pageSize=10
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: "Gun", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 }) // 1 = Ascending and -1 = Descending
    // .select({ name: 1 }) - to show only name result
    .count();
  console.log(courses);
}

getCourses();
