FROM node:20-alpine3.20

# Java 17 for Android builds; also add common tooling.
RUN apk update \
  && apk add --no-cache \
    openjdk17-jdk \
    git \
    curl \
    unzip \
    bash

# Set Java home explicitly for tooling.
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV ANDROID_HOME=/opt/android-sdk

# Install Android command-line tools (latest stable).
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools \
    && curl -fsSL https://dl.google.com/android/repository/commandlinetools-linux-14742923_latest.zip -o /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools \
    && mkdir -p $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && mv /tmp/cmdline-tools/cmdline-tools/* $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && rm -rf /tmp/cmdline-tools /tmp/cmdline-tools.zip

ENV PATH="$JAVA_HOME/bin:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:$PATH"

WORKDIR /app
