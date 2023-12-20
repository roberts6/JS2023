import fs from 'fs/promises';

export async function readFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf-8');
    return data.trim() === '' ? '[]' : data;
  } catch (error) {
    return '[]';
  }
}

export async function writeFile(filename, data) {
  await fs.writeFile(filename, data, 'utf-8');
}

export function generateId() {
  return Math.floor(Math.random() * 1000000).toString();
}
