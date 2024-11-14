app_port = 3000
image_repo = ghcr.io/azkafr92
image_name = coldsire-skill-test-be
service_name = coldsire-skill-test-be

build:
	sudo docker build -t ${image_repo}/${image_name} .

push:
	sudo docker push ${image_repo}/${image_name}

pull:
	sudo docker pull ${image_repo}/${image_name}

run:
	sudo docker run -d \
	--name ${service_name} \
	-p ${app_port}:${app_port} \
	--env-file .env \
	${image_repo}/${image_name}