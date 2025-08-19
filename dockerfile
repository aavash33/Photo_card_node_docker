FROM node:16

# Set working directory
WORKDIR /app

# Copy package files for backend
COPY ./backend_form/package*.json ./backend_form/

# Install dependencies
WORKDIR /app/backend_form
RUN npm install

# Copy all application files
WORKDIR /app
COPY . .

# Set working directory back to backend_form for starting the server
WORKDIR /app/backend_form
EXPOSE 3000

CMD ["node", "index.js"]