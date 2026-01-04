from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory, abort
import csv
import os
from datetime import datetime

# Initialisation de l'application Flask
app = Flask(__name__)
# Clé secrète utilisée pour sessions
app.secret_key = os.environ.get('FLASK_SECRET', 'change-this-secret')

# Fournit l'année courante aux templates 
@app.context_processor
def inject_current_year():
    return {'current_year': datetime.utcnow().year} 

# Page d'accueil (template index.html)
@app.route('/')
def index():
    return render_template('index.html') 

# Route pour recevoir les messages du formulaire 
@app.route('/contact', methods=['POST'])
def contact():
   
    # Récupère les données soit en JSON 
    if request.is_json:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
    else:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

    # Validation simple : tous les champs requis
    if not (name and email and message):
        if request.is_json:
            return jsonify({'status':'error','message':'Veuillez remplir tous les champs.'}), 400
        flash('Veuillez remplir tous les champs.')
        return redirect(url_for('index'))

    # Enregistre les messages dans un fichier CSV local (contacts.csv)
    csv_path = os.path.join(os.path.dirname(__file__), 'contacts.csv')
    write_header = not os.path.exists(csv_path)
    with open(csv_path, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if write_header:
            # Écrit une en-tête la première fois
            writer.writerow(['timestamp', 'name', 'email', 'message'])
        writer.writerow([datetime.utcnow().isoformat(), name, email, message])

    # Retourne une réponse JSON pour les requêtes AJAX, sinon utilise flash+redirect
    if request.is_json:
        return jsonify({'status':'ok','message':'Merci ! Votre message a été enregistré.'})

    flash('Merci ! Votre message a été enregistré.')
    return redirect(url_for('index'))

# Téléchargement du CV : cherche `static/docs/CV_Fatima_Rhabiri.pdf` et le sert en pièce jointe
@app.route('/download-cv')
def download_cv():
    docs_folder = os.path.join(os.path.dirname(__file__), 'static', 'docs')
    filename = 'CV_Fatima_Rhabiri.pdf'
    filepath = os.path.join(docs_folder, filename)
    if not os.path.exists(filepath):
        # Retourne 404 clair si le fichier n'existe pas
        abort(404, description='CV non trouvé. Placez votre CV sous `static/docs/` avec le nom "CV_Fatima_Rhabiri.pdf"')
    return send_from_directory(docs_folder, filename, as_attachment=True)

# Lancement en mode développement 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
