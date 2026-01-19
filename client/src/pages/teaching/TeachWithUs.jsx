import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroAnimated from '../../components/HeroAnimated';
import '../../styles/teaching.css';

function TeachWithUs() {
  const faqs = [
    {
      question: "How do I become a Quran teacher on QuranDeen?",
      answer: "To become a teacher on QuranDeen, simply click the 'Start Teaching Today' button and complete our 4-step registration process. You'll need to provide your teaching experience, specialties (Tajweed, Hifz, Tafsir, etc.), set your hourly rate, and upload any certifications or Ijazah. Once submitted, our team will review your application within 24-48 hours. After approval, your profile will be visible to students worldwide."
    },
    {
      question: "What qualifications do I need to teach on QuranDeen?",
      answer: "We welcome teachers with various levels of experience and qualifications. Ideally, you should have knowledge in Quranic sciences such as Tajweed, memorization (Hifz), or Tafsir. Having an Ijazah (certification of Quran recitation chain) is highly valued but not mandatory. What matters most is your ability to effectively teach and connect with students. We evaluate each application based on experience, knowledge, and teaching capability."
    },
    {
      question: "How much can I earn teaching on QuranDeen?",
      answer: "Your earnings depend on your set hourly rate and the number of classes you teach. Teachers on QuranDeen typically charge between $10-$50+ per hour depending on their experience and specialization. You keep 80% of your earnings, while the platform takes a 20% commission to cover payment processing, platform maintenance, and student acquisition. Many of our top teachers earn $1,000-$5,000+ per month teaching part-time."
    },
    {
      question: "How does the payment system work?",
      answer: "We use Stripe for secure payment processing. When a student books and pays for a class, the funds are held securely. After the class is completed, your 80% share is available for withdrawal. You can set up direct bank transfers to receive your earnings. Payments are processed weekly, and you can track all your earnings in your teacher dashboard with detailed transaction history."
    },
    {
      question: "What technology do I need to teach online?",
      answer: "You'll need a reliable internet connection, a computer or tablet with a webcam, and a microphone. Our platform uses Jitsi Meet for video conferencing, which works directly in your browser without any software installation. We recommend a quiet teaching environment with good lighting. Having a whiteboard or screen sharing capability is helpful for visual explanations, but not required."
    },
    {
      question: "Can I set my own schedule and availability?",
      answer: "Absolutely! You have complete control over your schedule. In your teacher dashboard, you can set your available time slots for each day of the week. You can update your availability anytime, block out days for personal time, and manage your booking calendar. Students can only book classes during your specified available hours, giving you full flexibility to teach around your other commitments."
    },
    {
      question: "How do students find and book me?",
      answer: "Once your profile is approved and active, you'll appear in our Teacher Directory. Students can search and filter teachers by specialty, language, price range, ratings, and availability. Your profile showcases your bio, experience, certifications, teaching videos, and student reviews. Students can view your calendar, select a package, choose a time slot, and book instantly. You'll receive notifications for all bookings."
    },
    {
      question: "What subjects and specialties can I teach?",
      answer: "QuranDeen supports various Quran-related teaching specialties including: Tajweed (proper recitation rules), Hifz (Quran memorization), Tafsir (Quran interpretation and commentary), Arabic language basics, Noorani Qaida for beginners, Islamic studies, and more. You can select multiple specialties when creating your profile, and create different class packages for different subjects."
    },
    {
      question: "What if a student doesn't show up for a class?",
      answer: "We have policies to protect teachers from no-shows. If a student misses a scheduled class without prior notice (at least 24 hours), you still receive compensation for your time. Students who repeatedly miss classes may have their booking privileges restricted. We encourage communication through our in-app messaging system to prevent scheduling conflicts and ensure smooth class experiences."
    },
    {
      question: "How can I grow my student base and get more bookings?",
      answer: "To attract more students: 1) Complete your profile fully with a professional photo and detailed bio. 2) Upload certifications and teaching credentials. 3) Add an introduction video showcasing your teaching style. 4) Offer competitive initial rates to build reviews. 5) Provide excellent classes to earn 5-star ratings. 6) Respond promptly to student messages. 7) Maintain high availability during peak hours. 8) Create attractive class packages for regular students."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="teach-with-us-page">
      <Helmet>
        <title>Become a Quran Teacher - Teach Online & Earn | QuranDeen</title>
        <meta name="description" content="Join QuranDeen as a Quran teacher. Teach Tajweed, Hifz, Tafsir & Arabic online. Set your schedule, earn 80% of your rates. Start teaching students worldwide today!" />
        <meta name="keywords" content="become quran teacher, teach quran online, quran teaching jobs, online quran tutor, tajweed teacher, hifz teacher, islamic teacher jobs" />
        <link rel="canonical" href="https://qurandeen.com/teach-with-us" />
        <meta property="og:title" content="Become a Quran Teacher - Teach Online & Earn | QuranDeen" />
        <meta property="og:description" content="Join QuranDeen as a Quran teacher. Teach Tajweed, Hifz, Tafsir & Arabic online. Set your schedule, earn 80% of your rates." />
        <meta property="og:url" content="https://qurandeen.com/teach-with-us" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <HeroAnimated 
        title="Teach Quran Online"
        subtitle="Share Your Knowledge & Earn"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Teach With Us', path: '/teach-with-us' }
        ]}
      />

      <div className="teach-content">
        <section className="teach-section teach-intro">
          <div className="teach-container">
            <h2>Join the World's Leading Quran Teaching Platform</h2>
            <p className="lead-text">
              QuranDeen connects qualified Quran teachers with students from over 100 countries. 
              Whether you're an experienced scholar with Ijazah or a passionate teacher, 
              share your knowledge of the Holy Quran and make a meaningful impact while earning from home.
            </p>
            <div className="cta-buttons">
              <Link to="/become-teacher" className="btn btn-primary btn-large">
                Start Teaching Today
              </Link>
              <Link to="/teachers" className="btn btn-secondary btn-large">
                View Teacher Directory
              </Link>
            </div>
          </div>
        </section>

        <section className="teach-section teach-why">
          <div className="teach-container">
            <h2>Why Teach on QuranDeen?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <h3>Global Student Base</h3>
                <p>Connect with students from over 100 countries actively seeking Quran education. Our platform brings learners directly to you.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3>Keep 80% of Earnings</h3>
                <p>Our fair commission model means you keep 80% of what you earn. Set your own rates and maximize your income.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3>Flexible Schedule</h3>
                <p>Teach on your own terms. Set your availability, work from anywhere, and build a schedule that fits your lifestyle.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>Build Your Reputation</h3>
                <p>Earn reviews and ratings from students. Top-rated teachers get featured placement and more booking requests.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-how-it-works">
          <div className="teach-container">
            <h2>How It Works</h2>
            <div className="steps-timeline">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Create Your Profile</h3>
                <p>Sign up and complete your teacher profile with your experience, specialties, hourly rate, and certifications. Add a photo and introduction video to stand out.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Get Verified</h3>
                <p>Our team reviews your application within 24-48 hours. Once approved, your profile goes live in the teacher directory for students to discover.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Set Your Availability</h3>
                <p>Define your weekly teaching schedule. Create class packages - single sessions, weekly bundles, or monthly subscriptions - with your preferred pricing.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Start Teaching</h3>
                <p>Students book and pay through our platform. Conduct classes via Jitsi Meet video. After each session, receive your earnings and grow your student base.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-subjects">
          <div className="teach-container">
            <h2>What You Can Teach</h2>
            <div className="subjects-grid">
              <div className="subject-card">
                <h3>Tajweed</h3>
                <p>Teach the rules of proper Quran recitation, including pronunciation, elongation, and articulation points.</p>
              </div>
              <div className="subject-card">
                <h3>Hifz (Memorization)</h3>
                <p>Guide students in memorizing the Holy Quran, from short surahs to complete memorization.</p>
              </div>
              <div className="subject-card">
                <h3>Tafsir</h3>
                <p>Explain the meanings, context, and interpretations of Quranic verses for deeper understanding.</p>
              </div>
              <div className="subject-card">
                <h3>Arabic Language</h3>
                <p>Teach Quranic Arabic, vocabulary, grammar, and help students read Arabic fluently.</p>
              </div>
              <div className="subject-card">
                <h3>Noorani Qaida</h3>
                <p>Help beginners learn Arabic letters, pronunciation basics, and foundational reading skills.</p>
              </div>
              <div className="subject-card">
                <h3>Islamic Studies</h3>
                <p>Teach broader Islamic knowledge including Hadith, Fiqh, Seerah, and Islamic history.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-earnings">
          <div className="teach-container">
            <h2>Your Earning Potential</h2>
            <div className="earnings-content">
              <div className="earnings-calculator">
                <h3>Sample Monthly Earnings</h3>
                <div className="earning-example">
                  <div className="example-row">
                    <span>Hourly Rate:</span>
                    <strong>$25/hour</strong>
                  </div>
                  <div className="example-row">
                    <span>Hours Per Week:</span>
                    <strong>15 hours</strong>
                  </div>
                  <div className="example-row">
                    <span>Gross Monthly:</span>
                    <strong>$1,500</strong>
                  </div>
                  <div className="example-row highlight">
                    <span>Your Earnings (80%):</span>
                    <strong>$1,200/month</strong>
                  </div>
                </div>
              </div>
              <div className="earnings-info">
                <h3>Maximize Your Income</h3>
                <ul>
                  <li>Set competitive rates based on your experience and certifications</li>
                  <li>Offer package deals to encourage regular bookings</li>
                  <li>Teach during peak hours when demand is highest</li>
                  <li>Build a base of recurring students for stable income</li>
                  <li>Earn bonuses and featured placement as a top-rated teacher</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-tools">
          <div className="teach-container">
            <h2>Teaching Tools & Features</h2>
            <div className="tools-grid">
              <div className="tool-item">
                <h3>Video Conferencing</h3>
                <p>Built-in Jitsi Meet integration for seamless HD video classes with screen sharing capability.</p>
              </div>
              <div className="tool-item">
                <h3>Teacher Dashboard</h3>
                <p>Manage bookings, view upcoming classes, track earnings, and communicate with students all in one place.</p>
              </div>
              <div className="tool-item">
                <h3>Secure Payments</h3>
                <p>Stripe-powered payment processing ensures you get paid safely and on time, every time.</p>
              </div>
              <div className="tool-item">
                <h3>Student Messaging</h3>
                <p>In-app messaging system to communicate with students, discuss schedules, and provide feedback.</p>
              </div>
              <div className="tool-item">
                <h3>Availability Calendar</h3>
                <p>Easy-to-use calendar to set and update your teaching availability throughout the week.</p>
              </div>
              <div className="tool-item">
                <h3>Class Packages</h3>
                <p>Create custom packages - single classes, weekly sessions, or monthly subscriptions at discounted rates.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-requirements">
          <div className="teach-container">
            <h2>Requirements to Teach</h2>
            <div className="requirements-content">
              <div className="requirements-list">
                <div className="requirement-item required">
                  <h4>Required</h4>
                  <ul>
                    <li>Proficiency in Quran recitation with Tajweed</li>
                    <li>Reliable internet connection</li>
                    <li>Computer/tablet with webcam and microphone</li>
                    <li>Quiet, professional teaching environment</li>
                    <li>Commitment to scheduled classes</li>
                  </ul>
                </div>
                <div className="requirement-item preferred">
                  <h4>Preferred</h4>
                  <ul>
                    <li>Ijazah or formal Quran certification</li>
                    <li>Prior teaching experience (online or in-person)</li>
                    <li>Fluency in multiple languages</li>
                    <li>Background in Islamic studies</li>
                    <li>Degree in Arabic or Quranic sciences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-testimonials">
          <div className="teach-container">
            <h2>What Our Teachers Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"QuranDeen has transformed my teaching career. I now teach students from 5 different countries while working from home. The platform is easy to use and payments are always on time."</p>
                </div>
                <div className="testimonial-author">
                  <strong>Sheikh Ahmad</strong>
                  <span>Tajweed & Hifz Teacher - Egypt</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"As a female teacher, I appreciate the flexibility and safety of teaching online. I can manage my family responsibilities while still contributing to Quran education worldwide."</p>
                </div>
                <div className="testimonial-author">
                  <strong>Ustazah Fatima</strong>
                  <span>Noorani Qaida Specialist - Malaysia</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"The booking and payment system is seamless. I focus on teaching while QuranDeen handles everything else. My student base has grown significantly since joining."</p>
                </div>
                <div className="testimonial-author">
                  <strong>Hafiz Bilal</strong>
                  <span>Quran Memorization Teacher - Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-stats">
          <div className="teach-container">
            <h2>Join Our Growing Community</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Teachers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Students Worldwide</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Countries Reached</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Classes Completed</div>
              </div>
            </div>
          </div>
        </section>

        <section className="teach-section teach-faqs">
          <div className="teach-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faqs-list">
              {faqs.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">{faq.question}</summary>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="teach-section teach-cta-final">
          <div className="teach-container">
            <h2>Ready to Share Your Knowledge?</h2>
            <p>Join hundreds of teachers already making an impact on QuranDeen. Start your teaching journey today and help students connect with the Holy Quran.</p>
            <Link to="/become-teacher" className="btn btn-primary btn-large">
              Apply Now - It's Free
            </Link>
            <p className="cta-note">No fees to join. Start earning within days of approval.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeachWithUs;
