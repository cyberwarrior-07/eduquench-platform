import { CourseCard } from "@/components/CourseCard";

// Temporary mock data - will be replaced with API calls
export const mockCourses = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    thumbnail: "https://source.unsplash.com/random/800x600?web",
    instructor: "John Doe",
    duration: "8 hours",
    lessons: 12,
    progress: 45,
    isLocked: false,
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Master advanced React concepts and patterns",
    thumbnail: "https://source.unsplash.com/random/800x600?coding",
    instructor: "Jane Smith",
    duration: "10 hours",
    lessons: 15,
    isLocked: true,
  },
  {
    id: "3",
    title: "Full Stack Development",
    description: "Build complete web applications from scratch",
    thumbnail: "https://source.unsplash.com/random/800x600?programming",
    instructor: "Mike Johnson",
    duration: "15 hours",
    lessons: 20,
    progress: 10,
    isLocked: false,
  },
];

const Courses = () => {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">My Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;