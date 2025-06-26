FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app for production
RUN node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built app from the builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
