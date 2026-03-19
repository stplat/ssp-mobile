FROM node:20-bookworm-slim

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jdk \
    git \
    curl \
    unzip \
    bash \
    ca-certificates \
    wget \
    zip \
    make \
    python3 \
    libc6 \
    libstdc++6 \
    lib32stdc++6 \
    lib32z1 \
    zlib1g \
    libgcc-s1 \
  && rm -rf /var/lib/apt/lists/*

ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_IMAGE_ROOT=/opt/android-sdk-image

# Android command-line tools (latest stable).
ARG ANDROID_CMDLINE_TOOLS_ZIP=commandlinetools-linux-14742923_latest.zip
RUN mkdir -p "${ANDROID_SDK_IMAGE_ROOT}/cmdline-tools" \
  && curl -fL --retry 5 --retry-delay 2 --connect-timeout 10 --max-time 1800 \
      "https://dl.google.com/android/repository/${ANDROID_CMDLINE_TOOLS_ZIP}" \
      -o /tmp/cmdline-tools.zip \
  && unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools \
  && mkdir -p "${ANDROID_SDK_IMAGE_ROOT}/cmdline-tools/latest" \
  && mv /tmp/cmdline-tools/cmdline-tools/* "${ANDROID_SDK_IMAGE_ROOT}/cmdline-tools/latest/" \
  && rm -rf /tmp/cmdline-tools /tmp/cmdline-tools.zip

ENV PATH="/usr/lib/jvm/java-17-openjdk-amd64/bin:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator:${PATH}"

RUN install -d /usr/local/bin \
  && cat > /usr/local/bin/android-sdk-bootstrap <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if [ ! -x "${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin/sdkmanager" ]; then
  mkdir -p "${ANDROID_SDK_ROOT}/cmdline-tools"
  cp -a "${ANDROID_SDK_IMAGE_ROOT}/cmdline-tools/latest" "${ANDROID_SDK_ROOT}/cmdline-tools/"
fi
EOF

RUN chmod +x /usr/local/bin/android-sdk-bootstrap

# Use the pre-created non-root `node` user (uid:gid 1000:1000).
RUN mkdir -p /workspace "${ANDROID_SDK_ROOT}" "${ANDROID_SDK_IMAGE_ROOT}" \
  && chown -R node:node /workspace "${ANDROID_SDK_ROOT}" "${ANDROID_SDK_IMAGE_ROOT}"

WORKDIR /workspace
USER node
