// lib/getRequiredRoles.ts
import { routePermissions } from '@/lib/permissions';

export function getRequiredRoles(pathname: string): string[] | null {
    for (const route of routePermissions) {
        if (route.pattern.test(pathname)) {
            return route.roles;
        }
    }
    return null;
}
