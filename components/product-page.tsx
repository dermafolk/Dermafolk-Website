"use client";

import { type HTMLAttributes, type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { fallbackProducts } from "@/lib/data";
import { resolveMediaUrl } from "@/lib/media";
import { SiteShell } from "@/components/site-shell";

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

type DetailItem = {
  title: string;
  content: ReactNode;
};

const product = fallbackProducts[0];
const galleryImages: GalleryImage[] = product.images.map((image, index) => ({
  src: image.src,
  alt: image.alt,
  label: index === 0 ? "View product photo" : index === 1 ? "View lifestyle photo" : "View styled photo",
}));

const details: DetailItem[] = [
  {
    title: "Description",
    content:
      "Dermafolk Renewal Serum is a single fragrance-free formula built at clinical actives concentration - glutathione, niacinamide, glycerin, mandelic acid and aloe vera - designed to brighten tone, support the skin barrier and gently resurface texture in one honest step, without a ten-step routine.",
  },
  {
    title: "How to Use",
    content: (
      <ul>
        <li><b>AM:</b> Smooth 2-3 drops between fingertips and press into cleansed skin before sunscreen.</li>
        <li><b>PM:</b> Apply as your last step - no need to seal with anything else on top.</li>
        <li><b>3 weeks in:</b> Most people notice brighter, more even tone by the end of the first bottle.</li>
      </ul>
    ),
  },
  {
    title: "Full Ingredient List",
    content:
      "Aqua, Glycerin, Niacinamide (3%), Glutathione (2%), Mandelic Acid (1%), Aloe Barbadensis Leaf Juice (1%), Pentylene Glycol, Xanthan Gum, Sodium Hyaluronate, Panthenol, Tocopherol, Citric Acid, Sodium Benzoate, Potassium Sorbate. Free from parabens, sulfates, synthetic fragrance, mineral oil and silicones.",
  },
  {
    title: "Shipping & Returns",
    content:
      "Free, tracked and insured shipping across every serviceable pin code in India. Covered by a 45-day guarantee - if you don't see a difference, we'll refund your first bottle, no questions asked.",
  },
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
      <span className="mrp">₹{product.mrp}</span>
      <span className="price">₹{product.price}</span>
      <span className="off">{product.discountPercent}% OFF</span>
    </div>
  );
}

function Stars() {
  return (
    <div className="stars">
      <MaterialIcon>star</MaterialIcon>
      <MaterialIcon>star</MaterialIcon>
      <MaterialIcon>star</MaterialIcon>
      <MaterialIcon>star</MaterialIcon>
      <MaterialIcon>star_half</MaterialIcon>
    </div>
  );
}

export function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openDetail, setOpenDetail] = useState(0);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [added]);

  const totalPrice = quantity * product.price;

  return (
    <SiteShell>
      <div className="wrap">
        <div className="breadcrumb">
          <a href="/">Home</a><span className="sep">/</span><span className="current">Renewal Serum</span>
        </div>
      </div>

      <section id="buy-panel" style={{ paddingBottom: "clamp(60px,10vw,100px)" }}>
        <div className="wrap pdp-grid">
          <div className="pdp-gallery">
            <div className="pdp-main-image">
              <img src={resolveMediaUrl(selectedImage.src)} alt={selectedImage.alt} />
            </div>
            <div className="pdp-thumbs">
              {galleryImages.map((image) => (
                <button
                  className={`pdp-thumb ${selectedImage.src === image.src ? "active" : ""}`}
                  key={image.src}
                  onClick={() => setSelectedImage(image)}
                  type="button"
                  aria-label={image.label}
                >
                  <img src={resolveMediaUrl(image.src)} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-info">
            <div className="kicker">The Serum</div>
            <h1>{product.name}</h1>
            <div className="pdp-rating">
              <Stars />
              <span>4.8 · 9,800 reviews</span>
            </div>
            <PriceLine />
            <p className="desc">{product.description}</p>
            <ul className="product-facts">
              <li><MaterialIcon>science</MaterialIcon> 5 active ingredients, clinically dosed</li>
              <li><MaterialIcon>water_drop</MaterialIcon> 120ml - lasts 20 to 24 weeks</li>
              <li><MaterialIcon>verified</MaterialIcon> Dermatologist tested, fragrance-free</li>
              <li><MaterialIcon>recycling</MaterialIcon> Refillable glass bottle</li>
            </ul>
            <div className="qty-row">
              <div className="qty-stepper">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(10, value + 1))}>
                  +
                </button>
              </div>
              <div className="product-actions">
                <Button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => {
                    addItem(product, quantity);
                    setAdded(true);
                  }}
                >
                  {added ? "Added ✓" : "Add to Bag"}
                </Button>
                <Button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    addItem(product, quantity);
                    router.push("/checkout");
                  }}
                >
                  Buy Now - ₹{totalPrice}
                </Button>
              </div>
            </div>
            <div className="pdp-trust-row">
              <div><MaterialIcon>local_shipping</MaterialIcon> Free pan-India delivery</div>
              <div><MaterialIcon>verified_user</MaterialIcon> 45-day guarantee</div>
              <div><MaterialIcon>encrypted</MaterialIcon> Secure checkout</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="details" style={{ background: "var(--bg-alt)" }}>
        <div className="wrap">
          <div className="kicker">Details</div>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)" }}>Everything you&apos;d ask before buying.</h2>
          <div className="details-list">
            {details.map((detail, index) => {
              const isOpen = openDetail === index;
              return (
                <div className={`details-item ${isOpen ? "open" : ""}`} key={detail.title}>
                  <button className="details-q" type="button" onClick={() => setOpenDetail(isOpen ? -1 : index)}>
                    {detail.title} <MaterialIcon>add</MaterialIcon>
                  </button>
                  <div className="details-a" style={{ maxHeight: isOpen ? "340px" : undefined }}>
                    {typeof detail.content === "string" ? <p>{detail.content}</p> : detail.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
