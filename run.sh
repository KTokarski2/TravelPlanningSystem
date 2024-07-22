#!/bin/bash

PROJECT_DIR="$(pwd)"
BACKEND_JAR="$PROJECT_DIR/target/travel-planner-0.0.1-SNAPSHOT.jar"
FRONTEND_DIR="$PROJECT_DIR/soez_fronted"

start_docker_compose() {
    echo "Starting Docker Compose for containers"
    docker-compose -f "$PROJECT_DIR/docker/docker-compose.yml" up -d
    echo "Docker Compose containers are up and running"
}

start_backend() {
    echo "Starting backend"
    java -jar "$BACKEND_JAR" &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
}

start_frontend() {
    echo "Starting frontend"
    cd "$FRONTEND_DIR" || exit
    npm start &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
}

stop_backend() {
    echo "Stopping backend"
    kill -9 "$BACKEND_PID"  # Check if $BACKEND_PID is set before killing
    echo "Backend stopped"
}

stop_frontend() {
    echo "Stopping frontend"
    kill -9 "$FRONTEND_PID"  # Check if $FRONTEND_PID is set before killing
    echo "Frontend stopped"
}

stop_docker_compose() {
    echo "Stopping Docker Compose containers"
    docker-compose -f "$PROJECT_DIR/docker/docker-compose.yml" down
    echo "Docker Compose containers stopped"
}

# Trap signals to ensure cleanup
trap 'stop_frontend; stop_backend; stop_docker_compose; exit 1' SIGINT SIGTERM

# Main script flow
start_docker_compose
sleep 30
start_backend
start_frontend

wait "$FRONTEND_PID"
echo "Application stopped"
