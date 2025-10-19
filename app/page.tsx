import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Calendar, Camera, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">TravelShare</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
                Share Your Journey with Those Who Matter
              </h2>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Keep friends and family connected to your travels with real-time updates, beautiful timelines, and
                shared memories that last forever.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <Button size="lg" asChild>
                  <Link href="/register">Start Your Journey</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=800&width=1000"
                alt="Traveler exploring scenic destinations"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need to Share Your Adventures
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Real-Time Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your current location and let loved ones follow your journey in real-time
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Timeline Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Beautiful timeline of your past, present, and future travel activities
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Social Features</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comments, reactions, and different permission levels for family and friends
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Camera className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Rich Media</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share photos, videos, and detailed information about flights, hotels, and activities
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl font-bold text-foreground mb-6">Ready to Start Sharing?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of travelers who are already keeping their loved ones connected to their adventures.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Create Your First Trip</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-accent" />
                <span className="text-lg font-semibold text-foreground">TravelShare</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting travelers with their loved ones, one journey at a time.
              </p>
              <div className="flex items-center gap-3">
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Timeline
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Location Sharing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Trip Planning
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Press Kit
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Acceptable Use
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} TravelShare. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Sitemap
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Accessibility
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
