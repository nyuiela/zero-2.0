# Use the official Rust image as base
FROM --platform=linux/amd64 debian:bookworm-slim as builder

# Install system dependencies for building
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libpq-dev \
    curl \
    git \
    cmake \
    ninja-build \
    && rm -rf /var/lib/apt/lists/*

# Install Rust via rustup with retry logic
RUN for i in {1..5}; do \
    echo "Attempt $i: Installing Rust..." && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    break || \
    (echo "Rust installation failed, retrying in 10 seconds..." && sleep 10); \
    done
ENV PATH="/root/.cargo/bin:${PATH}"

# Install RISC0 toolchain with retry logic
WORKDIR /tmp
RUN for i in {1..5}; do \
    echo "Attempt $i: Cloning RISC0..." && \
    (git clone https://github.com/risc0/risc0.git || \
    git clone git://github.com/risc0/risc0.git) && \
    break || \
    (echo "RISC0 clone failed, retrying in 15 seconds..." && sleep 15); \
    done
WORKDIR /tmp/risc0
RUN git checkout release-2.1
RUN for i in {1..3}; do \
    echo "Attempt $i: Installing rzup..." && \
    cargo install --path rzup && \
    break || \
    (echo "rzup installation failed, retrying in 10 seconds..." && sleep 10); \
    done
RUN for i in {1..3}; do \
    echo "Attempt $i: Running rzup install..." && \
    rzup install && \
    break || \
    (echo "rzup install failed, retrying in 10 seconds..." && sleep 10); \
    done

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY Cargo.toml Cargo.lock ./
COPY host/Cargo.toml ./host/
COPY db/Cargo.toml ./db/
COPY methods/Cargo.toml ./methods/

# Create dummy source files to build dependencies
RUN mkdir -p host/src db/src methods/src
RUN echo "fn main() {}" > host/src/main.rs
RUN echo "fn main() {}" > db/src/main.rs
RUN echo "fn main() {}" > methods/src/lib.rs

# Build dependencies only with retry logic
RUN for i in {1..3}; do \
    echo "Attempt $i: Building host dependencies..." && \
    RISC0_DEV_MODE=1 cargo build --release --package host && \
    break || \
    (echo "Host build failed, retrying in 20 seconds..." && sleep 20); \
    done
RUN for i in {1..3}; do \
    echo "Attempt $i: Building db dependencies..." && \
    cargo build --release --bin db && \
    break || \
    (echo "DB build failed, retrying in 20 seconds..." && sleep 20); \
    done

# Remove dummy files and copy real source code
RUN rm -rf host/src db/src methods/src
COPY . .

# Build the actual project with retry logic
RUN for i in {1..3}; do \
    echo "Attempt $i: Building final host..." && \
    RISC0_DEV_MODE=1 RUST_LOG=info RISC0_INFO=1 cargo build --release --package host && \
    break || \
    (echo "Final host build failed, retrying in 30 seconds..." && sleep 30); \
    done
RUN for i in {1..3}; do \
    echo "Attempt $i: Building final db..." && \
    cargo build --release --bin db && \
    break || \
    (echo "Final db build failed, retrying in 30 seconds..." && sleep 30); \
    done

# Runtime stage
FROM --platform=linux/amd64 debian:bookworm-slim

# Install runtime dependencies including PostgreSQL client tools with retry
RUN for i in {1..5}; do \
    echo "Attempt $i: Installing runtime dependencies..." && \
    apt-get update && apt-get install -y \
    ca-certificates \
    libpq5 \
    libssl3 \
    postgresql-client \
    curl \
    sed \
    bash \
    && rm -rf /var/lib/apt/lists/* && \
    break || \
    (echo "Runtime dependencies failed, retrying in 10 seconds..." && sleep 10); \
    done

# Create non-root user
RUN useradd -m -u 1000 rustuser

# Set working directory
WORKDIR /app

# Copy the binaries from builder stage
COPY --from=builder /app/target/release/host /app/host
COPY --from=builder /app/target/release/db /app/db

# Copy any necessary files (like methods ELF files)
COPY --from=builder /app/methods /app/methods
COPY --from=builder /app/db /app/db_files

# Add entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Change ownership to non-root user
RUN chown -R rustuser:rustuser /app

# Switch to non-root user
USER rustuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/cars || exit 1

# Run the entrypoint script with proper bash and sed command for Windows line endings
ENTRYPOINT ["/bin/bash", "-c", "sed -i 's/\r//' /app/entrypoint.sh && bash /app/entrypoint.sh"] 