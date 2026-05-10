import fs from "fs/promises";

export async function readTextFile(path: string) {
    return fs.readFile(path, "utf-8");
}