CLIENT_DIR=frontend

install-client:
	@echo "Installing client dependencies..."
	cd $(CLIENT_DIR) && npm install

install-server:
	@echo "Installing server dependencies..."
	npm install

install: install-client install-server

build:
	@echo "Building client app..."
	cd $(CLIENT_DIR) && npm run build

start:
	@echo "Starting the app..."
	cd $(CLIENT_DIR) && npx start-server -s ./dist

local:
	@echo "Running app in local development mode..."
	cd $(CLIENT_DIR) && npm run dev

lint:
	@echo "Running ESLint..."
	cd $(CLIENT_DIR) && npx eslint .

lint-fix:
	@echo "Running ESLint with --fix..."
	cd $(CLIENT_DIR) && npx eslint . --fix

wait-for-frontend:
	@echo "Waiting for frontend to be ready..."
	cd $(CLIENT_DIR) && npx wait-on http://localhost:5000

test: wait-for-frontend
	@echo "Running tests..."
	npx playwright test
