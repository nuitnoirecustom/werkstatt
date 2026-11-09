---
title: "CarPlay only starts sometimes: a case after a retrofit"
description: "AMG GT S with a retrofitted NTG5.5 head unit: wired CarPlay came after minutes or not at all. How we found the lead, what we changed and how we test it."
date: 2026-11-09
slug: carplay-not-starting-after-retrofit
status: in-test
vehicle: "Mercedes-AMG GT S (C190), 2016"
topic: "Apple CarPlay · NTG5.5 · Retrofit"
---

> [!NOTE]
> **Status 9 November 2026:** the changes have been active since 8 November 2026 and the long-term test is running. We add new results to the log below, with the date.

## The car

A Mercedes-AMG GT S, model year 2016, pre-facelift. It had been retrofitted with an NTG5.5-generation head unit with factory Apple CarPlay, a new display and a new instrument cluster. All genuine parts, integrated through adapters. The retrofit was not done by us.

## The symptom

Wired CarPlay only worked now and then:

- Sometimes it connected only after 5 to 10 minutes.
- Sometimes not at all.
- Once it was running, it stayed stable for hours.

The phone always charged. And as so often with intermittent faults: whoever got into the car just to test it usually found CarPlay working.

## What had already been tried

The problem had been there for about a year. In that time the head unit was replaced once and the phone was changed three times. Another iPhone and an Android phone behaved exactly the same way. Add many cables, including expensive branded ones. Reflashing the software calmed things down, but only for a few days.

When several phones, several cables and a second head unit all show the same thing, the cause is rarely the phone or the cable. So we looked at software and configuration.

## Lead 1: the USB stick

During a failure we plugged a USB stick into the data port. The head unit recognised it straight away. Stick out, phone back in, and CarPlay started.

So the USB connection is physically fine. It seems to hang, and another device resets it. That made a hardware fault unlikely.

## Lead 2: the fault memory

We read out the head unit with diagnostic software. Three entries stood out:

- **Head unit restarts** (reset recovery) as an active fault.
- **Map data not activated.** This fault had been stored since the mileage of the retrofit, and its counter was already at the maximum.
- **Wrong time zone:** UTC+6 instead of UTC+1. The head unit took it from the map data that was never activated.

## Lead 3: a Mercedes-Benz bulletin

In Technical Service Bulletin LI82.85-P-074970 of 7 July 2022, Mercedes-Benz lists this among the symptoms for NTG5.5 COMAND: Apple CarPlay is inoperable. The bulletin gives improperly installed navigation map data as the cause. The remedy: delete the map data and install it again. No parts are to be replaced for it.

Officially the bulletin covers model series 205 and 463, not the AMG GT. But the head unit generation is the same, and the entry "map data not activated" fitted the picture exactly.

## What we changed

Before any change we backed up the complete coding of the control units involved. Then:

1. **Internal navigation switched off.** It was never used; navigation runs through CarPlay. This way the head unit no longer tries to activate map data.
2. **Keepalive interval reset to the factory value:** 10 instead of 3 seconds.
3. **Time zone no longer taken from the map data.** Time and time zone are now set by hand.

After the restart CarPlay connected straight away. After disconnecting the power completely we read out the coding again and compared it with the backup: all 60 domains match.

> [!IMPORTANT]
> **To be honest:** we changed two settings at once that can affect CarPlay, the navigation and the keepalive interval. We cannot say which one makes the difference. All changes are documented and can be reversed.

## How we test it

An intermittent fault is only fixed once it stays away for a long time. So:

- Every start is logged: CarPlay there straight away or not.
- If CarPlay does fail, the phone stays plugged in and we read out the state of USB and media interface right away.
- We only write "solved" after several weeks without a failure.

### Log

- **8 November 2026:** changes coded, coding checked after a full power disconnect. CarPlay starts on the first attempt.
- **9 November 2026:** article published. Long-term test running.

## What we take away

- **With intermittent faults, measure first, then replace.** A new head unit did not help here.
- **The fault memory tells the story.** Faults stored since the mileage of a retrofit are the first lead.
- **Back up before any coding.** That keeps every change reversible.

> [!CAUTION]
> An experience report, not instructions. Changing the coding is at your own risk. We do not publish coding data, software files or vehicle data.

## Source

- Mercedes-Benz, Technical Service Bulletin [LI82.85-P-074970](https://static.nhtsa.gov/odi/tsbs/2022/MC-10217162-0001.pdf), "NTG5.5 COMAND - Navigation and/or Apple Carplay Inoperable", 7 July 2022, published by the US National Highway Traffic Safety Administration (NHTSA).

*Nuit Noire Custom · studio in Marthalen, Switzerland · [nuitnoirecustom.ch](https://nuitnoirecustom.ch/en/)*
