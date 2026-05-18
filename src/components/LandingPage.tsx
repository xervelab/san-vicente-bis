import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19a7 7 0 0 1 14 0" />
      </svg>
    ),
    title: 'Resident Records',
    description: 'Maintain complete and up-to-date resident profiles with household linkage and demographic data.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
    title: 'Household Management',
    description: 'Track household composition, addresses, and family relationships across the barangay.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
    title: 'Certificate Issuance',
    description: 'Generate barangay clearances, residency certificates, and indigency certifications instantly.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 3h8l3 3v15H5V3h3" />
        <path d="M9 11h6M9 15h6" />
      </svg>
    ),
    title: 'Blotter Records',
    description: 'Record and monitor incident reports and disputes with complete case management tools.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        <path d="M6 9v6M18 9v6" />
      </svg>
    ),
    title: 'Online Requests',
    description: 'Accept and process document requests online, reducing queues and improving resident experience.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20h16" />
        <path d="M7 16v-4M12 16V8M17 16v-7" />
      </svg>
    ),
    title: 'Reports & Analytics',
    description: 'Generate demographic summaries and operational reports for informed decision-making.',
  },
]

const stats = [
  { label: 'Residents Served', value: '5,000+' },
  { label: 'Households Tracked', value: '1,200+' },
  { label: 'Certificates Issued', value: '800+' },
  { label: 'Online Requests', value: '300+' },
]

export function LandingPage() {
  const navigate = useNavigate()
  const goToLogin = () => navigate('/login')
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('bis-theme', next ? 'dark' : 'light')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">

      {/* Navbar */}
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-white/95 shadow-sm backdrop-blur-md dark:bg-slate-950/95'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo sizeClassName="h-9 w-9" textClassName="text-xs" />
            <span className="font-semibold tracking-tight">Barangay San Vicente</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Features
            </a>
            <a href="#about" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              About
            </a>
            <a href="#contact" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3c-.03.19-.05.39-.05.59A8.2 8.2 0 0 0 19.4 11.8c.2 0 .4-.02.6-.05Z" />
                </svg>
              )}
            </button>
            {/* Hamburger button – visible on mobile */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <button
              onClick={goToLogin}
              className="hidden rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 md:inline-flex"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileMenuOpen ? 'max-h-72 border-t border-slate-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-6 py-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Contact
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); goToLogin(); }}
              className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Background gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-transparent opacity-60 blur-3xl dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-transparent" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-emerald-100 to-transparent opacity-50 blur-3xl dark:from-emerald-900/20" />
        </div>

        <div className="relative max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Digital Government Services
          </span>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">
            Barangay Services,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Simplified
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            A modern information system for Barangay San Vicente — managing residents, issuing certificates, tracking incidents, and serving the community efficiently.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={goToLogin}
              className="w-full rounded-xl bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-slate-700 hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto"
            >
              Get Started
            </button>
            <a
              href="#features"
              className="w-full rounded-xl border border-slate-200 px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 9-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Everything your barangay needs
            </h2>
            <p className="mx-auto max-w-xl text-slate-500 dark:text-slate-400">
              An all-in-one platform built to modernize barangay operations and improve public service delivery.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                  {feat.icon}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-slate-50 py-24 px-6 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                About Barangay San Vicente
              </h2>
              <p className="mb-4 leading-relaxed text-slate-500 dark:text-slate-400">
                Barangay San Vicente is committed to delivering efficient, transparent, and accessible government services to all its residents. Our digital platform brings barangay transactions online, reducing waiting times and paperwork.
              </p>
              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                From certificate requests to incident reporting, our system ensures that every resident receives prompt and professional service from their local government unit.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  24/7 Online Access
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Secure & Private
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Fast Processing
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-2xl dark:from-slate-700 dark:to-slate-800">
                <BrandLogo sizeClassName="h-28 w-28" textClassName="text-3xl" />
                <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-slate-800">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -left-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-slate-800">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 p-12 text-center shadow-2xl dark:bg-white">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-slate-900">
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-slate-400 dark:text-slate-600">
            Log in or create an account to access the full suite of barangay services and manage your records online.
          </p>
          <button
            onClick={goToLogin}
            className="rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-md transition-all hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            Access the Portal
          </button>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-slate-50 py-16 px-6 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="mb-3 flex justify-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Address</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">123 Barangay Hall St., San Vicente</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="mb-3 flex justify-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92V21a2 2 0 0 1-2.18 2A20 20 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Phone</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">(02) 8123-4567</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="mb-3 flex justify-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Email</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">bgy.sanvicente@example.gov.ph</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <BrandLogo sizeClassName="h-6 w-6" textClassName="text-[9px]" />
            <span className="font-medium text-slate-600 dark:text-slate-300">Barangay San Vicente</span>
          </div>
          <p>© {new Date().getFullYear()} Barangay San Vicente. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
