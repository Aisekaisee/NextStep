import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const ManualInput = () => {
  const [interests, setInterests] = useState({
    tech: [3],
    design: [3],
    business: [3]
  });
  const [skillLevels, setSkillLevels] = useState({
    programming: [3],
    analytical: [3],
    communication: [3]
  });
  const [problemSolving, setProblemSolving] = useState([3]);
  const [creativity, setCreativity] = useState([3]);
  const [workStyle, setWorkStyle] = useState("");
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const availableTools = [
    "JavaScript", "Python", "React", "Angular", "Vue", "Node.js", "Django", 
    "Flask", "SQL", "MongoDB", "Git", "Docker", "AWS", "Azure", "Figma", 
    "Adobe Creative Suite", "Tableau", "Power BI", "Excel", "R", "MATLAB"
  ];

  const softSkillOptions = [
    "Analytical Thinker", "Communicator", "Problem Solver", "Logical Thinker",
    "Persuasive", "Creative Thinker", "Leader", "Empathetic", "Curious",
    "Detail-Oriented", "Organizer"
  ];

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => {
      if (prev.includes(tool)) {
        return prev.filter(t => t !== tool);
      } else if (prev.length < 3) {
        return [...prev, tool];
      } else {
        toast({
          title: "Maximum 3 tools allowed",
          description: "Please deselect a tool before adding a new one.",
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  const toggleSoftSkill = (skill: string) => {
    setSoftSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getCareerRecommendations = () => {
    if (selectedTools.length === 0) {
      toast({
        title: "Please select some tools",
        description: "Choose at least one tool to get recommendations.",
        variant: "destructive"
      });
      return;
    }

    // Simulate AI recommendations based on inputs
    setRecommendations([
      {
        title: "Product Manager",
        probability: 89,
        explanation: `Your combination of technical skills (${selectedTools.slice(0,2).join(', ')}) with strong communication (${skillLevels.communication[0]}/5) and business interests (${interests.business[0]}/5) makes you ideal for product management roles.`
      },
      {
        title: "UX/UI Designer", 
        probability: 82,
        explanation: `High creativity score (${creativity[0]}/5) combined with technical understanding and user-focused skills positions you well for design roles that bridge technology and user experience.`
      },
      {
        title: "Technical Consultant",
        probability: 76,
        explanation: `Your technical expertise combined with strong communication skills makes you perfect for consulting roles where you'll translate complex technical concepts for business stakeholders.`
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
            Find Your Career
          </h1>

          {/* 1. Interest Levels */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Interest Levels</CardTitle>
              <CardDescription>
                Rate your interest in different areas (1-5 scale)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Technology: {interests.tech[0]}/5</Label>
                <Slider
                  value={interests.tech}
                  onValueChange={(value) => setInterests(prev => ({...prev, tech: value}))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Design: {interests.design[0]}/5</Label>
                <Slider
                  value={interests.design}
                  onValueChange={(value) => setInterests(prev => ({...prev, design: value}))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Business: {interests.business[0]}/5</Label>
                <Slider
                  value={interests.business}
                  onValueChange={(value) => setInterests(prev => ({...prev, business: value}))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Skill Levels */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Skill Levels</CardTitle>
              <CardDescription>
                Rate your skill level in different areas (1-5 scale)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Programming: {skillLevels.programming[0]}/5</Label>
                <Slider
                  value={skillLevels.programming}
                  onValueChange={(value) => setSkillLevels(prev => ({...prev, programming: value}))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Analytical: {skillLevels.analytical[0]}/5</Label>
                <Slider
                  value={skillLevels.analytical}
                  onValueChange={(value) => setSkillLevels(prev => ({...prev, analytical: value}))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Communication: {skillLevels.communication[0]}/5</Label>
                <Slider
                  value={skillLevels.communication}
                  onValueChange={(value) => setSkillLevels(prev => ({...prev, communication: value}))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Problem Solving and Creativity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Problem Solving and Creativity</CardTitle>
              <CardDescription>
                Rate your abilities (1-5 scale)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Problem Solving: {problemSolving[0]}/5</Label>
                <Slider
                  value={problemSolving}
                  onValueChange={setProblemSolving}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Creativity: {creativity[0]}/5</Label>
                <Slider
                  value={creativity}
                  onValueChange={setCreativity}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Preferred Work Style */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Preferred Work Style</CardTitle>
              <CardDescription>
                How do you prefer to work?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={workStyle} onValueChange={setWorkStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred work style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* 5. Soft Skill Traits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Soft Skill Traits</CardTitle>
              <CardDescription>
                Select the traits that best describe you (Maximum 2)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {softSkillOptions.map((skill) => (
                  <Button
                    key={skill}
                    variant={softSkills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSoftSkill(skill)}
                    className="justify-start"
                    disabled={!softSkills.includes(skill) && softSkills.length >= 2}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
              {softSkills.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected Traits:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {softSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 6. Tools Knowledge */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tools Knowledge
              </CardTitle>
              <CardDescription>
                Select up to 3 tools you know (maximum 3 allowed)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableTools.map((tool) => (
                  <Button
                    key={tool}
                    variant={selectedTools.includes(tool) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTool(tool)}
                    className="justify-start"
                    disabled={!selectedTools.includes(tool) && selectedTools.length >= 3}
                  >
                    {tool}
                  </Button>
                ))}
              </div>
              {selectedTools.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected Tools ({selectedTools.length}/3):</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTools.map((tool) => (
                      <Badge key={tool} variant="secondary">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Get Recommendations Button */}
          <div className="text-center mb-8">
            <Button 
              onClick={getCareerRecommendations}
              size="lg"
              className="px-8"
            >
              Get Career Recommendations
            </Button>
          </div>

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
                          <span>Selected Skills</span>
                          <span className="text-primary">+0.32</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Communication Interest</span>
                          <span className="text-primary">+0.25</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Business Interest</span>
                          <span className="text-primary">+0.19</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Work Style Preference</span>
                          <span className="text-primary">+0.15</span>
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

export default ManualInput;