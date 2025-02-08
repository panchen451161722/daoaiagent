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

Make sure to set these variables in your `.env` file:
```bash
MODEL=your_model_name
BASE_URL=your_base_url
OPENAI_API_KEY=your_api_key
LANGCHAIN_TRACING_V2=true_or_false
LANGCHAIN_ENDPOINT=your_langchain_endpoint
LANGCHAIN_API_KEY=your_langchain_api_key
LANGCHAIN_PROJECT=your_project_name
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
  -d '@proposal.json' | tee >(jq > final_state.json)
```

The response will be saved to `final_state.json`.