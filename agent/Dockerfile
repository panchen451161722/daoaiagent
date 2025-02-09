# Use ARG for platform specification
ARG TARGETPLATFORM
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

# Copy poetry files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not create virtual environment (we're in container)
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --only=main --no-interaction --no-ansi

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Use python -m to run uvicorn instead of direct execution
CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"] 