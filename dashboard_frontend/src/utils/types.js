/**
 * Shared type-like JSDoc definitions for future API integration.
 * Using JSDoc for intellisense without TS.
 */

/**
 * @typedef {Object} TimeRange
 * @property {"realtime"|"daily"|"weekly"|"monthly"|"custom"} preset
 * @property {string=} fromISO
 * @property {string=} toISO
 */

/**
 * @typedef {Object} GlobalFilters
 * @property {TimeRange} time
 * @property {string=} tenant
 * @property {string=} department
 * @property {string=} team
 * @property {string=} user
 * @property {string=} module
 * @property {string=} feature
 * @property {string=} workflow
 * @property {string=} geography
 */

/**
 * @typedef {"EXEC"|"MANAGER"|"TENANT_ADMIN"|"TEAM_LEAD"|"FDE"|"FINANCE"|"DEVOPS"|"SECURITY"|"LEGAL"|"KAVIA_ADMIN"} Role
 */

/**
 * @typedef {Object} RBACContext
 * @property {Role[]} roles
 */

/**
 * PUBLIC_INTERFACE
 * Returns true if the current roles satisfy the minimum role requirement.
 * This is a placeholder and should be replaced with real RBAC logic later.
 * @param {RBACContext} ctx
 * @param {Role[]} allowedRoles
 * @returns {boolean}
 */
export function canAccess(ctx, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  const set = new Set(ctx.roles || []);
  return allowedRoles.some(r => set.has(r));
}
