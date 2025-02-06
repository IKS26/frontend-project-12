install:
	npm ci

build:
	npm run build

start:
	npm run start

lint:
	make -C frontend lint

lint-fix:
	make -C frontend lint-fix		
