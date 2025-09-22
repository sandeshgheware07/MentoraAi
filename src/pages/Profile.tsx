import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_town: '',
    preferred_city: '',
    tenth_marks: '',
    twelfth_marks: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (data) {
      setFormData({
        full_name: data.full_name || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        current_town: data.current_town || '',
        preferred_city: data.preferred_city || '',
        tenth_marks: data.tenth_marks?.toString() || '',
        twelfth_marks: data.twelfth_marks?.toString() || ''
      });
    } else {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    const profileData = {
      user_id: user.id,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      current_town: formData.current_town,
      preferred_city: formData.preferred_city,
      tenth_marks: formData.tenth_marks ? parseFloat(formData.tenth_marks) : null,
      twelfth_marks: formData.twelfth_marks ? parseFloat(formData.twelfth_marks) : null
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto">
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
            <User className="h-8 w-8 text-primary" />
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Please provide your academic details and preferences to get personalized recommendations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Academic Profile</CardTitle>
            <CardDescription>
              This information will be used to provide personalized degree and college recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_town">Current Town/City *</Label>
                  <Input
                    id="current_town"
                    name="current_town"
                    value={formData.current_town}
                    onChange={handleChange}
                    placeholder="Enter your current location"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_city">Preferred City for Graduation *</Label>
                <Input
                  id="preferred_city"
                  name="preferred_city"
                  value={formData.preferred_city}
                  onChange={handleChange}
                  placeholder="Enter your preferred city for studies"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenth_marks">10th Standard Marks (%) *</Label>
                  <Input
                    id="tenth_marks"
                    name="tenth_marks"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.tenth_marks}
                    onChange={handleChange}
                    placeholder="Enter your 10th marks"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twelfth_marks">12th Standard Marks (%) *</Label>
                  <Input
                    id="twelfth_marks"
                    name="twelfth_marks"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.twelfth_marks}
                    onChange={handleChange}
                    placeholder="Enter your 12th marks"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;