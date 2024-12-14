import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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
    level: "Beginner",
    category: "Web Development",
    enrollmentStatus: "Open",
    requirements: ["Basic computer knowledge", "No prior coding experience needed"],
    objectives: [
      "Understand HTML structure",
      "Style with CSS",
      "JavaScript basics",
    ],
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
    level: "Advanced",
    category: "Frontend Development",
    enrollmentStatus: "Open",
    requirements: ["React basics", "JavaScript knowledge"],
    objectives: ["Advanced hooks", "Custom patterns", "Performance optimization"],
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
    level: "Intermediate",
    category: "Full Stack",
    enrollmentStatus: "In Progress",
    requirements: ["Basic web development", "JavaScript fundamentals"],
    objectives: ["Backend development", "Database integration", "Deployment"],
  },
] as const;

const categories = ["All", "Web Development", "Frontend Development", "Full Stack", "Backend"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Explore Courses</h1>
          <p className="text-muted-foreground">
            Discover our wide range of courses and start learning today
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="col-span-full flex flex-wrap gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedLevel}
              onValueChange={setSelectedLevel}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No courses found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;