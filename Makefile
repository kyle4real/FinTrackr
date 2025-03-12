docker-setup:
	docker-compose up -d

docker-down:
	docker-compose down

start: docker-setup
	npm run dev

stop: docker-down