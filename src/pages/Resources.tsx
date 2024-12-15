import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      type: "PDF",
      size: "2.5 MB"
    },
    {
      id: 2,
      title: "UI Design Principles",
      type: "PDF",
      size: "1.8 MB"
    },
    {
      id: 3,
      title: "JavaScript Best Practices",
      type: "PDF",
      size: "3.2 MB"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Resources</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-gray-500">
                        {resource.type} • {resource.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;