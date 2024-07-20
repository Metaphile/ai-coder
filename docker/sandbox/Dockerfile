FROM node:latest

RUN apt-get update && \
    apt-get install -y git jq man-db && \
    apt-get clean

RUN useradd --create-home --shell /bin/bash agentuser

USER agentuser

WORKDIR /home/agentuser

VOLUME ["/home/agentuser"]
