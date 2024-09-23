import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Importando o uuid

const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read and parse db.json
const readDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      // If db.json does not exist, initialize it with an empty structure
      fs.writeFileSync(dbPath, JSON.stringify({ tasks: [] }, null, 2), 'utf8');
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { tasks: [] }; // Return a default empty structure in case of error
  }
};

// Helper function to write to db.json
const writeDb = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// GET all tasks
export async function GET() {
  const tasks = readDb().tasks;
  return NextResponse.json(tasks);
}

// POST a new task
export async function POST(request: Request) {
  const newTask = await request.json();
  const db = readDb();
  newTask.id = uuidv4(); // Gerando um ID único com uuid
  db.tasks.push(newTask);
  writeDb(db);
  return NextResponse.json(newTask);
}

// PUT - update a task
export async function PUT(request: Request) {
  const updatedTask = await request.json();
  const db = readDb();
  const taskIndex = db.tasks.findIndex((task: any) => task.id === updatedTask.id);

  if (taskIndex !== -1) {
    db.tasks[taskIndex] = updatedTask;
    writeDb(db);
    return NextResponse.json(updatedTask);
  } else {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}

// DELETE a task
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const db = readDb();
  const newTasks = db.tasks.filter((task: any) => task.id !== id); // Comparando com string

  if (newTasks.length !== db.tasks.length) {
    db.tasks = newTasks;
    writeDb(db);
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}