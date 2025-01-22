#!/bin/bash

# Convertir le fichier en format Linux :
# dos2unix v_singleCommand.sh
# bash v_singleCommand.sh

# Tester si l'agent de connection est lançé :
eval "$(ssh-agent -s)"

# Obtention du nom de la clé privée
cleSSH="Cle_github"     # Clé de mon PC portable
cleSSH="id_rsa"         # Clé de mon PC gaming
cleSSH="etienneclr_key" # Clé du PC de l'école

# Ajouter votre clef privée à l'agent
ssh-add ~/.ssh/$cleSSH
ssh-add -l
ssh -T git@github.com

git pull --force # LA COMMANDE A EXECUTER !!!
