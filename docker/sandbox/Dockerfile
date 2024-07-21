FROM node:latest

RUN apt-get update && \
    apt-get install -y git jq man-db && \
    apt-get clean

RUN useradd --create-home --shell /bin/bash agentuser

USER agentuser

RUN mkdir -p /home/agentuser/project

WORKDIR /home/agentuser/project

VOLUME ["/home/agentuser"]
