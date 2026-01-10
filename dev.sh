#!/usr/bin/env bash
set -e

# ---- config ----
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$PROJECT_ROOT/Inbox1"
ANDROID_AVD="Medium_Phone_API_36"
IOS_DEVICE="iPhone 17 Pro"
METRO_PORT=8081
# ----------------

echo "▶ Using project root: $APP_DIR"

# Android env (defensive; no-op if already set)
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"

cd "$APP_DIR"

# ---- Metro ----
if ! lsof -i :$METRO_PORT >/dev/null 2>&1; then
  echo "▶ Starting Metro bundler"
  npx react-native start --port $METRO_PORT &
  METRO_PID=$!
  sleep 3
else
  echo "▶ Metro already running on port $METRO_PORT"
fi

# ---- Android Emulator ----
if ! adb devices | grep -q emulator; then
  echo "▶ Starting Android emulator: $ANDROID_AVD"
  emulator "@$ANDROID_AVD" >/dev/null 2>&1 &
else
  echo "▶ Android emulator already running"
fi

# ---- iOS Simulator ----
if ! xcrun simctl list devices | grep -q "$IOS_DEVICE (Booted)"; then
  echo "▶ Booting iOS simulator: $IOS_DEVICE"
  xcrun simctl boot "$IOS_DEVICE" || true
else
  echo "▶ iOS simulator already booted"
fi

# ---- Launch apps (no rebuild if already installed) ----
echo "▶ Launching Android app"
adb shell monkey -p com.inbox1 -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1 || true

echo "▶ Launching iOS app"
xcrun simctl launch booted com.inbox1 || true

echo "✅ Dev environment ready"
echo "   • Metro: http://localhost:$METRO_PORT"
echo "   • Android AVD: $ANDROID_AVD"
echo "   • iOS Simulator: $IOS_DEVICE"
