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

import typescript from "typescript";
import type { JSDocCommentValue, TypeDeclarationKind } from "../types";
import type { Nilable } from "../types/internal";

/**
 * Checks if a value is of `TypeDeclarationKind` or not.
 *
 * @param {any} value The value to check.
 *
 * @returns {boolean} Is of type `TypeDeclarationKind` or not.
 */
export function isTypeDeclarationKind(value: any): value is TypeDeclarationKind {
    return [
        typescript.SyntaxKind.InterfaceDeclaration,
        typescript.SyntaxKind.TypeAliasDeclaration,
        typescript.SyntaxKind.EnumDeclaration,
        typescript.SyntaxKind.ClassDeclaration
    ].includes(value as any);
}

/**
 * Merges a JSDoc comment to one normalized string.
 *
 * @param {JSDocCommentValue} comment The comment value.
 *
 * @returns {string} The comment value as string.
 */
export function mergeJSDocComment(comment: Nilable<JSDocCommentValue>): string {
    let mergedComment = "";

    if (typeof comment === "string") {
        mergedComment += comment;
    }
    else if (Array.isArray(comment)) {
        mergedComment += comment.map((c) => {
            return c.text;
        }).join(" ");
    }

    return mergedComment.trim();
}
