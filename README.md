# 🚀 DevOps Platform --- End-to-End Cloud Native Deployment

A full production-style DevOps project demonstrating modern cloud-native
practices including CI/CD, GitOps, Kubernetes, and observability.

------------------------------------------------------------------------

## 🧠 Overview

This project showcases a complete DevOps lifecycle:

-   Application built with **Next.js + Firebase**
-   Containerized using **Docker**
-   Automated CI/CD with **GitHub Actions**
-   GitOps deployment using **ArgoCD**
-   Progressive delivery with **Argo Rollouts (Blue/Green)**
-   Hosted on **AWS EC2 (k3s Kubernetes cluster)**
-   Public access via **Ingress (Traefik + nip.io)**

------------------------------------------------------------------------

## 🏗️ Architecture

Developer → GitHub → GitHub Actions → Docker Hub → GitOps Repo → ArgoCD
→ Kubernetes → Users

------------------------------------------------------------------------

## ⚙️ Tech Stack

### 🚀 Application

-   Next.js 16
-   Firebase (Auth + Firestore)
-   Tailwind CSS

### 🐳 Containerization

-   Docker (multi-stage build)
-   Node 20 Alpine

### 🔄 CI/CD

-   GitHub Actions
-   Docker Buildx
-   Docker Hub registry

### 📦 GitOps

-   ArgoCD
-   Separate GitOps repository
-   Kustomize-based manifests

### 🚦 Deployment Strategy

-   Argo Rollouts
-   Blue/Green deployment
-   Zero-downtime switching

### ☁️ Infrastructure

-   AWS EC2 (t3 instance)
-   k3s (lightweight Kubernetes)
-   Traefik Ingress Controller

------------------------------------------------------------------------

## 🔁 CI/CD Pipeline

### ✅ Continuous Integration

-   Trigger: push to `main`
-   Build Docker image
-   Push to Docker Hub
-   Tag with commit SHA + latest

### ✅ Continuous Deployment (GitOps)

-   Update image tag in GitOps repo
-   ArgoCD detects change
-   Automatically syncs cluster

------------------------------------------------------------------------

## 🔥 Key Features

-   🚀 Zero Downtime Deployment (Blue/Green)
-   🔄 GitOps Workflow
-   🧠 Automated Image Updates
-   🌐 Public Access via Ingress
