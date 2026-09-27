# Default Urdu Fonts Directory

Place any local `.ttf` or `.otf` Urdu font files in this directory to serve them directly from the web application.

Example structure:
```text
public/fonts/
├── NotoNastaliqUrdu-Regular.ttf
├── JameelNooriNastaleeq.ttf
├── NafeesNastaliq.ttf
└── AlviNastaleeq.ttf
```

Fonts uploaded via the application UI or downloaded through the **AI Font Discovery** system are automatically stored in browser **IndexedDB** (`UrduTextPngMakerDB`) and remain available offline across browser restarts!
