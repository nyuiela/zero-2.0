const team = [
  {
    name: 'Patrick Kish',
    role: 'Lead Developer',
    bio: 'Full-stack engineer and blockchain enthusiast. Patrick leads the technical vision and architecture for ZERO.'
  },
  {
    name: 'Noble Nyuiela',
    role: 'Smart Contract & Backend',
    bio: 'Specialist in Solidity, backend, and decentralized systems. Noble ensures the security and reliability of our smart contracts.'
  },
  {
    name: 'Lydia Buggs',
    role: 'Business & Product',
    bio: 'Business strategist and product manager. Lydia bridges the gap between user needs and technical solutions.'
  },
  {
    name: 'Joseph Femi',
    role: 'Frontend & UX',
    bio: 'Frontend developer and UX designer. Joseph crafts beautiful, intuitive interfaces for our users.'
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none p-10 rounded-xl shadow-xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Meet the Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map(member => (
            <div key={member.name} className="bg-white border-none rounded-lg p-6 shadow text-center">
              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p className="text-[#00296b] font-medium mb-2">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 