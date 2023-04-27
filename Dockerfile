FROM node:16

# Arguments
ARG port
ARG jwt_secret

# Environment variables
ENV PORT=$port
ENV JWT_SECRET=$jwt_secret

# Create app directory and set it as the working directory
WORKDIR /app
COPY . .

# Install app dependencies
RUN npm i

# Build the app
RUN npm run build

# Expose the port
EXPOSE $PORT

# Run the app
CMD ["npm", "start"]