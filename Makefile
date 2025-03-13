docker-setup:
	docker-compose up -d

docker-down:
	docker-compose down

install:
	npm install

generate-prisma:
	npx prisma generate

start: install docker-setup generate-prisma
	npm run dev

stop: docker-down