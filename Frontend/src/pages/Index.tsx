import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Target } from "lucide-react";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
            Take the Next Step in Your Career
          </h1>
          <h2 className="text-2xl md:text-3xl mb-16 text-primary font-medium">
            with AI Guidance
          </h2>

          {/* Two Main Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Upload Resume Card */}
            <Card 
              className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
              onClick={() => navigate('/resume')}
            >
              <CardHeader className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Upload Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Let AI analyze your resume and suggest career paths.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Find Your Career Card */}
            <Card 
              className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
              onClick={() => navigate('/manual')}
            >
              <CardHeader className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Find Your Career</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Manually enter your skills and interests to get recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground mt-16 py-8 border-t">
          NextStep © 2025 — Empowering Careers with AI
        </footer>
      </div>
    </div>
  );
};

export default Index;
