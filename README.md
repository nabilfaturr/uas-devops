# UAS DevOps - Todo List Application 🚀

Project ini adalah implementasi tugas akhir mata kuliah DevOps yang mencakup containerization, orkestrasi dengan Kubernetes, CI/CD, dan monitoring.

## 📋 Fitur & Teknologi

- **Frontend**: React.js + Vite (Serving via Nginx Container).
- **Backend**: Bun Runtime + ElysiaJS Framework.
- **Database**: PostgreSQL (StatefulSet).
- **Orchestration**: Kubernetes (Minikube).
- **Features**:
  - Horizontal Pod Autoscaler (HPA) berdasarkan CPU usage.
  - CI/CD Pipeline via GitHub Actions.
  - Monitoring stack lengkap (Prometheus + Grafana).

---

## 🛠️ Prasyarat (Prerequisites)

Pastikan tools berikut sudah terinstall di komputer Anda:

- Docker Desktop / Docker Engine
- Minikube
- Kubectl
- Helm (untuk install monitoring stack)

---

## 🚀 Cara Menjalankan (Deployment)

### 1. Setup Environment Lokal (Development)

Sebelum ke Kubernetes, Anda bisa mencoba aplikasi secara lokal menggunakan Docker Compose.

```bash
# Build & Run semua service
docker compose up --build

# Buka di browser:
# Frontend: http://localhost:5173
# API Health: http://localhost:3000/health
```

### 2. Deployment ke Kubernetes (Minikube)

#### A. Start Minikube & Build Images

Karena kita menggunakan Minikube lokal, kita perlu build image docker ke dalam environment Minikube.

```bash
# Start Minikube
minikube start --driver=docker

# Enable Metrics Server (Wajib untuk HPA)
minikube addons enable metrics-server

# Switch context docker ke Minikube
eval $(minikube docker-env)

# Build Image Backend & Frontend
docker build -t uas-backend:latest ./backend
docker build -t uas-frontend:latest ./frontend
```

#### B. Apply Manifests

Deploy semua konfigurasi (Database, Backend, Frontend, HPA) ke cluster.

```bash
# Deploy semua resource di folder k8s/
kubectl apply -f k8s/

# Cek status pods
kubectl get pods
```

#### C. Akses Aplikasi

Karena Frontend menggunakan `NodePort`, kita perlu meminta URL akses khusus dari Minikube.

```bash
# Dapatkan URL Frontend
minikube service frontend --url
```

_Copy URL yang muncul dan buka di browser._

---

## 📈 Monitoring & Scaling (UAS Requirements)

### 1. Horizontal Pod Autoscaler (HPA)

Backend dikonfigurasi untuk auto-scale jika penggunaan CPU > 50%.

- **Manifest**: `k8s/hpa.yaml`
- **Min Replicas**: 1
- **Max Replicas**: 5

**Cara Test Scaling (Stress Test):**
Buka terminal baru dan jalankan load generator:

```bash
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://backend:3000/health; done"
```

Cek status HPA (tunggu 1-2 menit):

```bash
kubectl get hpa backend-hpa --watch
```

_Anda akan melihat jumlah REPLICAS bertambah dari 1 menjadi angka yang lebih tinggi._

### 2. Monitoring (Prometheus & Grafana)

Monitoring stack diinstall menggunakan Helm Chart `kube-prometheus-stack` di namespace `monitoring`.

**Cara Akses Grafana:**

1. Dapatkan password admin:
   ```bash
   kubectl --namespace monitoring get secrets monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 -d ; echo
   ```
2. Forward port ke localhost:
   ```bash
   kubectl --namespace monitoring port-forward svc/monitoring-grafana 3000:80
   ```
3. Buka browser: [http://localhost:3000](http://localhost:3000)
   - **User**: admin
   - **Password**: (hasil langkah 1)

---

## 🔄 CI/CD Pipeline

Workflow GitHub Actions tersimpan di `.github/workflows/main.yml`.

**Alur Kerja:**

1. **Push ke Main**: Developer melakukan push code ke branch `main`.
2. **Build & Push**: GitHub Actions membuild Docker Image dan push ke Docker Hub.
3. **Deploy**: GitHub Actions login ke cluster Kubernetes (via secret `KUBE_CONFIG`) dan mengupdate deployment.

**Setup Secrets di GitHub Repo:**

- `DOCKER_USERNAME`: Username Docker Hub.
- `DOCKER_PASSWORD`: Password Docker Hub.
- `KUBE_CONFIG`: Isi file `~/.kube/config` (base64 encoded recommended).

---

## 📂 Struktur Project

```
.
├── backend/            # Source code Backend (Bun + Elysia + Postgres)
├── frontend/           # Source code Frontend (React + Vite)
├── k8s/                # Kubernetes Manifests
│   ├── backend.yaml    # Deployment Backend
│   ├── frontend.yaml   # Deployment Frontend
│   ├── postgres.yaml   # StatefulSet DB
│   ├── hpa.yaml        # Autoscaling Config
│   └── ...
├── .github/workflows/  # CI/CD Pipeline
├── docker-compose.yml  # Local Development Setup
└── README.md           # Dokumentasi Project
```

---

**UAS DevOps Project - Jan 2026**
