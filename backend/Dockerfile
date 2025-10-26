
FROM node:20-alpine AS builder

WORKDIR /home/app

COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Now only thi is part will be in the final image
FROM node:20-alpine

WORKDIR /home/app

# Install only netcat-openbsd (Alpine version, much lighter) to run the script
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./

# Install only production dependencies no extra packages
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma client from builder just to run the
# there are two prisma :
# Part 1: prisma package (The Tool/Generator): What it does: Reads your schema.prisma file and generates JavaScript code
# Part 2: @prisma/client + Generated Code (The Output) : What it is: JavaScript code that was created by the Prisma tool which is required so we copy that only to reduce the size
COPY --from=builder /home/app/generated ./generated

# Copy application code
COPY . .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/home/app/entrypoint.sh"]

CMD ["npm", "start"]