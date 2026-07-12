"use client";

import { useEffect, useActionState, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, UploadCloud } from "lucide-react";

import type { Product } from "@/lib/types";
import { saveProductAction, uploadImageAction } from "@/app/admin/actions";

type ImageItem = { src: string; alt: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveProductAction, {
    ok: false,
    message: "",
  });

  const [id] = useState(() => product?.id ?? crypto.randomUUID());
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [images, setImages] = useState<ImageItem[]>(product?.images ?? []);
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    setSlugTouched(true);
  }

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    event.target.value = "";
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    try {
      const added: ImageItem[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadImageAction(fd);
        if (res.error) {
          setUploadError(res.error);
          continue;
        }
        if (res.url) {
          added.push({ src: res.url, alt: file.name || "Product image" });
        }
      }
      if (added.length) {
        setImages((prev) => [...prev, ...added]);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function addManualUrl() {
    const url = manualUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, { src: url, alt: url }]);
    setManualUrl("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="admin-card">
      <h3>{product ? `Edit: ${product.name}` : "Add new product"}</h3>

      <form action={formAction} className="admin-stack">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />

        <div className="admin-grid-two">
          <div className="field">
            <label>Name</label>
            <input
              name="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Product name"
              required
            />
          </div>
          <div className="field">
            <label>Slug</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="product-slug"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={4}
            placeholder="Short product description"
            required
          />
        </div>

        <div className="admin-grid-two">
          <div className="field">
            <label>Price (₹)</label>
            <input
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.price ?? ""}
              placeholder="495"
              required
            />
          </div>
          <div className="field">
            <label>MRP (₹)</label>
            <input
              name="mrp"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.mrp ?? ""}
              placeholder="799"
              required
            />
          </div>
        </div>

        <div className="admin-grid-two">
          <div className="field">
            <label>Discount % (0-100)</label>
            <input
              name="discountPercent"
              type="number"
              min={0}
              max={100}
              step={1}
              defaultValue={product?.discountPercent ?? 0}
              placeholder="0"
              required
            />
          </div>
          <div className="field">
            <label>Category (optional)</label>
            <input
              name="category"
              defaultValue={product?.category ?? ""}
              placeholder="face wash"
            />
          </div>
        </div>

        <label className="admin-check" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
          <span>Active (visible on store)</span>
        </label>

        <div className="field">
          <label>Images (at least one)</label>
          <div className="admin-images" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="admin-image-row"
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="admin-thumb"
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                />
                <span className="admin-image-src" style={{ flex: 1, fontSize: 12, wordBreak: "break-all" }}>
                  {image.src}
                </span>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "8px 12px" }}
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </button>
              </div>
            ))}
            {images.length === 0 ? (
              <p className="desc">No images yet — upload or paste a URL below.</p>
            ) : null}
          </div>

          <div
            className="admin-upload-row"
            style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "10px" }}
          >
            <label className="btn btn-outline" style={{ cursor: "pointer" }}>
              <UploadCloud className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFiles}
                disabled={uploading}
              />
            </label>
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://... or /public-image.webp"
              style={{ flex: 1, minWidth: 200 }}
            />
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "8px 12px" }}
              onClick={addManualUrl}
            >
              <Plus className="h-4 w-4" />
              <span>Add URL</span>
            </button>
          </div>
          {uploading ? (
            <p className="desc">
              <Loader2 className="h-4 w-4" style={{ display: "inline-block", marginRight: 6 }} />
              Uploading...
            </p>
          ) : null}
          {uploadError ? <p className="desc" style={{ color: "#b3261e" }}>{uploadError}</p> : null}
          {images.length === 0 ? (
            <p className="desc" style={{ color: "#b3261e" }}>
              Add at least one image before saving.
            </p>
          ) : null}
        </div>

        {state.message ? (
          <p className="desc" style={{ color: state.ok ? "#1a7f37" : "#b3261e" }}>
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending || uploading || images.length === 0}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>{product ? "Save changes" : "Create product"}</span>
        </button>
      </form>
    </div>
  );
}
