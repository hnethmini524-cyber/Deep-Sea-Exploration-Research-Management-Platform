# Deep Sea Exploration Research Management Platform

A web-based Deep Sea Exploration Research Management Platform designed to centralize and organize information collected during deep-sea exploration missions.

## Overview

This provides a structured environment for managing research missions, researchers, species observations, collected samples, and exploration areas. The platform serves as a central repository where research teams can store, track, and access expedition-related data.

The system is designed to reduce data fragmentation by bringing mission records, observations, sample collections, and research area information into a single platform.

## Project Status

🚧 Currently in Development

---

## Problem Statement

Deep-sea exploration projects generate large amounts of information that are often stored across spreadsheets, documents, and disconnected systems.

Challenges include:
- Scattered mission records
- Difficult tracking of species observations
- Limited visibility into collected samples
- Inefficient researcher collaboration
- Lack of centralized exploration data

This aims to solve these problems by providing a unified research management platform.

## Objectives

- Centralize deep-sea exploration data.
- Manage exploration missions efficiently.
- Track researchers and their contributions.
- Record species observations and mission findings.
- Manage collected samples.
- Organize research areas and exploration history.
- Provide a clear overview of ongoing and completed missions.

## Features
Dashboard - Provides a high-level overview of platform activities.

- Total Missions
- Total Researchers
- Total Species
- Total Samples
- Total Research Areas
- Recent Missions

Mission Management - Manage exploration missions and related research activities.

- Create missions
- View mission details
- Edit missions
- Assign researchers to missions

Researcher Management - Manage researchers details

- Add researchers
- View researcher profiles
- Edit researcher information
- Delete researchers

Species & Sample Management - Maintain records of marine species and field observations.

- Add species / Sample
- View species / Sample profiles

Research Area Management - Manage exploration zones and research locations.

- Create research areas
- View research areas

## System Architecture

- Frontend - React, Tailwind CSS
- Backend - Spring Boot, Spring Security, Spring Data JPA
- Database - MySQL
- Version Control - GitHub

---

# 📌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/login | Authenticate user and receive JWT token |
| POST | /api/v1/auth/confirm | Confirm password setup |
| GET | /api/v1/dashboard | Get dashboard summary data |
| POST | /api/v1/missions | Create a mission |
| GET | /api/v1/missions | Get all missions |
| GET | /api/v1/missions/{id} | Get specific mission |
| PUT | /api/v1/missions/{id} | Update specific mission |
| GET | /api/v1/areas | Get all research areas |
| GET | /api/v1/areas/{id} | Get specific research area |
| POST | /api/v1/areas | Create a research area |
| GET | /api/v1/samples | Get all samples |
| GET | /api/v1/samples/{id} | Get specific sample |
| POST | /api/v1/samples | Create a sample |
| GET | /api/v1/species | Get all species |
| GET | /api/v1/species/{id} | Get specific species |
| POST | /api/v1/species | Create a species |
| POST | /api/v1/users/invite | Invite researchers to the system |
| GET | /api/v1/users/researchers | Get all researchers |
| GET | /api/v1/users/me | Get specific user profile |
| PUT | /api/v1/users/me | Update specific user profile |
| DELETE | /api/v1/users/{id} | Delete a users |
| POST | /api/v1/images/upload | Upload image |

## Learning Goals

This project is being developed to strengthen skills in:
- Backend Development
- REST API Design
- Spring Boot
- Spring Security
- Database Design
- JPA/Hibernate
- Authentication & Authorization
- Entity Relationships
- Full-Stack Application Development