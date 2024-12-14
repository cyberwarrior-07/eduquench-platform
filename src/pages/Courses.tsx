import { CourseCard } from "@/components/CourseCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Course } from "@/types/course";

// Temporary mock data - will be replaced with API calls
export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    thumbnail: "https://source.unsplash.com/random/800x600?web",
    instructor: "John Doe",
    duration: "8 weeks",
    lessons: 24,
    progress: 0,
    isLocked: false,
    requirements: ["Basic computer knowledge", "No prior coding experience needed"],
    objectives: [
      "Understand HTML structure",
      "Style with CSS",
      "JavaScript basics",
      "Build simple websites"
    ],
    level: "Beginner",
    category: "Web Development",
    enrollmentStatus: "Open"
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Master advanced React concepts and patterns",
    thumbnail: "https://source.unsplash.com/random/800x600?coding",
    instructor: "Jane Smith",
    duration: "6 weeks",
    lessons: 18,
    isLocked: true,
    requirements: ["JavaScript proficiency", "Basic React knowledge"],
    objectives: [
      "Advanced hooks",
      "Component patterns",
      "State management",
      "Performance optimization"
    ],
    level: "Advanced",
    category: "Frontend Development",
    enrollmentStatus: "Closed"
  },
  {
    id: "3",
    title: "Data Structures and Algorithms",
    description: "Essential computer science concepts for developers",
    thumbnail: "https://source.unsplash.com/random/800x600?algorithm",
    instructor: "Mike Johnson",
    duration: "10 weeks",
    lessons: 30,
    progress: 60,
    isLocked: false,
    requirements: ["Basic programming knowledge", "Problem-solving skills"],
    objectives: [
      "Understand basic data structures",
      "Algorithm analysis",
      "Sorting and searching",
      "Graph algorithms"
    ],
    level: "Intermediate",
    category: "Computer Science",
    enrollmentStatus: "In Progress"
  }
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredCourses = mockCourses.filter(course =>
    selectedCategory === "all" ? true : course.category === selectedCategory
  );

  return (
    <div className="container mx-auto py-8">
      <Select onValueChange={setSelectedCategory} defaultValue="all">
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Frontend Development">Frontend Development</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
