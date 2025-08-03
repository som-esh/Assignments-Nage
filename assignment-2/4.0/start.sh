#!/bin/sh
sudo chown -R $(whoami) ./backend/docker
sudo chmod -R 755 ./backend/docker
docker compose build
docker compose up
#cd frontend
#npm install
#npm run dev
