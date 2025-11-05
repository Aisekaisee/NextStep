import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsed, setParsed] = useState<{ name?: string | null; email?: string | null; phone?: string | null; education?: string[]; experience?: string[] } | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsParsing(true);
      setParsed(null);
      setExtractedSkills([]);
      setRecommendations([]);
      try {
        const form = new FormData();
        form.append("file", uploadedFile);
        const analyzeUrl =
          import.meta.env.VITE_ANALYZE_URL ||
          import.meta.env.VITE_RECOMMENDER_URL ||
          "http://127.0.0.1:8000/analyze";
        const res = await fetch(analyzeUrl, {
          method: "POST",
          body: form,
        });
        if (!res.ok) throw new Error(`Recommend failed: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data.recommendations)) setRecommendations(data.recommendations);
        if (Array.isArray(data.skills)) setExtractedSkills(data.skills);
        toast({ title: "Recommendations ready", description: "Top roles generated from your resume." });
      } catch (err: any) {
        toast({ title: "Parsing error", description: err?.message || "Failed to fetch", variant: "destructive" });
      } finally {
        setIsParsing(false);
      }
    }
  };

  const getCareerRecommendations = async () => {
    if (!file) return;
    setIsParsing(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(import.meta.env.VITE_RECOMMENDER_URL || "http://127.0.0.1:8000/recommend", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Recommend failed: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data.recommendations)) {
        const top3 = [...data.recommendations]
          .sort((a: any, b: any) => (b?.probability || 0) - (a?.probability || 0))
          .slice(0, 3);
        setRecommendations(top3);
      }
      toast({ title: "Recommendations ready", description: "Top roles generated from your resume." });
    } catch (err: any) {
      toast({ title: "Recommendation error", description: err?.message || "Failed to get recommendations", variant: "destructive" });
    } finally {
      setIsParsing(false);
    }
  };

  const handleFeedback = (positive: boolean) => {
    toast({
      title: positive ? "Thank you for your feedback!" : "Feedback received",
      description: positive ? "We're glad our recommendations were helpful." : "We'll use this to improve our suggestions.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            Upload Your Resume
          </h1>

          {/* File Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Upload
              </CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOCX format for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  ref={fileInputRef}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="mb-2"
                  disabled={isParsing}
                >
                  {isParsing ? "Parsing..." : "Choose File"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "PDF or DOCX files only"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Removed parsed basics and skills display; we show only top career options */}

          {/* Career Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Your Top Career Recommendations
              </h2>
              
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {rec.probability}%
                        </div>
                        <div className="text-sm text-muted-foreground">Match</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={rec.probability} className="mb-4" />
                    <p className="text-muted-foreground mb-4">{rec.explanation}</p>
                    {Array.isArray(rec.supportingSkills) && rec.supportingSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">Supporting Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {rec.supportingSkills.map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* SHAP Chart Placeholder */}
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">Feature Contributions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Technical Skills</span>
                          <span className="text-primary">+0.35</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Communication</span>
                          <span className="text-primary">+0.28</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Project Management</span>
                          <span className="text-primary">+0.22</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFeedback(true)}
                        className="flex items-center gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Helpful
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFeedback(false)}
                        className="flex items-center gap-2"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Not Helpful
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground mt-16 py-8 border-t">
          NextStep © 2025 — Empowering Careers with AI
        </footer>
      </div>
    </div>
  );
};

export default ResumeUpload;