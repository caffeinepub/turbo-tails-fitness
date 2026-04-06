import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Clock,
  Facebook,
  Heart,
  Home,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Star,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetAllPackages, useSubmitInquiry } from "../hooks/useQueries";
import type { InquiryInput, SessionPackage } from "../hooks/useQueries";

// ── Static fallback packages ─────────────────────────────────────────────────
const FALLBACK_PACKAGES: SessionPackage[] = [
  {
    id: 1n,
    name: "Trial Run",
    description:
      "First-time dogs only. A 30-minute intro session to get comfortable on the slat mill. Includes handler guidance and a progress report.",
    numberOfSessions: 1n,
    priceCents: 3250n,
  },
  {
    id: 2n,
    name: "Intro Package",
    description:
      "Perfect for new dogs building their fitness base. Start with the Trial Run, then 3 follow-up runs. Valid 6 weeks.",
    numberOfSessions: 4n,
    priceCents: 12950n,
  },
  {
    id: 3n,
    name: "4-Run Package",
    description:
      "Our most popular option! $36.50/run — save 15% vs. single runs. Prepaid, valid 10 weeks.",
    numberOfSessions: 4n,
    priceCents: 14600n,
  },
  {
    id: 4n,
    name: "Pack Run (Multi-Dog)",
    description:
      "Two or more dogs from the same household running together. Discounted rate per dog. Contact us to book.",
    numberOfSessions: 1n,
    priceCents: 3550n,
  },
];

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(0)}`;
}

function formatPricePerSession(pkg: SessionPackage): string {
  const perSession =
    Number(pkg.priceCents) / Number(pkg.numberOfSessions) / 100;
  return `$${perSession.toFixed(0)}/session`;
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Our Mobile Gym", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Medicine Hat Area", href: "#contact" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Utility bar */}
      <div className="bg-navy text-white text-xs py-2 text-center px-4">
        <span className="opacity-90">
          Canine Fitness Service in Medicine Hat, Redcliff & Surrounding Area
        </span>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#home"
              className="flex items-center gap-2 flex-shrink-0"
              data-ocid="nav.link"
            >
              <img
                src="/assets/generated/logo-icon-transparent.dim_200x200.png"
                alt="Turbo Tails Fitness logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-navy text-base">
                  Turbo Tails
                </span>
                <span className="text-primary text-xs font-semibold tracking-wide">
                  FITNESS
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden md:block"
                data-ocid="nav.primary_button"
              >
                <Button className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-md font-semibold text-sm px-5">
                  Book a Session
                </Button>
              </a>
              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation"
                data-ocid="nav.toggle"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-white px-4 pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-3 text-sm font-medium text-foreground hover:text-primary border-b border-border last:border-0"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block mt-3"
              data-ocid="nav.primary_button"
            >
              <Button className="w-full rounded-full bg-primary text-white font-semibold">
                Book a Session
              </Button>
            </a>
          </motion.div>
        )}
      </header>
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="home" className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Medicine Hat & Redcliff's Mobile Dog Gym
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-4">
              Fitness That Comes <span className="text-primary">To Your</span>{" "}
              Door
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              20-minute high-intensity cardio sessions on a self-propelled slat
              mill, right in your driveway. Your dog stays fit, happy, and
              healthy — without you leaving home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contact" data-ocid="hero.primary_button">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg font-bold text-base px-8 py-6"
                >
                  Book Their Run!
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#how-it-works" data-ocid="hero.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold text-base px-8 py-6 transition-colors"
                >
                  How It Works
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🐕", "🐩", "🦮", "🐕‍🦺"].map((dog) => (
                  <div
                    key={dog}
                    className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-sm"
                  >
                    {dog}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-orange text-orange" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Loved by Medicine Hat & Redcliff dogs & their owners
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: hero image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src="/assets/generated/hero-van-dog.dim_1200x800.jpg"
                alt="Turbo Tails Fitness van with dog on slat mill"
                className="w-full h-80 md:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange" />
              </div>
              <div>
                <p className="font-bold text-navy text-sm">20 Minutes</p>
                <p className="text-xs text-muted-foreground">
                  High-intensity cardio
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 }}
              className="absolute -top-4 -right-4 bg-primary rounded-2xl shadow-card p-4 text-white"
            >
              <p className="font-bold text-lg">100%</p>
              <p className="text-xs opacity-90">At Your Door</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Feature strip ─────────────────────────────────────────────────────────────
function FeatureStrip() {
  const features = [
    {
      icon: <Home className="w-6 h-6" />,
      label: "Stress-Free (at Home)",
      desc: "No car rides or busy facilities",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      label: "Safe & Supervised",
      desc: "Handler inside throughout",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Fits Your Schedule",
      desc: "Flexible booking times",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: "All Breeds Welcome",
      desc: "From tiny terriers to giants",
    },
  ];

  return (
    <section className="bg-navy py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3 p-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{f.label}</p>
                <p className="text-xs text-white/60 mt-1">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Book Online or By Phone",
      description:
        "Choose a convenient time slot. We'll confirm your booking and send details about what to expect for your dog's first session.",
      emoji: "📱",
    },
    {
      number: "02",
      title: "Our Van Arrives at Your Door",
      description:
        "Our Turbo Tails branded van pulls right up to your driveway. No travel stress for you or your pup!",
      emoji: "🚐",
    },
    {
      number: "03",
      title: "Your Dog Runs the Slat Mill",
      description:
        "Handler stays inside the climate-controlled van. Toys, praise, and positive reinforcement keep your dog motivated and having a blast.",
      emoji: "🐕",
    },
    {
      number: "04",
      title: "Dog Goes Home Happy & Tired!",
      description:
        "After 20 minutes of high-intensity cardio, your dog returns to you — satisfied, exercised, and ready for a well-earned nap.",
      emoji: "😴",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Getting your dog fit has never been easier. Here's what to expect:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl p-6 shadow-card relative group hover:shadow-card-hover transition-shadow"
            >
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                {step.number}
              </div>
              <div className="text-4xl mb-4 mt-2">{step.emoji}</div>
              <h3 className="font-bold text-navy text-base mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Services & Pricing ────────────────────────────────────────────────────────
function ServicesPricingSection() {
  const { data: packages, isLoading } = useGetAllPackages();
  const displayPackages =
    packages && packages.length > 0 ? packages : FALLBACK_PACKAGES;

  const highlights = [
    "Confirmed booking",
    "20-min session",
    "Handler included",
    "Medicine Hat, Redcliff & surroundings",
  ];
  const popularIndex =
    displayPackages.length > 2 ? 2 : displayPackages.length > 1 ? 1 : 0;

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Services & Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            Session Packages
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Choose the package that fits your dog's fitness routine. All
            sessions are 20 minutes of supervised slat mill cardio.
          </p>
        </motion.div>

        {/* Service info banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-background rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-6"
        >
          <img
            src="/assets/generated/dog-slat-mill.dim_800x600.jpg"
            alt="Dog on slat mill in the van"
            className="w-full md:w-48 h-40 object-cover rounded-xl shadow-card"
          />
          <div>
            <h3 className="font-bold text-navy text-lg mb-2">
              The Slat Mill Experience
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our self-propelled slat mill lets your dog control their own speed
              — no motors, no forced pace. The handler stays inside the
              climate-controlled van throughout, using toys and praise to keep
              your dog motivated and having fun. It's the most effective and
              dog-friendly cardio workout available.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {highlights.map((h) => (
                <Badge
                  key={h}
                  variant="outline"
                  className="text-xs text-primary border-primary/30"
                >
                  ✓ {h}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? ["s1", "s2", "s3", "s4"].map((sk) => (
                <div
                  key={sk}
                  className="bg-background rounded-2xl p-6 shadow-card"
                  data-ocid="pricing.loading_state"
                >
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-10 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ))
            : displayPackages.map((pkg, i) => (
                <motion.div
                  key={String(pkg.id)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all ${
                    i === popularIndex
                      ? "bg-navy text-white ring-2 ring-primary scale-[1.02]"
                      : "bg-white"
                  }`}
                  data-ocid={`pricing.item.${i + 1}`}
                >
                  {i === popularIndex && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-orange text-white border-0 text-xs font-bold px-3 shadow">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3
                      className={`font-bold text-lg ${i === popularIndex ? "text-white" : "text-navy"}`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span
                        className={`text-4xl font-bold ${i === popularIndex ? "text-white" : "text-navy"}`}
                      >
                        {formatPrice(pkg.priceCents)}
                      </span>
                      <span
                        className={`text-sm ${i === popularIndex ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {formatPricePerSession(pkg)}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-6 leading-relaxed ${i === popularIndex ? "text-white/80" : "text-muted-foreground"}`}
                  >
                    {pkg.description}
                  </p>
                  <div
                    className={`text-xs mb-6 font-medium ${i === popularIndex ? "text-primary" : "text-primary"}`}
                  >
                    {Number(pkg.numberOfSessions)} session
                    {Number(pkg.numberOfSessions) > 1 ? "s" : ""} included
                  </div>
                  <a href="#contact" data-ocid={`pricing.book_button.${i + 1}`}>
                    <Button
                      className={`w-full rounded-full font-bold ${
                        i === popularIndex
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-navy text-white hover:bg-navy/90"
                      }`}
                    >
                      Book Now
                    </Button>
                  </a>
                </motion.div>
              ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          All packages prepaid. Prices in CAD. Frequency: 1–2 runs/week
          recommended.
        </p>
      </div>
    </section>
  );
}

// ── Contact / Booking ─────────────────────────────────────────────────────────
function ContactSection() {
  const submitInquiry = useSubmitInquiry();
  const [form, setForm] = useState<InquiryInput>({
    name: "",
    email: "",
    phone: "",
    dogName: "",
    dogBreed: "",
    preferredDate: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof InquiryInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitInquiry.mutateAsync(form);
      setSubmitted(true);
      toast.success("Booking inquiry sent! We'll be in touch within 24 hours.");
    } catch {
      toast.error(
        "Something went wrong. Please try again or call us directly.",
      );
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Book a Session
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            Get In Touch
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Ready to get your dog running? Fill out the form below or reach us
            directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-navy rounded-2xl p-8 text-white h-full">
              <h3 className="text-xl font-bold mb-6">Contact Details</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Service Area</p>
                    <p className="text-white/70 text-sm mt-1">
                      Medicine Hat, Redcliff & Surrounding Area
                      <br />
                      Alberta, Canada
                      <br />
                      (We come to you!)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a
                      href="tel:4035550199"
                      className="text-white/70 text-sm hover:text-primary transition-colors"
                    >
                      (403) 555-0199
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:hello@turbotailsfitness.ca"
                      className="text-white/70 text-sm hover:text-primary transition-colors"
                    >
                      hello@turbotailsfitness.ca
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="font-semibold mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label="Facebook"
                    data-ocid="contact.link"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label="Instagram"
                    data-ocid="contact.link"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Styled location placeholder */}
              <div className="mt-8 rounded-xl bg-primary/10 border border-primary/20 p-4">
                <p className="text-xs text-white/60 uppercase tracking-wide font-semibold mb-2">
                  Service Zone
                </p>
                <p className="font-bold text-primary">
                  Medicine Hat & Redcliff
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Dunmore · Cypress County · Bow Island & more
                </p>
                <p className="text-white/40 text-xs mt-2">
                  Contact us to confirm your area
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: booking form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-card p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                  data-ocid="contact.success_state"
                >
                  <div className="text-6xl mb-4">🐕</div>
                  <h3 className="text-2xl font-bold text-navy mb-2">
                    Woof! We Got It!
                  </h3>
                  <p className="text-muted-foreground">
                    Thanks for reaching out. We'll confirm your booking within
                    24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full bg-primary text-white"
                  >
                    Submit Another Inquiry
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  data-ocid="contact.modal"
                >
                  <h3 className="text-xl font-bold text-navy mb-4">
                    Booking Inquiry
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="contact-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Your Name
                      </Label>
                      <Input
                        id="contact-name"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        data-ocid="contact.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="contact-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="contact-phone"
                        className="text-sm font-medium text-foreground"
                      >
                        Phone
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="(403) 555-0100"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        data-ocid="contact.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="contact-date"
                        className="text-sm font-medium text-foreground"
                      >
                        Preferred Date
                      </Label>
                      <Input
                        id="contact-date"
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) =>
                          handleChange("preferredDate", e.target.value)
                        }
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="contact-dog-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Dog's Name
                      </Label>
                      <Input
                        id="contact-dog-name"
                        placeholder="Buddy"
                        value={form.dogName}
                        onChange={(e) =>
                          handleChange("dogName", e.target.value)
                        }
                        required
                        data-ocid="contact.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="contact-dog-breed"
                        className="text-sm font-medium text-foreground"
                      >
                        Dog's Breed
                      </Label>
                      <Input
                        id="contact-dog-breed"
                        placeholder="Golden Retriever"
                        value={form.dogBreed}
                        onChange={(e) =>
                          handleChange("dogBreed", e.target.value)
                        }
                        required
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="contact-message"
                      className="text-sm font-medium text-foreground"
                    >
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Any details about your dog, schedule preferences, or questions..."
                      rows={3}
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      data-ocid="contact.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitInquiry.isPending}
                    className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold py-5 shadow-md"
                    data-ocid="contact.submit_button"
                  >
                    {submitInquiry.isPending
                      ? "Sending..."
                      : "Send Booking Inquiry 🐕"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/logo-icon-transparent.dim_200x200.png"
                alt="Turbo Tails Fitness"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-white">Turbo Tails Fitness</p>
                <p className="text-primary text-xs">
                  Medicine Hat & Redcliff's Mobile Dog Gym
                </p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              We come to you — bringing professional canine fitness right to
              your driveway in Medicine Hat, Redcliff, and surrounding area,
              Alberta.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-bold text-sm uppercase tracking-wide mb-4">
              Quick Links
            </p>
            <div className="space-y-2">
              {[
                { label: "Home", href: "#home" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "#contact" },
                { label: "Admin", href: "/admin" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-white/60 text-sm hover:text-primary transition-colors"
                  data-ocid="footer.link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-sm uppercase tracking-wide mb-4">
              Contact
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>(403) 555-0199</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@turbotailsfitness.ca</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Medicine Hat, Redcliff & Area, AB</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
                data-ocid="footer.link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
                data-ocid="footer.link"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/40 text-xs">
          © {currentYear} Turbo Tails Fitness. All rights reserved. | Built with
          ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Main landing page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        <HeroSection />
        <FeatureStrip />
        <HowItWorksSection />
        <ServicesPricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
