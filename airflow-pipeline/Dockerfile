FROM apache/airflow:2.10.2

USER root

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget unzip build-essential libsndfile1 libopenmpi-dev \
    libnss3 libgconf-2-4 libxi6 libgbm1 libxrandr2 \
    libasound2 libatk1.0-0 libpangocairo-1.0-0 \
    libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxfixes3 libpangoft2-1.0-0 \
    ca-certificates fonts-liberation \
    libappindicator3-1 xdg-utils curl gnupg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Switch back to airflow user
USER airflow

# Copy and install Python dependencies
COPY requirements.txt /
RUN pip install --no-cache-dir -r /requirements.txt

