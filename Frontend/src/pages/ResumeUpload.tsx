import { useState } from "react";
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
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Simulate skill extraction
      setExtractedSkills([
        "JavaScript", "React", "Python", "Data Analysis", 
        "Project Management", "Communication", "Problem Solving"
      ]);
      toast({
        title: "Resume uploaded successfully!",
        description: "Skills have been extracted from your resume.",
      });
    }
  };

  const getCareerRecommendations = () => {
    // Simulate AI recommendations
    setRecommendations([
      {
        title: "Frontend Developer",
        probability: 92,
        explanation: "Your strong JavaScript and React skills make you an excellent candidate for frontend development roles. Your project management experience adds valuable leadership capabilities."
      },
      {
        title: "Full Stack Developer", 
        probability: 87,
        explanation: "Combining your frontend skills with Python backend knowledge positions you well for full stack roles. Your communication skills are essential for cross-functional collaboration."
      },
      {
        title: "Technical Project Manager",
        probability: 78,
        explanation: "Your technical background combined with demonstrated project management and communication skills make you ideal for bridging technical teams and business stakeholders."
      }
    ]);
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
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Button variant="outline" className="mb-2">
                    Choose File
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : "PDF or DOCX files only"}
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Skills */}
          {extractedSkills.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Detected Skills</CardTitle>
                <CardDescription>
                  Skills extracted from your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button 
                  onClick={getCareerRecommendations}
                  className="mt-4 w-full"
                  disabled={!file}
                >
                  Get Career Recommendations
                </Button>
              </CardContent>
            </Card>
          )}

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