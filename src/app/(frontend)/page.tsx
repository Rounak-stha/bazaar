import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Blocks, Palette, ShieldCheck, Sparkles, Globe, Search, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 supports-[backdrop-filter]:bg-background/70 backdrop-blur border-b">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a
            href="#"
            className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent"
          >
            ShopLaunch
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#templates" className="hover:text-foreground transition-colors">
              Templates
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign in
            </Button>
            <Button variant="gradient">Start free</Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-soft"
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-border text-muted-foreground mb-4">
                <Sparkles className="h-3.5 w-3.5" /> New: AI Shoop Manager & Analytics Coming Soon
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Ecommerce Website Builder
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Design, launch, and grow your online store in minutes. Drag-and-drop sections,
                beautiful templates, built-in SEO, and secure payments—no code needed.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button size="lg" variant="gradient">
                  Start free
                </Button>
                <Button size="lg" variant="outline" className="">
                  View templates
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> SSL checkout
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Fast CDN
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" /> SEO-ready
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl border bg-card shadow-elevated p-2 md:p-4 animate-float">
                Here goes image
                {/* <img src={heroImage} alt="ShopLaunch dashboard showing drag-and-drop builder and live preview" className="rounded-lg w-full h-auto" loading="eager" decoding="async" /> */}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-20 border-t">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-3">
                Everything you need to sell
              </h2>
              <p className="text-muted-foreground">
                Powerful features to design, optimize, and scale your store—without touching code.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="rounded-lg border bg-card p-6 shadow-sm">
                <Blocks className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Drag & drop builder</h3>
                <p className="text-sm text-muted-foreground">
                  Arrange sections and blocks with pixel-perfect control and instant preview.
                </p>
              </article>
              <article className="rounded-lg border bg-card p-6 shadow-sm">
                <Palette className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Designer-made themes</h3>
                <p className="text-sm text-muted-foreground">
                  Pick from premium templates with configurable colors, type, and layout.
                </p>
              </article>
              <article className="rounded-lg border bg-card p-6 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Secure checkout</h3>
                <p className="text-sm text-muted-foreground">
                  PCI-compliant payments and tax-ready invoices out of the box.
                </p>
              </article>
              <article className="rounded-lg border bg-card p-6 shadow-sm">
                <Globe className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Global-ready</h3>
                <p className="text-sm text-muted-foreground">
                  Localize currency, language, and shipping rules for any market.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="py-16 md:py-20 border-t">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Beautiful templates</h2>
                <p className="text-muted-foreground">
                  Start faster with hand‑crafted designs you can fully customize.
                </p>
              </div>
              <Button variant="link" className="hidden md:inline-flex">
                See all templates →
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <figure className="rounded-xl border bg-card p-2 shadow-elevated">
                Template Image
                {/* <img src={template1} alt="Minimal ecommerce template with bold hero and product grid" className="rounded-md w-full h-auto" loading="lazy" decoding="async" /> */}
                <figcaption className="p-4 text-sm text-muted-foreground">
                  Minimal Storefront
                </figcaption>
              </figure>
              <figure className="rounded-xl border bg-card p-2 shadow-elevated">
                Another Template Image
                {/* <img src={template2} alt="Lifestyle ecommerce template with curated product cards" className="rounded-md w-full h-auto" loading="lazy" decoding="async" /> */}
                <figcaption className="p-4 text-sm text-muted-foreground">
                  Lifestyle Boutique
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 md:py-20 border-t">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground">
                Start free. Upgrade when you’re ready to scale.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-1">Starter</h3>
                <p className="text-sm text-muted-foreground mb-4">For launching your first store</p>
                <div className="text-3xl font-bold mb-4">
                  $0<span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6 list-disc pl-4">
                  <li>1 storefront</li>
                  <li>Basic templates</li>
                  <li>1 GB assets</li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get started
                </Button>
              </div>
              <div className="rounded-xl border bg-card p-6 relative">
                <span className="absolute -top-3 right-4 text-xs font-medium px-2 py-1 rounded-full border bg-background">
                  Popular
                </span>
                <h3 className="font-semibold mb-1">Growth</h3>
                <p className="text-sm text-muted-foreground mb-4">For growing brands</p>
                <div className="text-3xl font-bold mb-4">
                  $29<span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6 list-disc pl-4">
                  <li>3 storefronts</li>
                  <li>All templates</li>
                  <li>10 GB assets</li>
                  <li>Custom domain</li>
                </ul>
                <Button className="w-full">Start free trial</Button>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-1">Pro</h3>
                <p className="text-sm text-muted-foreground mb-4">Scale without limits</p>
                <div className="text-3xl font-bold mb-4">
                  $99<span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6 list-disc pl-4">
                  <li>Unlimited storefronts</li>
                  <li>Priority support</li>
                  <li>Advanced SEO</li>
                  <li>Headless API</li>
                </ul>
                <Button className="w-full" variant="outline">
                  Contact sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-20 border-t">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-semibold mb-6 text-center">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Do I need to know how to code?</AccordionTrigger>
                <AccordionContent>
                  No. ShopLaunch is fully no‑code with drag‑and‑drop sections and live preview.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I use my own domain?</AccordionTrigger>
                <AccordionContent>
                  Yes. Connect a custom domain on Growth and Pro plans in minutes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                <AccordionContent>
                  Yes. Start free and upgrade any time—no credit card required to try it.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 border-t">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="rounded-2xl border p-10 bg-card shadow-elevated">
              <h2 className="text-3xl font-semibold mb-3">Launch your store today</h2>
              <p className="text-muted-foreground mb-6">
                Join creators and brands building fast, beautiful stores with ShopLaunch.
              </p>
              <Button size="lg">Create my store</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold">ShopLaunch</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
