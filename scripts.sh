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

minikube addons enable metrics-server

kubectl get svc

kubectl port-forward svc/uas-todo-frontend 8080:80

# Terminal Run load generator
kubectl run -i --tty load-generator \
  --rm \
  --image=busybox \
  --restart=Never -- \
  /bin/sh -c "while sleep 0.01; do wget -q -O- http://uas-todo-backend:3000/health; done"

 kubectl port-forward svc/uas-todo-backend 3001:3000

 kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
