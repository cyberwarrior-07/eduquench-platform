import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
}

export default function CMSPageForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useSession();

  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    slug: "",
    content: "",
    status: "draft",
  });

  const mutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      if (!session?.user?.id) {
        throw new Error('You must be logged in to create pages');
      }

      const { error } = await supabase
        .from('cms_pages')
        .insert({
          ...data,
          content: { body: data.content },
          created_by: session.user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast.success('Page created successfully');
      navigate('/admin/pages');
    },
    onError: (error) => {
      console.error('Error creating page:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create page');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Please log in to create pages
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Page</h1>
        <p className="text-muted-foreground">
          Create a new CMS page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter page title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="page-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter page content"
                rows={10}
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit">Create Page</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/pages')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}