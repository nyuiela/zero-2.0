@echo off
echo 🔍 Checking network connectivity for Docker builds...

echo 📡 Testing DNS resolution...
nslookup github.com
nslookup registry-1.docker.io

echo 🌐 Testing HTTP connectivity...
curl -I https://github.com
curl -I https://registry-1.docker.io

echo 🔧 Testing Docker daemon...
docker version

echo 📦 Testing Docker Hub pull...
docker pull hello-world

echo ✅ Network check complete!
pause 