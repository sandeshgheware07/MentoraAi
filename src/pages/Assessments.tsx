import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Target, CheckCircle } from 'lucide-react';

const assessmentQuestions = {
  1: [
    {
      question: "Which of these subjects interests you the most?",
      options: ["Mathematics & Physics", "Biology & Chemistry", "Social Sciences", "Arts & Literature", "Computer Science"]
    },
    {
      question: "What type of work environment appeals to you?",
      options: ["Laboratory/Research", "Office/Corporate", "Outdoor/Field work", "Creative studio", "Technology companies"]
    },
    {
      question: "Which career outcome excites you most?",
      options: ["Solving complex problems", "Helping people", "Creating something new", "Leading teams", "Building technology"]
    },
    {
      question: "How do you prefer to work?",
      options: ["Independently", "In small teams", "In large groups", "With mentorship", "Remotely"]
    },
    {
      question: "Which of these activities do you enjoy?",
      options: ["Analyzing data", "Caring for others", "Designing/Creating", "Public speaking", "Programming"]
    },
    {
      question: "What motivates you most?",
      options: ["Financial success", "Making a difference", "Recognition", "Personal growth", "Innovation"]
    },
    {
      question: "Which field seems most promising to you?",
      options: ["Engineering", "Medicine", "Business", "Arts", "Technology"]
    },
    {
      question: "How do you handle pressure?",
      options: ["Thrive under pressure", "Work steadily", "Need calm environment", "Prefer deadlines", "Flexible approach"]
    },
    {
      question: "What's your learning style?",
      options: ["Visual learner", "Hands-on practice", "Reading/Writing", "Discussion-based", "Online learning"]
    },
    {
      question: "Which skill do you want to develop?",
      options: ["Technical skills", "Communication", "Leadership", "Creativity", "Analytical thinking"]
    },
    {
      question: "What type of impact do you want to make?",
      options: ["Scientific breakthrough", "Social change", "Economic growth", "Cultural influence", "Technological advancement"]
    },
    {
      question: "Which work schedule suits you?",
      options: ["Regular 9-5", "Flexible hours", "Project-based", "Shift work", "Freelance"]
    },
    {
      question: "What's your ideal work-life balance?",
      options: ["Work-focused", "Balanced", "Life-focused", "Seasonal variation", "No preference"]
    },
    {
      question: "Which of these excites you most?",
      options: ["Research & Development", "Patient care", "Business strategy", "Creative expression", "Software development"]
    },
    {
      question: "How important is job security to you?",
      options: ["Very important", "Somewhat important", "Not important", "Depends on role", "Prefer risk-taking"]
    }
  ],
  2: [
    {
      question: "Based on your field interest, which specialization appeals most?",
      options: ["Core engineering", "Applied sciences", "Management studies", "Research oriented", "Interdisciplinary"]
    },
    {
      question: "What type of problems do you want to solve?",
      options: ["Technical challenges", "Human problems", "Business issues", "Environmental concerns", "Social problems"]
    },
    {
      question: "Which industry interests you most?",
      options: ["Technology", "Healthcare", "Finance", "Education", "Manufacturing"]
    },
    {
      question: "What's your preferred study intensity?",
      options: ["Highly theoretical", "Practical focused", "Balanced theory-practice", "Research intensive", "Application oriented"]
    },
    {
      question: "Which skills do you want to master?",
      options: ["Technical expertise", "Management skills", "Research abilities", "Creative skills", "Communication"]
    },
    {
      question: "What's your career timeline preference?",
      options: ["Quick employment", "Graduate studies first", "Entrepreneurship", "Research career", "Government service"]
    },
    {
      question: "Which work setting interests you?",
      options: ["Corporate environment", "Academic institution", "Government sector", "Startup culture", "Non-profit organization"]
    },
    {
      question: "What's your risk tolerance?",
      options: ["High risk, high reward", "Moderate risk", "Low risk preferred", "Calculated risks", "Risk averse"]
    },
    {
      question: "Which achievement would make you proudest?",
      options: ["Technical innovation", "Leading a team", "Publishing research", "Starting a company", "Serving society"]
    },
    {
      question: "What's your ideal project duration?",
      options: ["Short-term projects", "Medium-term goals", "Long-term vision", "Ongoing research", "Varied timelines"]
    },
    {
      question: "Which collaboration style suits you?",
      options: ["Cross-functional teams", "Subject matter experts", "International cooperation", "Community engagement", "Solo expertise"]
    },
    {
      question: "What's your preferred complexity level?",
      options: ["Highly complex problems", "Moderate complexity", "Simple solutions", "Gradually increasing", "Variable complexity"]
    },
    {
      question: "Which outcome matters most to you?",
      options: ["Practical applications", "Theoretical understanding", "Commercial success", "Academic recognition", "Social impact"]
    },
    {
      question: "What's your technology comfort level?",
      options: ["Cutting-edge technology", "Proven technologies", "Traditional methods", "Hybrid approaches", "Technology-independent"]
    },
    {
      question: "Which growth path appeals to you?",
      options: ["Technical leadership", "People management", "Subject matter expert", "Entrepreneurial", "Academic career"]
    },
    {
      question: "What's your global perspective?",
      options: ["International opportunities", "National focus", "Regional impact", "Local community", "Universal applications"]
    },
    {
      question: "Which challenge excites you most?",
      options: ["Unsolved problems", "Optimization tasks", "Innovation projects", "Implementation challenges", "System design"]
    },
    {
      question: "What's your ideal team size?",
      options: ["Individual contributor", "Small team (2-5)", "Medium team (6-15)", "Large team (15+)", "No preference"]
    },
    {
      question: "Which success metric matters most?",
      options: ["Technical excellence", "Business impact", "Research citations", "User satisfaction", "Social change"]
    },
    {
      question: "What's your long-term vision?",
      options: ["Industry expert", "Research leader", "Business executive", "Social entrepreneur", "Academic professor"]
    }
  ],
  3: [
    {
      question: "Considering all factors, which degree program feels most aligned with your goals?",
      options: ["Engineering (B.Tech)", "Science (B.Sc)", "Commerce (B.Com)", "Arts (B.A)", "Management (BBA)"]
    },
    {
      question: "What's most important in your college choice?",
      options: ["Academic reputation", "Placement records", "Faculty quality", "Infrastructure", "Location"]
    },
    {
      question: "Which factor would you prioritize?",
      options: ["Low fees", "High placement package", "Research opportunities", "Industry connections", "Alumni network"]
    },
    {
      question: "What's your backup plan preference?",
      options: ["Multiple similar programs", "Diverse options", "Gap year acceptable", "Immediate employment", "Family business"]
    },
    {
      question: "How important is college ranking to you?",
      options: ["Extremely important", "Very important", "Moderately important", "Slightly important", "Not important"]
    },
    {
      question: "What's your financial preference?",
      options: ["Scholarship/Merit aid", "Educational loan", "Family funding", "Part-time work", "Government schemes"]
    },
    {
      question: "Which college type do you prefer?",
      options: ["Government college", "Private university", "Deemed university", "Autonomous college", "No preference"]
    },
    {
      question: "What's your accommodation preference?",
      options: ["College hostel", "Private accommodation", "Day scholar", "Home nearby", "Flexible"]
    },
    {
      question: "Which extracurricular activities interest you?",
      options: ["Technical clubs", "Sports", "Cultural activities", "Social service", "Entrepreneurship"]
    },
    {
      question: "How important is diversity to you?",
      options: ["Very important", "Somewhat important", "Not important", "Regional preference", "International exposure"]
    },
    {
      question: "What's your decision-making approach?",
      options: ["Data-driven analysis", "Intuition-based", "Family consultation", "Peer opinions", "Expert guidance"]
    },
    {
      question: "Which support system do you need?",
      options: ["Academic support", "Career counseling", "Personal mentoring", "Financial aid", "Industry exposure"]
    },
    {
      question: "What's your timeline flexibility?",
      options: ["Must start this year", "Can wait one year", "Flexible timeline", "Prefer early admission", "No rush"]
    },
    {
      question: "Which outcome concerns you most?",
      options: ["Unemployment after graduation", "Low starting salary", "Limited growth opportunities", "Work-life balance", "Job satisfaction"]
    },
    {
      question: "What's your final decision factor?",
      options: ["Personal passion", "Market demand", "Family expectations", "Financial considerations", "Future opportunities"]
    }
  ]
};

const Assessments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentAssessment, setCurrentAssessment] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [completedAssessments, setCompletedAssessments] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      fetchCompletedAssessments();
    }
  }, [user]);

  const fetchCompletedAssessments = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('assessments')
      .select('assessment_type')
      .eq('user_id', user.id);
      
    if (data) {
      setCompletedAssessments(data.map(a => a.assessment_type));
      
      // Set current assessment to next incomplete one
      if (!data.find(a => a.assessment_type === 1)) {
        setCurrentAssessment(1);
      } else if (!data.find(a => a.assessment_type === 2)) {
        setCurrentAssessment(2);
      } else if (!data.find(a => a.assessment_type === 3)) {
        setCurrentAssessment(3);
      }
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    const questions = assessmentQuestions[currentAssessment as keyof typeof assessmentQuestions];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        assessment_type: currentAssessment,
        answers: answers
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Assessment ${currentAssessment} completed successfully!`,
      });
      
      // Reset for next assessment
      setAnswers({});
      setCurrentQuestion(0);
      
      if (currentAssessment < 3) {
        setCurrentAssessment(prev => prev + 1);
        await fetchCompletedAssessments();
      } else {
        // All assessments completed, redirect to colleges
        navigate('/colleges');
      }
    }
    
    setLoading(false);
  };

  const questions = assessmentQuestions[currentAssessment as keyof typeof assessmentQuestions];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isCurrentQuestionAnswered = answers[currentQuestion] !== undefined;
  const allQuestionsAnswered = Object.keys(answers).length === totalQuestions;

  const getAssessmentTitle = (type: number) => {
    switch (type) {
      case 1: return "Field Discovery Assessment";
      case 2: return "Specialization Assessment";
      case 3: return "Final Decision Assessment";
      default: return "Assessment";
    }
  };

  const getAssessmentDescription = (type: number) => {
    switch (type) {
      case 1: return "Discover your ideal field of study (15 questions)";
      case 2: return "Find your perfect specialization (20 questions)";
      case 3: return "Make your final decision with confidence (15 questions)";
      default: return "Assessment";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Career Assessments
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete these assessments to get personalized degree and college recommendations.
          </p>
        </div>

        {/* Assessment Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((num) => (
            <Card key={num} className={`${currentAssessment === num ? 'ring-2 ring-primary' : ''} ${completedAssessments.includes(num) ? 'bg-green-50 border-green-200' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {completedAssessments.includes(num) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Target className="h-5 w-5" />
                  )}
                  {getAssessmentTitle(num)}
                </CardTitle>
                <CardDescription className="text-xs">
                  {getAssessmentDescription(num)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{getAssessmentTitle(currentAssessment)}</CardTitle>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">
                {questions[currentQuestion].question}
              </h3>
              
              <RadioGroup
                value={answers[currentQuestion] || ''}
                onValueChange={handleAnswerChange}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentQuestion === totalQuestions - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered || loading}
                  >
                    {loading ? "Submitting..." : "Submit Assessment"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentQuestionAnswered}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessments;