sudo docker stop Megapaca
sudo docker rm Megapaca
sudo docker image rm megapaca-app
sudo git pull
sudo docker build -t megapaca-app .
sudo docker run -d --name Megapaca -p 443:443 megapaca-app
sudo docker docker network connect my-network Megapaca