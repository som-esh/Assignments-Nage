#!/bin/sh
sudo chown -R $(whoami) ./backend/dockerls
sudo chmod -R 755 ./backend/docker
docker compose build
docker compose up -d
cd frontend
npm install
npm run dev
