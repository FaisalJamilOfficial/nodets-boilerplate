#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing it now..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    NODE_MAJOR=18
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt-get update
    sudo apt-get install nodejs -y
    echo "Node.js has been installed."
else
    echo "Node.js is already installed."
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "Yarn is not installed. Installing it now..."
    sudo npm install -g yarn
    # curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -;
    # echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list; 
    # sudo apt update && sudo apt install yarn
    echo "Yarn has been installed."
else
    echo "Yarn is already installed."
fi

# Check if pm2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing it now..."
    sudo npm install -g pm2
    echo "PM2 has been installed."
    pm2 start ./dist/app.js --name app-backend;
    echo "PM2 process with name app-backend has been started."
    pm2 install pm2-logrotate
    echo "pm2-logrotate has been installed."
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu;
    echo "Now PM2 will automatically restart at boot."
    pm2 save;
    echo "PM2 configuration saved."
else
    echo "PM2 is already installed."
fi

# Check if Nginx is installed and install it with the specified commands if not
if ! command -v nginx &> /dev/null; then
    echo "Nginx is not installed. Installing it now..."
    sudo apt install nginx -y
    sudo ufw enable
    sudo ufw allow 22
    sudo ufw allow 5001
    sudo ufw allow 5003
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw allow http
    sudo ufw allow https
    sudo apt update
    sudo systemctl reload nginx
    echo "Nginx has been installed and configured."
else
    echo "Nginx is already installed."
fi

# Check if Certbot is installed and install it with the specified commands if not
if ! command -v certbot &> /dev/null; then
    echo "Certbot is not installed. Installing it now..."
    sudo apt install certbot python3-certbot-nginx -y;
    sudo systemctl reload nginx;
    echo "Certbot has been installed."
else
    echo "Certbot is already installed."
fi