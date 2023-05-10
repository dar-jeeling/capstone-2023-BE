# Use an official Node runtime as the base image
FROM node:18.12.1

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml for pnpm) into the directory
COPY package.json pnpm-lock.yaml ./

# Install any needed packages specified in package.json
RUN curl -f https://get.pnpm.io/v6.js | node - add --global pnpm
RUN pnpm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run npm run start when the container launches
CMD ["pnpm", "run", "start"]

# Install Python3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install OpenCV
RUN apt-get update && apt-get install -y libsm6 libxext6 libxrender-dev
RUN pip install opencv-python

# libGL
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y