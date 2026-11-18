# Client Manager CLI

A lightweight, zero-dependency Node.js command-line utility for managing small business client records locally.

## Features
* **Zero Dependencies:** Built entirely with native Node.js core modules (`node:fs`, `node:path`, `node:readline`).
* **Interactive Prompts:** Fast CLI interface for adding client records.
* **Search & Filter:** Instantly look up clients by name or project.
* **Table & CSV Export:** View data in clean terminal tables or export straight to `clients.csv` for spreadsheets.

## Usage

| Command | Description |
| :--- | :--- |
| `node client-mgr.js list` | List all saved clients in a terminal table |
| `node client-mgr.js add` | Interactive prompt to add a new client |
| `node client-mgr.js search <query>` | Search records by name or project |
| `node client-mgr.js delete <id>` | Remove a client record by unique ID |
| `node client-mgr.js export` | Export all records to `clients.csv` |

## Storage
Data is stored locally in `clients.json` in the project directory.

