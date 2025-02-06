install:
	npm ci && make -C frontend install

build:
	npm run build

start:
	npm start

lint:
	make -C frontend lint

lint-fix:
	make -C frontend lint-fix		
