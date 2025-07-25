# Use Node.js LTS as base image
FROM node:18.20.7

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production


# Copy the rest of the application
COPY . .


# Set environment variables
ENV NODE_ENV=production
ENV GCLOUD_PROJECT_ID=mathongo-assignment-466918
ENV DATABASE_ID=mathongo
ARG GOOGLE_APPLICATION_CREDENTIALS
ENV GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS

# Expose the port that your application listens on
EXPOSE 8080


# Start the application
CMD ["node", "index.js"]