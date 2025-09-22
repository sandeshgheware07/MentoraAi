import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, GraduationCap, MapPin, Target, Users, LogOut } from 'lucide-react';

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAssessments();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
      
    setProfile(data);
  };

  const fetchAssessments = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    setAssessments(data || []);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getNextStep = () => {
    if (!profile) return 'profile';
    if (assessments.length === 0) return 'assessment1';
    if (assessments.length === 1) return 'assessment2';
    if (assessments.length === 2) return 'assessment3';
    return 'colleges';
  };

  const nextStep = getNextStep();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10">
      <header className="bg-card border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">College Guidance Platform</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.email}!</h2>
          <p className="text-muted-foreground">Your journey to finding the perfect college starts here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Profile Setup
              </CardTitle>
              <CardDescription>Complete your academic profile</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {profile ? 'Profile completed ✓' : 'Set up your academic background and preferences'}
              </p>
              <Button 
                onClick={() => navigate('/profile')}
                variant={profile ? "outline" : "default"}
                className="w-full"
              >
                {profile ? 'Update Profile' : 'Complete Profile'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Career Assessments
              </CardTitle>
              <CardDescription>Discover your ideal field</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Completed: {assessments.length}/3 assessments
              </p>
              <Button 
                onClick={() => navigate('/assessments')}
                disabled={!profile}
                className="w-full"
              >
                {assessments.length === 0 ? 'Start Assessments' : 'Continue Assessments'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                College Recommendations
              </CardTitle>
              <CardDescription>Find your perfect college</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized college recommendations
              </p>
              <Button 
                onClick={() => navigate('/colleges')}
                disabled={assessments.length < 3}
                className="w-full"
              >
                View Colleges
              </Button>
            </CardContent>
          </Card>
        </div>

     

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Profile Setup</span>
                  <span className={profile ? "text-green-600" : "text-muted-foreground"}>
                    {profile ? "Complete" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Field Assessment</span>
                  <span className={assessments.length >= 1 ? "text-green-600" : "text-muted-foreground"}>
                    {assessments.length >= 1 ? "Complete" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Specialization Assessment</span>
                  <span className={assessments.length >= 2 ? "text-green-600" : "text-muted-foreground"}>
                    {assessments.length >= 2 ? "Complete" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Final Assessment</span>
                  <span className={assessments.length >= 3 ? "text-green-600" : "text-muted-foreground"}>
                    {assessments.length >= 3 ? "Complete" : "Pending"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Personalized career assessments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Government college prioritization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Real-time seat allocation data
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Admission process tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Location-based recommendations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;