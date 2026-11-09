---
title: "CarPlay startet nur manchmal: ein Fall nach dem Retrofit"
description: "AMG GT S mit nachgerüstetem NTG5.5: CarPlay per Kabel kam mal nach Minuten, mal gar nicht. Wie wir die Spur fanden, was wir änderten und wie wir testen."
date: 2026-11-09
slug: carplay-startet-nicht-nach-retrofit
status: in-test
vehicle: "Mercedes-AMG GT S (C190), 2016"
topic: "Apple CarPlay · NTG5.5 · Retrofit"
---

> [!NOTE]
> **Stand 9. November 2026:** Die Änderungen sind seit dem 8. November 2026 aktiv, der Langzeittest läuft. Neue Ergebnisse tragen wir unten im Verlauf mit Datum ein.

## Das Fahrzeug

Ein Mercedes-AMG GT S, Baujahr 2016, noch vor dem Facelift. Nachgerüstet wurden ein Headunit der Generation NTG5.5 mit werkseitigem Apple CarPlay, ein neues Display und ein neues Kombiinstrument. Alles Originalteile, eingebunden über Adapter. Die Nachrüstung stammt nicht von uns.

## Das Symptom

CarPlay per Kabel funktionierte nur sporadisch:

- Manchmal verband es sich erst nach 5 bis 10 Minuten.
- Manchmal gar nicht.
- Lief es einmal, blieb es stundenlang stabil.

Geladen wurde das Telefon dabei immer. Und wie so oft bei sporadischen Fehlern: Wer sich extra zum Testen ins Auto setzte, bekam meistens ein funktionierendes CarPlay.

## Was schon versucht worden war

Das Problem bestand rund ein Jahr. In dieser Zeit wurde das Headunit einmal getauscht und das Telefon dreimal gewechselt. Ein weiteres iPhone und ein Android-Telefon zeigten genau dasselbe Verhalten. Dazu kamen zahlreiche Kabel, auch teure Markenkabel. Ein Neuaufspielen der Software brachte Ruhe, aber nur für ein paar Tage.

Wenn mehrere Telefone, mehrere Kabel und ein zweites Headunit dasselbe zeigen, liegt die Ursache selten an Telefon oder Kabel. Wir haben deshalb bei Software und Konfiguration gesucht.

## Spur 1: der USB-Stick

Bei einem Ausfall steckten wir einen USB-Stick in den Daten-Port. Das Headunit erkannte ihn sofort. Stick raus, Telefon wieder rein, und CarPlay startete.

Die USB-Verbindung ist also physisch in Ordnung. Sie scheint hängen zu bleiben, und ein anderes Gerät setzt sie zurück. Ein Hardware-Defekt wurde damit unwahrscheinlich.

## Spur 2: der Fehlerspeicher

Mit einer Diagnose-Software haben wir das Headunit ausgelesen. Drei Einträge fielen auf:

- **Neustarts des Headunits** (Reset Recovery) als aktiver Fehler.
- **Kartendaten nicht aktiviert.** Dieser Fehler bestand seit dem Kilometerstand der Nachrüstung, sein Zähler stand bereits am Maximum.
- **Falsche Zeitzone:** UTC+6 statt UTC+1. Das Headunit übernahm sie aus den nicht aktivierten Kartendaten.

## Spur 3: ein Bulletin von Mercedes-Benz

Im Technical Service Bulletin LI82.85-P-074970 vom 7. Juli 2022 nennt Mercedes-Benz für NTG5.5 COMAND unter anderem dieses Symptom: Apple CarPlay funktioniert nicht. Als Ursache gibt das Bulletin falsch installierte Navigationskarten an. Die Abhilfe: Kartendaten löschen und neu installieren. Teile sollen dafür nicht getauscht werden.

Das Bulletin gilt offiziell für die Baureihen 205 und 463, nicht für den AMG GT. Die Headunit-Generation ist aber dieselbe, und der Eintrag „Kartendaten nicht aktiviert“ passte genau ins Bild.

## Was wir geändert haben

Vor jeder Änderung haben wir die komplette Codierung der beteiligten Steuergeräte gesichert. Dann:

1. **Interne Navigation deaktiviert.** Sie wurde nie genutzt, navigiert wird über CarPlay. So versucht das Headunit nicht mehr, Kartendaten zu aktivieren.
2. **Keepalive-Intervall auf den Werkswert zurückgesetzt:** 10 statt 3 Sekunden.
3. **Zeitzone nicht mehr aus den Kartendaten übernehmen.** Uhrzeit und Zeitzone werden jetzt von Hand gestellt.

Nach dem Neustart verband sich CarPlay sofort. Nach einer kompletten Stromtrennung haben wir die Codierung erneut ausgelesen und mit der Sicherung verglichen: Alle 60 Bereiche stimmen.

> [!IMPORTANT]
> **Ehrlich gesagt:** Wir haben zwei Einstellungen gleichzeitig geändert, die CarPlay betreffen können, die Navigation und das Keepalive-Intervall. Welche davon den Ausschlag gibt, können wir nicht sagen. Alle Änderungen sind dokumentiert und lassen sich zurücksetzen.

## So testen wir

Ein sporadischer Fehler ist erst behoben, wenn er über längere Zeit nicht wiederkommt. Deshalb:

- Jeder Start wird notiert: CarPlay sofort da oder nicht.
- Fällt CarPlay doch aus, bleibt das Telefon gesteckt, und wir lesen sofort den Zustand von USB und Medienschnittstelle aus.
- „Gelöst“ schreiben wir erst nach mehreren Wochen ohne Ausfall.

### Verlauf

- **8. November 2026:** Änderungen codiert, Codierung nach Stromtrennung geprüft. CarPlay startet beim ersten Versuch.
- **9. November 2026:** Artikel veröffentlicht. Langzeittest läuft.

## Was wir daraus mitnehmen

- **Bei sporadischen Fehlern zuerst messen, dann tauschen.** Ein neues Headunit hat hier nichts verbessert.
- **Der Fehlerspeicher erzählt die Geschichte.** Fehler, die seit dem Kilometerstand der Nachrüstung bestehen, sind die erste Spur.
- **Vor jeder Codierung sichern.** So bleibt jede Änderung umkehrbar.

> [!CAUTION]
> Ein Erfahrungsbericht, keine Anleitung. Eingriffe in die Codierung erfolgen auf eigenes Risiko. Codierdaten, Software-Dateien und Fahrzeugdaten veröffentlichen wir nicht.

## Quelle

- Mercedes-Benz, Technical Service Bulletin [LI82.85-P-074970](https://static.nhtsa.gov/odi/tsbs/2022/MC-10217162-0001.pdf), „NTG5.5 COMAND - Navigation and/or Apple Carplay Inoperable“, 7. Juli 2022, veröffentlicht bei der US-Verkehrssicherheitsbehörde NHTSA.

*Nuit Noire Custom · Atelier in Marthalen ZH · [nuitnoirecustom.ch](https://nuitnoirecustom.ch)*
