import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Baby,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Crown,
  ExternalLink,
  Facebook,
  Flame,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Mic,
  Music,
  Navigation,
  Phone,
  Play,
  Shield,
  Star,
  Twitter,
  User,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Event, Sermon } from "./backend.d";
import {
  useEvents,
  useSermons,
  useSubmitContactForm,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

// ---- Helpers ----
function formatDate(ts: bigint): string {
  const date = new Date(Number(ts) / 1_000_000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ---- Static Data ----
const FALLBACK_SERMONS: Sermon[] = [
  {
    title: "The Fire That Never Dies",
    speaker: "Pastor Emmanuel Okafor",
    date: BigInt(Date.now() - 7 * 86400000) * 1_000_000n,
    scriptureReference: "Acts 2:1-4",
    description:
      "Experience the transforming power of the Holy Spirit as we explore the Day of Pentecost and its relevance to believers today.",
  },
  {
    title: "Walking in the Spirit",
    speaker: "Rev. Grace Adeyemi",
    date: BigInt(Date.now() - 14 * 86400000) * 1_000_000n,
    scriptureReference: "Galatians 5:16-25",
    description:
      "A powerful message on how to live a Spirit-filled life daily and overcome the works of the flesh through surrender and faith.",
  },
  {
    title: "Your Breakthrough Season",
    speaker: "Pastor Emmanuel Okafor",
    date: BigInt(Date.now() - 21 * 86400000) * 1_000_000n,
    scriptureReference: "Isaiah 43:18-19",
    description:
      "God is doing something new in your life. Discover the keys to stepping into the divine breakthroughs He has prepared for you.",
  },
];

const FALLBACK_EVENTS: Event[] = [
  {
    title: "Joy of Giving — Clothes & Grocery Distribution",
    date: BigInt(new Date("2026-03-15T17:30:00").getTime()) * 1_000_000n,
    time: "5:30 PM",
    location: "IPC Bethel Worship Centre, Horamavu Agara",
    description:
      "Join us for a blessed time of giving as we distribute clothes and groceries to those in need. Come and be a blessing!",
  },
];

const MINISTRIES = [
  {
    icon: Users,
    title: "Youth Ministry",
    description:
      "Empowering the next generation through dynamic worship, mentorship, and Spirit-filled encounters every Friday evening.",
  },
  {
    icon: Heart,
    title: "Women's Fellowship",
    description:
      "A nurturing community of women growing in faith, purpose, and sisterhood through prayer, study, and service.",
  },
  {
    icon: User,
    title: "Men's Fellowship",
    description:
      "Building men of integrity, faith, and godly character who lead their families, church, and communities with excellence.",
  },
  {
    icon: Baby,
    title: "Children's Church",
    description:
      "A joyful, safe environment where children 3–12 discover God's love through storytelling, music, and creative worship.",
  },
  {
    icon: Music,
    title: "Worship & Arts",
    description:
      "Ushering the congregation into the presence of God through anointed music, creative expression, and Spirit-led worship.",
  },
  {
    icon: Flame,
    title: "Prayer Ministry",
    description:
      "The heartbeat of our church — interceding for the nations, the lost, and our community through corporate and personal prayer.",
  },
];

const SERVICE_TIMES = [
  {
    day: "Sunday",
    name: "Morning Worship Services",
    times: [
      { label: "Kannada", time: "9:00 AM – 11:00 AM" },
      { label: "English", time: "9:00 AM – 10:00 AM" },
      { label: "Malayalam", time: "10:00 AM – 12:30 PM" },
    ],
    icon: Star,
  },
  {
    day: "Thursday",
    name: "Ladies Meeting",
    times: [{ label: "", time: "10:30 AM – 12:30 PM" }],
    icon: Users,
  },
  {
    day: "Friday",
    name: "Fasting Prayer",
    times: [{ label: "", time: "10:30 AM – 12:30 PM" }],
    icon: Flame,
  },
  {
    day: "Saturday",
    name: "Sunday School",
    times: [{ label: "", time: "4:30 PM – 5:30 PM" }],
    icon: BookOpen,
  },
  {
    day: "Saturday",
    name: "Special Prayer",
    times: [{ label: "", time: "7:00 PM – 8:30 PM" }],
    icon: Star,
  },
];

const PASTORS = [
  {
    role: "Senior Pastor",
    name: "Pr George Thomas",
    icon: Crown,
  },
  {
    role: "Kannada",
    name: "Eve Ebi George",
    icon: BookOpen,
  },
  {
    role: "English",
    name: "Br Praison Jose",
    icon: BookOpen,
  },
];

// ---- Animated Section ----
function AnimatedSection({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- Nav ----
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#home", label: "Home", ocid: "nav.home_link" },
    { href: "#about", label: "About", ocid: "nav.about_link" },
    { href: "#pastors", label: "Pastors", ocid: "nav.pastors_link" },
    { href: "#services", label: "Services", ocid: "nav.services_link" },
    { href: "#sermons", label: "Sermons", ocid: "nav.sermons_link" },
    { href: "#ministries", label: "Ministries", ocid: "nav.ministries_link" },
    { href: "#events", label: "Events", ocid: "nav.events_link" },
    { href: "#contact", label: "Contact", ocid: "nav.contact_link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <img
            src="/assets/uploads/IMG_4259-1.png"
            alt="IPC Bethel Worship Centre"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-ocid={l.ocid}
              className="px-3 py-1.5 text-sm font-body text-muted-foreground hover:text-gold transition-colors duration-200 rounded-md hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md hover:bg-white/10 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-background/98 border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-ocid={l.ocid}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-body text-muted-foreground hover:text-gold transition-colors duration-200 rounded-md hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---- Hero ----
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-church.dim_1920x1080.jpg')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/75" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-bg opacity-70" />

      {/* Floating light orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-float"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.18 68), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-8"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.2 290), transparent 70%)",
          animation: "float 8s ease-in-out infinite 2s",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Tagline badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Flame className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-body tracking-widest uppercase text-gold">
              Pentecostal Church
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            <span className="block text-foreground">IPC Bethel</span>
            <span className="block text-gold gold-glow italic">
              Worship Centre
            </span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the{" "}
            <span className="text-gold font-semibold">Presence of God</span> — a
            community alive in the Spirit, rooted in faith, and passionate about
            transforming lives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              data-ocid="hero.primary_button"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold px-8 py-6 text-base shadow-gold animate-glow-pulse"
            >
              <a href="#services">Join Us Sunday</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              data-ocid="hero.secondary_button"
              asChild
              className="border-gold/50 text-gold hover:bg-gold/10 font-body font-semibold px-8 py-6 text-base"
            >
              <a href="#sermons">
                <Play className="w-4 h-4 mr-2" />
                Watch Sermons
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
          >
            <span className="text-xs font-body tracking-widest uppercase">
              Explore
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ---- About ----
function About() {
  const { ref, visible } = useScrollAnimation();
  return (
    <section id="about" className="py-24 section-alt">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            Our Story
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-gold italic">IPC Bethel</span>
          </h2>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-gold">
                Our History
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                IPC Bethel Worship Centre was established with a burning
                conviction that God was calling a people to radical worship,
                deep prayer, and fearless evangelism. From humble beginnings in
                a small hall, God's hand has grown this congregation into a
                vibrant family spanning generations.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Rooted in Pentecostal heritage and guided by the Holy Spirit, we
                have witnessed countless healings, salvations, and community
                transformations. Our story is still being written — and every
                member is a living chapter.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-gold">
                Our Vision
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold italic">
                  "To impact lives with the transforming power of the Holy
                  Spirit"
                </span>{" "}
                — raising disciples who carry revival fire into every sphere of
                society.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-gold">
                Our Mission
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                To gather, grow, and send Spirit-filled believers — equipping
                every person to experience God's power, serve their community,
                and make disciples of all nations.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-gold">
                Core Values
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Flame, label: "Spirit-Filled Worship" },
                  { icon: BookOpen, label: "Biblical Truth" },
                  { icon: Heart, label: "Radical Generosity" },
                  { icon: Users, label: "Kingdom Community" },
                  { icon: Shield, label: "Prayer & Intercession" },
                  { icon: Star, label: "Excellence in Service" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="font-body text-sm text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---- Pastors ----
function Pastors() {
  return (
    <section id="pastors" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            Leadership
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-gold italic">Pastors</span>
          </h2>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PASTORS.map(({ role, name, icon: Icon }, i) => (
            <AnimatedSection key={role + name}>
              <Card
                className="bg-card border-border card-glow transition-all duration-300 overflow-hidden relative group text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3 items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    {role}
                  </div>
                  <CardTitle className="font-display text-xl font-bold text-foreground">
                    {name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Services ----
function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            Gather With Us
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Service <span className="text-gold italic">Times</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Come as you are. You are always welcome at IPC Bethel Worship
            Centre.
          </p>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SERVICE_TIMES.map(({ day, name, times, icon: Icon }, i) => (
            <AnimatedSection key={day + name}>
              <Card
                className="bg-card border-border card-glow transition-all duration-300 overflow-hidden relative group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <div className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    {day}
                  </div>
                  <CardTitle className="font-display text-xl font-semibold text-foreground">
                    {name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {times.map((t) => (
                    <div
                      key={t.label + t.time}
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="font-body font-semibold text-gold text-base">
                        {t.label ? (
                          <>
                            <span className="text-muted-foreground font-normal text-sm mr-1">
                              {t.label}:
                            </span>
                            {t.time}
                          </>
                        ) : (
                          t.time
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-muted-foreground">
                      IPC KS HQ, Horamavu Agara, Karnataka, India - 560043
                    </span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Sermons ----
function SermonCard({ sermon, index }: { sermon: Sermon; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-ocid={`sermons.item.${index + 1}`}
    >
      <Card className="bg-card border-border card-glow transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-80 transition-opacity" />
        <CardHeader>
          <div className="flex items-start justify-between gap-3 mb-2">
            <Badge
              variant="secondary"
              className="font-body text-xs bg-primary/15 text-gold border-primary/20"
            >
              {sermon.scriptureReference}
            </Badge>
            <span className="font-body text-xs text-muted-foreground flex-shrink-0">
              {formatDate(sermon.date)}
            </span>
          </div>
          <CardTitle className="font-display text-xl font-semibold text-foreground leading-tight">
            {sermon.title}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Mic className="w-3.5 h-3.5 text-gold" />
            <span className="font-body text-sm text-muted-foreground">
              {sermon.speaker}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between gap-4">
          <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {sermon.description}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gold/30 text-gold hover:bg-gold/10 font-body"
          >
            <Play className="w-3.5 h-3.5 mr-2" /> Listen
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Sermons() {
  const { data: sermons, isLoading } = useSermons();
  const displaySermons =
    sermons && sermons.length > 0 ? sermons : FALLBACK_SERMONS;

  return (
    <section id="sermons" className="py-24 section-alt">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            The Word
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Recent <span className="text-gold italic">Sermons</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Be transformed by the renewing of your mind through anointed
            teachings.
          </p>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        {isLoading ? (
          <div
            className="grid md:grid-cols-3 gap-6"
            data-ocid="sermons.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted mt-2" />
                  <Skeleton className="h-4 w-32 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="sermons.list"
          >
            {displaySermons.map((sermon, i) => (
              <SermonCard key={sermon.title} sermon={sermon} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Ministries ----
function Ministries() {
  return (
    <section id="ministries" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            Belong
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-gold italic">Ministries</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Find your place to serve, grow, and belong in the body of Christ.
          </p>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINISTRIES.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="bg-card border-border card-glow transition-all duration-300 h-full group cursor-default relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-80 transition-opacity" />
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Events ----
function EventCard({ event, index }: { event: Event; index: number }) {
  const date = new Date(Number(event.date) / 1_000_000);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-ocid={`events.item.${index + 1}`}
    >
      <Card className="bg-card border-border card-glow transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-80 transition-opacity" />
        <CardContent className="pt-6">
          <div className="flex gap-4">
            {/* Date block */}
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/20 flex flex-col items-center justify-center border border-primary/20">
              <span className="font-display font-bold text-xl text-gold leading-none">
                {day}
              </span>
              <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                {month}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-foreground mb-1 leading-tight">
                {event.title}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span className="font-body text-xs text-muted-foreground">
                    {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span className="font-body text-xs text-muted-foreground truncate">
                    {event.location}
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Events() {
  const { data: events, isLoading } = useEvents();
  const displayEvents = events && events.length > 0 ? events : FALLBACK_EVENTS;

  return (
    <section id="events" className="py-24 section-alt">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            Calendar
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-gold italic">Events</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Stay connected with what God is doing in our community.
          </p>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        {isLoading ? (
          <div
            className="space-y-4 max-w-3xl mx-auto"
            data-ocid="events.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-14 h-14 rounded-xl bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-muted" />
                      <Skeleton className="h-3 w-1/2 bg-muted" />
                      <Skeleton className="h-8 w-full bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto" data-ocid="events.list">
            {displayEvents.map((event, i) => (
              <EventCard key={event.title} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Contact ----
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const mutation = useSubmitContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(form);
      toast.success("Message sent! We'll be in touch soon.", {
        duration: 5000,
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-gold border-primary/30 font-body">
            Reach Out
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In <span className="text-gold italic">Touch</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            We would love to hear from you. Whether you have questions, prayer
            requests, or simply want to connect.
          </p>
          <div className="flame-divider w-32 mx-auto mt-6" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <AnimatedSection className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-semibold text-gold mb-6">
                Visit Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="font-body font-semibold text-foreground text-sm">
                      Address
                    </div>
                    <div className="font-body text-sm text-muted-foreground">
                      IPC KS HQ, Horamavu Agara,
                      <br />
                      Karnataka, India - 560043
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="font-body font-semibold text-foreground text-sm">
                      Phone
                    </div>
                    <div className="font-body text-sm text-muted-foreground space-y-0.5">
                      <div>
                        <a
                          href="tel:+919945522629"
                          className="hover:text-gold transition-colors"
                        >
                          +91 99455 22629
                        </a>
                      </div>
                      <div>
                        <a
                          href="tel:+919945882098"
                          className="hover:text-gold transition-colors"
                        >
                          +91 9945882098
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="font-body font-semibold text-foreground text-sm">
                      Email
                    </div>
                    <div className="font-body text-sm text-muted-foreground">
                      <a
                        href="mailto:bwcipc@gmail.com"
                        className="hover:text-gold transition-colors"
                      >
                        bwcipc@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <motion.a
              href="https://maps.app.goo.gl/Z6WFtph2LVYDM6MF9"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.map_marker"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="block rounded-xl overflow-hidden border border-gold/30 bg-secondary relative group cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.02 68 / 0.8) 0%, oklch(0.14 0.04 290 / 0.6) 100%)",
              }}
            >
              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-xl border border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(0.82 0.18 68 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 68 / 0.3) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative z-10 p-6 flex flex-col items-center text-center gap-4">
                {/* Pulsing pin icon */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-primary/20 border border-gold/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                    <MapPin className="w-8 h-8 text-gold" />
                  </div>
                </div>

                <div>
                  <p className="font-display text-lg font-semibold text-foreground mb-1">
                    IPC Bethel Worship Centre
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    Horamavu Agara, Karnataka, India
                  </p>
                </div>

                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/30 group-hover:bg-gold/20 group-hover:border-gold/60 transition-all duration-300">
                  <Navigation className="w-4 h-4 text-gold" />
                  <span className="font-body text-sm font-semibold text-gold">
                    Get Directions
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold/70" />
                </div>
              </div>
            </motion.a>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="font-body text-sm text-foreground"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        data-ocid="contact.input"
                        placeholder="John Adeyemi"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        required
                        className="bg-secondary border-border font-body"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="font-body text-sm text-foreground"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        data-ocid="contact.email_input"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        required
                        className="bg-secondary border-border font-body"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="font-body text-sm text-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      data-ocid="contact.phone_input"
                      placeholder="+91 99455 22629"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="bg-secondary border-border font-body"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="message"
                      className="font-body text-sm text-foreground"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      data-ocid="contact.textarea"
                      placeholder="How can we help you? Share your prayer request, question, or message..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      required
                      rows={5}
                      className="bg-secondary border-border font-body resize-none"
                    />
                  </div>

                  {mutation.isError && (
                    <div
                      data-ocid="contact.error_state"
                      className="text-destructive text-sm font-body bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                    >
                      Failed to send. Please try again.
                    </div>
                  )}

                  {mutation.isSuccess && (
                    <div
                      data-ocid="contact.success_state"
                      className="text-green-400 text-sm font-body bg-green-400/10 border border-green-400/20 rounded-md px-3 py-2"
                    >
                      ✓ Message sent successfully!
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    disabled={mutation.isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold"
                  >
                    {mutation.isPending ? (
                      <span
                        data-ocid="contact.loading_state"
                        className="flex items-center gap-2"
                      >
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Social links config
const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  {
    Icon: Youtube,
    label: "YouTube",
    href: "https://youtube.com/@ipcbethelworshipcentre",
  },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
];

// ---- Footer ----
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-background border-t border-border">
      {/* Divider glow */}
      <div className="flame-divider" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-gold" />
              <div>
                <div className="font-display font-bold text-foreground">
                  IPC Bethel Worship Centre
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Transforming lives through the power of the Holy Spirit. A
              community of faith, love, and purpose.
            </p>
            {/* Social */}
            <div className="flex gap-3 pt-1">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-primary/15 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold tracking-widest uppercase mb-4">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ["Home", "#home"],
                ["About", "#about"],
                ["Services", "#services"],
                ["Sermons", "#sermons"],
                ["Ministries", "#ministries"],
                ["Events", "#events"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Service Times Quick */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold tracking-widest uppercase mb-4">
              Service Times
            </h4>
            <div className="space-y-2">
              <div className="font-body text-sm">
                <span className="text-foreground">Sunday</span>
                <div className="text-muted-foreground text-xs mt-0.5 space-y-0.5">
                  <div>Kannada 9–11AM</div>
                  <div>English 9–10AM</div>
                  <div>Malayalam 10AM–12:30PM</div>
                </div>
              </div>
              <div className="font-body text-sm">
                <span className="text-foreground">Wednesday</span>
                <span className="text-muted-foreground ml-2">6:30 PM</span>
              </div>
              <div className="font-body text-sm">
                <span className="text-foreground">Friday</span>
                <span className="text-muted-foreground ml-2">6:00 PM</span>
              </div>
              <div className="font-body text-xs text-muted-foreground pt-2">
                Horamavu Agara, Karnataka, India
              </div>
            </div>
          </div>
        </div>

        <div className="flame-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © {year} IPC Bethel Worship Centre. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---- App ----
function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <About />
        <Pastors />
        <Services />
        <Sermons />
        <Ministries />
        <Events />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
