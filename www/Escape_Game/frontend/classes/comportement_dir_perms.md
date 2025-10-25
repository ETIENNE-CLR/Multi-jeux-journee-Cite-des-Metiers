Ah oui, très bonne question 😄
C’est un petit “piège” classique du système de permissions Linux.

👉 En fait, **pour entrer dans un dossier (avec `cd`)**, tu n’as pas besoin de la permission **lecture (`r`)**, mais **exécution (`x`)**.

Voici la différence :

* **Lecture (`r`)** sur un dossier : permet de **lister** son contenu (par exemple avec `ls`).
* **Exécution (`x`)** sur un dossier : permet de **traverser** le dossier, c’est-à-dire d’y **accéder** et d’entrer dedans (avec `cd` ou pour accéder à des fichiers à l’intérieur).
* **Écriture (`w`)** : permet de créer, renommer ou supprimer des fichiers dans ce dossier.

Donc quand tu fais :

```bash
chmod 400 testD
```

tu retires la permission `x`, ce qui fait que le dossier est « visible » (lisible en théorie) mais **inaccessible**.
Tu peux voir qu’il existe, mais tu ne peux pas y aller.

Pour pouvoir faire `cd testD`, il faut au minimum :

```bash
chmod 500 testD
```

(c’est-à-dire lecture + exécution pour le propriétaire)

💡 En résumé :

* `r` → lire le contenu (ls)
* `x` → traverser (cd)
* `w` → modifier le contenu

Souhaites-tu que je t’explique plus précisément ce que ça donne pour chaque combinaison de permissions sur un dossier ? (c’est assez instructif 😄)
