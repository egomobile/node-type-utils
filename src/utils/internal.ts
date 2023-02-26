// This file is part of the @egomobile/type-utils distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/type-utils is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/type-utils is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import fs from "node:fs";
import path from "node:path";
import typescript from "typescript";
import { mergeJSDocComment } from ".";
import type { JSDoc, JSDocTag } from "../types";
import type { Nilable } from "../types/internal";

export async function collectTypeDefintionFiles(dir: string, files: string[] = []): Promise<string[]> {
    for (const item of await fs.promises.readdir(dir)) {
        const fullItemPath = path.join(dir, item);

        const stat = await fs.promises.stat(fullItemPath);
        if (stat.isDirectory()) {
            await collectTypeDefintionFiles(fullItemPath, files);
        }
        else {
            if (item.endsWith(".d.ts")) {
                files.push(fullItemPath);
            }
        }
    }

    return files;
}

export function extractJSDocs(node: any): JSDoc[] {
    const jsDocs: JSDoc[] = [];

    const tsJSDoc: Nilable<typescript.JSDoc[]> = node?.jsDoc;
    if (Array.isArray(tsJSDoc)) {
        for (const jsDoc of tsJSDoc) {
            const memberJSDoc: JSDoc = {
                "comment": mergeJSDocComment(jsDoc.comment) || null,
                "node": jsDoc,
                "tags": []
            };

            const tags: Nilable<typescript.NodeArray<typescript.JSDocTag>> = jsDoc.tags;
            if (tags?.length) {
                for (const jsDocTag of tags) {
                    const memberJSDocTag: JSDocTag = {
                        "comment": mergeJSDocComment(jsDocTag.comment),
                        "name": jsDocTag.tagName.text,
                        "node": jsDocTag
                    };

                    memberJSDoc.tags.push(memberJSDocTag);
                }
            }

            jsDocs.push(memberJSDoc);
        }
    }

    return jsDocs;
}
