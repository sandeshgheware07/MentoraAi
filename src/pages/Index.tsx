import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Target, BookOpen, MapPin } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            College Guidance Platform
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your comprehensive platform for discovering the perfect undergraduate degree and college. 
            Take assessments, get personalized recommendations, and track your admission journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personalized Assessments</h3>
              <p className="text-muted-foreground">Take 3 comprehensive assessments to discover your ideal field and specialization</p>
            </div>
            
            <div className="text-center p-6">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Recommendations</h3>
              <p className="text-muted-foreground">Get degree and college suggestions based on your academic profile and preferences</p>
            </div>
            
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Location-Based Matching</h3>
              <p className="text-muted-foreground">Find colleges in your preferred city with government institutions prioritized</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-3"
            >
              Get Started Today
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account? <button onClick={() => navigate('/auth')} className="text-primary hover:underline">Sign in here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;