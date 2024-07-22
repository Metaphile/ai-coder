FROM node:latest

RUN apt-get update && \
    apt-get install -y git jq man-db && \
    apt-get clean

RUN useradd --create-home --shell /bin/bash planner-agent
RUN useradd --create-home --shell /bin/bash coder-agent

USER coder-agent
RUN mkdir -p /home/coder-agent/project
# read-only for other users
RUN chmod -R 755 /home/coder-agent

WORKDIR /home/coder-agent/project

VOLUME ["/home/coder-agent"]
