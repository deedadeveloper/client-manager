#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const DB_FILE = path.join(__dirname, 'clients.json');

function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    }
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const [, , command, ...args] = process.argv;

switch (command) {
    case 'list': {
        const clients = loadDB();
        if (clients.length === 0) {
            console.log('No clients found.');
        } else {
            console.table(clients);
        }
        process.exit(0);
        break;
    }

    case 'add': {
        rl.question('Client Name: ', (name) => {
            rl.question('Email / Contact: ', (contact) => {
                rl.question('Service / Project: ', (project) => {
                    const clients = loadDB();
                    const newClient = {
                        id: Date.now().toString(36),
                        name: name.trim(),
                        contact: contact.trim(),
                        project: project.trim(),
                        addedAt: new Date().toISOString()
                    };
                    clients.push(newClient);
                    saveDB(clients);
                    console.log(`\nClient "${newClient.name}" added successfully (ID: ${newClient.id})`);
                    rl.close();
                });
            });
        });
        break;
    }

    case 'search': {
        const query = args.join(' ').toLowerCase();
        if (!query) {
            console.log('Please provide a search term. Usage: node client-mgr.js search <name>');
            process.exit(1);
        }
        const clients = loadDB();
        const results = clients.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.project.toLowerCase().includes(query)
        );
        if (results.length === 0) {
            console.log(`No clients matching "${query}".`);
        } else {
            console.table(results);
        }
        process.exit(0);
        break;
    }

    case 'delete': {
        const id = args[0];
        if (!id) {
            console.log('Please provide a client ID. Usage: node client-mgr.js delete <id>');
            process.exit(1);
        }
        let clients = loadDB();
        const initialLength = clients.length;
        clients = clients.filter(c => c.id !== id);
        if (clients.length === initialLength) {
            console.log(`Client with ID "${id}" not found.`);
        } else {
            saveDB(clients);
            console.log(`Client ${id} deleted.`);
        }
        process.exit(0);
        break;
    }

    case 'export': {
        const clients = loadDB();
        if (clients.length === 0) {
            console.log('No clients to export.');
            process.exit(0);
        }
        const headers = ['id', 'name', 'contact', 'project', 'addedAt'];
        const csvRows = [
            headers.join(','),
            ...clients.map(c => headers.map(h => `"${(c[h] || '').toString().replace(/"/g, '""')}"`).join(','))
        ];
        const exportPath = path.join(__dirname, 'clients.csv');
        fs.writeFileSync(exportPath, csvRows.join('\n'));
        console.log(`Successfully exported ${clients.length} clients to:\n${exportPath}`);
        process.exit(0);
        break;
    }

    default:
        console.log(`
Derrick's Client Manager Utility
Usage:
  node client-mgr.js list                 - List all clients
  node client-mgr.js add                  - Interactive prompt to add a client
  node client-mgr.js search <query>       - Search clients by name or project
  node client-mgr.js delete <id>          - Delete a client by ID
  node client-mgr.js export               - Export all clients to clients.csv
        `);
        process.exit(0);
}
