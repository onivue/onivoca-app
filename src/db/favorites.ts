import type { CardData } from "../data/cards";

// Importierte Favoriten: Englisch<TAB>Deutsch. Deutsche Ausgangsbegriffe sind bereits umgedreht.
const FAVORITES = `
concise	prägnant
extort	erpressen
tantrum	Wutanfall
embrace yourself	Nimm dich selbst an
embrace	umarmen
embrace	Umarmung; sich annehmen
embrace	Umarmung
genuinely	authentisch; wirklich
genuinely	original
genuinly	original
consider	in Betracht ziehen; für ... halten
jealousy	Eifersucht
jalousy	Eifersucht
pretending	vortäuschend; so tun als ob
insolence	Unverschämtheit
forsake	verlassen
thorns	Dornen
endure	aushalten
sorrow	Kummer
vicarious	stellvertretend
plunge	stürzen; eintauchen
immutable	unveränderlich
guts	Eingeweide; Mut
perk	Vorteil; Vergünstigung
fatigue	Ermüdung; Erschöpfung
mad	verrückt; wütend
limbs	Gliedmaßen
bereavement	Trauer; Verlust eines Angehörigen
contraption	Apparat; Vorrichtung
distinction	Unterscheidung; Auszeichnung
derivation	Ableitung
dwarf	Zwerg; Zwergin
misget	Zwergin; Zwerg
notch	Kerbe
barley	Gerste
sty	Gerste
doomed	zum Scheitern verurteilt
fierce	hart; wild; erbittert
contradiction	Widerspruch
contridiction	Widerspruch
pouring	Gießen; strömend
perpetuate	verewigen; aufrechterhalten
hip	Hüfte
scathed	verletzt; beschädigt (meist in „unscathed“)
flawed	fehlerhaft
comps	Wettbewerbe; Freikarten
minor	geringfügig; minderjährig
major	wesentlich; Hauptfach
surveillance	Überwachung
consciousness	Bewusstsein
intimidation	Einschüchterung
envy	Neid
pursuit	Verfolgung; Streben
obey	gehorchen
acceleration	Beschleunigung
mediocre	durchschnittlich; mittelmäßig
sophisticated	anspruchsvoll; ausgefeilt
clout	Einfluss; Schlagkraft
doom	Untergang; Verhängnis
yawning	Gähnen
leverage	Hebelwirkung; Einfluss
laverage	Hebelwirkung
lunacy	Wahnsinn
claims	Ansprüche; Behauptungen
curb	Bordstein; eindämmen
crucial	entscheidend
crusical	entscheidend
digest	verdauen; Zusammenfassung
caveats	Vorbehalte; Einschränkungen
slack	locker; nachlässig
primeval	urzeitlich; urtümlich
slop	Matsch; Fraß
pun	Wortspiel
tortured	gequält; gefoltert
hold fast	standhalten; festhalten
responsibility	Verantwortung
equity	Eigenkapital; Gerechtigkeit
distinct	klar unterscheidbar; deutlich
guilting me	mir Schuldgefühle machen
exploit	ausbeuten; ausnutzen
exploite	ausbeuten
spouse	Ehepartner; Ehepartnerin
I dare you	Du traust dich ja nicht; ich fordere dich heraus
fetch	holen; bringen
vivacious	lebhaft
constraints	Einschränkungen
trace	Spur; zurückverfolgen
abroad	im Ausland
acquittal	Freispruch
slope	Neigung; Hang
nasty	unangenehm; gemein
both determined	beide entschlossen
determine	bestimmen; feststellen
labor	Arbeit; Wehen
unprecedented	beispiellos
dishonest	unehrlich
certainly	sicherlich
treason	Verrat
Gemini	Zwillinge
atone	büßen; wiedergutmachen
acknowledge	anerkennen; bestätigen
that's a wrap	das war's; damit ist es geschafft
grooming	Körperpflege; Vorbereitung
sloppy	schlampig; nachlässig
ample	reichlich
consent	Zustimmung
dummy	Attrappe; Schnuller
severed	abgetrennt
horrid	schrecklich
severance	Abfindung; Trennung
spark	Funke; auslösen
vigilante	Selbstjustiz übende Person
spare them	verschone sie
spared	verschont
desperation	Verzweiflung
oblivion	Vergessenheit; Bedeutungslosigkeit
retaliation	Vergeltung
stale	abgestanden; schal
fate	Schicksal
disputed	umstritten
operations manager	Betriebsleiter; Betriebsleiterin
obstacle	Hindernis
shall	soll; werden
apparently	offenbar; scheinbar
establishments	Einrichtungen; Betriebe
apart	getrennt; auseinander
dodge	ausweichen; umgehen
eventually	letztlich; schließlich
altered	verändert
janitor	Hausmeister; Hausmeisterin
prosecuted	strafrechtlich verfolgt
comprehensive	umfassend
comprehend	begreifen; verstehen
convinced	überzeugt
gorge	Schlucht; sich vollessen
receding	zurückweichend; zurückgehend
meadow	Wiese
hauberk	Kettenhemd
admired	bewundert
whether	ob
sermon	Predigt
lullabies	Schlaflieder
hibernator	Winterschläfer
sorrows	Sorgen
bid you farewell	verabschiede dich
morn	Morgen
a sigh	seufzen
defy	trotzen
endorse	unterstützen; befürworten
virility	Männlichkeit
beacon	Leuchtfeuer; Signal
humiliation	Erniedrigung
stubborn	hartnäckig
doubt	zweifeln; Zweifel
condemn	verurteilen
gluttony	Völlerei
greed	Gier
sloth	Trägheit
wrath	Zorn
sued	verklagt
alleged	angeblich
omit	auslassen
reportedly	Berichten zufolge
unfortunately	unglücklicherweise
hijack	entführen; kapern
tension	Spannung
suddenly	plötzlich
my relatives	meine Verwandten
muffled	gedämpft
cursing	fluchen; Verwünschungen
brisk	rege; flott
assuming	vorausgesetzt; unter der Annahme
desperate	verzweifelt; dringend
forecast	Vorhersage; prognostizieren
allegedly	angeblich; mutmaßlich
rumor	Gerücht
pattern	Muster
imbecile	schwachsinnige Person (beleidigend)
assume	davon ausgehen; annehmen
confidence	Vertrauen; Selbstvertrauen
indeed	in der Tat; tatsächlich
poppy	Mohn
bearer	Träger; Überbringer
foe	Feind
tides	Gezeiten
calamity	Unglück; Katastrophe
penultimate	vorletzte; vorletzter
spoiled	verwöhnt; verdorben
sanity	Vernunft; geistige Gesundheit
mighty	mächtig
wig	Perücke
biases	Vorurteile; Verzerrungen
guilty	schuldig
desire	Verlangen; wünschen
slanders	Verleumdungen
gossip	Tratsch; Klatsch
odour	Geruch
hesitate	zögern
embers	Glut
mend it	repariere es; bring es in Ordnung
elicit	hervorrufen; entlocken
bother	stören; sich kümmern
probably	wahrscheinlich
proposed	vorgeschlagen
perhaps	vielleicht
possibly	möglicherweise; eventuell
approach	sich nähern; Ansatz
vile	abscheulich; gemein
tempest	Sturm
innocent	unschuldig
reign	regieren; Herrschaft
fortune	Vermögen; Glück
whining	jammern
yelling at me	mich anschreien
hints	Hinweise
indulge	sich hingeben; gönnen
carry on	fortfahren; weitermachen
impunity	Straflosigkeit
thrive	gedeihen
squalor	Elend; Verwahrlosung
heir	Erbe; Erbin
advisement	Beratung; Überlegung
realm	Reich; Bereich
summon	herbeirufen; beschwören
barely	kaum
ridge	Grat; Bergrücken
forth	weiter; hervor
torment	quälen; Qual
suggestion	Vorschlag; Anregung
maverick	Einzelgänger; Querdenker
dignity	Würde
descendants	Nachkommen
greedy	gierig
obsessed	besessen
habit	Gewohnheit
chasing	jagend; verfolgen
disturbing	verstörend
wages	Löhne
seems	scheint
pretends	gibt vor
harassment	Belästigung
give me a favor	tu mir einen Gefallen
embarrassing	peinlich
although	obwohl
recognize	erkennen; anerkennen
spontaneously	spontan
commuting	Pendeln; zur Arbeit fahren
sue	verklagen
insisting	darauf bestehen
avalanche	Lawine
gathering	Treffen; Versammlung; sammeln
i sacrificed	ich habe geopfert
purpose	Zweck; Absicht
proper	angemessen; richtig
jinx	Pech bringen; Unglücksbringer
acquisition	Erwerb; Übernahme
exhausted	erschöpft
opportunities	Möglichkeiten
always	immer; stets
rant	Schimpftirade; schimpfen
refuse	ablehnen; sich weigern
sacrifice	Opfer; opfern
prevail	sich durchsetzen
witness	Zeuge; bezeugen
rumors	Gerüchte
kidney	Niere
cucumber	Gurke
gradually	schrittweise
ferry	Fähre
conspiracy	Verschwörung
interfere	eingreifen; stören
quilt	Steppdecke
straw	Stroh
tough	hart; schwierig
dough	Teig
through	durch
though	obwohl
herbal	pflanzlich; Kräuter-
sighs	seufzt; Seufzer
reasonably	vernünftigerweise; ziemlich
favor	Gefallen
convenience	Bequemlichkeit
celebrities	Berühmtheiten
bummer	Pech; schade
coincidence	Zufall
necessary	notwendig
postpone	verschieben
unopposed	unwidersprochen; ohne Gegenwehr
terrific	großartig; ausgezeichnet
mesmerising	hypnotisierend
filthy	schmutzig; verdorben
awful	schrecklich; furchtbar
unsustainable	nicht nachhaltig
regret	Bedauern; bereuen
usually	gewöhnlich; in der Regel
meanest	gemeinste; am unfreundlichsten
gamble	 Glücksspiel; aufs Spiel setzen
boggle	verblüffen; verwirren
curse	Fluch; verfluchen
proposal	Vorschlag
mugged	überfallen
hesitation	Zögern
turd	Scheißhaufen (vulgär)
neat	ordentlich; sauber
shallow	flach; oberflächlich
retiring	in den Ruhestand gehend
negotiate	verhandeln
exhausting	anstrengend
regardless	ungeachtet; unabhängig davon
effort	Anstrengung
doomsday	Weltuntergang
immortal	unsterblich
imminent	unmittelbar bevorstehend
convince	überzeugen
grease	Fett; einfetten
witnesses	Zeugen
conscience	Gewissen
dizzy	schwindlig
tizzy	aufgeregt; durcheinander
smirk	Grinsen; selbstgefällig lächeln
clue	Hinweis
resolutions	Vorsätze; Beschlüsse
cunt	vulgäres Schimpfwort (stark beleidigend)
miracle	Wunder
compassion	Mitgefühl
hay	Heu
muzzle	Schnauze; Maulkorb
rustling	Rascheln
treat yourself	gönn dir etwas
gorgeous	wunderschön; herrlich
related	verwandt; verbunden
investigator	Ermittler; Ermittlerin
heading out	auf dem Weg nach draußen
coward	Feigling
patronize	bevormunden; herablassend behandeln
lair	Höhle; Versteck
ahead	voraus; bevorstehend
tread	treten; schreiten
silly	albern; dumm
miscellaneous	Verschiedenes
vulnerabilities	Schwachstellen
stove	Herd
sharpening	schärfen; Schärfen
pivot	schwenken; Dreh- und Angelpunkt
owe	verdanken; schulden
offended	beleidigt; gekränkt
stunning	atemberaubend
owe me	du schuldest mir
tuition	Unterrichtsgebühren; Nachhilfe
generous	großzügig
tap water	Leitungswasser
invoke	aufrufen; heraufbeschwören
unprovoked	grundlos; unprovoziert
cue	Stichwort; Einsatz
supposed	vermeintlich; soll
moron	Trottel (beleidigend)
vendors	Anbieter; Verkäufer
bribe	bestechen; Bestechungsgeld
attitude	Einstellung; Haltung
fertility	Fruchtbarkeit
pond	Teich
retribution	Vergeltung
insane	wahnsinnig
rather	lieber; ziemlich
assumed	angenommen
threat	Bedrohung
persistent	beharrlich; hartnäckig
suspicious	verdächtig; misstrauisch
lousy	lausig
courtesy	Höflichkeit; Gefälligkeit
disrupted	gestört; unterbrochen
complains	beschwert sich
whether or	ob ... oder
neither	weder; keiner von beiden
me neither	ich auch nicht
exposed	ausgesetzt; offengelegt
vixen	Füchsin; streitsüchtige Frau
rude	unhöflich
towards	in Richtung; gegenüber
behavior	Verhalten
fools	Narren; Dummköpfe
ease	Leichtigkeit; erleichtern
demands	Forderungen; verlangt
honestly	ehrlich gesagt
consensual	einvernehmlich
ancestry	Abstammung
appreciation	Wertschätzung; Anerkennung
groceries	Lebensmittel
disturbed	gestört; beunruhigt
sentence	Satz; Urteil
afford	sich leisten
branch	Ast; Zweigstelle
pride	Stolz
on-premises	vor Ort; in den eigenen Räumen
lament	Klage; beklagen
batch	Stapel; Charge
effective	wirksam
inappropriate	unangemessen
repelled	abgestoßen; zurückgeschreckt
distracted	abgelenkt
honest	ehrlich
calming	beruhigend
excitement	Aufregung; Begeisterung
appropriate	angemessen; passend
screw you	verpiss dich (vulgär)
participate	teilnehmen
participating	teilnehmend
literally	buchstäblich
gosh	Mensch; meine Güte
snail	Schnecke
intercourse	Geschlechtsverkehr
foreign	fremd; ausländisch
nook	Winkel; Nische
imposter	Hochstapler; Betrüger
sassy	frech; selbstbewusst
proposing	vorschlagend; einen Antrag machend
niece	Nichte
lethal	tödlich
certain	sicher; gewiss
condo	Eigentumswohnung
business as usual	alles wie gewohnt
pleasure	Vergnügen; Freude
superior being	überlegenes Wesen
throw up	sich übergeben
accomplished	erreicht; vollendet
rabies	Tollwut
cursed	verflucht
odor	Geruch
skirmish	Scharmützel
ambush	Hinterhalt
recent	kürzlich; jüngste
attempting	versuchend
treated	behandelt
almost	fast; beinahe
volunteer	Freiwillige; sich freiwillig melden
appreciate	schätzen; zu schätzen wissen
grace	Anmut; Gnade
obviously	offensichtlich
basically	grundsätzlich; im Grunde
specified	festgelegt; präzisiert
resign	zurücktreten; kündigen
weak	schwach
offensive	beleidigend; anstößig
faggot	stark beleidigendes Schimpfwort gegen schwule Männer
i'm glad	ich bin froh
deposit	Anzahlung; einzahlen
relief	Erleichterung; Linderung
ridiculous	lächerlich
distinguish	unterscheiden
stipulating	festlegend; vorschreibend
kinda upsetting	irgendwie ärgerlich
the investigation	Ermittlung; Untersuchung
instant	sofortig; Augenblick
convenient	praktisch; gelegen
denote	bezeichnen; bedeuten
do not regret	bereue es nicht
emphasizes	betont
dependency	Abhängigkeit
dumped	abgeladen; verlassen
to settle	sich niederlassen; regeln
accessibility	Barrierefreiheit; Zugänglichkeit
dependencies	Abhängigkeiten
memorize	auswendig lernen
reliability	Zuverlässigkeit
embedded	eingebettet
void	Leere; ungültig
keep going	mach weiter
grid	Gitter; Raster
circuit	Schaltkreis; Runde
attempt	Versuch; versuchen
repository	Repository; Ablage
reusable	wiederverwendbar
numb	taub
guess	vermuten; raten
furniture	Möbel
suffering	Leiden
dainty	zierlich
beyond	darüber hinaus; jenseits
descendant	Nachfahre; Nachkomme
abuse	Missbrauch; misshandeln
negotiation	Verhandlung
mocking	verspottend; Spott
hilarious	urkomisch
gore	Blut; blutige Gewaltdarstellung
passion	Leidenschaft
court	Gericht; Hof
divorce	Scheidung; sich scheiden lassen
shelter	Schutz; Zuflucht
ancient	uralt; antik
anxiety	Angst; Sorge
reaper	Sensenmann; Schnitter
admirers	Bewunderer
narrow	eng; knapp
inhabit	bewohnen
pathetic	erbärmlich
habits	Gewohnheiten
adorable	bezaubernd
trespassers	Eindringlinge; unbefugte Personen
confused	verwirrt
retire	in den Ruhestand gehen
recending	zurücktretend
memoize	auswendig lernen
genuinly	original
holdfast	festhalten
stobborn	hartnäckig
mufled	gedämpft
elicite	hervorrufen
yealing	jammern
yealing on me	mich anschreien
crusical	entscheidend
exploite	ausbeuten
scarving	Schärfen
wether or	ob oder
efficial	wirksam
preciated	präzisiert
intercourts	Geschlechtsverkehr
inhabitat	bewohnen
pummel	verprügeln; heftig schlagen
odour	Geruch
rumors	Gerüchte
witnesses	Zeugen
descendants	Nachkommen
habits	Gewohnheiten
`;

const CORRECTIONS: Record<string, string> = {
  "genuinly": "genuinely",
  "recending": "receding",
  "jalousy": "jealousy",
  "misget": "dwarf",
  "sty": "barley",
  "contridiction": "contradiction",
  "laverage": "leverage",
  "holdfast": "hold fast",
  "stobborn": "stubborn",
  "mufled": "muffled",
  "elicite": "elicit",
  "yealing": "whining",
  "yealing on me": "yelling at me",
  "crusical": "crucial",
  "exploite": "exploit",
  "scarving": "sharpening",
  "wether or": "whether or",
  "efficial": "effective",
  "preciated": "specified",
  "memoize": "memorize",
  "intercourts": "intercourse",
  "inhabitat": "inhabit",
  "odour": "odor",
  "rumors": "rumor",
  "witnesses": "witness",
  "descendants": "descendant",
  "habits": "habit",
};

const WARNINGS: Record<string, string> = {
  cunt: "Sehr vulgär und stark beleidigend. Nicht verwenden.",
  faggot: "Stark beleidigende homophobe Beleidigung. Nicht verwenden.",
  "screw you": "Vulgäre, aggressive Redewendung.",
  turd: "Vulgärer Ausdruck.",
  imbecile: "Abwertende Beleidigung. Besser vermeiden.",
  moron: "Beleidigende Bezeichnung. Besser vermeiden.",
};

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, "").trim();
}

const unique = new Map<string, CardData>();
for (const line of FAVORITES.trim().split("\n")) {
  const [rawFront, rawBack] = line.split("\t");
  if (!rawFront || !rawBack) continue;

  const original = rawFront.trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, " ");
  let front = CORRECTIONS[original.toLocaleLowerCase("en")] ?? original;
  let back = rawBack.trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, " ");
  if (front.toLocaleLowerCase("en") === "genuinely" && back === "authentisch; wirklich") {
    back = "wirklich; authentisch";
  }

  const key = normalize(front);
  if (!key) continue;
  const existing = unique.get(key);
  if (existing) {
    const translations = new Set([...existing.back.split("; "), ...back.split("; ")]);
    existing.back = [...translations].join("; ");
    const label = /\s/.test(existing.front) ? "expression" : "word";
    existing.examples[0] = {
      en: `The ${label} “${existing.front}” means “${existing.back}”.`,
      de: `${label === "expression" ? "Die Wendung" : "Das Wort"} „${existing.front}“ bedeutet „${existing.back}“.`,
    };
    continue;
  }

  const isPhrase = /\s/.test(front);
  const label = isPhrase ? "expression" : "word";
  unique.set(key, {
    id: `fav-${key}`,
    front,
    back,
    category: isPhrase ? "phrasen" : "alltag",
    phonetic: "",
    examples: [
      {
        en: `The ${label} “${front}” means “${back}”.`,
        de: `${isPhrase ? "Die Wendung" : "Das Wort"} „${front}“ bedeutet „${back}“.`,
      },
    ],
    note: WARNINGS[key],
  });
}

export const SEED_CARDS: CardData[] = [...unique.values()];
