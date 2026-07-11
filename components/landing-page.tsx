"use client";

import { type HTMLAttributes, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { type HomepageSection } from "@/lib/types";
import { SiteShell } from "@/components/site-shell";

type Review = {
  name: string;
  city: string;
  text: string;
  rating: number;
};

const reviewsSeed: Review[] = [
  { name: "Priya M.", city: "Mumbai", text: "I stopped using four other products in the same week. My skin tone looks so much more even.", rating: 5 },
  { name: "Denise K.", city: "Bengaluru", text: "The texture is what sold me - it disappears in seconds and my makeup sits better on top.", rating: 5 },
  { name: "Sana R.", city: "Delhi", text: "Sensitive skin, zero reaction, and visibly less redness around my nose by week three.", rating: 5 },
  { name: "Neha S.", city: "Pune", text: "Finally a serum that doesn't clog my pores. Two months in and my texture is so much smoother.", rating: 5 },
  { name: "Ritu A.", city: "Hyderabad", text: "Gentle enough for daily use and I've genuinely stopped reaching for concealer as often.", rating: 4.5 },
  { name: "Kavya N.", city: "Kochi", text: "Delivery was quick even to my hometown, and the packaging felt premium straight out of the box.", rating: 5 },
];

const topBadges = [
  ["verified", "Dermatologist Tested"],
  ["pets", "Cruelty-Free"],
  ["eco", "100% Vegan Formula"],
  ["recycling", "Refillable Glass Bottle"],
];

const ingredients = [
  { icon: "brightness_5", title: "Glutathione", body: "An antioxidant that helps fade dullness and even out visible tone.", pct: "2% CONCENTRATION" },
  { icon: "spa", title: "Niacinamide", body: "Supports the skin barrier while calming redness and refining pores.", pct: "3% CONCENTRATION" },
  { icon: "water_drop", title: "Glycerin", body: "A humectant that draws moisture in and keeps skin comfortable all day.", pct: "3% CONCENTRATION" },
  { icon: "auto_awesome", title: "Mandelic Acid", body: "A gentle, larger-molecule AHA that resurfaces texture without irritation.", pct: "1% CONCENTRATION" },
  { icon: "eco", title: "Aloe Vera", body: "Soothes on contact and softens the formula's finish on sensitive skin.", pct: "1% CONCENTRATION" },
];

const faqs = [
  {
    question: "Can Dermafolk really replace my whole routine?",
    answer:
      "For most people, yes - Dermafolk is dosed to cover hydration, brightening and gentle exfoliation in one step. If you use a targeted treatment like retinol or a prescription, keep that and layer Dermafolk underneath as your daily serum.",
  },
  { question: "Is it suitable for sensitive skin?", answer: "Yes. The formula is fragrance-free and uses a gentle, larger-molecule AHA, so it was designed with sensitive and reactive skin types in mind." },
  { question: "Do you deliver across India?", answer: "Yes - we ship pan India to every serviceable pin code, with tracked and insured delivery on every order." },
  { question: "What if it doesn't work for my skin?", answer: "You're covered by our 45-day guarantee - if you don't see a difference, we'll refund your first bottle, no questions asked." },
];

function MaterialIcon({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: string }) {
  return (
    <span className={`msi ${className}`} {...props}>
      {children}
    </span>
  );
}

function PriceLine() {
  return (
    <div className="price-line">
      <span className="mrp">₹799</span>
      <span className="price">₹495</span>
      <span className="off">38% OFF</span>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const icon = rating >= value ? "star" : rating > index ? "star_half" : "star_outline";
        return <MaterialIcon key={value}>{icon}</MaterialIcon>;
      })}
    </div>
  );
}

function TrustIcons() {
  return (
    <section className="trust-strip">
      <div className="trust-grid">
        <div className="trust-card">
          <svg className="trust-icon" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 4 L46 12 V26 C46 37 37 45 26 48 C15 45 6 37 6 26 V12 Z" fill="none" stroke="#E4CFA6" strokeWidth="2.4" strokeLinejoin="round" />
            <rect x="15" y="24" width="16" height="11" rx="1.5" fill="#E4CFA6" />
            <path d="M31 27 H37 L40 30 V35 H31 Z" fill="none" stroke="#E4CFA6" strokeWidth="2" />
            <circle cx="20" cy="36" r="2.2" fill="#2A2420" />
            <circle cx="35" cy="36" r="2.2" fill="#2A2420" />
          </svg>
          <div><h4>Secure Delivery</h4></div>
        </div>
        <div className="trust-card">
          <svg className="trust-icon" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 6 C34 6 40 13 40 21 C40 32 26 46 26 46 C26 46 12 32 12 21 C12 13 18 6 26 6 Z" fill="none" stroke="#E4CFA6" strokeWidth="2.4" strokeLinejoin="round" />
            <circle cx="26" cy="21" r="7" fill="#E4CFA6" />
            <path d="M26 21 L22 15 M26 21 L31 16 M26 21 L21 25" stroke="#2A2420" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div><h4>Pan India Delivery</h4></div>
        </div>
        <div className="trust-card">
          <svg className="trust-icon" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <rect x="7" y="14" width="38" height="26" rx="3" fill="none" stroke="#E4CFA6" strokeWidth="2.4" />
            <rect x="7" y="20" width="38" height="5" fill="#E4CFA6" />
            <rect x="13" y="31" width="10" height="4" rx="1" fill="#E4CFA6" />
            <rect x="24" y="8" width="14" height="14" rx="3" fill="#2A2420" stroke="#E4CFA6" strokeWidth="2" />
            <path d="M28 15 L30.5 17.5 L35 12.5" stroke="#E4CFA6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div><h4>Secure Payment</h4></div>
        </div>
      </div>
    </section>
  );
}

function ReviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [reviewForm, setReviewForm] = useState({ name: "", city: "", text: "" });
  const [reviews, setReviews] = useState<Review[]>(reviewsSeed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(window.innerWidth > 900 ? 3 : 1);
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, reviews.length - visibleCount);
  const slidePercent = 100 / visibleCount;

  useEffect(() => {
    setCurrentIndex((value) => Math.min(value, maxIndex));
  }, [maxIndex]);

  const addReview = () => {
    const nextReview: Review = {
      name: reviewForm.name.trim() || "Anonymous",
      city: reviewForm.city.trim() || "India",
      text: reviewForm.text.trim() || "Loved the results!",
      rating,
    };

    setReviews((items) => [...items, nextReview]);
    setCurrentIndex(Math.max(0, reviews.length + 1 - visibleCount));
    setReviewForm({ name: "", city: "", text: "" });
    setRating(5);
    onClose();
  };

  const moveCarousel = (direction: "prev" | "next") => {
    setCurrentIndex((value) => {
      if (direction === "prev") return Math.max(0, value - 1);
      return Math.min(maxIndex, value + 1);
    });
  };

  return (
    <div
      className={`modal-overlay ${open ? "active" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <MaterialIcon>close</MaterialIcon>
        </button>
        <h3 style={{ marginBottom: "24px" }}>Write a Review</h3>
        <div className="field">
          <label>Your rating</label>
          <div className="star-select">
            {[1, 2, 3, 4, 5].map((value) => (
              <MaterialIcon key={value} className={value <= rating ? "filled" : ""} onClick={() => setRating(value)}>
                star
              </MaterialIcon>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Your name</label>
          <input type="text" placeholder="e.g. Aditi P." value={reviewForm.name} onChange={(event) => setReviewForm((form) => ({ ...form, name: event.target.value }))} />
        </div>
        <div className="field">
          <label>City</label>
          <input type="text" placeholder="e.g. Jaipur" value={reviewForm.city} onChange={(event) => setReviewForm((form) => ({ ...form, city: event.target.value }))} />
        </div>
        <div className="field">
          <label>Your review</label>
          <textarea rows={4} placeholder="Tell us how Dermafolk worked for you..." value={reviewForm.text} onChange={(event) => setReviewForm((form) => ({ ...form, text: event.target.value }))} />
        </div>
        <Button className="btn btn-primary modal-submit" onClick={addReview}>Submit Review</Button>

        <div className="carousel" style={{ marginTop: "30px" }}>
          <Button className="car-arrow" aria-label="Previous reviews" onClick={() => moveCarousel("prev")} disabled={currentIndex <= 0}>
            <MaterialIcon>chevron_left</MaterialIcon>
          </Button>
          <div className="car-viewport">
            <div
              className="car-track"
              style={{ transform: `translateX(-${currentIndex * slidePercent}%)` }}
              onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
              onTouchEnd={(event) => {
                const diff = touchStartX - event.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  moveCarousel(diff > 0 ? "next" : "prev");
                }
              }}
            >
              {reviews.map((review, index) => (
                <div key={`${review.name}-${review.city}-${index}`} className="review-slide" style={{ flexBasis: `${slidePercent}%`, maxWidth: `${slidePercent}%` }}>
                  <div className="testi-card">
                    <Stars rating={review.rating} />
                    <p>&quot;{review.text}&quot;</p>
                    <div className="testi-top" style={{ marginTop: "20px", marginBottom: 0 }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--mauve-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "var(--clay-dark)" }}>
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="testi-name">{review.name}</div>
                        <div className="testi-loc">Verified buyer, {review.city}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button className="car-arrow" aria-label="Next reviews" onClick={() => moveCarousel("next")} disabled={currentIndex >= maxIndex}>
            <MaterialIcon>chevron_right</MaterialIcon>
          </Button>
        </div>
      </div>
    </div>
  );
}

const heroTitleFallback = "Brighter, calmer skin in one honest step.";
const heroBodyFallback =
  "Glutathione, niacinamide and mandelic acid, in a single fragrance-free serum built to even tone and soften texture - without the ten-step routine.";

export function LandingPage({ hero }: { hero?: HomepageSection }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroTitle = hero?.title || heroTitleFallback;
  const heroBody = hero?.body || heroBodyFallback;

  return (
    <SiteShell>
      <section className="hero-banner">
        <img src="/banner-image.webp" alt="Dermafolk product bottle styled with plant shadows and aloe vera" />
        <div className="content">
          <div className="kicker">Dermafolk - One Bottle Renewal</div>
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <PriceLine />
          <div className="hero-actions">
            <Button asChild className="btn btn-primary">
              <a href="#buy">Buy Now - ₹495</a>
            </Button>
            <Button asChild className="btn btn-outline on-dark">
              <a href="/shop">View Product</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="top-badges">
        <div className="wrap">
          <div className="top-badges-grid">
            {topBadges.map(([icon, label]) => (
              <div className="top-badge" key={label}>
                <MaterialIcon>{icon}</MaterialIcon>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section section-pad" id="product">
        <div className="wrap product-grid">
          <div className="product-visual">
            <img src="/product-image.webp" alt="Dermafolk product bottle on a stone tray with a folded towel and aloe vera" />
            <div className="price-tag">
              <span className="mrp">₹799</span>
              <span className="amt">₹495</span>
              <span className="txt">38% OFF</span>
            </div>
          </div>
          <div className="product-info">
            <div className="kicker">The Product</div>
            <h2>Dermafolk Renewal Serum</h2>
            <p className="desc">A single fragrance-free serum formulated at clinical concentrations - built to brighten, hydrate and gently resurface, so it's the only step your skin actually asks for.</p>
            <PriceLine />
            <ul className="product-facts">
              <li><MaterialIcon>science</MaterialIcon> 5 active ingredients, clinically dosed</li>
              <li><MaterialIcon>water_drop</MaterialIcon> 120ml - lasts 20 to 24 weeks</li>
              <li><MaterialIcon>verified</MaterialIcon> Dermatologist tested, fragrance-free</li>
              <li><MaterialIcon>recycling</MaterialIcon> Refillable glass bottle</li>
            </ul>
            <div className="product-actions">
              <Button asChild className="btn btn-outline">
                <a href="/shop">View Now</a>
              </Button>
              <Button asChild className="btn btn-primary">
                <a href="#buy">Buy Now - ₹495</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustIcons />

      <section className="split" id="about">
        <div className="wrap split-grid">
          <div className="img-col">
            <img src="/product-image.webp" alt="Dermafolk product bottle on a stone tray with a folded towel and aloe vera" />
          </div>
          <div className="text-col">
            <div className="inner">
              <div className="kicker">The Problem</div>
              <h2>Your skin doesn&apos;t need eleven products. It needs one, done properly.</h2>
              <p>Serums, essences, oils, spot treatments - most routines layer actives that were never designed to work together, leaving skin irritated instead of renewed.</p>
              <p>Dermafolk was built backwards from the goal: one formula, correctly dosed, that does the job of a full shelf.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="formula">
        <div className="wrap">
          <div className="kicker">What&apos;s Inside</div>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)", maxWidth: "600px" }}>Five actives. Nothing riding along for the label.</h2>
          <div className="ing-grid">
            {ingredients.map((ingredient) => (
              <div className="ing-card" key={ingredient.title}>
                <div className="ing-icon"><MaterialIcon>{ingredient.icon}</MaterialIcon></div>
                <h3>{ingredient.title}</h3>
                <p>{ingredient.body}</p>
                <span className="pct">{ingredient.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ritual section-pad" id="ritual">
        <div className="wrap ritual-grid">
          <div>
            <div className="kicker">The Ritual</div>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)" }}>Two minutes. Twice a day.</h2>
            <div className="ritual-step">
              <div className="tag">AM</div>
              <div><h4>Press, don&apos;t rub</h4><p>Smooth 2-3 drops between fingertips and press into cleansed skin before sunscreen.</p></div>
            </div>
            <div className="ritual-step">
              <div className="tag">PM</div>
              <div><h4>Let it work overnight</h4><p>Apply as your last step - no need to seal with anything else on top.</p></div>
            </div>
            <div className="ritual-step">
              <div className="tag">3wk</div>
              <div><h4>Track the change</h4><p>Most people notice brighter, more even tone by the end of the first bottle.</p></div>
            </div>
          </div>
          <div className="ritual-img">
            <img src="/lady-using-product.webp" alt="Woman applying Dermafolk serum during her morning routine" />
          </div>
        </div>
      </section>

      <section className="section-pad" id="reviews" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div className="reviews-head">
            <div className="kicker">Reviews</div>
            <h2>9,800 people put one bottle to the test.</h2>
            <Button className="btn btn-outline" onClick={() => setReviewOpen(true)}>
              <MaterialIcon className="!text-[18px]">rate_review</MaterialIcon> Write a Review
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad" id="faq">
        <div className="wrap">
          <div className="kicker">Questions</div>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)" }}>Before you buy.</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={faq.question}>
                <button className="faq-q" type="button" onClick={() => setOpenFaq(isOpen ? null : index)}>
                  {faq.question} <MaterialIcon>add</MaterialIcon>
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? "260px" : undefined }}>
                  <p>{faq.answer}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="final-cta" id="buy">
        <div className="wrap">
          <div className="content">
            <div className="kicker">Try It Risk-Free</div>
            <h2>45 days to fall in love with one bottle.</h2>
            <p>Free pan-India shipping on every order, and a full refund if it isn&apos;t the last serum you ever buy.</p>
            <PriceLine />
            <Button asChild className="btn btn-primary">
              <a href="/shop">Buy Now - ₹495</a>
            </Button>
          </div>
        </div>
      </section>

      <ReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </SiteShell>
  );
}
