import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Users,
  TrendingUp,
  FileText,
  Bell,
  Wallet,
  Check,
  Instagram,
  Facebook,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";

const features = [
  { icon: Wallet, title: "Track contributions", desc: "Auto-update balances the moment members pay." },
  { icon: Users, title: "Manage members", desc: "Add, remove and view member status at a glance." },
  { icon: TrendingUp, title: "Loans & repayments", desc: "Issue loans, set interest, and track repayments." },
  { icon: FileText, title: "Reports & PDFs", desc: "Export monthly reports and member statements." },
  { icon: Bell, title: "Smart reminders", desc: "Notify members about upcoming contributions." },
  { icon: ShieldCheck, title: "Secure & private", desc: "Role-based access and protected financial records." },
];

const steps = [
  { n: "01", title: "Create your stokvel", desc: "Set a name, contribution amount and payout cycle." },
  { n: "02", title: "Add members", desc: "Invite your community in minutes." },
  { n: "03", title: "Manage with ease", desc: "Track money, loans and reports — all in one place." },
];

const testimonials = [
  { name: "Nomsa K.", role: "Treasurer, Soweto", quote: "Ubuntu Pay made our books transparent. No more arguments at month-end." },
  { name: "Sipho N.", role: "Member, Tembisa", quote: "I get reminders, see my balance, and trust the numbers. Simple." },
  { name: "Lerato P.", role: "Admin, Khayelitsha", quote: "Reports take seconds. Our 12-member group runs like a real bank." },
];

const pricing = [
  { name: "Basic", price: 179, popular: false, features: ["Contribution tracking", "Member management", "Basic reports"] },
  { name: "Standard", price: 550, popular: true, features: ["Everything in Basic", "Loans & repayments", "Notifications", "Priority support"] },
  { name: "Premium", price: 1000, popular: false, features: ["Everything in Standard", "Advanced reporting", "Multi-group management", "Premium support"] },
];

const faqs = [
  { q: "What is a stokvel?", a: "A stokvel is a savings club where community members contribute regularly and benefit collectively." },
  { q: "Is my money safe?", a: "Ubuntu Pay never holds your money — we help you track and manage it transparently." },
  { q: "Can I cancel anytime?", a: "Yes. You can downgrade or cancel your subscription at any time from Settings." },
  { q: "Does it work on any phone?", a: "Yes. Ubuntu Pay is mobile-first and works on any modern smartphone." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={ubuntuPayLogo} alt="Ubuntu Pay" className="w-9 h-9 rounded-lg" />
            <span className="font-display font-bold text-lg">Ubuntu Pay</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to="/register"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-light text-accent-foreground px-3 py-1.5 rounded-full text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Built for African community finance
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-5 text-charcoal">
              Manage your stokvel with{" "}
              <span className="text-primary">transparency, trust</span>, and control.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg">
              Ubuntu Pay helps stokvels track contributions, manage loans, monitor balances,
              and build trust within communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/onboarding">
                <Button size="lg" className="w-full sm:w-auto h-12 px-6 text-base shadow-elevated">
                  Start Managing Your Stokvel <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 text-base">
                  Book a Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> No setup fees</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Cancel anytime</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-[2rem] rotate-3 opacity-20 blur-3xl" />
            <div className="relative bg-card rounded-[2rem] shadow-elevated border border-border p-6">
              <div className="bg-gradient-balance rounded-2xl p-5 text-primary-foreground mb-4">
                <p className="text-xs opacity-90 mb-1">Stokvel Balance</p>
                <p className="font-display text-3xl font-extrabold">R 45,230.00</p>
                <p className="text-xs opacity-80 mt-1">+12% this month</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["Contribute", "Loans", "Reports"].map((l) => (
                  <div key={l} className="bg-primary-light rounded-xl p-3 text-center">
                    <p className="text-xs font-medium text-accent-foreground">{l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { n: "Nomsa K.", a: "+R 1,000" },
                  { n: "Sipho N.", a: "+R 1,000" },
                  { n: "Lerato P.", a: "+R 1,000" },
                ].map((r) => (
                  <div key={r.n} className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                    <span className="text-sm font-medium">{r.n}</span>
                    <span className="text-sm font-bold text-primary">{r.a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground">Three simple steps to a transparent stokvel.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((s) => (
              <Card key={s.n} className="p-6 shadow-card border-border">
                <div className="text-primary font-display font-bold text-3xl mb-3">{s.n}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Everything your stokvel needs</h2>
            <p className="text-muted-foreground">Tools designed for community finance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 shadow-card hover:shadow-elevated transition-shadow border-border">
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Pick the plan that fits your stokvel.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pricing.map((p) => (
              <Card
                key={p.name}
                className={`p-6 border ${p.popular ? "border-primary shadow-elevated" : "border-border shadow-card"} relative`}
              >
                {p.popular && (
                  <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <h3 className="font-display font-bold text-xl">{p.name}</h3>
                <div className="my-4">
                  <span className="font-display text-4xl font-extrabold">R{p.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button className="w-full" variant={p.popular ? "default" : "outline"}>
                    Choose {p.name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Loved by communities</h2>
            <p className="text-muted-foreground">Real groups, real trust.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 shadow-card border-border">
                <p className="text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {t.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-5 bg-card">
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-5">
          <Card className="p-10 bg-gradient-hero text-primary-foreground border-0 text-center shadow-elevated">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Ready to lead your stokvel with confidence?</h2>
            <p className="opacity-90 mb-6">Join hundreds of South African communities running their groups on Ubuntu Pay.</p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="h-12 px-6">
                Start free today <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-card">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={ubuntuPayLogo} alt="Ubuntu Pay" className="w-8 h-8 rounded-lg" />
            <span className="font-display font-semibold">Ubuntu Pay</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="https://www.ubuntupay.co.za" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground">
              <Globe className="w-4 h-4" /> www.ubuntupay.co.za
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground"><Instagram className="w-4 h-4" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-foreground"><Facebook className="w-4 h-4" /></a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Ubuntu Pay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
