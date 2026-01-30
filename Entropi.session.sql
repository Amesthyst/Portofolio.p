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
