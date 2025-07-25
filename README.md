# k6-loadtest

Deze repository bevat een load testing script met [k6](https://k6.io/) om de prestaties van restaurantwebsites te meten. Het wordt specifiek gebruikt om de [webhosting pakketten](https://netbela.com/webhosting) van [**Netbela**](https://netbela.com) te testen onder realistische gebruikersbelasting, met een geleidelijke opbouw en afbouw van het verkeer.

## Kenmerken
- Instelbaar aantal gelijktijdige gebruikers (virtual users, VUs) om verschillende verkeersniveaus te simuleren
- Instelbare doel-URL via een omgevingsvariabele voor maximale flexibiliteit
- Willekeurige user agents en pagina’s om echt gebruikersgedrag na te bootsen
- Meet belangrijke prestatie-statistieken: TTFB, paginaduur en blocking time
- Realistische verkeersbelasting met ramp-up en ramp-down fasen

## Aan de slag

### Vereisten
- [k6](https://k6.io/docs/getting-started/installation) geïnstalleerd op je systeem

### Gebruik

Clone deze repository en voer het script uit met je gewenste instellingen:

```bash
BASE_URL=https://jouw-website.nl VUS=15 k6 run loadtest.js
