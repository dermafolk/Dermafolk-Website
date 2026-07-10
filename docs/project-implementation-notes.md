# DermaFolk Implementation Notes

## Admin Dashboard Reference

The DermaFolk admin page should follow the look and structure of this reference:

https://github.com/shriramsetu/ram-setu/tree/main/src/pages/admin

Use this as the visual and layout reference when implementing the admin dashboard.

## Environment Files

- `.env` is present and must not be modified unless explicitly requested.
- `.env.example` is present and may be used only as a reference for required environment variables.

The available environment variable groups from `.env.example` are:

- Supabase
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SECRET_KEY`
- Cloudinary
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

## Current Instruction

For now, this information is only being documented. No admin page implementation, environment changes, or credential changes should be made from this note alone.
