#!/bin/bash

# Add theme toggle to Assessment, LearningPath, Tutorial, ScenarioSelection, and Scenario pages

for file in client/src/pages/{Assessment,LearningPath,Tutorial,ScenarioSelection,Scenario}.tsx; do
  # Check if ThemeToggle import already exists
  if ! grep -q "ThemeToggle" "$file"; then
    # Add import after other imports
    sed -i '/^import.*from "wouter";$/a import { ThemeToggle } from "@/components/ThemeToggle";' "$file"
    
    # Add theme toggle div after the opening div of return statement
    sed -i '/return (/,/<div className="min-h-screen/ {
      /<div className="min-h-screen/a\      <div className="fixed top-4 right-4 z-50">\n        <ThemeToggle />\n      </div>
    }' "$file"
    
    echo "Added theme toggle to $file"
  fi
done
