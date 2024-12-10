# Use Ubuntu as the base image
FROM ubuntu:20.04

# Set noninteractive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    gnupg \
    git \
    build-essential \
    pkg-config \
    libudev-dev \
    libssl-dev \
    libclang-dev \
    llvm \
    clang \
    nodejs \
    npm \
    cmake \
    python3 \
    python3-pip \
    ca-certificates \
    openssl \
    tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Rust and Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN curl -sSfL https://github.com/solana-labs/solana/releases/download/v1.18.26/solana-release-x86_64-unknown-linux-gnu.tar.bz2 -o solana.tar.bz2 && \
    tar -xjf solana.tar.bz2 && \
    mv solana-release/bin/* /usr/local/bin/ && \
    rm -rf solana.tar.bz2 solana-release

# Install Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Set working directory
WORKDIR /app

