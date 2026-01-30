To run the Web:
1 npm install
2 env. :
-DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/linkshare?schema=public"
-NEXTAUTH_SECRET="your_secret_key_here"
-NEXTAUTH_URL="http://localhost:3000"

3 npx prisma migrate dev
4 npx prisma db seed
5 npm run dev


DB Query:
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar TEXT,
    createdat TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Link" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    "order" INT DEFAULT 0,
    userid UUID NOT NULL,
    createdat TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


















This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
