import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
 
interface ProfileData {
  id: string;
  username: string;
  // Add other profile fields here
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
      } else if (data) {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-display font-bold text-gradient-purple">
        User Profiles
      </h1>
      <p className="mt-2 text-muted-foreground">
        This is a list of profiles fetched from Supabase.
      </p>
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <ul className="mt-4 list-disc list-inside">
          {profiles.map((profile) => (
            <li key={profile.id}>{profile.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}