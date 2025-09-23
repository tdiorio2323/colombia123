import { useState } from "react";

interface ProfileData {
  id: string;
  username: string;
  // Add other profile fields here
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(false); // Set to false as no data is being fetched

  // useEffect(() => {
  //   const fetchProfiles = async () => {
  //     const { data, error } = await supabase.from("profiles").select("*");

  //     if (error) {
  //       console.error("Error fetching profiles:", error);
  //     } else if (data) {
  //       setProfiles(data);
  //     }
  //     setLoading(false);
  //   };

  //   fetchProfiles();
  // }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-display font-bold text-gradient-purple">
        User Profiles
      </h1>
      <p className="mt-2 text-muted-foreground">
        Supabase is currently disabled, so no profiles are being fetched.
      </p>
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <ul className="mt-4 list-disc list-inside">
          {profiles.length === 0 ? (
            <li>No profiles to display (Supabase disabled).</li>
          ) : (
            profiles.map((profile) => (
              <li key={profile.id}>{profile.username}</li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
