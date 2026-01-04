# Portfolio

Site professionnel de portfolio en Flask pour Fatima Rhabiri.

## Installation

1. Créez un environnement virtuel et activez-le

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

2. Exécuter

```bash
python app.py
```

Le site écoute par défaut sur `http://127.0.0.1:5000/`.

## Contenu et personnalisation
- Déposez votre CV PDF dans `static/docs/` avec le nom exact `CV_Fatima_Rhabiri.pdf` pour que le bouton "Télécharger CV" fonctionne.
- Modifiez les textes dans `templates/index.html` pour personnaliser les sections, projets et expériences.

## Fonctionnalités
- Page d'accueil moderne et responsive avec sections : Profil, Expériences (timeline), Projets (modales), Compétences, Langues, Contact
- Formulaire de contact envoyé en AJAX (JSON) et sauvegardé dans `contacts.csv`
- Téléchargement du CV via `/download-cv`

## Sécurité & déploiement
- Remplacez la clé secrète par une variable d'environnement `FLASK_SECRET` en production
- Pour déployer, utilisez Gunicorn + un serveur revers (Nginx) ou une plateforme adaptée

## Partager le projet sur GitHub
Voici une procédure simple pour mettre ce projet sur votre compte GitHub et le partager avec votre professeur :

1. Créez un nouveau dépôt sur GitHub (via https://github.com/new). Donnez-lui un nom (ex. `portfolio-fatima`) et ne créez pas de README (vous en avez déjà un).

2. Dans le dossier du projet local, exécutez ces commandes (remplacez les valeurs entre <>):

```bash
# initialiser git si nécessaire
git init
# ignorer fichiers sensibles et l'environnement virtuel
# créez un fichier .gitignore si vous n'en avez pas
cat > .gitignore << 'EOF'
venv/
__pycache__/
*.pyc
.env
.DS_Store
EOF

# ajouter les fichiers et commiter
git add .
git commit -m "Initial project import: portfolio"

# ajouter le remote (collez l'URL fournie par GitHub pour votre nouveau dépôt)
# exemple d'URL HTTPS : https://github.com/<votre-username>/<repo>.git
git remote add origin https://github.com/<votre-username>/<repo>.git
# nommez la branche principale 'main' et poussez
git branch -M main
git push -u origin main
```

Remarques :
- Si GitHub vous demande des identifiants pour HTTPS, vous pouvez utiliser un Personal Access Token (PAT) ou configurer une clé SSH et utiliser l'URL SSH du dépôt.
- Si vous préférez une interface graphique, GitHub Desktop ou l'extension Git de VSCode fonctionnent très bien.

3. Une fois poussé, copiez l'URL du dépôt et partagez-la avec votre professeur (par ex. https://github.com/thebestdatasciense/portfolio-fatima).

Si vous le souhaitez, je peux :
- ajouter un fichier `.gitignore` automatiquement, ou
- préparer un petit script `deploy.sh` d'exemple, ou
- vous guider pas à pas ici pendant que vous poussez (si vous me dites si vous utilisez HTTPS ou SSH).

