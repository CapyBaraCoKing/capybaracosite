import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Vaporwave Capybara Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 vaporwave-gradient opacity-20"></div>
          <img src="/3d-vaporwave-capybara-in-neon-cyberpunk-setting-wi.jpg" alt="3D Vaporwave Capybara" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text text-accent">capybara.exe</h1>
          <p className="text-2xl md:text-3xl mb-4 text-secondary neon-text">joined the lobby</p>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Welcome to the ultimate gaming community where legends are born and friendships are forged in the digital
            realm.
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-xl neon-glow transition-all duration-300 hover:scale-105"
          >
            Join Discord — gg ez
          </Button>
        </div>

        {/* Floating Glass Panel for Future Discord Widget */}
        <Card className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-secondary">Community Stats</h3>
            <div className="flex justify-around text-sm">
              <div>
                <div className="text-2xl font-bold text-accent">1,337</div>
                <div className="text-muted-foreground">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">420</div>
                <div className="text-muted-foreground">Online</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">69</div>
                <div className="text-muted-foreground">In Game</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-accent neon-text">Capybara Community</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-foreground hover:text-secondary hover:neon-glow">
                Home
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-secondary hover:neon-glow">
                Events
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-secondary hover:neon-glow">
                Leaderboard
              </Button>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground neon-glow bg-transparent"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-secondary neon-text">Level Up Your Gaming</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-panel p-6 hover:neon-glow transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4 text-accent">🎮</div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Epic Tournaments</h3>
                <p className="text-muted-foreground">
                  Compete in weekly tournaments across multiple games and climb the leaderboards.
                </p>
              </div>
            </Card>
            <Card className="glass-panel p-6 hover:neon-glow transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4 text-primary">👥</div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Find Your Squad</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded gamers and form lasting friendships in our community.
                </p>
              </div>
            </Card>
            <Card className="glass-panel p-6 hover:neon-glow transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4 text-secondary">🏆</div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Exclusive Rewards</h3>
                <p className="text-muted-foreground">
                  Earn exclusive badges, titles, and rewards for your gaming achievements.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 text-accent neon-text">Capybara Community</div>
          <p className="text-muted-foreground mb-4">Where gaming legends are born</p>
          <div className="flex justify-center space-x-6">
            <Button variant="ghost" className="text-secondary hover:neon-glow">
              Discord
            </Button>
            <Button variant="ghost" className="text-secondary hover:neon-glow">
              Twitter
            </Button>
            <Button variant="ghost" className="text-secondary hover:neon-glow">
              Twitch
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
