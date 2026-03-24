
Upload ONLY this project to GitHub and deploy it to Vercel.
Do not upload the full Next.js project.

After Vercel deploys, edit auth-config.js and replace REPLACE-WITH-YOUR-VERCEL-DOMAIN
with your actual Vercel domain, then upload auth-config.js to your main site.

Test URLs:
1) https://YOUR-VERCEL-DOMAIN/api/access  -> should return method_not_allowed on GET
2) main site login should call the Vercel URL from auth-config.js
