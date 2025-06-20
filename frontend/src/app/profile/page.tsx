import AuthGuard from '@/components/auth-guard'
import ProfileContent from './profile-content'

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Profile</h1>
            <ProfileContent />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
} 