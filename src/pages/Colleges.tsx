import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Star, DollarSign, GraduationCap, ExternalLink } from 'lucide-react';

const Colleges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchColleges();
    }
  }, [user]);

  useEffect(() => {
    filterColleges();
  }, [searchTerm, colleges]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
      
    setProfile(data);
  };

  const fetchColleges = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch colleges",
        variant: "destructive",
      });
    } else {
      setColleges(data || []);
    }
    
    setLoading(false);
  };

  const filterColleges = () => {
    let filtered = colleges;
    
    if (searchTerm) {
      filtered = colleges.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Prioritize colleges in user's preferred city
    if (profile?.preferred_city) {
      filtered.sort((a, b) => {
        const aInPreferred = a.city.toLowerCase().includes(profile.preferred_city.toLowerCase());
        const bInPreferred = b.city.toLowerCase().includes(profile.preferred_city.toLowerCase());
        
        if (aInPreferred && !bInPreferred) return -1;
        if (!aInPreferred && bInPreferred) return 1;
        
        // Secondary sort by rating
        return (b.rating || 0) - (a.rating || 0);
      });
    }
    
    setFilteredColleges(filtered);
  };

  const handleCollegeSelect = (college: any) => {
    setSelectedCollege(college);
    // In a real app, this would show detailed information about seat allocation,
    // admission process, etc.
    toast({
      title: "College Selected",
      description: `You've shown interest in ${college.name}. Admission tracking will be available soon.`,
    });
  };

  const getCollegeType = (name: string) => {
    if (name.toLowerCase().includes('government') || name.toLowerCase().includes('nit') || name.toLowerCase().includes('iit')) {
      return 'Government';
    }
    return 'Private';
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto">
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
            <GraduationCap className="h-8 w-8 text-primary" />
            College Recommendations
          </h1>
          <p className="text-muted-foreground mt-2">
            Based on your profile and assessments, here are the best colleges for you.
            {profile?.preferred_city && (
              <span className="block mt-1">
                Prioritizing colleges in {profile.preferred_city} and nearby areas.
              </span>
            )}
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search colleges by name, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{college.name}</CardTitle>
                  <Badge variant={getCollegeType(college.name) === 'Government' ? 'default' : 'secondary'}>
                    {getCollegeType(college.name)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {college.city}, {college.state}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {college.rating && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      {renderRating(college.rating)}
                    </div>
                  )}
                  
                  {college.fees_range && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Fees Range</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{college.fees_range}</span>
                      </div>
                    </div>
                  )}
                  
                  {college.courses && (
                    <div>
                      <span className="text-sm text-muted-foreground">Available Courses</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.isArray(college.courses) ? college.courses.slice(0, 3).map((course: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        )) : (
                          <Badge variant="outline" className="text-xs">
                            Multiple courses available
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleCollegeSelect(college)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {college.website && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => window.open(college.website, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No colleges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for more options.
            </p>
          </div>
        )}

        {/* Note about real-time data */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">About Our Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              College recommendations are based on your academic profile, assessment results, and location preferences. 
              Government colleges are prioritized in your preferred city. For real-time seat allocation data, 
              fee structures, and admission timelines, please contact individual colleges directly or check their official websites.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Colleges;