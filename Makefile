install:
	cd frontend && npm ci

start:
	npx start-server -s ./frontend/dist

dev:
	npm run dev --prefix frontend

build:
	npm run build --prefix frontend
	
lint:
