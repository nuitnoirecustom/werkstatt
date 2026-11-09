# Einen Artikel schreiben / Writing an article

1. Neuer Ordner in `artikel/`, Name nur mit a–z, 0–9 und `-`, z. B. `2026-12-sternenhimmel-g63`.
2. Darin `de.md` und `en.md` (eine Sprache allein geht auch), Fotos in `bilder/`.
3. Push auf `main`. Die Action prüft alles und baut `index.json`. Nach etwa 15 Minuten steht der Artikel auf der Website.

Ist ein Feld falsch, schlägt die Action fehl, GitHub schickt eine E-Mail, und die Website zeigt weiter den alten Stand.

## Kopf jeder Datei / Front matter

```yaml
---
title: "CarPlay startet nur manchmal: ein Fall nach dem Retrofit"
description: "Ein bis zwei Sätze, höchstens 200 Zeichen. Erscheint in Google und auf der Karte."
date: 2026-11-30          # ab diesem Tag sichtbar (vorher versteckt)
updated: 2026-12-15       # optional
slug: carplay-startet-nicht-nach-retrofit   # Adresse: /werkstatt/<slug>
status: in-test           # in-test, solved oder open
vehicle: "Mercedes-AMG GT S (C190), 2016"
topic: "Apple CarPlay · NTG5.5 · Retrofit"
cover: bilder/titel.jpg   # optional
---
```

`date`, `status`, `vehicle`, `topic` und `cover` werden aus `de.md` übernommen.

## Was im Text geht / What works in the text

- Überschriften ab `##`, Listen, **fett**, *kursiv*, Tabellen, Links.
- Fotos: `![Beschreibung](bilder/foto.jpg "Bildunterschrift")`, nur jpg, png, webp, avif, gif.
- Hinweisboxen, wie auf GitHub:

```markdown
> [!NOTE]
> Hinweis

> [!IMPORTANT]
> Wichtig

> [!CAUTION]
> Vorsicht
```

- Interne Notiz, die das Veröffentlichen blockiert: `<!-- TODO: … -->`

## Nie veröffentlichen / Never publish

Fahrgestellnummern (die Action sucht danach), Kennzeichen, Namen von Kunden, Codierdaten und Software-Dateien, fremde Fotos, Fotos mit Markenlogos.
