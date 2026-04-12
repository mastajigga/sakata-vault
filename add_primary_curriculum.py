#!/usr/bin/env python3
import re

curriculumPath = 'src/app/ecole/data/mathematics-curriculum.ts'
with open(curriculumPath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove closing bracket
content = re.sub(r'\],\s*\];\s*$', '],', content)

# Add all primary programs
additionalPrograms = """
  // PRIMAIRE 2 - Ages 6-7
  {
    slug: "primaire-2",
    title: "Primaire 2",
    degree: "Degré élémentaire",
    focus: "Ajouter et retirer, argent, mesures simples",
    overview: "L'enfant approfondit le calcul : ajouter deux petits groupes, retirer une partie.",
    learningObjectives: ["Additionner et soustraire jusqu'à 20.", "Utiliser la monnaie locale.", "Mesurer avec le corps."],
    localContexts: ["pièces de monnaie", "tissu", "trajet au puits", "récolte"],
    theoryBlocks: [{ title: "Ajouter", explanation: "Deux groupes se rassemblent.", formula: "3 + 4 = 7", example: "Trois et quatre pirogues." }],
    exercises: [],
    courseSlug: "primaire-2",
    courseChapters: [
      { id: "p2-ch1", title: "Additionner jusqu'à 20", subtitle: "Deux groupes réunis", exerciseIds: [], sakataContext: "Au marché, trois paniers et 5 paniers.", visualizations: [{ type: "number-line", title: "Sauts", description: "Voir le saut" }, { type: "area-rectangle", title: "Deux groupes", description: "Réunir" }, { type: "place-value-grid", title: "Unités", description: "Ajouter" }, { type: "balance", title: "Équilibre", description: "Équilibre" }], theoryBlocks: [{ title: "L'addition", explanation: "Deux groupes ensemble.", formula: "a + b = c", example: "8 + 7 = 15." }] },
      { id: "p2-ch2", title: "Soustraire", subtitle: "Enlever une partie", exerciseIds: [], sakataContext: "Douze poissons, vendre cinq.", visualizations: [{ type: "number-line", title: "Sauts arrière", description: "Retrait" }, { type: "area-rectangle", title: "Enlever", description: "Retirer" }, { type: "place-value-grid", title: "Unités", description: "Enlever" }, { type: "balance", title: "Équilibre", description: "Nouveau" }], theoryBlocks: [{ title: "Soustraction", explanation: "Enlever une partie.", formula: "a - b = c", example: "15 - 7 = 8." }] },
      { id: "p2-ch3", title: "L'argent", subtitle: "Pièces et échanges", exerciseIds: [], sakataContext: "Vingt francs pour du riz à huit francs.", visualizations: [{ type: "place-value-grid", title: "Pièces", description: "Visualiser l'argent" }, { type: "number-line", title: "Prix", description: "Ordre" }, { type: "area-rectangle", title: "Grille", description: "Ranger" }, { type: "timeline", title: "Transaction", description: "Achat" }], theoryBlocks: [{ title: "Pièces", explanation: "Chaque pièce a une valeur.", formula: "1 = 1 franc", example: "Trois pièces de 5 = 15 francs." }] },
      { id: "p2-ch4", title: "Mesurer", subtitle: "Empan, pas, coudée", exerciseIds: [], sakataContext: "Mesurer le tissu en coudées.", visualizations: [{ type: "number-line", title: "Mesure", description: "Longueur" }, { type: "area-rectangle", title: "Rectangle", description: "Distance" }, { type: "place-value-grid", title: "Compter", description: "Pas" }, { type: "timeline", title: "Distance", description: "Étapes" }], theoryBlocks: [{ title: "Mesurer corps", explanation: "L'empan, le pas, la coudée.", formula: "Distance = nombre de pas", example: "Puits à 50 pas." }] },
      { id: "p2-ch5", title: "Problèmes", subtitle: "Histoires avec opérations", exerciseIds: [], sakataContext: "Huit mangues, en donner trois.", visualizations: [{ type: "timeline", title: "Histoire", description: "Étapes" }, { type: "number-line", title: "Chemin", description: "Solution" }, { type: "place-value-grid", title: "Résultat", description: "Réponse" }, { type: "area-rectangle", title: "Avant/après", description: "Changement" }], theoryBlocks: [{ title: "Lire problème", explanation: "Lire, identifier, choisir opération.", formula: "Histoire → Opération → Réponse", example: "6 − 2 = 4." }] },
    ],
  },
"""

content += additionalPrograms
content += '\n];\n'

with open(curriculumPath, 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Primaire 2 added successfully!')
