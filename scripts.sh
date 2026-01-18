kubectl delete all --all

kubectl delete all -l app=backend
kubectl delete all -l app=frontend
kubectl apply -f k8s/

kubectl apply -f k8s/

kubectl delete service backend frontend

echo $DOCKER_MINIKUBE_ACTIVE

# build and re-deploy frontend
eval $(minikube docker-env)
docker compose build frontend  # Cukup build frontend saja
kubectl rollout restart deployment uas-todo-frontend

docker build -t uas-backend:latest ./backend                
docker build -t uas-frontend:latest ./frontend              
docker build -t uas-db:latest ./db 