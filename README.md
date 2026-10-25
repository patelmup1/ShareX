# ShareX

A Django file-sharing project. Upload files, share the generated six-letter code, and use that code to find download links.

## How it works

1. Visit `/upload/` and choose one or more files.
2. Submit the upload and copy the generated sharing code.
3. Open `/receive` and enter the code to access the files.

## Technology

Python, Django, HTML, CSS, and JavaScript. Files are stored under Django's configured media directory.

## Local setup

```bash
git clone https://github.com/patelmup1/ShareX.git
cd ShareX
python -m venv .venv
```

Activate the environment:

- Windows PowerShell: `.venv\Scripts\Activate.ps1`
- macOS / Linux: `source .venv/bin/activate`

Then install the dependencies and start the development server:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open [the upload page](http://127.0.0.1:8000/upload/).

## Repository guide

- [core/views.py](core/views.py): upload, sharing-code, and download logic
- [core/urls.py](core/urls.py): application routes
- [core/templates](core/templates): page templates
- [core/static](core/static): styles, scripts, and icons
- [sharex/settings.py](sharex/settings.py): Django configuration

## Current limitations

This is a development project. The sharing code acts as the access mechanism; the current views do not implement user authentication, file expiration, upload quotas, or malware scanning. Invalid download codes need better error handling. The dependency list contains older pinned packages and has not been validated against current Python releases.

## Feedback

Report reproducible bugs through [GitHub Issues](https://github.com/patelmup1/ShareX/issues), including the page, steps, and error message.
