// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Scroll progress bar
const progress = document.getElementById('progress');
const updateProgress = () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progress.style.width = pct + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Dates
const today = new Date();
const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const expiry = new Date(today);
expiry.setDate(expiry.getDate() + 7);
const proposalEl = document.getElementById('proposalDate');
const expiryEl = document.getElementById('expiryDate');
if (proposalEl) proposalEl.textContent = fmt(today);
if (expiryEl) expiryEl.textContent = fmt(expiry);
