# Use an official Node.js image as the base image
FROM node:latest

# Install necessary tools
RUN apt-get update && \
    apt-get install -y git jq man-db && \
    apt-get clean

# Create app directory
WORKDIR /sandbox

# Define the volume
VOLUME ["/sandbox"]

# TODO do we need this?
CMD ["sh"]
