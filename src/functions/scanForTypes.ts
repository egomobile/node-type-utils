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
import typescript from "typescript";
import url from "node:url";
import { TypeKind, TypeInformation, TypeMember, TypeHeritage, TypeHeritageType } from "../types";
import type { Nilable } from "../types/internal";
import { collectTypeDefintionFiles, extractJSDocs, getMergedMembers } from "../utils/internal";
import { isTypeDeclarationKind } from "../utils";

/**
 * Options for `scanForTypes()` function.
 */
export interface IScanForTypesOptions {
    /**
     * The custom language version to use.
     */
    languageVersion?: Nilable<typescript.ScriptTarget>;
    /**
     * The custom TypeScript module to use.
     */
    typescript?: Nilable<any>;
}

/**
 * Result of a `scanForTypes()` execution.
 */
export type ScanForTypesResult = TypeInformation[];

/**
 * Scans for types in a directory and its sub-directories.
 *
 * @example
 * ```
 * import { scanForTypes } from "@egomobile/type-utils"
 *
 * const dir = "<PATH-TO-THE-ROOT-DIRECTORY-TO-SCAN>"
 *
 * async function main() {
 *   const types = await scanForTypes(dir)
 *
 *   console.log("Loaded types:", types)
 * }
 *
 * main().catch(console.error)
 * ```
 *
 * @param {string} dir The starting point.
 * @param {Nilable<IScanForTypesOptions>} [options] The custom options.
 */
export async function scanForTypes(dir: string, options?: Nilable<IScanForTypesOptions>): Promise<ScanForTypesResult> {
    const ts: typeof typescript = options?.typescript ?? typescript;
    const languageVersion = options?.languageVersion ?? ts.ScriptTarget.ES2019;

    const result: ScanForTypesResult = [];

    for (const file of await collectTypeDefintionFiles(dir)) {
        const sourceFile = ts.createSourceFile(
            file,
            await fs.promises.readFile(file, "utf8"),
            languageVersion,
        );

        sourceFile.statements?.forEach((node: any) => {
            if (!isTypeDeclarationKind(node.kind)) {
                return;
            }

            const name = String(node.name?.escapedText);
            const sourceUrl = url.pathToFileURL(file);
            const jsDoc = extractJSDocs(node);

            let typeInfo: TypeInformation | undefined;
            if (ts.isInterfaceDeclaration(node)) {
                typeInfo = {
                    "getMergedMembers": undefined!,
                    "heritages": [],
                    jsDoc,
                    "kind": TypeKind.Interface,
                    "members": [],
                    name,
                    node,
                    sourceFile,
                    "url": sourceUrl
                };
            }
            else if (ts.isEnumDeclaration(node)) {
                typeInfo = {
                    "getMergedMembers": undefined!,
                    "heritages": [],
                    jsDoc,
                    "kind": TypeKind.Enum,
                    "members": [],
                    name,
                    node,
                    sourceFile,
                    "url": sourceUrl
                };
            }
            else if (ts.isClassDeclaration(node)) {
                typeInfo = {
                    "getMergedMembers": undefined!,
                    "heritages": [],
                    jsDoc,
                    "kind": TypeKind.Class,
                    "members": [],
                    name,
                    node,
                    sourceFile,
                    "url": sourceUrl
                };
            }
            else if (ts.isTypeAliasDeclaration(node)) {
                typeInfo = {
                    "getMergedMembers": undefined!,
                    "heritages": [],
                    jsDoc,
                    "kind": TypeKind.TypeAlias,
                    "members": [],
                    name,
                    node,
                    sourceFile,
                    "url": sourceUrl
                };
            }

            if (!typeInfo) {
                return;
            }

            typeInfo.getMergedMembers = function () {
                return getMergedMembers(this);
            };

            result.push(typeInfo);
        });
    }

    for (const typeInfo of result) {
        const node: any = typeInfo.node;

        if (typeInfo.kind === TypeKind.TypeAlias) {
            //
        }
        else {
            for (const member of node.members) {
                if (typeof member.name?.text !== "string") {
                    continue;
                }

                const typeMember: TypeMember = {
                    "isOptional": !!member.questionToken,
                    "jsDoc": extractJSDocs(member.jsDoc),
                    "name": String(member.name?.text),
                    "node": member,
                    "parent": typeInfo
                };

                typeInfo.members.push(typeMember);
            }
        }

        const heritageClauses: Nilable<typescript.HeritageClause[]> = node.heritageClauses;
        if (Array.isArray(heritageClauses)) {
            for (const heritageClause of heritageClauses) {
                const typeHeritage: TypeHeritage = {
                    "node": heritageClause,
                    "parent": typeInfo,
                    "types": []
                };

                for (const type of heritageClause.types) {
                    const typeHeritageType: TypeHeritageType = {
                        "node": type,
                        "parent": typeHeritage,
                        "types": []
                    };

                    const escapedText = (type.expression as any).escapedText;
                    if (typeof escapedText === "string") {
                        const knownTypes = result.filter((otherTypeInfo) => {
                            return otherTypeInfo !== typeInfo &&
                                otherTypeInfo.name === escapedText;
                        });

                        typeHeritageType.types.push(
                            ...knownTypes
                        );
                    }

                    typeHeritage.types.push(typeHeritageType);
                }

                typeInfo.heritages.push(typeHeritage);
            }
        }
    }

    return result;
}
