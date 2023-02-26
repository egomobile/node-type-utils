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
import type { URL } from "node:url";
import type { Nullable } from "./internal";

/**
 * A JSDoc item.
 */
export interface IJSDoc {
    /**
     * The normalized comment, if available.
     */
    comment: Nullable<string>;
    /**
     * The underlying node.
     */
    node: typescript.JSDoc;
    /**
     * One or more JSDoc tags.
     */
    tags: JSDocTag[];
}

/**
 * A JSDoc tag.
 */
export interface IJSDocTag {
    /**
     * The normalized comment, if available.
     */
    comment: Nullable<string>;
    /**
     * The name.
     */
    name: string;
    /**
     * The underlying node.
     */
    node: typescript.JSDocTag;
}

/**
 * A type heritage;
 */
export interface ITypeHeritage {
    /**
     * The underlying node.
     */
    node: typescript.HeritageClause;
    /**
     * The underlying parent type.
     */
    parent: TypeInformation;
    /**
     * The types.
     */
    types: TypeHeritageType[];
}

/**
 * A type hertiage type.
 */
export interface ITypeHeritageType {
    /**
     * The underlying node.
     */
    node: typescript.ExpressionWithTypeArguments;
    /**
     * The underlying parent.
     */
    parent: TypeHeritage;
    /**
     * The known types.
     */
    types: TypeInformation[];
}

/**
 * Stores information about a type.
 */
export interface ITypeInformation {
    /**
     * List of heritages.
     */
    heritages: TypeHeritage[];
    /**
     * Returns the list of merged type members.
     *
     * @returns {MergedTypeMembers} The merged list of type members.
     */
    getMergedMembers: () => MergedTypeMembers;
    /**
     * List of JSDoc items.
     */
    jsDoc: JSDoc[];
    /**
     * The kind of type.
     */
    kind: TypeKind;
    /**
     * List of members.
     */
    members: TypeMember[];
    /**
     * The name of the type.
     */
    name: string;
    /**
     * The TypeScript node object.
     */
    node: typescript.Node;
    /**
     * The source file information, if available.
     */
    sourceFile: Nullable<typescript.SourceFile>;
    /**
     * The URL from where the information has been loaded.
     */
    url: Nullable<URL>;
}

/**
 * A type member.
 */
export interface ITypeMember {
    /**
     * Indicates if member is optional or not.
     */
    isOptional: boolean;
    /**
     * List of JSDoc items.
     */
    jsDoc: JSDoc[];
    /**
     * The name.
     */
    name: string;
    /**
     * The underlying node.
     */
    node: typescript.Node;
    /**
     * The underlying parent type.
     */
    parent: TypeInformation;
}

/**
 * Possible value for a JS doc.
 */
export type JSDoc = IJSDoc;

/**
 * A possible value for a JSDoc comment.
 */
export type JSDocCommentValue = string | typescript.NodeArray<typescript.JSDocComment>;

/**
 * A possible value for a JSDoc tag.
 */
export type JSDocTag = IJSDocTag;

/**
 * Merged type members.
 */
export type MergedTypeMembers = Record<string, TypeMember>;

/**
 * A possible value for a `typescript.SyntaxKind` that
 * represents a type declaration.
 */
export type TypeDeclarationKind =
    typescript.SyntaxKind.ClassDeclaration |
    typescript.SyntaxKind.EnumDeclaration |
    typescript.SyntaxKind.InterfaceDeclaration |
    typescript.SyntaxKind.TypeAliasDeclaration;

/**
 * A possible value for a type hertiage.
 */
export type TypeHeritage = ITypeHeritage;

/**
 * A possible value for a type hertiage type.
 */
export type TypeHeritageType = ITypeHeritageType;

/**
 * Possible types for a type information object.
 */
export type TypeInformation = ITypeInformation;

/**
 * List of type kinds.
 */
export enum TypeKind {
    /**
     * Class
     */
    Class = "class",
    /**
     * Enumeration
     */
    Enum = "enum",
    /**
     * Interface
     */
    Interface = "interface",
    /**
     * Type alias.
     */
    TypeAlias = "type",
}

/**
 * Possible types for a type member object.
 */
export type TypeMember = ITypeMember;
