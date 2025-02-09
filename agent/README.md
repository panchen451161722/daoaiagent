# DAO Agent

## Overview

This is a simple agent that can be used to manage a DAO. It is built using the LangGraph library.

## Installation

```bash
# Install poetry
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install
```

## Local Usage

```bash
cp example.env .env
# Fill in the .env file with your own secrets

poetry run python main.py
```

## Docker Server

### Build and Run

```bash
# Build and start the server
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

### Environment Variables

Make sure to set variables in your `.env` file, follow `example.env` for reference.

```bash
cp example.env .env
```

### API Usage

Test the health check endpoint:
```bash
curl http://localhost:8000/health
```

Submit a proposal in `proposal.json` for review:
```bash
curl -X POST http://localhost:8000/invoke \
  -H "Content-Type: application/json" \
  -d '@input.json' | tee >(jq > output.json)
```

```bash
curl -X POST https://autonome.alt.technology/daov1-lggwuj/invoke \
  -H "Content-Type: application/json" \
  -d '@input.json' | tee >(jq > output.json)
```

The response will be saved to `output.json`.

## Publish to Docker Hub

```bash
docker login
# Specify for linux/amd64 platform
docker build --platform linux/amd64 -t backdoor705/daoagent:latest .
docker push backdoor705/daoagent:latest
```