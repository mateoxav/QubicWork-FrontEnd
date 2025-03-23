#!/bin/bash
# Script para respaldar los cambios experimentales en una rama "future-dev" y resetear la rama actual a la versión estable.
# Se supone que la rama actual tiene cambios no comiteados que se quieren guardar aparte.

# Declaración de variables
branch=""
commit_message=""
newbranch=""
ts=""

# Asignación de variables
branch="future-dev"
commit_message="Backup experimental changes before reset (future-dev backup)"

# Agregar todos los cambios (incluyendo archivos no rastreados)
git add -A

# Verificar si hay cambios staged para commit
if git diff --cached --quiet; then
	echo "No hay cambios para guardar."
	exit 0
fi

# Comitear los cambios con un mensaje de respaldo
git commit -m "$commit_message"
if [ $? -ne 0 ]; then
	echo "Error al hacer commit de los cambios."
	exit 1
fi

# Verificar si la rama de respaldo ya existe
if git show-ref --verify --quiet "refs/heads/$branch"; then
	# Si ya existe, se crea una rama con sufijo timestamp para evitar conflictos
	ts=$(date +%Y%m%d%H%M%S)
	newbranch="${branch}-${ts}"
	git branch "$newbranch"
	echo "La rama '$branch' ya existía. Se creó '$newbranch' en su lugar."
else
	git branch "$branch"
fi

# Resetear la rama actual al commit anterior (la versión estable)
git reset --hard HEAD~1
if [ $? -ne 0 ]; then
	echo "Error al resetear la rama actual."
	exit 1
fi

echo "Cambios guardados en la rama '$branch' y la rama actual ha sido restaurada a la versión estable."
