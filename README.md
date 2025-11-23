# Recipies-In-Docker
This project is a simple Recipes Finder website built using HTML, CSS, and JavaScript and served through Nginx inside a Docker container. It demonstrates how to containerize a static website and run it using Docker on any system.

## Description
Recipe Finder is a sleek and responsive web application that allows users to search, explore, and view recipe details.  
It is built using **HTML**, **CSS**, and **JavaScript**, and retrieves real-time recipe data from **TheMealDB API**.

The project is fully containerized using **Docker** and served through **Nginx**, making it portable and runnable on any system.

## Features
- Search recipes in real-time  
- Explore details like:
  - Category  
  - Region  
  - Ingredients  
  - Instructions  
  - Tags  
  - YouTube tutorial links  
- Responsive and modern UI  
- Fast and smooth transitions  
- Runs inside Docker using Nginx  
- Works on any OS with Docker installed  

## How It Works
The website interacts with **TheMealDB API**:

- `search.php?s=query` → fetch recipes matching search text  
- `lookup.php?i=id` → fetch complete recipe details  

JavaScript dynamically:
- Renders recipe cards  
- Loads featured recipes on launch  
- Displays loaders and error messages  
- Shows full recipe details on click  
- Allows navigating back to results  
- Parses long instruction text into clean steps  

Nginx serves all static files inside the Docker container.

## JavaScript Functions Overview

### **1. fetchRecipes(query)**
Fetches recipes based on user input.

### **2. fetchRecipeDetails(id)**
Fetches complete details of a selected recipe.

### **3. displayRecipes(recipes)**
Renders all recipe cards dynamically.

### **4. showRecipeDetails(id)**
Loads the full recipe page with image, ingredients, steps, and more.

### **5. parseInstructions(text)**
Splits long instructions into simple, readable steps.

### **6. showLoading()**
Displays loading animation while retrieving data.

### **7. showError(message)**
Shows an error message when API fails or no results are found.

### **8. goBack()**
Returns to recipe list from the detail page.


## Installation and Usage

### **Clone the Repository**
- git clone https://github.com/cloudxplorer/Recipies-In-Docker

### **Change the directory to Recipies-In-Docker**
- cd Recipies-In-Docker

### **Build the Docker Image**
- docker build -t recipes-in-docker .

### **Run the Docker Container**
- docker run -d -p 8080:80 --name recipes-box recipes-in-docker

### **View in Browser**
- http://localhost:8080
- **Demo** : [Recipies Finder](https://cloudxplorer.github.io/Recipies-In-Docker)

### **Stop and Remove Container (optional)**
- docker stop recipes-container
- docker rm recipes-container

## Tech Stack

### **Frontend**
- **HTML5** – Structure of the website  
- **CSS3** – Styling, layout, responsiveness  
- **JavaScript (Vanilla JS)** – Dynamic UI, API integration (TheMealDB)

### **Backend / API**
- **TheMealDB API** – Public API used to fetch recipe data

### **Server**
- **Nginx** – Serves static files inside the container

### **Containerization**
- **Docker** – Used to build and run the website inside a container

### **License**
- This project is open-source and available under the MIT License. You are free to use, modify, and distribute it.


