'use client'
import { useEffect, useState } from 'react';

export function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch profile');
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data.</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <h2>{profile.greeting}</h2>
      {profile.user ? (
        <pre style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>
          {JSON.stringify(profile.user, null, 2)}
        </pre>
      ) : (
        <div>Not authenticated</div>
      )}
    </div>
  );
} 