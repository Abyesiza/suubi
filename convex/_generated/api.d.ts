/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as appointments from "../appointments.js";
import type * as availableTimes from "../availableTimes.js";
import type * as contact from "../contact.js";
import type * as crons from "../crons.js";
import type * as gallery from "../gallery.js";
import type * as helpers_permissions from "../helpers/permissions.js";
import type * as helpers_validators from "../helpers/validators.js";
import type * as messages from "../messages.js";
import type * as news from "../news.js";
import type * as newsemail from "../newsemail.js";
import type * as patientRegistrations from "../patientRegistrations.js";
import type * as programemail from "../programemail.js";
import type * as programs from "../programs.js";
import type * as publicStats from "../publicStats.js";
import type * as room from "../room.js";
import type * as staffProfiles from "../staffProfiles.js";
import type * as subscribers from "../subscribers.js";
import type * as typing from "../typing.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  appointments: typeof appointments;
  availableTimes: typeof availableTimes;
  contact: typeof contact;
  crons: typeof crons;
  gallery: typeof gallery;
  "helpers/permissions": typeof helpers_permissions;
  "helpers/validators": typeof helpers_validators;
  messages: typeof messages;
  news: typeof news;
  newsemail: typeof newsemail;
  patientRegistrations: typeof patientRegistrations;
  programemail: typeof programemail;
  programs: typeof programs;
  publicStats: typeof publicStats;
  room: typeof room;
  staffProfiles: typeof staffProfiles;
  subscribers: typeof subscribers;
  typing: typeof typing;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
