'use client'

import { useAuthStore } from '@/lib/authStore'

export default function ProfileContent() {
  const { user } = useAuthStore()
  
  if (!user) return <div>Loading...</div>
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
          <p className="text-foreground font-mono bg-muted px-3 py-2 rounded mt-1">
            {user.address}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Username</label>
          <p className="text-foreground bg-muted px-3 py-2 rounded mt-1">
            {user.username || 'Not set'}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Authentication Status</label>
          <p className="text-green-400 bg-muted px-3 py-2 rounded mt-1">
            ✓ Authenticated
          </p>
        </div>
      </div>
    </div>
  )
} 